import axios from "axios"


export const commonApi = async(httpRequest,url,reqbody,reqHeader)=>{
    const reqConfig = {
        method: httpRequest,
        url,
        data: reqbody,
        headers: reqHeader?reqHeader:{"Content-Type":"application/json"}
    }
    
    
    return await axios(reqConfig).then((result)=>{
        return result
    }).catch((error)=>{
        return error
    })
}