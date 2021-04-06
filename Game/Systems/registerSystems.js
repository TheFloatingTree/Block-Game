import { BlockManager } from "./BlockManager";
import { CameraController } from "./cameraController";
import { Setup } from "./Setup";
import { StartSceneSetup } from "./StartSceneSetup";

export function registerSystems(ECS) {
    ECS.registerSystem(CameraController)
    ECS.registerSystem(BlockManager)
    ECS.registerSystem(Setup)
    ECS.registerSystem(StartSceneSetup)
}