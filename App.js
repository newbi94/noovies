import React, { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View, Image } from 'react-native';
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { Asset, useAssets, } from "expo-asset";
SplashScreen.preventAutoHideAsync();


export default function App () {
  const [ready, setReady] = useState(false);

  /* const [assets] = useAssets([require("./1.jpg")])
  const [loaded] = Font.useFonts(Ionicons.font) */
  //아래 장황한 코드들을 단 두줄로 줄일 수 있는 Hook이다.
  //useAssets과 useFonts를 쓰면 간단하게 preload할 수 있다.
 //단 Image.prefetch 처럼 외부에서 파일을 preload할 수는 없다.
  const loadFonts = (fonts) => fonts.map((font) => Font.loadAsync(font));
  
  const loadImages = (images) =>
    images.map((image) => {
      if (typeof image === "string") {
        return Image.prefetch(image);
      } else {
        return Asset.loadAsync(image);
      }
    });//외부 서버로부터 파일을 preload할 때는 Image.prefetch를,
       //noovies폴더 내부에 있는 파일을 preload할 때는 Asset.loadAsync를 한다.
  
  useEffect( async () => {
    async function prepare() {
      try {
        const fonts = loadFonts([Ionicons.font]);
        const images = loadImages([require("./1.jpg"),"https://www.dong-wha.co.kr/product/pimage/324_img21.jpg"])
        await Promise.all([...fonts, ...images]);
        //fonts와 images의 promise들에 await을 붙여주는 Promise.all
      } catch (error) {
        console.warn(error);
      } finally {
        setReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (ready) await SplashScreen.hideAsync();
  }, [ready]); //Hide the native splash screen immediately, ready가 true가 되면
              //splash screen을 숨긴다.
              //useCallback -> 함수는 랜더링될 때 늘 새로운 참조값을 갖지만
              //위 함수를 사용하면 값이 실제로 바뀔 때만 새로운 참조값이 된다.
  if (!ready) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView}>
      <Text>We are done Loading !</Text>
    </View>
  );
}
