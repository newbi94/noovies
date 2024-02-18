import React, { useState } from "react";
import styled from "styled-components/native";
import { TVResponse, tvApi } from "../api";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../components/Loader";
import { RefreshControl, ScrollView } from "react-native";
import HList from "../components/HList";



const Tv = () => {

const queryClient = useQueryClient();

const [refreshing,setRefreshing] = useState(false);

    const { 
        isLoading: todayLoading, 
        data: todayData,
        hasNextPage:todayHasNext,
        fetchNextPage:todayFetchNext,   
      } = useInfiniteQuery<TVResponse>({
        queryKey: ['tv','today'],
        queryFn: tvApi.airingToday,
        getNextPageParam: (currentPage) => {
          const nextPage = currentPage.page +1;
          return nextPage > currentPage.total_pages ? null : nextPage;
        },
    });

    const { 
        isLoading: topLoading, 
        data: topData, 
        hasNextPage:topHasNext,
        fetchNextPage:topFetchNext,
      } = useInfiniteQuery<TVResponse>({
        queryKey: ['tv','top'],
        queryFn: tvApi.topRated,
        getNextPageParam: (currentPage) => {
          const nextPage = currentPage.page +1;
          return nextPage > currentPage.total_pages ? null : nextPage;
        },
    });

    const { 
        isLoading: trendingLoading, 
        data: trendingData, 
        hasNextPage:trendingHasNext,
        fetchNextPage:trendingFetchNext,  
      } = useInfiniteQuery<TVResponse>({
        queryKey: ['tv','trending'],
        queryFn: tvApi.trending,
        getNextPageParam: (currentPage) => {
          const nextPage = currentPage.page +1;
          return nextPage > currentPage.total_pages ? null : nextPage;
        },
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
        <HList 
        title="Trending TV" 
        data={trendingData.pages.map((page) => page.results).flat()}
        hasNext={trendingHasNext}
        fetchNext={trendingFetchNext}
        />
      ) : null}
      {todayData ? (
        <HList 
        title="Airing Today" 
        data={todayData.pages.map((page) => page.results).flat()} 
        hasNext={todayHasNext}
        fetchNext={todayFetchNext}
        />
      ) : null}
      {topData ? <HList 
      title="Top Rated TV" 
      data={topData.pages.map((page) => page.results).flat()} 
      hasNext={topHasNext}
      fetchNext={topFetchNext}
      /> : null}
        </ScrollView>
    );
};

export default Tv;