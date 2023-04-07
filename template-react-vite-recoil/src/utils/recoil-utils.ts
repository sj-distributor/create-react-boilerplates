import {
  atom,
  AtomEffect,
  AtomOptions,
  isRecoilValue,
  MutableSnapshot,
  RecoilState,
} from "recoil";

import * as storage from "./storage";

/**
 * track changes & save to storage
 */
const saveStorageEffect =
  <T>(key: string): AtomEffect<T> =>
  ({ onSet }) => {
    onSet((newValue, _, isReset) => {
      if (isReset) {
        storage.remove(key);
      } else {
        storage.save(key, JSON.stringify(newValue));
      }
    });
  };

export type AtomWithStorageOptions<T> = AtomOptions<T> & { storageKey: string };

export type RecoilStateWithStorage<T> = RecoilState<T> & { storageKey: string };

/**
 * Create storage atom.
 */
export const atomWithStorage = <T>({
  ...options
}: AtomWithStorageOptions<T>): RecoilStateWithStorage<T> => {
  const storageKey = options.storageKey;

  options.effects = options.effects
    ? options.effects.concat([saveStorageEffect<T>(storageKey)])
    : [saveStorageEffect<T>(storageKey)];

  const atomWithStorage = atom({ ...options }) as RecoilStateWithStorage<T>;

  atomWithStorage.storageKey = storageKey;

  return atomWithStorage;
};

/**
 * Checks if the input object is recoil atom with storage.
 */
const isRecoilStateWithStorage = (object: any) => {
  return (
    isRecoilValue(object) &&
    Object.prototype.hasOwnProperty.call(object, "storageKey")
  );
};

export interface IAtomInitState {
  atom: RecoilState<any>;
  value: any;
}

/**
 * Setup state from storage.
 */
export const setupStoreageState = async (
  models: Record<string, any>
): Promise<IAtomInitState[]> => {
  const atomInitStates: IAtomInitState[] = [];

  for (const modelName in models) {
    const modelNameTyped = modelName as keyof typeof models;

    const model = models[modelNameTyped];

    if (isRecoilStateWithStorage(model)) {
      const atom = model as RecoilStateWithStorage<any>;

      if (atom.storageKey) {
        const savedValue = await storage.load(atom.storageKey);

        if (savedValue !== null) {
          atomInitStates.push({
            atom: atom,
            value: JSON.parse(savedValue),
          });
        }
      }
    }
  }

  return atomInitStates;
};

/**
 * Initialize recoil state
 */
export const withInitializeState = (atomInitStates: IAtomInitState[]) => {
  return (mutableSnapshot: MutableSnapshot) => {
    atomInitStates.forEach(({ atom, value }) => {
      mutableSnapshot.set(atom, value);
    });
  };
};
