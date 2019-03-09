import barrelImagePath from "./assets/whack_barrel.PNG"

const canvas = document.createElement("canvas")
canvas.width = 1000
canvas.height = 1000

const context = canvas.getContext("2d")!

const barrelImage = new Image()

barrelImage.src = barrelImagePath
barrelImage.onload = () => {
  context.drawImage(barrelImage, 10, 10)
}

document.body.append(canvas)
