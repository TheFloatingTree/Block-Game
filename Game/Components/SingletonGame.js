import { Component } from "../../Trengine/src/Engine/ECS/Component"
import { ComponentData } from "../../Trengine/src/Engine/ECS/Persistence/ComponentData"

export class SingletonGame extends Component {
    constructor({ } = {}) {
        super()

        this.topBlock = null
        this.movingBlock = null
        this.shouldSpawnBlock = true
        this.moveOnXAxis = true
        this.score = 0
        this.finished = false
    }

    serialize() {
        return new ComponentData({
            componentType: this.className(),
            data: {}
        })
    }
}