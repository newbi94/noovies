import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import Swiper from "react-native-web-swiper";
import styled from "styled-components/native";
import Slide from "../components/Slide";
import VMedia from "../components/VMedia";
import HMedia from "../components/HMedia";

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

/* const TrendingScroll = styled.FlatList`
  margin-top: 20px;
`; */

const ListContainer = styled.View`
  margin-bottom: 40px;
`;

const ComingSoonTitle = styled(ListTitle)`
  margin-bottom: 20px;
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
        <FlatList
          style={{marginTop:20}}
          data={trending}
          horizontal
          keyExtractor={(item) => item.id +""}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 30 }}
          ItemSeparatorComponent={() => <View style={{ width: 30 }} />}
          renderItem={({ item }) => (
            <VMedia
              posterPath={item.poster_path}
              originalTitle={item.original_title}
              voteAverage={item.vote_average}
            />)}//FlatList는 data와 renderItem을 필수로 기입한다.
            //FlatList가 기존의 스크롤뷰보다 뛰어난 점은 모든 elements를 한번에
            //render하는 스크롤뷰와 다르게 화면에 나타나기 바로 직전에 render하여
            //소위 말하는 렉을 줄여준다.
            //keyExtractor로 각 key를 부여해주는데 +""는 숫자로 된 해당id를 받아
            //string형태로 바꿔주는 역할을 한다. 니꼬는 string으로 받아야하는 에러가 떠서
            //이렇게 했지만 지금은 개선이 된건지 저 부분을 빼도 에러가 나지 않는다.
            //ItemSeparatorComponent가 바로 스크롤뷰에서 갖지 못해 VMedia에서 부여했던
            //margin속성이다. 더 특별한 것은 공간을 주는 방식이 사이에 컴포넌트를 넣어주는 방식이라
            //텍스트나 이미지등 원하는 것을 집어 넣을 수 있고, 똑똑하게도 마지막 VMedia컴포넌트 뒤에는
            //추가하지 않아 따로 -1해주는 코딩을 짤 필요가 없다.
            //<TrendingScroll> 자체를 <FlatList>로 바꿔야 하는 줄 알았는데 위에 있는 
            //TrendingScroll의 스타일 컴포넌트를 FlatList로 바꿔주면 된다. <- 니꼬는 됐는데 나는 안된다.
            //해서 위에 스타일 컴포넌트 지우고 태그를 <FlatList>로 바꾼 뒤 style={{marginTop:20}}으로 추가했다.
          />  
      </ListContainer>
      <ComingSoonTitle>Comming Soon!</ComingSoonTitle>
      </>
      }
      keyExtractor={(item) => item.id +""}
      data={upcoming}
      renderItem={({item}) => (
          <HMedia 
          key={item.id}
          posterPath={item.poster_path}
          originalTitle={item.original_title}
          releaseDate={item.release_date}
          overview={item.overview}
          voteAverage={item.vote_average}
          />)}
        />
  );
};
export default Movies;