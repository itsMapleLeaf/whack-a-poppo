import { ImageLoader } from "./ImageLoader"

const getAssetPath = (imageName: string) => `/assets/${imageName}.png`

const imageLoader = new ImageLoader()

async function main() {
  const barrel = imageLoader.add(getAssetPath("barrel"))
  const hammer = imageLoader.add(getAssetPath("hammer1"))
  const star = imageLoader.add(getAssetPath("star"))

  await imageLoader.loadAll()

  console.log(imageLoader.get(barrel))
}

main().catch(console.error)
