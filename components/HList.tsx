import React from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import VMedia from "./VMedia";
import { Movie, TV } from "../api";

const ListTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 18px;
  font-weight: 600;
  margin-left: 30px;
`;

const ListContainer = styled.View`
  margin-bottom: 40px;
`;

export const HListSeperator = styled.View`
  width: 20px;
`;

interface HListProps {
    title: string;
    data: Movie[] | TV[];
  }
  
  const HList: React.FC<HListProps> = ({ title, data, hasNext, fetchNext }) => {
    
    const loadMore = () => {
      if(hasNext){
        fetchNext();
        console.log("HList", hasNext);
      }
      console.log("HList", hasNext);
    }

    return (
    <ListContainer>
        <ListTitle>{title}</ListTitle>
        <FlatList
                onEndReached={loadMore}
                data={data}
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={HListSeperator}
                contentContainerStyle={{ paddingHorizontal: 30 }}
                keyExtractor={(item: Movie | TV) => item.id + ""}
                renderItem={({ item }: { item: Movie | TV }) => (
                    <VMedia
                        posterPath={item.poster_path || ""}
                        originalTitle={
                          "original_title" in item ? item.original_title 
                          : item.original_name
                        }
                        voteAverage={item.vote_average}
                        fullData={item}
                    />
                )}
        />
        </ListContainer>
    );      
};


            export default HList;