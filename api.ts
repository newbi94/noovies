import { QueryFunction } from "@tanstack/react-query";

const API_KEY = '1ca048192caae0c193269bc2b692dabc';
const BASE_URL = "https://api.themoviedb.org/3";

export interface Movie {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export interface TV {
    name: string;
    original_name: string;
    origin_country: string[];
    vote_count: number;
    backdrop_path: string | null;
    vote_average: number;
    genre_ids: number[];
    id: number;
    original_language: string;
    overview: string;
    poster_path: string | null;
    first_air_date: string;
    popularity: number;
    media_type: string;
}  
  
interface BaseResponse {
  page: number;
  total_results: number;
  total_pages: number;
}
  
export interface MovieResponse extends BaseResponse {
  results: Movie[];
}

export interface TVResponse extends BaseResponse {
  results: TV[];
}

interface Fetchers<T> {
  [key: string]: QueryFunction<T>;
}

export const moviesApi: Fetchers<MovieResponse> = { 
    trending : () => 
    fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`)
    .then((res) => res.json()), 

    upcoming : ({ pageParam }) => 
    fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${ pageParam ? pageParam : 1}`)
    .then((res) => res.json()), 
    
/*     
여기서 인자로 들어가는 { pageParam }을 이름이라도 바꾸면 movie들의 key가 겹친다는 에러 :
’ Warning: Encountered two children with the same key, `1172551`. Keys should be unique 
so that components maintain their identity across updates. Non-unique keys may cause children to be 
duplicated and/or omitted — the behavior is unsupported and could change in a future version. ‘
    
가 발생하고, 뒤에 있는 ${ pageParam ? pageParam : 1 }처럼 기본 값을 주어지지 않고 단순히 
${ pageParam } 만 넣으면  ‘ TypeError: Cannot read property 'id' of undefined ‘ 가 발생한다. */

    nowPlaying : () => 
    fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=KR`)
    .then((res) => res.json()), 
    
    search: ({ queryKey }) => {
      const [_, query] = queryKey;
      return fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&page=1&query=${query}`
      ).then((res) => res.json());
    },
    detail: ({ queryKey }) => {
      const [_, id] = queryKey;
      return fetch(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,images`
      ).then((res) => res.json());
    },
  };

  export const tvApi: Fetchers<TVResponse> = {
    trending: () =>
      fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`).then((res) =>
        res.json()
      ),
    airingToday: () =>
      fetch(`${BASE_URL}/tv/airing_today?api_key=${API_KEY}`).then((res) =>
        res.json()
      ),
    topRated: () =>
      fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`).then((res) =>
        res.json()
      ),
      search: ({ queryKey }) => {
        const [_, query] = queryKey;
        return fetch(
          `${BASE_URL}/search/tv?api_key=${API_KEY}&language=en-US&page=1&query=${query}`
        ).then((res) => res.json());
      },
      detail: ({ queryKey }) => {
        const [_, id] = queryKey;
        return fetch(
          `${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=videos,images`
        ).then((res) => res.json());
      },
  };