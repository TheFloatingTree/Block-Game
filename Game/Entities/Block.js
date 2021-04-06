import { ThreeBoxMesh } from "../../Trengine/src/Components/Three/ThreeBoxMesh";
import { Entity } from "../../Trengine/src/Engine/ECS/Entity";
import { Block } from "../Components/Block";
import palettes from '../../Trengine/node_modules/nice-color-palettes';
import colorInterpolater from '../../Trengine/node_modules/color-interpolate';

function convertRGB(rgbString) {
    const components = rgbString.split(',')
    const r = parseInt(components[0].substring(4))
    const g = parseInt(components[1])
    const b = parseInt(components[2])
    return r.toString(16) + g.toString(16) + b.toString(16)
}

function getColor(paletteNumber, index) {
    const palette = colorInterpolater([...palettes[paletteNumber], palettes[paletteNumber][0]])
    const color = palette(Math.abs(Math.abs(index / 15) - Math.abs(Math.floor(index / 15))))
    return convertRGB(color)
}

export function makeInitialBlock(y, blockCount) {
    const entity = new Entity()
    entity.addComponent(new Block())
    entity.addComponent(new ThreeBoxMesh({ width: 0.8, height: 0.12, depth: 0.8, color: getColor(2, blockCount), y }))
    return entity
}

export function makeBlock(x, y, z, width, depth, blockCount) {
    const entity = new Entity()
    entity.addComponent(new Block())
    entity.addComponent(new ThreeBoxMesh({ width, height: 0.12, depth, color: getColor(2, blockCount), y, x, z }))
    return entity
}