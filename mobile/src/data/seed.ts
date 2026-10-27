import type { Nft, OwnedNft } from "../types";

const defaultImage = require("../../assets/images/default.png");

export const profile = {
  name: "Sam Riley",
  nickname: "Sammy",
  rank: "Apprentice",
  picture: require("../../assets/images/logoPixel.png"),
  walletAddress: "djnsj2udb2j",
  expBalance: "582.34",
};

export const catalogue: Nft[] = [
  {
    id: "1",
    title: "0N1 Force #2819",
    kind: "collectable",
    image: require("../../assets/images/oni.png"),
    inRange: true,
    distance: "2 Km",
    rating: "4.8 Rating",
    location: {
      name: "Graffiti Zone @ Mauer Park",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipOa23rPK0ZG_8VcP8D5w0GO1xvrk6SZ4XNxC6Rr=w408-h306-k-no",
      description:
        "Mauerpark is a public linear park in Berlin's Prenzlauer Berg district. The name translates to 'Wall Park', referring to its status as a former part of the Berlin Wall and its Death Strip. The park is located at the border of Prenzlauer Berg and Gesundbrunnen district of former West Berlin.",
      coordinate: { latitude: 40.7596569, longitude: -73.9830029 },
    },
  },
  {
    id: "2",
    title: "Cyber kongz #0000",
    kind: "collectable",
    image: require("../../assets/images/pixilart.png"),
    inRange: false,
    distance: "500 m",
    rating: "2.8 Rating",
    location: {
      name: "betahaus @ Kreuzberg",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipMF7ZT-a5V0BIgu3ZvstuLKHj9ZFOlOvQt18Zge=w426-h240-k-no",
      description:
        "betahaus | Kreuzberg is our HQ space, and in some ways, our heart and soul. It's a coworking and event space that's been serving the city's startup and freelancer community since 2009. In 2018, we moved into a building at the edge of Kreuzberg with a long legacy of influential tenants. We've restored the space to include modern coworking areas, event spaces, team rooms, balconies, café, and rooftop terrace.",
      coordinate: { latitude: 40.7396569, longitude: -74.0030029 },
    },
  },
  {
    id: "3",
    title: "Ancient artifact #12",
    kind: "collectable",
    image: defaultImage,
    inRange: true,
    distance: "1.4 Km",
    rating: "4.1 Rating",
    location: {
      name: "The Morgan Library & Museum",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipMtWDGW_YwJfUvS1miD2LnbPqNOUHxerqJtU3Lp=w408-h272-k-no",
      description:
        "A museum and independent research library located in the heart of New York City, the Morgan Library & Museum began as the personal library of financier, collector, and cultural benefactor Pierpont Morgan.",
      coordinate: { latitude: 40.748758, longitude: -73.9813067 },
    },
  },
  {
    id: "4",
    title: "Lost in Space",
    kind: "collectable",
    image: defaultImage,
    inRange: true,
    distance: "1.4 Km",
    rating: "4.1 Rating",
    location: {
      name: "The Museum of Modern Art",
      description:
        "The MoMA has one of the largest and most influential collections of modern art in the world. Home to famous works like Vincent Van Gogh's Starry Night, Salvador Dali's The Persistence of Memory, and works by Mondrian, Monet, and Picasso, this is a haven for art lovers.",
      coordinate: { latitude: 40.7735653, longitude: -73.9777152 },
    },
  },
  {
    id: "5",
    title: "Nets vs. Knicks game ticket (front seats)!",
    kind: "voucher",
    image: defaultImage,
    inRange: true,
    distance: "1.4 Km",
    rating: "5 Rating",
    location: {
      name: "Madison Square Garden",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipOWmvPrNApBboULzSOxmSEClShG687GpT42oZNh=w408-h514-k-no",
      description:
        "World's most famous arena, this icon hosts pro sports, concerts & other big events.",
      coordinate: { latitude: 40.7547105, longitude: -73.9856321 },
    },
  },
  {
    id: "6",
    title: "Pop UP by Reggie Watts",
    kind: "voucher",
    image: defaultImage,
    inRange: true,
    distance: "1.4 Km",
    rating: "5 Rating",
    location: {
      name: "Central Park",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipNLLJzgpUeIGCzhIVdYiBd6FPEcgP5Z1UM7vwPt=w408-h285-k-no",
      description:
        "Performing this Saturday in Central Park. The person who scores this has a right to purchase my merchandise with 77% discount!",
      coordinate: { latitude: 40.7747105, longitude: -73.9656321 },
    },
  },
  {
    id: "7",
    title: "Exclusive Chef's special",
    kind: "voucher",
    image: defaultImage,
    inRange: true,
    distance: "0.4 Km",
    rating: "5 Rating",
    location: {
      name: "La Grande Boucherie",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipPOnG7fY9Jd87Nu1Q62J0MX4LSmi_WGZdBVN9bo=w408-h271-k-no",
      description:
        "By collecting this NFT you secure an exclusive chance for a chef's special outside of the menu.",
      coordinate: { latitude: 40.7647105, longitude: -73.9856321 },
    },
  },
  {
    id: "8",
    title: "Bored Apes meetup @ NFT.NYC",
    kind: "voucher",
    image: defaultImage,
    inRange: true,
    distance: "0.2 Km",
    rating: "5 Rating",
    location: {
      name: "Times Square",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipNtmaLbgLaTzv0ubPOdDKqsC3fmFFDwRbckH-oZ=w300-h225-p-k-no",
      description:
        "The community of Bored Apes Yacht club is coming to NFT.NYC. Participate, come and collect this limited edition NFT!",
      coordinate: { latitude: 40.7579747, longitude: -73.9877313 },
    },
  },
  {
    id: "9",
    title: "ON1 Force meetup @ NFT.NYC",
    kind: "voucher",
    image: defaultImage,
    inRange: true,
    distance: "0.2 Km",
    rating: "5 Rating",
    location: {
      name: "Times Square",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipNtmaLbgLaTzv0ubPOdDKqsC3fmFFDwRbckH-oZ=w300-h225-p-k-no",
      description:
        "The community of ON1 Force is coming to NFT.NYC. Participate, come and collect this limited edition NFT!",
      coordinate: { latitude: 40.7513747, longitude: -73.9877613 },
    },
  },
  {
    id: "10",
    title: "Rare Pizza DAO meetup @ NFT.NYC",
    kind: "voucher",
    image: defaultImage,
    inRange: true,
    distance: "0.2 Km",
    rating: "5 Rating",
    location: {
      name: "Times Square",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipNtmaLbgLaTzv0ubPOdDKqsC3fmFFDwRbckH-oZ=w300-h225-p-k-no",
      description:
        "VOUCHER: $10 dollars off pizzas!!! The community of Rare Pizza DAO is coming to NFT.NYC. Participate, come and collect this limited edition NFT!",
      coordinate: { latitude: 40.7413747, longitude: -73.9877613 },
    },
  },
  {
    id: "11",
    title: "Etherials meetup @ NFT.NYC",
    kind: "collectable",
    image: defaultImage,
    inRange: true,
    distance: "0.2 Km",
    rating: "5 Rating",
    location: {
      name: "Times Square",
      photo:
        "https://lh5.googleusercontent.com/p/AF1QipNtmaLbgLaTzv0ubPOdDKqsC3fmFFDwRbckH-oZ=w300-h225-p-k-no",
      description:
        "The community of Etherials is coming to NFT.NYC. Participate, come and collect this limited edition NFT!",
      coordinate: { latitude: 40.7413747, longitude: -73.9817613 },
    },
  },
];

export const initialWallet: OwnedNft[] = [
  { id: "11", redeemed: false },
  { id: "6", redeemed: false },
  { id: "7", redeemed: true },
];
