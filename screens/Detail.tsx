import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";
import { Movie, TV } from "../api";
import Poster from "../components/Poster";

const Container = styled.ScrollView`
    background-color: ${(props) => props.theme.mainBgColor};
`;

type RootStackParamList = {
    Detail: Movie | TV;
};
//Root Navigator가 갖고 있는 Screen들의 type을 만들어야 한다.
//{ } 안에 Detail스크린의 Route가 가질 모든 파라미터를 넣을 것.

type DetailScreenProps = 
        NativeStackScreenProps<RootStackParamList, "Detail">
//DetailScreenProps는 Tabs가 아니라 NativeStack소속이므로 NativeStackScreenProps,
//그리고 위에서 만들어 준
const Detail: React.FC<DetailScreenProps> = ({
    navigation: { setOptions }, //navigation안에 기본으로 존재하는 setOptions를 꺼내서 useEffect내에서 사용한다.
    route: { params },
    }) => {
    useEffect(() => {
        setOptions({
            title:
        "original_title" in params
          ? params.original_title
          : params.original_name,
        });
    }, []);
    
    return (
    <Container>
        <Poster path={params.poster_path || ""} />
    </Container>
    )
    
}

export default Detail;