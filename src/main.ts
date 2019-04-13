import "@babel/polyfill"

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()

    const handleLoad = () => {
      resolve(image)
      image.removeEventListener("load", handleLoad)
      image.removeEventListener("error", handleError)
    }

    const handleError = () => {
      reject(`Couldn't load "${src}"`)
      image.removeEventListener("load", handleLoad)
      image.removeEventListener("error", handleError)
    }

    image.src = src
    image.onload = handleLoad
    image.onerror = handleError
  })
}

type ImageLoaderEntry = {
  src: string
  image?: HTMLImageElement
}

type ImageLoaderEntryKey = symbol

class ImageLoader {
  private entries = new Map<ImageLoaderEntryKey, ImageLoaderEntry>()

  add(src: string) {
    const id = Symbol.for(src)
    this.entries.set(id, { src })
    return id
  }

  async load(key: ImageLoaderEntryKey) {
    const entry = this.entries.get(key)
    if (!entry) {
      throw new Error(`Couldn't find image "${String(key)}"`)
    }

    const image = await loadImage(entry.src)
    this.entries.set(key, { ...entry, image })
  }

  async loadAll() {
    const keys = [...this.entries.keys()]
    await Promise.all(keys.map((key) => this.load(key)))
  }

  get(key: ImageLoaderEntryKey) {
    const entry = this.entries.get(key)
    if (!entry) {
      throw new Error(`Image loader entry "${String(key)}" does not exist`)
    }

    if (!entry.image) {
      throw new Error(`Image "${String(key)}" has not been loaded`)
    }

    return entry.image
  }
}

const imageLoader = new ImageLoader()

const getAssetPath = (imageName: string) => `public/assets/${imageName}.png`

async function main() {
  const barrel = imageLoader.add(getAssetPath("barrel"))
  const hammer = imageLoader.add(getAssetPath("hammer"))
  const star = imageLoader.add(getAssetPath("star"))

  await imageLoader.loadAll()

  console.log(imageLoader.get(barrel))
}

main().catch(console.error)
