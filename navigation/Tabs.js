import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Movies from "../screens/Movies";
import Tv from "../screens/Tv";
import Search from "../screens/Search";
import { useColorScheme } from "react-native";
import { BLACK_COLOR, DARK_GREY, LIGHT_GREY, YELLOW_COLOR } from "../colors";
import { Ionicons } from "@expo/vector-icons";
import Stack from "./Stack";

const Tab = createBottomTabNavigator();

const Tabs = () => {
    const isDark = useColorScheme() === "dark";
    console.log(isDark);
   
   return (
<Tab.Navigator 
    sceneContainerStyle={{
        backgroundColor: isDark ? BLACK_COLOR : "white",
    }}//sceneContainerStyle을 통해 배경색을 정해주면 스크린 안에
    //무언가를 추가할 때마다 배경색을 넣어주지 않아도 된다. !!!
    screenOptions={{
        tabBarStyle: {
            backgroundColor: isDark ? BLACK_COLOR : "white",
          },
          tabBarActiveTintColor: isDark ? YELLOW_COLOR : BLACK_COLOR,
          tabBarInactiveTintColor: isDark ? DARK_GREY : LIGHT_GREY,
          headerStyle: {
            backgroundColor: isDark ? BLACK_COLOR : "white",
          },
          headerTitleStyle: {
            color: isDark ? "white" : BLACK_COLOR,
          },
          tabBarLabelStyle: {
            marginTop: -5,
            fontSize: 10,
            fontWeight: "600",
          },
        }}//Tab.Navigator에 screenOptions로 커스텀하면 모든 Tab에 설정을 보내게 된다.
      >
    <Tab.Screen 
        name="Movies" 
        component={Movies}
        options={{
            tabBarIcon: ({color, size }) => (
                <Ionicons name={"film-outline"} color={color} size={size}/>
            )
        }}//Tab.Screen에 options로 커스텀하면 각각의 Tab에 설정을 만들 수 있다.
        />
    <Tab.Screen 
        name="Tv" 
        component={Tv}
        options={{
            tabBarIcon: ({color, size }) => (
                <Ionicons name={"tv-outline"} color={color} size={size}/>
            )
        }}
        />
    <Tab.Screen 
        name="Search" 
        component={Search}
        options={{
            tabBarIcon: ({color, size }) => (
                <Ionicons name={"search-outline"} color={color} size={size}/>
            )
        }}
        />
</Tab.Navigator>
)
}

export default Tabs;