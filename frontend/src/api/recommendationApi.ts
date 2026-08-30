import axiosInstance from "../axios/axios";
import type { Recommendation } from "../types";

const recommendationApi = {
    getMy: async () =>
        axiosInstance.get<Recommendation[]>("/recommendations/my"),

    generate: async () =>
        axiosInstance.post<Recommendation[]>("/recommendations/generate"),
};

export default recommendationApi;