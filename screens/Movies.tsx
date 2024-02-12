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
import { moviesApi } from "../api";
import { useQuery } from "@tanstack/react-query";
//import { useQuery } from "react-query";

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

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
  const [refreshing, setRefreshing] = useState(false);
  
  const { isLoading: nowPlayingLoading, data: nowPlayingData } = useQuery(
    'nowPlaying',
    moviesApi.nowPlaying
  );
  const { data } = useQuery({
    queryKey: [QueryKeys.PRODUCTS],
    queryFn: () =>
      fetcher({
        method: "GET",
        path: "/products",
      }),
  });
  const { isLoading: upcomingLoading, data: upcomingData } = useQuery(
    ['upcoming'],
    moviesApi.upcoming
  );
  const { isLoading: trendingLoading, data: trendingData } = useQuery(
    ['trending'],
    moviesApi.trending
  );
  /* ReactQuery는 데이터 fetching, caching, 동기화, 서버 데이터 업데이트 등을 쉽게 만들어주는 라이브러리이다.
  loading, error, state 등 여러 기능들을 기존에는 각각 따로 구현해야 했다면 
  useQuery를 사용하여 fetching하면 이 모두를 함께 제공한다.
  그리고 ReactQuery의 cach시스템 또한 효율적이다. 한번 fetch했던 useQuery는 
  ReactQuery의 cach로 남아 다른 컴포넌트나 함수에서 쓰여도 다시 fetch하지 않는다. 
  첫번째 props " x "는 key이고, 두번째 props moviesApi.y는 api fetcher함수다.
  */
  
  const onRefresh = async () => {
  }
  
  const renderVMedia = ({ item }) => (
      <VMedia
        posterPath={item.poster_path}
        originalTitle={item.original_title}
        voteAverage={item.vote_average}
      />)

  const renderHMedia = ({item}) => (
      <HMedia 
        posterPath={item.poster_path}
        originalTitle={item.original_title}
        releaseDate={item.release_date}
        overview={item.overview}
        voteAverage={item.vote_average}
      />)
  
  const movieKeyExtractor = (item) => item.id + "";
  
  const loading = nowPlayingLoading || upcomingLoading || trendingLoading;

  return loading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
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
        {nowPlayingData.results.map((movie) => (
          <Slide 
          key={movie.id}
          backdropPath={movie.backdrop_path}
          posterPath={movie.poster_path}
          originalTitle={movie.original_title}
          voteAverage={movie.vote_average}
          overview={movie.overview}
          />))}
      </Swiper>
      <ListContainer>
        <ListTitle>Trending Movies</ListTitle>
        <FlatList
          style={{marginTop:20}}
          data={trendingData.results}
          horizontal
          keyExtractor={movieKeyExtractor}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 30 }}
          ItemSeparatorComponent={VSeparator}
          renderItem={renderVMedia}
          />  
      </ListContainer>
      <ComingSoonTitle>Comming Soon!</ComingSoonTitle>
      </>
      }
      keyExtractor={movieKeyExtractor}
      data={upcomingData.results}
      ItemSeparatorComponent={HSeparator}
      renderItem={renderHMedia}
        />
  );
};
export default Movies;