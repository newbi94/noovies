import React, { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View, Image } from 'react-native';
import * as Font from "expo-font";
import { AntDesign } from "@expo/vector-icons";
import { Asset, useAssets, } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./navigation/Tabs";

SplashScreen.preventAutoHideAsync();


export default function App () {
  const [ready, setReady] = useState(false);

  const loadFonts = (fonts) => fonts.map((font) => Font.loadAsync(font));
  const loadImages = (images) =>
    images.map((image) => {
      if (typeof image === "string") {
        return Image.prefetch(image);
      } else {
        return Asset.loadAsync(image);
      }
    });
    //Error: java.security.cert.CertPathValidatorException: Trust anchor for certification path not found
    //외부 url로부터 파일을 받아올 때 인증서에 관한 에러다.
    //image 부분에서 뒤에 있는 url로부터 파일을 받아오는 부분을 그냥 삭제해서 해결했다.

       async function prepare() {
          try {
            const fonts = loadFonts([AntDesign.font]);
            const images = loadImages([require("./1.png")])
            await Promise.all([...fonts, ...images]);
          } catch (error) {
            console.warn(error);
          } finally {
            setReady(true);
            console.log("setReady")
          }
        }

       useEffect(() => {
        prepare();
      }, []);
      //useEffect내에 prepare 함수를 넣어놨었는데, 자꾸 문제가 발생해서 바깥으로 빼서 해결했다.
      //async를 useEffect 내부에서 붙여줄거면 함수로 묶어서 붙여주래서 그렇게 했는데도 잘 해결되지 않았었다.
      //useEffect에 대한 공부가 더 필요하다.
      
      const onLayoutRootView = useCallback(async () => {
        if (ready) {
          await SplashScreen.hideAsync();
          console.log("READY to hide")
        }
      }, [ready]);
    
      if (!ready) {
        return null;
      }
      return (
        
        <NavigationContainer onReady={onLayoutRootView}>
      <Tabs />
    </NavigationContainer>
    
      );
    }//onReady는 네비게이션 한정 prop인듯 하다.
    //기존 onLayout을 유지하면 아무런 에러도 없이 splashscreen에서 영겁의 시간을 보내야한다.

    