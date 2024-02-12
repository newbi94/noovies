import React, { useCallback, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Image, useColorScheme } from 'react-native';
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import Root from "./navigation/Root";
import { ThemeProvider } from "styled-components/native";
import { darkTheme, lightTheme } from "./styled";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

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
    
    const isDark = useColorScheme() === "dark";
       
      useEffect(() => {
        async function prepare() {
          try {
            const fonts = loadFonts([Ionicons.font]);
            const images = loadImages([require("./1.png")])
            await Promise.all([...fonts, ...images]);
          } catch (error) {
            console.warn(error);
          } finally {
            setReady(true);
            console.log("setReady")
          }
        }
          prepare();
      }, []);
      
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
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={isDark ? darkTheme : lightTheme}>   
            <NavigationContainer onReady={onLayoutRootView}>
              <Root />
            </NavigationContainer>
          </ThemeProvider>
        </QueryClientProvider>
      );
    }
    