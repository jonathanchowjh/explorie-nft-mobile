/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
  Step1: undefined;
  Step2: undefined;
  Step3: undefined;
  Home: undefined;
  Login: undefined;
  Wallet: undefined;
  ExploryMap: undefined;
  Search: undefined;
};

export type Nft = {                      // Asset name -> unique id? 
  asset_name: string
  name: string,                   // human readable name
  image?: string | Array<any>,    // bitmap? how many types supported?
  mediaType?: string,
  description?: string,
  geoLocation?: string,
  files?: Array<{                  // What type of files supported for MVP
    name: string,
    mediaType: string,
    src: string | Array<any>
  }>,
  company?: string,                // SUGGESTED
  collection?: string,             // SUGGESTED
  type?: string,                   // SUGGESTED voucher / collectable
  rarity?: string | null           // SUGGESTED for collectables
  subtitle: string
}

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
  >;
