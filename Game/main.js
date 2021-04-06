import { Trengine } from '../Trengine/src/Engine/Trengine'
import { registerSystems } from './Systems/registerSystems'
import { registerComponents } from './Components/registerComponents'
 
Trengine.start({ 
    manifestPath: "../Game/Assets/manifest.json",
    onStart: async () => {
        const startSceneData = Trengine.Assets.data["start.scene.json"]
        await Trengine.ECS.loadScene(startSceneData)
    },
    registerSystems,
    registerComponents
})