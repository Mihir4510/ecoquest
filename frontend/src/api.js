// import axios from "axios";

// // Replace with your backend server URL
// const API_URL = "http://localhost:5000";  

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",  
  withCredentials: true,
});

export default api;
