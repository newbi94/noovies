import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import styled from "styled-components/native";
import { Movie, TV, moviesApi, tvApi } from "../api";
import Poster from "../components/Poster";
import { makeImgPath } from "../utils";
import { BLACK_COLOR } from "../colors";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const Container = styled.ScrollView`
    background-color: ${(props) => props.theme.mainBgColor};
`;

const Header = styled.View`
  height: ${SCREEN_HEIGHT / 4}px;
  justify-content: flex-end;
  padding: 0px 20px;
`;

const Background = styled.Image``;

const Column = styled.View`
  flex-direction: row;
  width: 80%;
`;
const Title = styled.Text`
  color: white;
  font-size: 36px;
  align-self: flex-end;
  margin-left: 15px;
  font-weight: 500;
`;
const Overview = styled.Text`
  color: ${(props) => props.theme.textColor};
  margin-top: 20px;
  padding: 0px 20px;
`;

type RootStackParamList = {
    Detail: Movie | TV;
};


type DetailScreenProps = 
        NativeStackScreenProps<RootStackParamList, "Detail">

const Detail: React.FC<DetailScreenProps> = ({
    navigation: { setOptions },
    route: { params },
    }) => {

        const {
            isLoading: moviesLoading,
            data: moviesData,
        } = useQuery({
            queryKey: ['movies', params.id],
            queryFn: moviesApi.detail,
            enabled: "original_title" in params,
        });
//영화에는 original_title에만 있고, tv show에는 original_name만 있는 것을 이용해
//enabled를 설정했다. 영화를 클릭하면 tv fetch는 동작하지 않는다. 반대 경우는 영화 fetch가 동작하지 않는다.
//자동완성을 통해 useQuery를 import할 경우 무심하게 엔터를 치면 tanstack이 아닌 일반 react-query로 import된다.
//그렇게 되면 React Query v5인 지금, useQuery는 작동하지 않게된다.
//params = nowplaying.results 라서 이것저것 데이터가 많긴하다.
//하지만 그 이외에 비디오라던지 다른 사진들, params보다 넓은 범위에서 데이터를 끌어 쓰려면
//fetch가 필요해서 이와 같이 fetching하는 것.
//기존에 사용하던 overview, rate, title, poster 등은 이미 params로부터 받아내고 있음을 기억하자.

        const {
            isLoading: tvLoading,
            data: tvData,
        } = useQuery({
            queryKey: ['tv',params.id],
            queryFn: tvApi.detail,
            enabled: "original_name" in params,
        });

    useEffect(() => {
        setOptions({
            title:
        "original_title" in params
          ? "Movie"
          : "TV Show",
        });
    }, []);
    console.log("movie",moviesData)
    console.log("tv", tvData)
    
    return (
    <Container>
        <Header>
            <Background 
                style={StyleSheet.absoluteFill}
                source={{ uri: makeImgPath(params.backdrop_path || "")}}
            />
            <LinearGradient 
                colors={["transparent",BLACK_COLOR]}
                style={StyleSheet.absoluteFill}
            />
            <Column>
                <Poster path={params.poster_path || ""} />
                <Title>
                    {"original_title" in params 
                    ? params.original_title
                    : params.original_name}
                </Title>
            </Column>
        </Header>
        <Overview>
            {params.overview}
        </Overview>
    </Container>
    )
}
//<LinearGradient>는 그라데이션 효과를 줄 수 있는 태그다.
//expo install expo-linear-gradient 를 통해 설치하고 import해줘야 하는데,
//자동으로 import가 되지 않아 수동으로 했다.
//transparent는 검정색을 기본으로 하는 투명색이다(?).

export default Detail;