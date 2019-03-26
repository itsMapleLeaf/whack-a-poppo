import * as pixi from "pixi.js"
import barrelImagePath from "./assets/barrel.png"

const barrel = pixi.Sprite.from(barrelImagePath)

const app = new pixi.Application({ width: 800, height: 600 })
app.stage.addChild(barrel)

document.body.append(app.view)
