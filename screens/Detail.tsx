import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Share, Platform } from "react-native";
import styled from "styled-components/native";
import { Movie, TV, moviesApi, tvApi } from "../api";
import Poster from "../components/Poster";
import { makeImgPath } from "../utils";
import { BLACK_COLOR } from "../colors";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@tanstack/react-query";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../components/Loader";
import { TouchableOpacity } from "react-native";

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
  margin: 20px 0px;
`;
const Data = styled.View`
  padding: 0px 20px;
`;
const VideoBtn = styled.TouchableOpacity`
  flex-direction: row;
`;
const BtnText = styled.Text`
  color: white;
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 24px;
  margin-left: 10px;
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
    const isMovie = "original_title" in params;

        const {
            isLoading,
            data,
        } = useQuery({
            queryKey: [isMovie ? 'movies':'tv', params.id],
            queryFn: isMovie ? moviesApi.detail : tvApi.detail,
        });
        // queryFn의 No overload matchs this call은 정말 골치다..
    
    const shareMedia = async () => {
      const isAndroid = Platform.OS === "android";
     
      const homepage = isMovie ?
        `https://www.imdb.com/title/${data.imdb_id}/`
        : data.homepage;
      
      if(isAndroid) {
        await Share.share({
          message:`${params.overview}\nCheck it out: ${homepage}`,
          title:"original_title" in params
          ? params.original_title
          : params.original_name,
        });
      } else {
        await Share.share({
          url: homepage,
          title:"original_title" in params
          ? params.original_title
          : params.original_name,
        });
      };
    };
    

    const ShareButton = () => (
      <TouchableOpacity onPress={shareMedia}>
        <Ionicons name="share-outline" color="white" size={24} />
      </TouchableOpacity>
    )
    useEffect(() => {
      setOptions({
        title: "original_title" in params ? "Movie" : "TV Show",
      });
    }, []);
    useEffect(() => {
      if (data) {
        setOptions({
          headerRight: () => <ShareButton />,
        });
      }
    }, [data]);
   /*  useEffect(() => {
        setOptions({
            title:
        "original_title" in params
          ? "Movie"
          : "TV Show",
          headerRight: () => <ShareButton />
        });
    }, []); 
    위와 같이 headerRight을 통해 Share버튼을 생성하는 코드를 짰지만,
    만들어진 버튼 안에서는 data = undefined가 발생한다.
    이해한 바로는 useQuery를 통해 data를 가져오는 fetching작업은 promise형태인데
    그렇지 않은 headerRight을 통한 ShareButton 생성은 detail 컴포넌트로 넘어오면
    즉시 이루어진다.
    먼저 만들어진 버튼 안에서는 그 후 fetching을 통해 가져온 data를 인식하지 못하는 것(?).
    그래서 useEffect를 분리해서 dependency를 data로 설정해 data를 가져오면
    ShareButton을 생성해 data를 인식할 수 있게끔 한다.
    */

    const openYTLink = async (videoID: string) => {
      const baseUrl = `https://m.youtube.com/watch?v=${videoID}`;
      // await Linking.openURL(baseUrl);
      await WebBrowser.openBrowserAsync(baseUrl);
    };
    //Linking을 사용하면 앱으로 나가지만 WebBrowser를 사용하면 이 앱 안에서
    //url을 열기 때문에 앱을 벗어나지 않게 한다.

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
        <Data>
        <Overview>{params.overview}</Overview>
        {isLoading ? <Loader /> : null}
        {data?.videos?.results?.map((video) => (
          <VideoBtn key={video.key} onPress={() => openYTLink(video.key)}>
            <Ionicons name="logo-youtube" color="white" size={24} />
            <BtnText>{video.name}</BtnText>
          </VideoBtn>
        ))}
      </Data>
    </Container>
    )}//video의 출처를 YouTube로 제한한 상태.
//다른 출처의 video만 있다면 아무것도 뜨지 않는다.

export default Detail;