import axiosInstance from "../axios/axios";
import type {Rating} from "../types";

const ratingApi = {
    getMy: async () =>
        axiosInstance.get<Rating[]>("/ratings/my"),

    rate: async (tmdbId: number, score: number, review: string) =>
        axiosInstance.post<Rating>
        ("/ratings",
            {
                tmdbId,
                score,
                review,
            }
        ),

    delete: async (tmdbId: number) =>
        axiosInstance.delete<{ message: string }>(`/ratings/${tmdbId}`),
};

export default ratingApi;