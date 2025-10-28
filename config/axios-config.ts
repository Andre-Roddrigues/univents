import { routes } from "@/config/routes";
// import { getUser } from "@/services/auth-services";
import axios from "axios";
import { decodeJwt } from "jose";

const apiClient = axios.create({
  baseURL: routes.backend_url,
});

apiClient.interceptors.request.use(
  async (config) => {
    // const session = await getUser();
    // const token = session?.accessToken;
    console.log("token: ");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;

    //   const decodedToken: any = decodeJwt(token);
    //   const userId = decodedToken.id;

    //   if (userId && config.url) {
    //     config.url = `${config.url}`;
    //   }
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
