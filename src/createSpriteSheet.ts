export function createSpriteSheet(
  image: HTMLImageElement,
  xFrameCount: number,
  yFrameCount: number,
) {
  const frameWidth = image.width / xFrameCount
  const frameHeight = image.height / yFrameCount

  return {
    frame: (xFrame: number, yFrame: number) => {
      const draw = (
        context: CanvasRenderingContext2D,
        xDest: number,
        yDest: number,
      ) => {
        context.drawImage(
          image,

          frameWidth * xFrame,
          frameWidth * yFrame,
          frameWidth,
          frameHeight,

          xDest,
          yDest,
          frameWidth,
          frameHeight,
        )
      }

      const drawCentered = (
        context: CanvasRenderingContext2D,
        xDest: number,
        yDest: number,
      ) => {
        context.drawImage(
          image,

          frameWidth * xFrame,
          frameWidth * yFrame,
          frameWidth,
          frameHeight,

          xDest - frameWidth / 2,
          yDest - frameHeight / 2,
          frameWidth,
          frameHeight,
        )
      }

      return { draw, drawCentered }
    },
  }
}
