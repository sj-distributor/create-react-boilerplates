export type ColorFunc = (str: string | number) => string;

export type Boilerplate = {
  name: string;
  color: ColorFunc;
  display: string;
  customCommand?: string;
};
