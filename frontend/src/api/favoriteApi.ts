import axiosInstance from "../axios/axios";
import type { FavoriteMovie } from "../types";

const favoriteApi = {
    getMy: async () =>
        axiosInstance.get<FavoriteMovie[]>("/favorites/my"),

    add: async (tmdbId: number) =>
        axiosInstance.post<FavoriteMovie>(`/favorites/${tmdbId}`),

    remove: async (tmdbId: number) =>
        axiosInstance.delete<{ message: string }>(`/favorites/${tmdbId}`),
};

export default favoriteApi;