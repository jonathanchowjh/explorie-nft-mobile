import type { Nft, NftKind, OwnedNft } from "../types";
import drops from "./drops.json";

const defaultImage = require("../../assets/images/default.png");

export const profile = {
  name: "Sam Riley",
  nickname: "Sammy",
  rank: "Apprentice",
  picture: require("../../assets/images/logoPixel.png"),
  expBalance: "582.34",
};

// What the app shows for each drop, beyond the id, title, kind and coordinate it shares with the server in drops.json.
type Copy = Pick<Nft, "image" | "distance" | "rating"> & { location: Omit<Nft["location"], "coordinate"> };

const copy: Record<string, Copy> = {
  "1": {
    image: require("../../assets/images/oni.png"),
    distance: "2 Km",
    rating: "4.8 Rating",
    location: {
      name: "Graffiti Zone @ Mauer Park",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipOa23rPK0ZG_8VcP8D5w0GO1xvrk6SZ4XNxC6Rr=w408-h306-k-no",
      description:
        "Mauerpark is a public linear park in Berlin's Prenzlauer Berg district. The name translates to 'Wall Park', referring to its status as a former part of the Berlin Wall and its Death Strip. The park is located at the border of Prenzlauer Berg and Gesundbrunnen district of former West Berlin.",
    },
  },
  "2": {
    image: require("../../assets/images/pixilart.png"),
    distance: "500 m",
    rating: "2.8 Rating",
    location: {
      name: "betahaus @ Kreuzberg",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipMF7ZT-a5V0BIgu3ZvstuLKHj9ZFOlOvQt18Zge=w426-h240-k-no",
      description:
        "betahaus | Kreuzberg is our HQ space, and in some ways, our heart and soul. It's a coworking and event space that's been serving the city's startup and freelancer community since 2009. In 2018, we moved into a building at the edge of Kreuzberg with a long legacy of influential tenants. We've restored the space to include modern coworking areas, event spaces, team rooms, balconies, café, and rooftop terrace.",
    },
  },
  "3": {
    image: defaultImage,
    distance: "1.4 Km",
    rating: "4.1 Rating",
    location: {
      name: "The Morgan Library & Museum",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipMtWDGW_YwJfUvS1miD2LnbPqNOUHxerqJtU3Lp=w408-h272-k-no",
      description:
        "A museum and independent research library located in the heart of New York City, the Morgan Library & Museum began as the personal library of financier, collector, and cultural benefactor Pierpont Morgan.",
    },
  },
  "4": {
    image: defaultImage,
    distance: "1.4 Km",
    rating: "4.1 Rating",
    location: {
      name: "The Museum of Modern Art",
      description:
        "The MoMA has one of the largest and most influential collections of modern art in the world. Home to famous works like Vincent Van Gogh's Starry Night, Salvador Dali's The Persistence of Memory, and works by Mondrian, Monet, and Picasso, this is a haven for art lovers.",
    },
  },
  "5": {
    image: defaultImage,
    distance: "1.4 Km",
    rating: "5 Rating",
    location: {
      name: "Madison Square Garden",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipOWmvPrNApBboULzSOxmSEClShG687GpT42oZNh=w408-h514-k-no",
      description:
        "World's most famous arena, this icon hosts pro sports, concerts & other big events.",
    },
  },
  "6": {
    image: defaultImage,
    distance: "1.4 Km",
    rating: "5 Rating",
    location: {
      name: "Central Park",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipNLLJzgpUeIGCzhIVdYiBd6FPEcgP5Z1UM7vwPt=w408-h285-k-no",
      description:
        "Performing this Saturday in Central Park. The person who scores this has a right to purchase my merchandise with 77% discount!",
    },
  },
  "7": {
    image: defaultImage,
    distance: "0.4 Km",
    rating: "5 Rating",
    location: {
      name: "La Grande Boucherie",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipPOnG7fY9Jd87Nu1Q62J0MX4LSmi_WGZdBVN9bo=w408-h271-k-no",
      description:
        "By collecting this NFT you secure an exclusive chance for a chef's special outside of the menu.",
    },
  },
  "8": {
    image: defaultImage,
    distance: "0.2 Km",
    rating: "5 Rating",
    location: {
      name: "Times Square",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipNtmaLbgLaTzv0ubPOdDKqsC3fmFFDwRbckH-oZ=w300-h225-p-k-no",
      description:
        "The community of Bored Apes Yacht club is coming to NFT.NYC. Participate, come and collect this limited edition NFT!",
    },
  },
  "9": {
    image: defaultImage,
    distance: "0.2 Km",
    rating: "5 Rating",
    location: {
      name: "Times Square",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipNtmaLbgLaTzv0ubPOdDKqsC3fmFFDwRbckH-oZ=w300-h225-p-k-no",
      description:
        "The community of ON1 Force is coming to NFT.NYC. Participate, come and collect this limited edition NFT!",
    },
  },
  "10": {
    image: defaultImage,
    distance: "0.2 Km",
    rating: "5 Rating",
    location: {
      name: "Times Square",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipNtmaLbgLaTzv0ubPOdDKqsC3fmFFDwRbckH-oZ=w300-h225-p-k-no",
      description:
        "VOUCHER: $10 dollars off pizzas!!! The community of Rare Pizza DAO is coming to NFT.NYC. Participate, come and collect this limited edition NFT!",
    },
  },
  "11": {
    image: defaultImage,
    distance: "0.2 Km",
    rating: "5 Rating",
    location: {
      name: "Times Square",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipNtmaLbgLaTzv0ubPOdDKqsC3fmFFDwRbckH-oZ=w300-h225-p-k-no",
      description:
        "The community of Etherials is coming to NFT.NYC. Participate, come and collect this limited edition NFT!",
    },
  },
};

export const catalogue: Nft[] = drops.map(({ coordinate, ...drop }) => ({
  ...drop,
  kind: drop.kind as NftKind,
  ...copy[drop.id],
  location: { ...copy[drop.id].location, coordinate },
}));

export const initialWallet: OwnedNft[] = [
  { id: "11", redeemed: false },
  { id: "6", redeemed: false },
  { id: "7", redeemed: true },
];
