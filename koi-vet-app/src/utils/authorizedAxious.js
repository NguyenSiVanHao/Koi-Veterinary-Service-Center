import axios from "axios";
import { toast } from "react-toastify";
import { API_ROOT } from "./constants";



//Khởi tạo đối tuọng Axios (authorizedAxios) với mục đích custom và cấu hình chung cho dự án
let api = axios.create({
    baseURL: API_ROOT,
})
//thời gian chờ tối đa của 1 request để 10phut
api.defaults.timeout = 1000 * 60 * 10;
//withCredentials: true để gửi cookie trong request lên backend phục vụ cho trường hợp chung ta su dung JWT token theo cơ chế httpOnly
// authorizedAxiosInstance.defaults.withCredentials = true;

//Câu hình interceptors cho Axios
// Add a request interceptor: can thiệp và giữa các request API
api.interceptors.request.use((config) => {
    //Lấy accessToken từ localStorage
    const accessToken = localStorage.getItem('accessToken');
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, function (error) {
    // Do something with request error
    console.log('error', error);
    return Promise.reject(error);
});

// Add a response interceptor : can thiệp vào nhung respone API trả về
api.interceptors.response.use((response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if(response.data?.message){
        // toast.success(response.data.message);
    }
    return response;
}, (error) => {
    // Mọi lỗi status code nằm ngoài phạm vi 200 - 299 sẽ là lỗi và chạy vào đây
    // Do something with response error

    if (error.response?.status !== 410) {
        //  toast.error(error.response?.data.message || error.message || 'Something went wrong check your internet connection');
        
       
    }
    return Promise.reject(error);
});



export default api;