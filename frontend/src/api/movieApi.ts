import axiosInstance from "../axios/axios";
import type {Movie, MovieDetails} from "../types";

const movieApi = {
    search: async (query: string) =>
        axiosInstance.get<Movie[]>("/movies/search",
            {
                params:
                    {
                        query
                    }
            }),
    getById: async (tmdbId: number) =>
        axiosInstance.get<MovieDetails>(`/movies/${tmdbId}`),

    getByGenre: async (genreTmdb: number)=>
        axiosInstance.get<Movie[]>(`/movies/genre/${genreTmdb}`),
};

export default movieApi;