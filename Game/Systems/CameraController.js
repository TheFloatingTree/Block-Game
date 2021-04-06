import { SingletonThreeCamera } from '../../Trengine/src/Components/Three/SingletonThreeCamera'
import { System } from '../../Trengine/src/Engine/ECS/System'

export class CameraController extends System {

    init() {
        this.camera = this.scene.singletonComponents.getComponent(SingletonThreeCamera)

        this.camera.camera.position.set(3, 3, 3)
        this.camera.camera.lookAt(0, 0, 0)
    }

    update() {
        
    }
}