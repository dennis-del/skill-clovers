import { commonApi } from "./commonApi"
import { serverUrl } from "./serverUrl"



export const registerApi = async(reqbody)=>{
    return await commonApi('POST',`${serverUrl}/register`,reqbody,"")
}

export const loginApi = async(reqbody)=>{
    return await commonApi('POST',`${serverUrl}/login`,reqbody,"")
}

export const addDomainApi = async(reqbody)=>{
    return await commonApi('POST',`${serverUrl}/createDomain`,reqbody,"")
}

export const fetchDomainsApi = async()=>{
    return await commonApi('GET', `${serverUrl}/domains`,null,"");
};

export const deleteDomainApi = async(id)=>{
    return await commonApi('DELETE',`${serverUrl}/deleteDomain/${id}`,{},"")
}

export const updateDomainApi = async(id,reqbody)=>{
    return await commonApi('PUT',`${serverUrl}/updateDomain/${id}`,reqbody,"")
}

export const getSingleDomainApi = async(id)=>{
    return await commonApi('GET',`${serverUrl}/singleDomain/${id}`,null,"")
}

export const getAllGoalsApi = async()=>{
    return await commonApi('GET',`${serverUrl}/goal`,null,"")
}

export const getSingleGoalApi = async(id)=>{
    return await commonApi('GET',`${serverUrl}/singleGoal/${id}`,null,"")
}

export const addCourseApi = async(reqbody)=>{
    return await commonApi('POST',`${serverUrl}/addCourse`,reqbody,"")
}

export const getAllCoursesApi = async (goalId = null, domainId = null) => {
    const url = new URL(`${serverUrl}/courses`);
    if (goalId) url.searchParams.append('goalId', goalId);
    if (domainId) url.searchParams.append('domainId', domainId);
    
    return await commonApi('GET', url.toString(), null, "")
}

export const deleteCourseApi = async(id)=>{
    return await commonApi('DELETE',`${serverUrl}/deleteCourse/${id}`,{},"")
}

export const updateCourseApi = async(id,reqbody)=>{
    return await commonApi('PUT',`${serverUrl}/updateCourse/${id}`,reqbody,"")
}

export const getSingleCourseApi = async(id)=>{
    return await commonApi('GET',`${serverUrl}/singleCourse/${id}`,null,"")
}

export const createOrderApi = async (reqBody) => {
    return await commonApi('POST', `${serverUrl}/createOrder`,reqBody,"");
};

export const verifyPaymentApi = async (reqBody) => {
    return await commonApi('POST', `${serverUrl}/verifyPayment`,reqBody,"");
};

export const getPaymentDetailsApi = async (paymentId) => {
    return await commonApi('GET', `${serverUrl}/payment/${paymentId}`,null,"");
};

export const checkUserCoursePaymentApi = async (userId, courseId) => {
    try {
      console.log('API Request URL:', `${serverUrl}/checkUserCoursePayment/${userId}/${courseId}`);
      const response = await commonApi(
        'GET',
        `${serverUrl}/checkUserCoursePayment/${userId}/${courseId}`,
        null,
        ""
      );
      console.log('API Response:', response);
      return response;
    } catch (error) {
      console.log('API Error:', error);
      throw error;
    }
};

export const addModuleApi = async (reqBody) => {
    return await commonApi('POST',`${serverUrl}/createModule`,reqBody,"");
};

export const getModulesApi = async (courseId) => {
    const response = await commonApi('GET', `${serverUrl}/modules/${courseId}`, null, "");
    console.log('Response from API:', response); // Log the response
    return response;
}

export const deleteModuleApi = async (id) => {
    return await commonApi('DELETE',`${serverUrl}/deleteModules/${id}`,{},"");
}

export const updateModuleApi = async (id,reqBody) => {
    return await commonApi('PUT',`${serverUrl}/updateModules/${id}`,reqBody,"");
}

export const getProfileApi = async (userId) => {
    return await commonApi('GET',`${serverUrl}/profile/${userId}`,null,"");
}

export const updateProfileApi = async (userId,reqBody) => {
    return await commonApi('PUT',`${serverUrl}/updateProfile/${userId}`,reqBody,"")
}

export const forgotPasswordApi = async (email) => {
    return await commonApi('POST',`${serverUrl}/forgotPassword`,email,"")
}

export const resetPasswordApi = async (reqbody) => {
    return await commonApi('POST',`${serverUrl}/resetPassword/${reqbody.token}`,reqbody,"")
}