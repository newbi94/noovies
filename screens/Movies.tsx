import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
} from "react-native";
import Swiper from "react-native-web-swiper";
import styled from "styled-components/native";
import Slide from "../components/Slide";
import VMedia from "../components/VMedia";
import HMedia from "../components/HMedia";
import { Movie, MovieResponse, moviesApi } from "../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../components/Loader";
import HList from "../components/HList";




const ListTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 18px;
  font-weight: 600;
  margin-left: 30px;
`;

const ListContainer = styled.View`
  margin-bottom: 40px;
`;

const ComingSoonTitle = styled(ListTitle)`
  margin-bottom: 20px;
`;

const VSeparator = styled.View`
  width: 20px;
`;

const HSeparator = styled.View`
  height: 20px;
`;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");



const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {
  
  const queryClient = useQueryClient();
  
/*   const { isLoading: nowPlayingLoading, data: nowPlayingData } = useQuery(
    ['nowPlaying'],
    moviesApi.nowPlaying,
  );
  const { isLoading: upcomingLoading, data: upcomingData } = useQuery(
    ['upcoming'],
    moviesApi.upcoming,
  );
  const { isLoading: trendingLoading, data: trendingData } = useQuery(
    ['trending'],
    moviesApi.trending,
  ); 
  useQuery의 기존 구성방식이다
  지금 v5로 넘어온 ReactQuery에서는 tanstack/react-query로 import하고
  구성방식도 아래처럼 해주어야 한다.
  */
 
  const { 
    isLoading: nowPlayingLoading, 
    data: nowPlayingData,  
    isRefetching: isRefetchingNowPlaying, 
  } = useQuery<MovieResponse>({
    queryKey: ['movies','nowPlaying'],
    queryFn: moviesApi.nowPlaying,
  });
  //키는 반드시 array, ['a' , 'b' ] -> a는 카테고리 역할을 한다.
  //cache로 저장될 때 카테고리가 있으면 굉장히 유용하다.
  const { 
    isLoading: upcomingLoading, 
    data: upcomingData, 
    isRefetching: isRefetchingUpcoming,
  } = useQuery<MovieResponse>({
    queryKey: ['movies','upcoming'],
    queryFn: moviesApi.upcoming,
  });
  
  const { 
    isLoading: trendingLoading, 
    data: trendingData,
    isRefetching: isRefetchingTrending, 
  } = useQuery<MovieResponse>({
    queryKey: ['movies','trending'],
    queryFn: moviesApi.trending,
  });

  const onRefresh = async () => {
    queryClient.refetchQueries({queryKey: ["movies"] })
  }
  //movies 카테고리가 붙은 쿼리를 refetch한다.
  
  const renderHMedia = ({ item }:{item:Movie}) => (
      <HMedia 
        posterPath={item.poster_path || ""}
        originalTitle={item.original_title}
        releaseDate={item.release_date}
        overview={item.overview}
        voteAverage={item.vote_average}
      />)
  
  const movieKeyExtractor = (item:Movie) => item.id + "";
  
  const loading = nowPlayingLoading || upcomingLoading || trendingLoading;
  const refreshing = isRefetchingNowPlaying || isRefetchingUpcoming || isRefetchingTrending;
  console.log(refreshing);

  return loading ? (
    <Loader />
  ) : ( upcomingData ? (
    <FlatList 
        refreshing={refreshing} 
        onRefresh={onRefresh}
        ListHeaderComponent={
        <>
      <Swiper 
        loop
        timeout={4}
        controlsEnabled={false}
        containerStyle={{
          marginBottom: 40,
          width: "100%",
          height: SCREEN_HEIGHT / 4,
        }}>
        {nowPlayingData?.results.map((movie) => (
          <Slide 
          key={movie.id}
          backdropPath={movie.backdrop_path || ""}
          posterPath={movie.poster_path || ""}
          originalTitle={movie.original_title}
          voteAverage={movie.vote_average}
          overview={movie.overview}
          />))}
      </Swiper>
      {trendingData ? (
        <HList 
          title="Trending Movies"
          data={trendingData.results}
        />) : null }
      <ComingSoonTitle>Comming Soon!</ComingSoonTitle>
      </>
      }
      keyExtractor={movieKeyExtractor}
      data={upcomingData.results}
      ItemSeparatorComponent={HSeparator}
      renderItem={renderHMedia}
        />
        ) : null
  );
};
export default Movies;