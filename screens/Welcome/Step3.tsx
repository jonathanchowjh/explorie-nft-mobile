import * as React from "react";
import { RootTabScreenProps } from "../../types";
import StepTemplate from "./StepTemplate";
import explorerImage from "../../assets/images/generic-2.png";

export default function ThirdStepScreen({
  navigation,
}: RootTabScreenProps<"Step3">) {
  return (
    <StepTemplate
      navigation={navigation}
      navigationTarget="Login"
      title="Spend, collect and trade NFTs"
      subtitle="Enjoy the freedom to do what you want with the NFTs"
      image={explorerImage}
    />
  );
}
