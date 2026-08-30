import axiosInstance from "../axios/axios";
import type {UserProfile} from "../types";

const userApi = {
    register: async (username: string, email: string, password: string) =>
        axiosInstance.post<{username: string; email: string; role: string}>
        ("/user/register",
            {
                username,
                email,
                password
            }
        ),

    login: async (username: string, password: string) =>
        axiosInstance.post<{token: string}>
        ("/user/login",
            {
                username,
                password
            }
        ),

    getMe: async () =>
        axiosInstance.get<UserProfile>("/user/me"),
};

export default userApi;