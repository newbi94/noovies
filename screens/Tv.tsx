import React, { useState } from "react";
import styled from "styled-components/native";
import { tvApi } from "../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../components/Loader";
import { RefreshControl, ScrollView } from "react-native";
import HList from "../components/HList";


const Tv = () => {

const queryClient = useQueryClient();

const [refreshing,setRefreshing] = useState(false);

    const { 
        isLoading: todayLoading, 
        data: todayData,   
      } = useQuery({
        queryKey: ['tv','today'],
        queryFn: tvApi.airingToday,
    });

    const { 
        isLoading: topLoading, 
        data: topData,   
      } = useQuery({
        queryKey: ['tv','top'],
        queryFn: tvApi.topRated,
    });

    const { 
        isLoading: trendingLoading, 
        data: trendingData,   
      } = useQuery({
        queryKey: ['tv','trending'],
        queryFn: tvApi.trending,
    });
      
    const onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries({queryKey: ["tv"] });
        setRefreshing(false);
    };

    const loading = todayLoading || topLoading || trendingLoading;

    return ( loading ? (
        <Loader />
        ) : 
        <ScrollView 
        refreshControl={
            <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
            />
        }
      contentContainerStyle={{ paddingVertical: 30 }}
    >
            {trendingData ? (
        <HList title="Trending TV" data={trendingData.results} />
      ) : null}
      {todayData ? (
        <HList title="Airing Today" data={todayData.results} />
      ) : null}
      {topData ? <HList title="Top Rated TV" data={topData.results} /> : null}
        </ScrollView>
    );
};

export default Tv;