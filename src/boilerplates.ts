import { bgBlack, green, yellow } from "kolorist";

import { Boilerplate } from "./types";

export const boilerplates: Boilerplate[] = [
  {
    name: "react-recoil",
    display: "Recoil + TypeScript",
    color: green,
  },
  {
    name: "react-ts",
    display: "TypeScript",
    color: bgBlack,
  },
  {
    name: "react-zustand",
    display: "Zustand + TypeScript",
    color: yellow,
  },
];
