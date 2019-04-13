export function loadImage(src: string) {
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
