import { createSpriteSheet } from "./createSpriteSheet"
import { ImageLoader } from "./ImageLoader"

const getAssetPath = (imageName: string) => `/assets/${imageName}.png`

const imageLoader = new ImageLoader()

async function main() {
  const barrelId = imageLoader.add(getAssetPath("barrel"))
  // const hammer = imageLoader.add(getAssetPath("hammer1"))
  // const star = imageLoader.add(getAssetPath("star"))

  await imageLoader.loadAll()

  const canvas = document.createElement("canvas")
  canvas.width = 800
  canvas.height = 600
  document.body.append(canvas)

  const context = canvas.getContext("2d")!

  const barrel = imageLoader.get(barrelId)

  const barrelSpriteSheet = createSpriteSheet(barrel, 2, 1)

  const cover = barrelSpriteSheet.frame(0, 0)
  const back = barrelSpriteSheet.frame(1, 0)

  back.drawCentered(context, 200, 200)
  cover.drawCentered(context, 200, 200)
}

main().catch(console.error)
