import React from "react";
import styled from "styled-components/native";
import Poster from "./Poster";
import Votes from "./Votes";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Movie, TV, } from "../api";

const Container = styled.View`
  align-items: center;
`;

const Title = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
  margin-top: 7px;
  margin-bottom: 5px;
`;

interface VMediaProps {
    posterPath: string;
    originalTitle: string;
    voteAverage: number;
    fullData: Movie | TV;
}
const VMedia:React.FC<VMediaProps> = ({
    posterPath,
    originalTitle,
    voteAverage,
    fullData,
    }) => {
      const navigation = useNavigation();
      const goToDetail = () => {
        
        navigation.navigate("Stack", { 
          screen: "Detail", 
          params:{
            ...fullData,
          }
        });
      }
      //navigate(a, {b})에서 위와 같이 b에 파라미터를 실어보낼수있다.

    return (
      <TouchableOpacity onPress={goToDetail}>
        <Container>
            <Poster path={posterPath} />
            <Title>
              {originalTitle.slice(0, 12)}
              {originalTitle.length > 12 ? "..." : null}
            </Title>
            <Votes votes={voteAverage}/>
        </Container>
      </TouchableOpacity>
          )
        }
    export default VMedia;