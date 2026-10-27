import * as React from "react";
import { StyleSheet } from "react-native";
import { View, ScrollView } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import {
  Header,
  Footer,
  IconInput,
  Spacer,
  ButtonSmall,
  SimpleList
} from "../components/Elements";
import { AppContext } from "../context/AppContext"

export default function SearchScreen({ route, navigation }: RootTabScreenProps<"Search">) {
  const [search, onChangeSearch] = React.useState("");
  const [header, onChangeHeader] = React.useState("");
  const [list, onChangeList] = React.useState([]);
  const { context } = React.useContext(AppContext);

  React.useEffect(() => {
    if (!route || !route.params) {
      return
    }
    if (route.params.data) {
      onChangeList(route.params.data)
    }
    if (route.params.title) {
      onChangeHeader(route.params.title)
    }
  }, [])
  
  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} />
      <View style={{ flexDirection: "row" }}>
        <Spacer css={{ flex: 0.05 }} />
        <ButtonSmall
          title=""
          icon="chevron-left"
          css={{ backgroundColor: "#CCCCCC", height: 40, flex: 0.2 }}
          onClick={() => navigation.goBack()}
        />
        <Spacer css={{ flex: 0.05 }} />
        <IconInput
          value={search}
          onChangeValue={(e) => {
            onChangeSearch(e)
            if (e.length == 0) {
              onChangeList([])
              onChangeHeader("")
            } else {
              onChangeHeader(`Search: ${e}`)
              onChangeList(context.nfts.filter((ele) => ele.title.toLowerCase().includes(e.toLowerCase())
                || ele.subtitle.toLowerCase().includes(e.toLowerCase())))
            }
          }}
          iconL="search"
          placeholder="Search"
        />
        <Spacer css={{ flex: 0.05 }} />
      </View>
      <Spacer />
      <ScrollView style={styles.container}>
        <SimpleList
          title={header}
          list={list}
          listFunc={(data) => navigation.navigate("ExploryMap", data)}
          error="Search Here..."
          navigation={navigation}
        />
        <Spacer />
      </ScrollView>
      <Footer navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    overflow: "hidden",
    padding: 15,
    paddingTop: 5,
  },
});
