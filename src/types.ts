export type ColorFunc = (str: string | number) => string

export type Framework = {
  name: string
  display: string
  color: ColorFunc
  variants: FrameworkVariant[]
}

export type FrameworkVariant = {
  name: string
  display: string
  color: ColorFunc
  customCommand?: string
}