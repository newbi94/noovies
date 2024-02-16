import React from "react";
import styled from "styled-components/native";
import Poster from "./Poster";
import Votes from "./Votes";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Movie } from "../api";

const Title = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
  margin-top: 7px;
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
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: 500;
  opacity: 0.6;
`;

interface HMediaProps {
    posterPath: string;
    originalTitle: string;
    overview: string;
    releaseDate?: string;
    voteAverage?: number;
    fullData: Movie;
}
/* ?를 붙여 선택적으로 props를 받지만, 아래에 해당 코드처럼 
?를 통해 받을 때와 받지 않을 때를 설정하지 않으면 앱 가동에는 큰 문제가
없지만 에러가 뜬다. 
{new Date(releaseDate).toLocaleDateString("ko", {
    month: "long",
    day: "numeric",
    year: "numeric",
    })} */

const HMedia:React.FC<HMediaProps> = ({
    posterPath,
    originalTitle,
    releaseDate,
    overview,
    voteAverage,
    fullData,
    }) => {
      const navigation = useNavigation();
      const goToDetail = () => {
        //@ts-ignore
        navigation.navigate("Stack", { 
          screen: "Detail", 
          params:{
            ...fullData,
          }
        });
      }
        return(
        <TouchableOpacity onPress={goToDetail}>  
          <HMovie>
              <Poster path={posterPath} />
              <HColumn>
                  <Title>
                      {originalTitle.length > 30
                          ? `${originalTitle.slice(0, 30)}...`
                          : originalTitle}
                  </Title>
                  {releaseDate ? (
                      <Release>
                          {new Date(releaseDate).toLocaleDateString("ko", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          })}
                      </Release>
                  ) : null}
                      {voteAverage ? <Votes votes={voteAverage} /> : null}
                  <Overview>
                      {overview !== "" && overview.length > 140
                      ? `${overview.slice(0, 140)}...`
                      : overview}
                  </Overview>
              </HColumn>
          </HMovie>
        </TouchableOpacity>
        )
}

export default HMedia;