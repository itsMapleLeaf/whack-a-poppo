import { loadImage } from "./loadImage"

type ImageLoaderEntry = {
  src: string
  image?: HTMLImageElement
}

type ImageLoaderEntryKey = symbol

export class ImageLoader {
  private entries = new Map<ImageLoaderEntryKey, ImageLoaderEntry>()

  add(src: string) {
    const key = Symbol.for(src)
    this.entries.set(key, { src })
    return key
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
