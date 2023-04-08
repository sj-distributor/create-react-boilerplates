import { Framework } from "./types";
import { cyan, green, yellow } from 'kolorist';

export const frameworks: Framework[] = [
  {
    name: 'react',
    display: 'React',
    color: cyan,
    variants: [
      {
        name: 'react-vite-recoil',
        display: 'TypeScript + Vite + Recoil',
        color: yellow,
      },
      {
        name: 'react-ts',
        display: 'TypeScript',
        color: green,
      }
    ],
  }
]

export const templates = frameworks
  .map(f => (f.variants && f.variants.map(v => v.name)) || [f.name])
  .reduce((a, b) => a.concat(b), []);