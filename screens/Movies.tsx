import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
} from "react-native";
import Swiper from "react-native-web-swiper";
import styled from "styled-components/native";
import Slide from "../components/Slide";
import Poster from "../components/Poster";

const Container = styled.ScrollView`
`;

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

const TrendingScroll = styled.ScrollView`
  margin-top: 20px;
`;

const Movie = styled.View`
  margin-right: 20px;
  align-items: center;
`;

const Title = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
  margin-top: 7px;
  margin-bottom: 5px;
`;

const Votes = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 10px;
`;

const ListContainer = styled.View`
  margin-bottom: 40px;
`;

const HMovie = styled.View`
  padding: 0px 30px;
  margin-bottom: 30px;
  flex-direction: row;
`;

const HColumn = styled.View`
  margin-left: 15px;
  width: 80%;
`;

const Overview = styled.Text`
  color: ${(props) => props.theme.textColor};
  opacity: 0.8;
  width: 80%;
`;

const Release = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  margin-right: 10px;
`;
const ComingSoonTitle = styled(ListTitle)`
  margin-bottom: 30px;
`;
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const API_KEY = '1ca048192caae0c193269bc2b692dabc'

const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nowPlaying, setNowPlaying] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  
  const getTrending = async () => {
    const { results } = await (
      await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
      )
    ).json();
    setTrending(results);
    console.log("getTrending")
  };
  
  const getUpcoming = async () => {
    const { results } = await (
      await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1&region=KR`
      )
    ).json();
    setUpcoming(results);
    console.log("getUpcoming")
  };
  
  const getNowPlaying = async () => {
     
  const { results } = await (
    await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
    )
  ).json();
    setNowPlaying(results);
    console.log("getNowplaying")
  };
  const getData = async () => {
    await Promise.all([getTrending(), getUpcoming(), 
      getNowPlaying()]);
    setLoading(false);
  };
  
  console.log("this type is", typeof nowPlaying)
  console.log("is this array?" , Array.isArray(nowPlaying))
  
  useEffect(() => {
      getData();
    }, []);
    const onRefresh = async () => {
      setRefreshing(true);
      await getData();
      setRefreshing(false);
    }
    //refreshControl을 만들 때 태그로 RefreshControl을 만들어주고,
    //내부에 props를 보내줘야 한다.
  return loading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Container
     refreshControl={
      <RefreshControl 
        refreshing={refreshing} 
        onRefresh={onRefresh}
      />}
    >
      <Swiper 
        loop
        timeout={4}
        controlsEnabled={false}
        containerStyle={{
          marginBottom: 40,
          width: "100%",
          height: SCREEN_HEIGHT / 4,
        }}>
        {nowPlaying.map((movie) => (
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
        <TrendingScroll
          contentContainerStyle={{ paddingLeft: 30 }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {trending.map((movie) => (
            <Movie key={movie.id}>
            <Poster path={movie.poster_path} />
            <Title>
              {movie.original_title.slice(0, 13)}
              {movie.original_title.length > 13 ? "..." : null}
            </Title>
              {movie.vote_average === 0 ? null : (
            <Votes>
              ⭐️ {movie.vote_average}/10
            </Votes>
              )}
            </Movie>
          ))}
        </TrendingScroll>
      </ListContainer>
      <ComingSoonTitle>Comming Soon!</ComingSoonTitle>
        {upcoming.map((movie) => (
        <HMovie key={movie.id}>
          <Poster path={movie.poster_path} />
          <HColumn>
            <Title>{movie.original_title}</Title>
            <Release>
              {new Date(movie.release_date).toLocaleDateString("ko", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Release>
            <Overview>
                {movie.overview !== "" && movie.overview.length > 80
                  ? `${movie.overview.slice(0, 140)}...`
                  : movie.overview}
            </Overview>
          </HColumn>
        </HMovie>))}
    </Container>
  );
};
export default Movies;