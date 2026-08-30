import axiosInstance from "../axios/axios";
import type { Genre } from "../types";

const genreApi = {
    getAll: async () =>
        axiosInstance.get<Genre[]>("/genres"),
};

export default genreApi;