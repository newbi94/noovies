import React from "react";
import { TouchableOpacity, Text } from "react-native";

const Movies = ({navigation:{ navigate }}) => (
  <TouchableOpacity 
    onPress={() => navigate("Stack", {screen:"Three"})}
    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Movies</Text>
  </TouchableOpacity>
);
//최초 앱 구동시 Tabs화면에서 시작하고 Movie탭에서 글자를 클릭하면 
//Root으로 나와 Stack으로 들어간 뒤, "Three" 컴포넌트로 이동하는 navigate이다.
export default Movies;
