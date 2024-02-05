import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from "./Tabs";
import Stack from "./Stack";

const Nav = createNativeStackNavigator();

const Root = () => (
    <Nav.Navigator
    screenOptions={{
        presentation: "modal",
        headerShown: false,
        }}>
        <Nav.Screen name="Tabs" component={Tabs}/>
        <Nav.Screen name="Stack" component={Stack}/>
    </Nav.Navigator>
)
//새로운 네비게이터를 만들어서 기존의 Stack과 Tabs 네비게이터를 같이 담았다.
//이것을 App.js에서 렌더링 하여 두가지를 같이 사용할 수 있게된다.
//기반은 NativeStackNavigator이다. Stack과 Tabs 중 Stack의 props.

export default Root;