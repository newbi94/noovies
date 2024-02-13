import React from "react";
import styled from "styled-components/native";
import { tvApi } from "../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../components/Loader";
import { RefreshControl, ScrollView } from "react-native";
import HList from "../components/HList";


const Tv = () => {

const queryClient = useQueryClient();

    const { 
        isLoading: todayLoading, 
        data: todayData,  
        isRefetching: isRefetchingToday, 
      } = useQuery({
        queryKey: ['tv','today'],
        queryFn: tvApi.airingToday,
    });

    const { 
        isLoading: topLoading, 
        data: topData,  
        isRefetching: isRefetchingTop, 
      } = useQuery({
        queryKey: ['tv','top'],
        queryFn: tvApi.topRated,
    });

    const { 
        isLoading: trendingLoading, 
        data: trendingData,  
        isRefetching: isRefetchingTrending, 
      } = useQuery({
        queryKey: ['tv','trending'],
        queryFn: tvApi.trending,
    });
      
    const onRefresh = async () => {
        queryClient.refetchQueries({queryKey: ["tv"] })
    }

    const loading = todayLoading || topLoading || trendingLoading;
    const refreshing = isRefetchingToday || isRefetchingTop || isRefetchingTrending;

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
            <HList title="Trending Tv" data={trendingData.results}/>
            <HList title="Today Tv" data={todayData.results}/>
            <HList title="Top Tv" data={topData.results}/>
        </ScrollView>
    );
};

export default Tv;