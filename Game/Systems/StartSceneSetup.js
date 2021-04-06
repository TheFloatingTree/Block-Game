import { System } from '../../Trengine/src/Engine/ECS/System'
import { PRESSED } from '../../Trengine/src/Engine/InputManager'
import { Trengine } from '../../Trengine/src/Engine/Trengine'
import { buildStartSceneVue } from '../UI/StartScene/buildStartSceneVue'


export class StartSceneSetup extends System {

    init() {
        Trengine.Inputs.registerBinding('start', ['SPACEBAR'], PRESSED)
        Trengine.UI.addVue(buildStartSceneVue, 'startScene')
    }

    update() {
        if (Trengine.Inputs.getInput('start')) {
            Trengine.ECS.loadScene(Trengine.Assets.data["block.scene.json"])
        }
    }

    dispose() {
        Trengine.UI.removeVue('startScene')
    }    
}