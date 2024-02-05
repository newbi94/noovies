import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {View, Text, TouchableOpacity } from 'react-native';
import { YELLOW_COLOR } from "../colors";



const ScreenOne = ({navigation:{ navigate }}) => (
    
    <TouchableOpacity onPress={() => navigate("Two")}>
        <Text>to Two</Text>
    </TouchableOpacity>
    
);// !! 중괄호가 아닌 소괄호로 감싸면 return을 생략할 수 있다.

const ScreenTwo = ({navigation:{ navigate }}) => {
    return (
    <TouchableOpacity onPress={() => navigate("Three")}>
        <Text>to Three</Text>
    </TouchableOpacity>
    )
};// !! 중괄호로 감쌌기 때문에 return을 넣어줘야 한다.

const ScreenThree = ({navigation:{ navigate }}) => (
    <TouchableOpacity onPress={() => navigate("Tabs", {screen:"Search"})}>
        <Text>go to Search on Tabs</Text>
    </TouchableOpacity>
);
//최초 Tabs에서 시작한 앱이 Movie탭에서 글자를 클릭하면 Tabs를 나와 Root에서
//Stack으로 들어가고 거기에서 "Three"로 오게된다.
//마찬가지로 Root으로 나와 Tabs로 들어간 후 Search 스크린으로 가는 navigate이다.
const NativeStack = createNativeStackNavigator();

const Stack = () => (

    <NativeStack.Navigator
    screenOptions={{
        presentation: "card",
        animation: "fade_from_bottom",
        headerTintColor: YELLOW_COLOR,
        headerBackTitleVisible: false,
      }}
      >
        <NativeStack.Screen name="One" component={ScreenOne} />
        <NativeStack.Screen name="Two" component={ScreenTwo} />
        <NativeStack.Screen name="Three" component={ScreenThree} />
    </NativeStack.Navigator>
)

export default Stack;