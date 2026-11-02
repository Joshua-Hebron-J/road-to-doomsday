import { Movie } from "../types/movie";
import { movies } from "./movies";

export const series: Movie[] = movies.filter((item) => item.type === "series");
