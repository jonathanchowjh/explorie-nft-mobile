import React from "react";
import { StyleSheet, View } from "react-native";
import type { ScreenProps } from "../navigation";
import { findNft, searchNfts } from "../state/NftStore";
import { Screen } from "../components/Screen";
import { Button, SearchInput } from "../components/ui";
import { NftList } from "../components/nft";

export default function SearchScreen({ navigation, route }: ScreenProps<"Search">) {
  // null until the user types: until then show the list this screen was opened with.
  const [query, setQuery] = React.useState<string | null>(null);

  let title = route.params?.title ?? "";
  let items = route.params?.ids.map(findNft) ?? [];
  if (query !== null) {
    title = query ? `Search: ${query}` : "";
    items = query ? searchNfts(query) : [];
  }

  return (
    <Screen>
      <View style={styles.toolbar}>
        <Button icon="chevron-left" label="Back" onPress={() => navigation.goBack()} style={styles.back} />
        <SearchInput value={query ?? ""} onChangeText={setQuery} />
      </View>
      <NftList
        title={title}
        items={items}
        empty="Search Here..."
        onPress={(nft) => navigation.navigate("Map", { id: nft.id })}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  toolbar: { flexDirection: "row", gap: 10 },
  back: { height: 40, width: 50, backgroundColor: "#CCCCCC" },
});
