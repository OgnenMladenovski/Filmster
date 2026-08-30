import axiosInstance from "../axios/axios";
import type { WatchlistItem } from "../types";

const watchlistApi = {
    getMy: async () =>
        axiosInstance.get<WatchlistItem[]>("/watchlist/my"),

    add: async (tmdbId: number) =>
        axiosInstance.post<WatchlistItem>(`/watchlist/${tmdbId}`),

    remove: async (tmdbId: number) =>
        axiosInstance.delete<{ message: string }>(`/watchlist/${tmdbId}`),
};

export default watchlistApi;