import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Cookie pathanor jonno (JWT token cookie te thake)
});

export default api;

//এইটা দিয়ে পরে সব API call (register, login, complaint) করা হবে, আলাদা করে বার বার URL লেখা লাগবে না।