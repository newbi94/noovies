import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Alert, Dimensions, FlatList, } from "react-native";
import Swiper from "react-native-web-swiper";
import styled from "styled-components/native";
import Slide from "../components/Slide";
import HMedia from "../components/HMedia";
import { Movie, MovieResponse, moviesApi } from "../api";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
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

  const [refreshing, setRefreshing] = useState(false);

 
  const { 
    isLoading: nowPlayingLoading, 
    data: nowPlayingData,   
  } = useQuery<MovieResponse>({
    queryKey: ['movies','nowPlaying'],
    queryFn: moviesApi.nowPlaying,
  });

  const { 
    isLoading: upcomingLoading, 
    data: upcomingData,
    hasNextPage:upcomingHasNext, 
    fetchNextPage:upcomingFetchNext,
  } = useInfiniteQuery<MovieResponse>({
    queryKey: ['movies', 'upcoming'],
    queryFn: moviesApi.upcoming,
    getNextPageParam: (currentPage) => {
      const nextPage = currentPage.page +1;
      return nextPage > currentPage.total_pages ? null : nextPage;
    },
  });

  const { 
    isLoading: trendingLoading, 
    data: trendingData, 
    hasNextPage:trendingHasNext,
    fetchNextPage:trendingFetchNext,
  } = useInfiniteQuery<MovieResponse>({
    queryKey: ['movies','trending'],
    queryFn: moviesApi.trending,
    getNextPageParam: (currentPage) => {
      const nextPage = currentPage.page +1;
      return nextPage > currentPage.total_pages ? null : nextPage;
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries({queryKey: ["movies"] });
    setRefreshing(false);
  };
  
  const renderHMedia = ({ item }:{item:Movie}) => (
      <HMedia 
        posterPath={item.poster_path || ""}
        originalTitle={item.original_title}
        releaseDate={item.release_date}
        overview={item.overview}
        voteAverage={item.vote_average}
        fullData={item}
      />)
  
      const movieKeyExtractor = (item, index) => item.id + String(index)
  
  const loading = nowPlayingLoading || upcomingLoading || trendingLoading;
  
  const loadMore = () => {
    if(upcomingHasNext){
      upcomingFetchNext();
      console.log("Up", upcomingHasNext)
      }
      console.log("Up", upcomingHasNext)
  }
  return loading ? (
    <Loader />
  ) : ( upcomingData ? (
    <FlatList
        onEndReached={loadMore}
        //onEndReachedThreshold={0.4}
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
          fullData={movie}
          />))}
      </Swiper>
      {trendingData ? (
        <HList 
          title="Trending Movies"
          data={trendingData.pages.map((page) => page.results).flat()}
          hasNext={trendingHasNext}
          fetchNext={trendingFetchNext}
        />) : null }
      <ComingSoonTitle>Comming Soon!</ComingSoonTitle>
      </>
      }
      keyExtractor={movieKeyExtractor}
      data={upcomingData.pages.map((page) => page.results).flat()}
      ItemSeparatorComponent={HSeparator}
      renderItem={renderHMedia}
        />
        ) : null
  );
};

export default Movies;