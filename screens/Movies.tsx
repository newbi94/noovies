import React from "react";
import { Dimensions } from "react-native";
import styled from "styled-components/native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Swiper from 'react-native-web-swiper';



const Container = styled.ScrollView`
  background-color: ${(props) => props.theme.mainBgColor};
`;

const View = styled.View`
  flex:1;
`;

const { height : SCREEN_HEIGHT } = Dimensions.get("window");
//위와 같은 코드 위가 선호되는 이유는 뒤에 , 를 찍고 다른 항목도 추가할 수 있기 때문.
//const SCREEN_HEIGHT = Dimensions.get("window").height;

const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = () => (
  <Container>
    <Swiper 
    loop 
    timeout={4}
    controlsEnabled={false}
    containerStyle={{width: "100%", height: SCREEN_HEIGHT / 4}}>
      <View style={{backgroundColor:"red"}}></View>
      <View style={{backgroundColor:"blue"}}></View>
      <View style={{backgroundColor:"red"}}></View>
      <View style={{backgroundColor:"blue"}}></View>
    </Swiper>
  </Container>
);

export default Movies;