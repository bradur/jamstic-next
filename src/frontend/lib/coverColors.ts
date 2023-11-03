import { prominent } from "color.js";
import { EntryColorPalette, RGBColor } from "types/types-custom";



const relativeLuminance = (color: number[]) => {
  const min = 0.03928
  const div = 12.92

  const factor = 0.055
  const divider = 1.055
  const defo = 2.4

  const [red, green, blue] = color.map((color) => {
    const colorSmall = color / 255
    return colorSmall <= min ? colorSmall / div : Math.pow((colorSmall + factor) / divider, defo)
  })

  return red * 0.2126 + green * 0.7152 + blue * 0.0722
}



const rgbToHex = (rgbColor: RGBColor) => {
  const asHex = rgbColor
    .map((color) => {
      const colorAsString = color.toString(16)
      console.log(`${color} -> ${colorAsString}`)
      if (colorAsString.length < 2) {
        return `0${colorAsString}`
      }
      return colorAsString;
    })
    .join('')
  return `#${asHex}`
}
type Props = {
  imageAsB64: string
}

export const colorsFromB64 = async ({ imageAsB64 }: Props): Promise<EntryColorPalette> => {
  const prominentColors = (await prominent(imageAsB64, { amount: 5, format: 'array', group: 50, sample: 5 })) as RGBColor[]
  prominentColors.sort((colorA, colorB) => {
    const luminA = relativeLuminance(colorA)
    const luminB = relativeLuminance(colorB)
    if (luminA > luminB) {
      return 1
    }
    if (luminB > luminA) {
      return -1
    }
    return 0
  })
  const [one, two, three, four, five] = prominentColors
  const css = Object.entries({ one, two, three, four, five })
    .map(([name, color]) => `--${name}: ${rgbToHex(color)};`)
    .join('')
  const colors = Object.entries({ one, two, three, four, five })
    .map(([name, color]) => ({ name, hex: rgbToHex(color), rgb: color }))
  return {
    colors,
    css
  };
};