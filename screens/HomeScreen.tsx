import * as React from "react";
import { StyleSheet } from "react-native";
import { View, ScrollView } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import {
  Header,
  Footer,
  BannerGradient,
  Spacer,
  ProgressBar,
  SimpleList
} from "../components/Elements";
import { AppContext } from "../context/AppContext"

export default function HomeScreen({ navigation }: RootTabScreenProps<"Home">) {
  const { context } = React.useContext(AppContext);
  const [home, onChangeHome] = React.useState([
    {
      title: "Popular NFTs",
      nfts: [],
      filter: () => true
    },
    {
      title: "Vouchers Near Me",
      nfts: [],
      filter: (ele) => ele.type == "voucher"
    },
    {
      title: "Collectables Near Me",
      nfts: [],
      filter: (ele) => ele.type == "collectable"
    }
  ]);

  React.useEffect(() => {
    if (!context || !context.nfts) return
    onChangeHome(home.map((ele) => {
      return {
        ...ele,
        nfts: context.nfts.filter(ele.filter)
      }
    }))
  }, [context])
  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} />
      <ScrollView style={styles.container}>
        <BannerGradient
          title="Sam Riley"
          subtitle="Apprentice"
          colorOne="rgba(0,0,0,0)"
          colorTwo="rgba(0,0,0,0)"
          profile="https://i.ibb.co/7b4DSq0/ExpImage.png"
          cssTitle={{ color: "black" }}
          cssSubtitle={{ color: "orange" }}
          imageBool={false}
        />
        <Spacer />
        <View style={{ flex: 1, flexDirection: "row" }}>
          <ProgressBar
            icon="bicycle"
            iconColor="rgb(0,80,0)"
            text="30 km travelled"
            progressColor="rgb(0,80,0)"
            progressWidth={150}
          />
          <Spacer css={{ flex: 0.1 }} />
          <ProgressBar
            icon="cubes"
            iconColor="rgb(0,80,0)"
            text="20 NFTs collected"
            progressColor="rgb(0,80,0)"
            progressWidth={150}
          />
        </View>
        <Spacer />
        <ProgressBar
          icon="check"
          iconColor="#e39c19"
          text="Daily Tasks"
          progressColor="#e39c19"
          progressWidth={200}
        />
        <Spacer />
        {
          home ? home.map((ele, num) => {
            return (
              <SimpleList
                key={num}
                navigation={navigation}

                title={ele.title}
                list={ele.nfts.slice(0,2)}
                listFunc={(data) => navigation.navigate("ExploryMap", data)}
                error="Search Here..."
                
                button="View More"
                buttonFunc={() => navigation.navigate("Search", {
                  title: ele.title,
                  data: ele.nfts
                })}
              />
            )
          }) : <View />
        }
      </ScrollView>
      <Footer navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "scroll",
    padding: 15,
    paddingTop: 5,
  },
});
