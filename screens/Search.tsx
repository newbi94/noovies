import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { moviesApi, tvApi } from '../api';
import Loader from '../components/Loader';
import HList from '../components/HList';

const Container = styled.ScrollView`
`;

const SearchBar = styled.TextInput`
  background-color: white;
  padding: 10px 15px;
  border-radius: 15px;
  width: 90%;
  margin: 10px auto;
`;

const Search = () => {
  const [query, setQuery] = useState("");
  const { 
    isLoading: moviesLoading,
    data: moviesData,
    refetch: searchMovies, 
  } = useQuery({
    queryKey: ['searchMovies', query],
    queryFn: moviesApi.search,
    enabled: false,
  });
  //입력값에 state를 줘서 api에 입력값을 전달한다.
  //enabled: false는 Search컴포넌트를 렌더링할 때, 자동으로 실행되는 것을 막는다.
  //onsubmit안에 refetch함수를 넣어줘서 submit시에만 작동한다.
  const { 
    isLoading: tvLoading,
    data: tvData,
    refetch: searchTv, 
} = useQuery({
  queryKey: ['searchTv', query],
  queryFn: tvApi.search,
  enabled: false,
});

  const onChangeText = (text: string) => setQuery(text);
  const onSubmit = () => {
    if (query === "") {
      return;
    }
    searchMovies();
    searchTv();
  };
  return (
    <Container>
        <SearchBar 
          placeholder='Search for...'
          placeholderTextColor="grey"
          returnKeyLabel='search'
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
        />
         {moviesLoading || tvLoading ? (
      <Loader />
    ) : (
      (moviesData && moviesData.results.length > 0) && (
        <HList title="Movie Results" data={moviesData.results} />
      )
    )}
    {tvData && tvData.results.length > 0 && (
      <HList title="TV Results" data={tvData.results} />
    )}
      </Container>
      );
  };
  /*{moviesLoading || tvLoading ? <Loader /> : null}
  {moviesData ? (
    <HList title="Movie Results" data={moviesData.results} />
  ) : null}
  {tvData ? <HList title="TV Results" data={tvData.results} /> : null}*/
  
  export default Search;
