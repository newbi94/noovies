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
    hasNextPage, 
    fetchNextPage,
  } = useInfiniteQuery<MovieResponse>({
    queryKey: ['movies', 'upcoming'],
    queryFn: moviesApi.upcoming,
    getNextPageParam: (currentPage) => {
      const nextPage = currentPage.page +1;
      return nextPage > currentPage.total_pages ? null : nextPage;
    },
  });
/*   useInfiniteQuery

무한 스크롤뷰라고 하는 이것은 api를 통해 받는 모든 데이터를 한번에 fetching하지 않고,
사용자가 page1의 스크롤 끝까지 넘겨갈 때쯤 (시점을 설정할 수 있다)
page2의 데이터를 추가로 fetching하여 가져오는 기능이다.

일반 scrollView에서 flatList로 넘어올 때와 비슷하다.
방대한 양의 데이터를 한번에 가져오려면 분명 느려지니까 이러한 기능들이 유용하게 쓰이는 것.
hasNextPage는 boolean값이다. 다음 페이지를 넘길 수 있는지 없는지(마지막 페이지인지)
알 수 있는 프로퍼티(?). fetchNextPage는 다음 페이지의 데이터를 가져오는 함수다.

getNextPageParam은 
This function can be set to automatically get the next cursor for infinite queries. 
The result will also be used to determine the value of `hasNextPage`. 라는 설명이 있다.

- 다음 페이지로 가는 방식을 정의하는 함수
- 마지막 또는 모든 페이지에 대한 데이터를 다룬다.
- 다음 api를 요청할 때 사용될 pageParam값을 정할 수 있다.

hasNextPage도 getNextPageParam의 return값을 기반으로 기능한다.
아마 위 코드처럼 getNextPageParam를 설정했을 때, null이 return되면 false가 되면서 
loadMore함수 내의 fetchNextPage를 발생시키지 않겠지.   */
  
  const { 
    isLoading: trendingLoading, 
    data: trendingData, 
  } = useQuery<MovieResponse>({
    queryKey: ['movies','trending'],
    queryFn: moviesApi.trending,
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
  
      const movieKeyExtractor = (item:Movie) => item.id + "";
  
  const loading = nowPlayingLoading || upcomingLoading || trendingLoading;
  
  const loadMore = () => {
    if(hasNextPage){
      fetchNextPage();
      console.log(upcomingData)
      console.log(hasNextPage)
      }
      console.log(hasNextPage)
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
          data={trendingData.results}
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
/* flat은 array in array를 정리해준다(?).

예를 들어,

[ [ { Movie } ],[ { Movie } ],[ { Movie } ],[ { Movie } ] ]. flat()
=> [ { Movie } , { Movie } , { Movie } , { Movie } ]
console.log(upcomingData)의 결과
{"pageParams": [undefined], "pages": [{"dates": [Object], "page": 1, "results": [Array], "total_pages": 2, "total_results": 28}]}
이러한데, 여기서 우리는 results가 필요하다.

헌데 useInfiniteQuery는 스크롤을 끝까지 내려 page: 1 에 대한 정보를 다 보면,
{"pageParams": [undefined, 2], "pages": [{"dates": [Object], "page": 1, "results": [Array], "total_pages": 2, "total_results": 28}, {"dates": [Object], "page": 2, "results": [Array], "total_pages": 2, "total_results": 28}]}
이렇게 page: 2를 하나 더 fetching하여 가져오는 기능을 한다.

자세히 보면 upcomingData.pages가 [{"dates": [Object], "page": 1, "results": [Array], "total_pages": 2, "total_results": 28}, {"dates": [Object], "page": 2, "results": [Array], "total_pages": 2, "total_results": 28}] 부분임을 알 수 있고,
여기서 [ ] 내부에 객체가 두개로 나뉘어져 있는데, 각각 page 1, 2이다.
우리는 각 page마다 results를 필요로 하는데 

https://api.themoviedb.org/3/movie/now_playing?api_key=1ca048192caae0c193269bc2b692dabc&language=en-US&page=1&region=KR

위 api를 참조하면 results : [ { movie1 } , { movie2 }, … ] 형태로 이루어져있다.
우리는 최종적으로 저 { movie } 들이 필요한 것인데 page가 누적되면 
[ [ { movie1 } , { movie2 }, … ] , [ { movie1 } , { movie2 }, … ] ] 형태로 array가 두 겹이 된다.

본래 useInfiniteQuery를 사용하지 않고 page=1에 고정된 상태로 render할 때는 
[ { movie1 } , { movie2 }, … ] 이런 형태기 때문에 여기서 maping하면 [ ] 내부에 각 객체들에
접근하여 render가 이뤄지지만 array가 두 겹이 되어버린 것.

flat을 통해 array를 벗겨 내어야한다.

위와 같이 page가 누적되어 upcomingData.pages 가 
[ [ Array ] , [ Array ] , … ] = [ [ results1 ] , [ results2 ] , … ] 형태를 띌 때, flat() 을 더해
각 [ results ] 들의 [ ]을 벗겨내 [ { movie1 } , { movie2 }, { movie3 }, … ] 형태로 바꿔서 

renderitem의 item으로 넘겨주면 각 movie들을 maping하여 순조롭게 render되는 것. */

export default Movies;