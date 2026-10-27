import React from "react";
import { profile } from "../data/seed";
import { Screen } from "../components/Screen";
import { Banner, EmptyText } from "../components/ui";

export default function MarketplaceScreen() {
  return (
    <Screen>
      <Banner
        title="Marketplace"
        subtitle="Buy and Sell your collectables"
        gradient={["rgba(0,200,0,0.8)", "rgba(0,0,0,0.4)"]}
        titleColor="black"
        profile={profile.picture}
      />
      <EmptyText>Under Development</EmptyText>
    </Screen>
  );
}
