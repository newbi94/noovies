import React, { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View } from 'react-native';

SplashScreen.preventAutoHideAsync();


export default function App () {
  const [ready, setReady] = useState(false);
  
  
  useEffect( async () => {
    async function prepare() {
      try {
        await new Promise((resolve)=> setTimeout(resolve, 8000))
        // pre-load fonts, call APIs, etc
        // 강의의 startLoading과 동일하게 동작
      } catch (error) {
        // 강의의 onError와 동일하게 동작
        console.warn(error);
      } finally {
        // 강의의 onFinish와 동일하게 동작
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
