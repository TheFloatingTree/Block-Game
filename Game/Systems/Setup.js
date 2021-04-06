import { System } from '../../Trengine/src/Engine/ECS/System'
import { PRESSED } from '../../Trengine/src/Engine/InputManager'
import { Trengine } from '../../Trengine/src/Engine/Trengine'
import { buildMainSceneVue } from '../UI/MainScene/buildMainSceneVue'

export class Setup extends System {

    init() {
        Trengine.Inputs.registerBinding('stop', ['SPACEBAR'], PRESSED)
        Trengine.UI.addVue(buildMainSceneVue, 'mainScene')
    }

    update() {
        
    }

    dispose() {
        Trengine.UI.removeVue('mainScene')
    }    
}