import React from "react";
import oni from "../assets/images/oni.png";
import kong from "../assets/images/pixilart.png";
import defaultNft from "../assets/images/default.png";

export interface AppState {
  nfts: [];
  myNfts: [];
}

type AppProviderProps = { children: React.ReactNode };

export const AppContext = React.createContext<{ state: AppState } | undefined>(
  undefined
);

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error(`useAppContext must be used withn a AppProvider`);
  }

  return context;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <AppContext.Provider value={{ state: initialState }}>
      {children}
    </AppContext.Provider>
  );
};

const LATITUDE = 40.7496569;
const LONGITUDE = -73.9930029;
const SPACE = 0.01;

const initialState = {
  myNfts: [
    {
      title: "Etherials meetup @ NFT.NYC",
      subtitle: "sub",
      asset_name: "11",
      type: "collectable",
      location: "Times square",
      locationImage:
        "https://lh5.googleusercontent.com/p/AF1QipNtmaLbgLaTzv0ubPOdDKqsC3fmFFDwRbckH-oZ=w300-h225-p-k-no",
      locationDescription:
        "The community of Etherials is coming to NFT.NYC. Participate, come and collect this limited editon NFT!",
      distance: "0.2 Km",
      rating: "5 Rating",
      coordinates: {
        latitude: 40.7413747,
        longitude: -73.9817613,
      },
      image: defaultNft,
      success: true,
    },
  ],
  nfts: [
    {
      title: "0N1 Force #2819",
      subtitle: "sub",
      asset_name: "1",
      type: "collectable",
      coordinates: {
        latitude: LATITUDE + SPACE,
        longitude: LONGITUDE + SPACE,
      },
      distance: "2 Km",
      rating: "4,8 Rating",
      location: "Grafitti Zone @ Mauer Park",
      locationImage:
        "https://lh5.googleusercontent.com/p/AF1QipOa23rPK0ZG_8VcP8D5w0GO1xvrk6SZ4XNxC6Rr=w408-h306-k-no",
      locationDescription:
        "Mauerpark is a public linear park in Berlin's Prenzlauer Berg district. The name translates to 'Wall Park', referring to its status as a former part of the Berlin Wall and its Death Strip. The park is located at the border of Prenzlauer Berg and Gesundbrunnen district of former West Berlin.",
      centerOffset: {
        x: -18,
        y: -60,
      },
      anchor: {
        x: 0.84,
        y: 1,
      },
      image: oni,
      success: true,
    },
    {
      title: "Cyber kongz #0000",
      subtitle: "sub",
      asset_name: "2",
      type: "collectable",
      location: "betahaus @ Kreuzberg",
      locationImage:
        "https://lh5.googleusercontent.com/p/AF1QipMF7ZT-a5V0BIgu3ZvstuLKHj9ZFOlOvQt18Zge=w426-h240-k-no",
      locationDescription:
        "betahaus | Kreuzberg is our HQ space, and in some ways, our heart and soul. It's a coworking and event space that's been serving the city's startup and freelancer community since 2009. In 2018, we moved into a building at the edge of Kreuzberg with a long legacy of influential tenants. We've restored the space to include modern coworking areas, event spaces, team rooms, balconies, café, and rooftop terrace.",
      distance: "500 m",
      rating: "2,8 Rating",
      coordinates: {
        latitude: LATITUDE - SPACE,
        longitude: LONGITUDE - SPACE,
      },
      centerOffset: {
        x: -42,
        y: -60,
      },
      anchor: {
        x: 0.84,
        y: 1,
      },
      image: kong,
      success: false,
    },
    {
      title: "Ancient articat #12",
      subtitle: "sub",
      asset_name: "3",
      type: "collectable",
      location: "The Morgan Library & Museum",
      locationImage:
        "https://lh5.googleusercontent.com/p/AF1QipMtWDGW_YwJfUvS1miD2LnbPqNOUHxerqJtU3Lp=w408-h272-k-no",
      locationDescription:
        "A museum and independent research library located in the heart of New York City, the Morgan Library & Museum began as the personal library of financier, collector, and cultural benefactor Pierpont Morgan.",
      distance: "1.4 Km",
      rating: "4,1 Rating",
      coordinates: {
        latitude: 40.748758,
        longitude: -73.9813067,
      },
      centerOffset: {
        x: -42,
        y: -60,
      },
      anchor: {
        x: 0.84,
        y: 1,
      },
      image:
        "https://mkpcdn.com/videos/d5f5870a3e8967dc968cebb988967cea_591705.mp4",
      success: true,
    },
    {
      title: "Lost in Space",
      subtitle: "sub",
      asset_name: "4",
      type: "collectable",
      location: "The Museum of Modern Art",
      locationImage:
        "https://lh5.googleusercontent.com/p/AF1QipPZerpfQD7_S9doOlWUcW6ejoVSt6gyF-Uzr8p4=w408-h306-k-no",
      locationDescription:
        "The MoMA has one of the largest and most influential collections of modern art in the world. Home to famous works like Vincent Van Gogh's Starry Night, Salvador Dali's The Persistence of Memory, and works by Mondrian, Monet, and Picasso, this is a haven for art lovers.",
      distance: "1.4 Km",
      rating: "4,1 Rating",
      coordinates: {
        latitude: 40.7635653 + SPACE,
        longitude: -73.9777152,
      },
      centerOffset: {
        x: -42,
        y: -60,
      },
      anchor: {
        x: 0.84,
        y: 1,
      },
      image:
        "https://storage.googleapis.com/showtime-cdn/ipfs/originals/QmTVMo53mhkuLUfsivqQcgZLGaBAA3V7cdBMmfRx8WEHrb_1630274051.mp4",
      success: true,
    },
    {
      title: "Nets vs. Knicks game ticket (front seats)!",
      subtitle: "sub",
      asset_name: "5",
      type: "voucher",
      location: "Madison Square Garden",
      locationImage:
        "https://lh5.googleusercontent.com/p/AF1QipOWmvPrNApBboULzSOxmSEClShG687GpT42oZNh=w408-h514-k-no",
      locationDescription:
        "Worlds most famous arena, this icon hosts pro sports, concerts & other big events.",
      distance: "1.4 Km",
      rating: "5 Rating",
      coordinates: {
        latitude: 40.7547105,
        longitude: -73.9856321,
      },
      centerOffset: {
        x: -42,
        y: -60,
      },
      anchor: {
        x: 0.84,
        y: 1,
      },
      image: defaultNft,
      success: true,
    },
    {
      title: "Pop UP by Reggie Watts",
      subtitle: "sub",
      asset_name: "6",
      type: "voucher",
      location: "Central Park",
      locationImage:
        "https://lh5.googleusercontent.com/p/AF1QipNLLJzgpUeIGCzhIVdYiBd6FPEcgP5Z1UM7vwPt=w408-h285-k-no",
      locationDescription:
        "Performing this Saturday in Central Park. The person who scores this has a right to purchase my merchendise with 77% discount!",
      distance: "1.4 Km",
      rating: "5 Rating",
      coordinates: {
        latitude: 40.7747105,
        longitude: -73.9656321,
      },
      centerOffset: {
        x: -42,
        y: -60,
      },
      anchor: {
        x: 0.84,
        y: 1,
      },
      image: defaultNft,
      success: true,
    },
    {
      title: "Exclusive Chef's special",
      subtitle: "sub",
      asset_name: "7",
      type: "voucher",
      location: "La Grande Boucherie",
      locationImage:
        "https://lh5.googleusercontent.com/p/AF1QipPOnG7fY9Jd87Nu1Q62J0MX4LSmi_WGZdBVN9bo=w408-h271-k-no",
      locationDescription:
        "By collecting this NFT you secure an exclusive chance for a chefs special outside of the menu.",
      distance: "0.4 Km",
      rating: "5 Rating",
      coordinates: {
        latitude: 40.7647105,
        longitude: -73.9856321,
      },
      centerOffset: {
        x: -42,
        y: -60,
      },
      anchor: {
        x: 0.84,
        y: 1,
      },
      image: defaultNft,
      success: true,
    },
    {
      title: "Bored Apes meetup @ NFT.NYC",
      subtitle: "sub",
      asset_name: "8",
      type: "voucher",
      location: "Times square",
      locationImage:
        "https://lh5.googleusercontent.com/p/AF1QipNtmaLbgLaTzv0ubPOdDKqsC3fmFFDwRbckH-oZ=w300-h225-p-k-no",
      locationDescription:
        "The community of Bored Apes Yacht club is coming to NFT.NYC. Participate, come and collect this limited editon NFT!",
      distance: "0.2 Km",
      rating: "5 Rating",
      coordinates: {
        latitude: 40.7579747,
        longitude: -73.9877313,
      },
      image: defaultNft,
      success: true,
    },
    {
      title: "ON1 Force meetup @ NFT.NYC",
      subtitle: "sub",
      asset_name: "9",
      type: "voucher",
      location: "Times square",
      locationImage:
        "https://lh5.googleusercontent.com/p/AF1QipNtmaLbgLaTzv0ubPOdDKqsC3fmFFDwRbckH-oZ=w300-h225-p-k-no",
      locationDescription:
        "The community of ON1 Force is coming to NFT.NYC. Participate, come and collect this limited editon NFT!",
      distance: "0.2 Km",
      rating: "5 Rating",
      coordinates: {
        latitude: 40.7513747,
        longitude: -73.9877613,
      },
      image: defaultNft,
      success: true,
    },
    {
      title: "Rare Pizza DAO meetup @ NFT.NYC",
      subtitle: "sub",
      asset_name: "10",
      type: "voucher",
      location: "Times square",
      locationImage:
        "https://lh5.googleusercontent.com/p/AF1QipNtmaLbgLaTzv0ubPOdDKqsC3fmFFDwRbckH-oZ=w300-h225-p-k-no",
      locationDescription:
        "The community of Rare Pizza DAO is coming to NFT.NYC. Participate, come and collect this limited editon NFT!",
      distance: "0.2 Km",
      rating: "5 Rating",
      coordinates: {
        latitude: 40.7413747,
        longitude: -73.9877613,
      },
      image: defaultNft,
      success: true,
    },
  ],
};

