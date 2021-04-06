import { Block } from "./Block";
import { SingletonGame } from "./SingletonGame";

export function registerComponents(ECS) {
    ECS.registerComponent(Block)
    ECS.registerComponent(SingletonGame)
}