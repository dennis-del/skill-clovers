import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../context/AuthContext';
import {
  addModuleApi,
  deleteModuleApi,
  getModulesApi,
  updateModuleApi,
} from '../services/allApi';
import { WebView } from 'react-native-webview';

const ModulePage = ({ route }) => {
  const { courseId, videoAccess, courseTitle } = route.params;
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [modules, setModules] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    thumbnail: '',
    order: '',
  });
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null);

  useEffect(() => {
    console.log('Current videoAccess:', videoAccess);
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await getModulesApi(courseId);
      setModules(response.data.modules || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const handleSaveOrUpdateModule = async () => {
    const moduleData = { ...formData, courseId };

    try {
      if (currentModuleId) {
        await updateModuleApi(currentModuleId, moduleData);
      } else {
        await addModuleApi(moduleData);
      }
      resetForm();
      fetchModules();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error saving/updating module:', error);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    try {
      await deleteModuleApi(moduleId);
      fetchModules();
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      videoUrl: '',
      thumbnail: '',
      order: '',
    });
    setCurrentModuleId('');
  };

  const handleVideoOpen = (url, moduleId) => {
    if (activeVideoId === moduleId) {
      // If clicking the same video, toggle fullscreen
      setIsFullScreen(!isFullScreen);
    } else {
      // If clicking a new video, play inline
      setSelectedVideoUrl(url);
      setActiveVideoId(moduleId);
      setIsFullScreen(false);
    }
  };

  const validateLink = (link) => {
    let embedLink;
    if (link.startsWith('https://youtu.be') || link.endsWith('?si=WumG2nfLwVqsjqUw')) {
      const yTkey = link.slice(17, 28);
      embedLink = `https://www.youtube.com/embed/${yTkey}`;
    } else {
      const yTkey = link.slice(-11);
      embedLink = `https://www.youtube.com/embed/${yTkey}`;
    }

    setFormData((prev) => ({ ...prev, videoUrl: embedLink }));
  };

  const renderModule = ({ item }) => {
    // Check if the user has access to the module
    if (videoAccess === '4' && item.order > 4) {
      return null; // Skip rendering this module if access is exceeded for 30%
    } else if (videoAccess === '8' && item.order > 8) {
      return null; // Skip rendering this module if access is exceeded for 50%
    }

    return (
      <View style={styles.moduleCard}>
        {activeVideoId === item._id ? (
          <View style={[styles.videoContainer, isFullScreen && styles.fullScreenVideo]}>
            <WebView
              source={{
                uri: `${selectedVideoUrl}?controls=1&rel=0&showinfo=0&modestbranding=1&playsinline=1&enablejsapi=1`,
                headers: {
                  'Referer': 'https://yourapp.com'
                }
              }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsFullscreenVideo={true}
              style={styles.inlineVideoPlayer}
              injectedJavaScript={`
                document.querySelector('.ytp-chrome-top').style.display = 'none';
                document.querySelector('.ytp-show-cards-title').style.display = 'none';
                document.querySelector('.ytp-watermark').style.display = 'none';
                document.querySelector('.ytp-youtube-button').style.display = 'none';
              `}
            />
            {!isFullScreen && (
              <TouchableOpacity 
                style={styles.closeInlineButton}
                onPress={() => setActiveVideoId(null)}
              >
                <Icon name="times" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity onPress={() => handleVideoOpen(item.videoUrl, item._id)}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={styles.playButtonOverlay}>
              <Icon name="play-circle" size={50} color="#fff" />
            </View>
          </TouchableOpacity>
        )}
        
        {isAdmin ? (
          <View style={styles.adminActions}>
            <TouchableOpacity style={styles.iconButton} onPress={() => handleDeleteModule(item._id)}>
              <Icon name="trash" size={20} color="#FF5722" />
            </TouchableOpacity>
            <View style={styles.moduleDetails}>
              <View style={styles.titleOrderContainer}>
                <Text style={styles.moduleTitle}>{item.title}</Text>
                <Text style={styles.moduleOrder}>  {item.order}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                setFormData({
                  title: item.title,
                  videoUrl: item.videoUrl,
                  thumbnail: item.thumbnail,
                  order: item.order.toString(),
                });
                setCurrentModuleId(item._id);
                setIsModalVisible(true);
              }}
            >
              <Icon name="edit" size={20} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.moduleDetails}>
            <View style={styles.titleOrderContainer}>
              <Text style={styles.moduleTitle}>{item.title}</Text>
              <Text style={styles.moduleOrder}>  {item.order}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[
      styles.container, 
      isFullScreen && styles.fullScreenContainer
    ]}>
      {!isFullScreen && <Text style={styles.header}>{courseTitle}</Text>}
      <FlatList
        data={modules}
        keyExtractor={(item) => item._id}
        renderItem={renderModule}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No modules found</Text>}
      />
      {isAdmin && !isFullScreen && (
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setIsModalVisible(true)}
        >
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      {/* Module Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>
              {currentModuleId ? 'Edit Module' : 'Add Module'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={formData.title}
              onChangeText={(value) => setFormData({ ...formData, title: value })}
            />
            <TextInput
              style={styles.input}
              placeholder="Video URL"
              value={formData.videoUrl}
              onChangeText={validateLink}
 />
            <TextInput
              style={styles.input}
              placeholder="Thumbnail URL"
              value={formData.thumbnail}
              onChangeText={(value) => setFormData({ ...formData, thumbnail: value })}
            />
            <TextInput
              style={styles.input}
              placeholder="Order"
              value={formData.order}
              onChangeText={(value) => setFormData({ ...formData, order: value })}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveOrUpdateModule}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  resetForm();
                  setIsModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 10 },
  header: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginVertical: 20 },
  listContent: { paddingBottom: 20 },
  emptyText: { textAlign: 'center', color: '#aaa', marginTop: 20 },
  moduleCard: { marginBottom: 15, borderRadius: 10, backgroundColor: '#fff', elevation: 4 },
  thumbnail: { width: '100%', height: 220, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  moduleDetails: { 
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 35  
  },
  titleOrderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  moduleTitle: { 
    fontSize: 16, 
    fontWeight: 'bold'
  },
  moduleOrder: { 
    fontSize: 16, 
    color: '#777'
  },
  adminActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: 10, 
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    padding: 15,
    elevation: 4,
  },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, margin: 20 },
  modalHeader: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5, marginBottom: 15 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  saveButton: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 5 },
  cancelButton: { backgroundColor: '#FF5722', padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: '600' },
  videoContainer: {
    height: 250,
    backgroundColor: '#000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  inlineVideoPlayer: {
    flex: 1,
  },
  fullScreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    zIndex: 999,
    borderRadius: 0,
  },
  closeInlineButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    zIndex: 1000,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 7,
  },
});

export default ModulePage;