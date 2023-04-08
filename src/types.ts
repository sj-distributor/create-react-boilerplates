export type ColorFunc = (str: string | number) => string

export type Framework = {
  name: string
  color: ColorFunc
  display: string
  boilerplate: FrameworkBoilerplate[]
}

export type FrameworkBoilerplate = {
  name: string
  color: ColorFunc
  display: string
  customCommand?: string
}