import { Framework } from "./types";
import { cyan, yellow } from 'kolorist';

export const frameworks: Framework[] = [
  {
    name: 'react',
    display: 'React',
    color: cyan,
    variants: [
      {
        name: 'react-vite-recoil',
        display: 'TypeScript + vite + Recoil',
        color: yellow,
      }
    ],
  }
]

export const templates = frameworks
  .map(f => (f.variants && f.variants.map(v => v.name)) || [f.name])
  .reduce((a, b) => a.concat(b), []);