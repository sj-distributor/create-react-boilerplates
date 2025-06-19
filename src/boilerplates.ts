import { bgBlack, yellow } from 'kolorist';

import type { Boilerplate } from './types';

export const boilerplates: Boilerplate[] = [
  {
    name: 'react-ts',
    display: 'TypeScript',
    color: bgBlack,
  },
  {
    name: 'react-zustand',
    display: 'TypeScript + Zustand',
    color: yellow,
  },
];
