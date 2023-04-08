import { Framework } from "./types";
import { cyan, green, yellow } from 'kolorist';

export const frameworks: Framework[] = [
  {
    name: 'react',
    display: 'React',
    color: cyan,
    boilerplate: [
      {
        name: 'react-recoil',
        display: 'TypeScript + Recoil',
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
  .map(f => (f.boilerplate && f.boilerplate.map(v => v.name)) || [f.name])
  .reduce((a, b) => a.concat(b), []);