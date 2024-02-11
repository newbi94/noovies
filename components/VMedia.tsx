import React from "react";
import styled from "styled-components/native";
import Poster from "./Poster";
import Votes from "./Votes";

const Movie = styled.View`
  align-items: center;
`;
/* VMedia는 말 그대로 앱상에서 보이는 두번째 스크롤 안에 있는 각 포스터와
별점, 제목을 합친 프레임(?)이다. 다른 컴포넌트에서 VMedia를 가져가 쓸 경우,
margin-right은 선택적으로 필요할 것이다. 이는 기존에 사용하던 스크롤뷰에서
margin속성을 부여할 수 없기 때문에 추가해줬던 항목이기 때문이다.
하지만 FlatList를 사용하면서 스크롤뷰 속성으로 margin을 부여할 수 있게 됨으로
Movie태그의 margin-right을 삭제했다. */
const Title = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
  margin-top: 7px;
  margin-bottom: 5px;
`;

interface VMediaProps {
    posterPath: string;
    originalTitle: string;
    voteAverage: number;
}
const VMedia:React.FC<VMediaProps> = ({
    posterPath,
    originalTitle,
    voteAverage,
    }) => {
    return (
        <Movie>
            <Poster path={posterPath} />
            <Title>
              {originalTitle.slice(0, 12)}
              {originalTitle.length > 12 ? "..." : null}
            </Title>
            <Votes votes={voteAverage}/>
        </Movie>
          )
        }
    export default VMedia;