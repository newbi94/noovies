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
  
  interface BaseResponse {
    page: number;
    total_results: number;
    total_pages: number;
  }
  
  export interface MovieResponse extends BaseResponse {
    results: Movie[];
  }

export const moviesApi = { 
    trending : () => 
    fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`)
    .then((res) => res.json()), 

    upcoming : () => 
    fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1&region=KR`)
    .then((res) => res.json()), 

    nowPlaying : () => 
    fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=KR`)
    .then((res) => res.json()), 
    
    search: ({ queryKey }) => {
      const [_, query] = queryKey;
      console.log(query)
      return fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&page=1&query=${query}`
      ).then((res) => res.json());
    },
  };
  //const [_, x] = y;
  //받아온 y(array)는 queryKey이다. 거기서 두번째 인자를 query로 정의하는 것.
  //즉 빈자리는 원래 'searchmovies'인데, 나중에 카테고리로써 역할을 할 것이다(?).

export const tvApi = {
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
  };