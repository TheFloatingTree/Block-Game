import { ThreeBoxMesh } from '../../Trengine/src/Components/Three/ThreeBoxMesh'
import { Easing } from '../../Trengine/src/Engine/Animator'
import { System } from '../../Trengine/src/Engine/ECS/System'
import { SoundPoolType } from '../../Trengine/src/Engine/SoundManager'
import { Trengine } from '../../Trengine/src/Engine/Trengine'
import { Block } from '../Components/Block'
import { SingletonGame } from '../Components/SingletonGame'
import { makeBlock, makeInitialBlock } from '../Entities/Block'

function isPerfect(isXAxis, topBlockDimensions, xDiff, zDiff) {
    return isXAxis ?
        topBlockDimensions.w - xDiff < 0.01 :
        topBlockDimensions.d - zDiff < 0.01
}

export class BlockManager extends System {

    init() {
        this.game = this.scene.singletonComponents.getComponent(SingletonGame)

        this.scene.addQuery('blocks', [Block, ThreeBoxMesh])
        Trengine.Events.registerMany(['ScoreChanged', 'BlockAnimationFinished', 'GameFinished'])

        Trengine.Sounds.makeSoundPool('claves', [
            Trengine.Assets.sounds['clave14.wav'],
            Trengine.Assets.sounds['clave15.wav'],
            Trengine.Assets.sounds['clave16.wav'],
            Trengine.Assets.sounds['clave18.wav'],
        ], SoundPoolType.ascending)

        const windSound = Trengine.Assets.sounds['wind_loop.wav']
        if (!windSound.playing()) {
            windSound.loop(true)
            windSound.play()
        }

        this.blockCount = -50

        const yOffset = -0.12
        for (let i = 0; i < 50; i++) {
            const block = makeInitialBlock(i * yOffset, this.blockCount)
            if (i === 0) {
                this.game.topBlock = block
            }
            this.scene.addEntity(block)
            this.blockCount++
        }
    }

    update() {
        if (Trengine.Inputs.getInput('stop') && this.game.finished) {
            Trengine.Assets.sounds['snap.wav'].play()
            Trengine.ECS.loadScene(Trengine.Assets.data["block.scene.json"])
        }

        if (this.game.finished) return

        if (Trengine.Events.any('BlockAnimationFinished')) {
            Trengine.Events.receive('BlockAnimationFinished').forEach(() => {
                this.game.shouldSpawnBlock = true
            })
        }

        if (this.game.shouldSpawnBlock) {
            const topBlockMesh = this.game.topBlock.getComponent(ThreeBoxMesh).mesh

            const newX = this.game.moveOnXAxis ? -1.5 : topBlockMesh.position.x
            const newY = 0.12
            const newZ = this.game.moveOnXAxis ? topBlockMesh.position.z : -1.5
            const newWidth = topBlockMesh.geometry.parameters.width
            const newDepth = topBlockMesh.geometry.parameters.depth

            this.blockCount++
            const block = makeBlock(newX, newY, newZ, newWidth, newDepth, this.blockCount)
            this.game.movingBlock = block

            this.scene.addEntity(block)

            this.game.shouldSpawnBlock = false
        }

        const movingBlockMesh = this.game.movingBlock.getComponent(ThreeBoxMesh).mesh
        if (this.game.moveOnXAxis) {
            movingBlockMesh.position.x += 0.01 * Trengine.Animator.clamp(Math.sqrt(this.game.score + 1) / 2, 1.5, 3.5) * Trengine.delta()
        } else {
            movingBlockMesh.position.z += 0.01 * Trengine.Animator.clamp(Math.sqrt(this.game.score + 1) / 2, 1.5, 3.5) * Trengine.delta()
        }

        if (movingBlockMesh.position.x >= 1 || movingBlockMesh.position.z >= 1) {
            this.game.finished = true
            Trengine.Events.send('GameFinished')
            Trengine.Assets.sounds['fail.wav'].play()
        }

        if (Trengine.Inputs.getInput('stop')) {
            const movingBlockMesh = this.game.movingBlock.getComponent(ThreeBoxMesh).mesh
            const topBlockMesh = this.game.topBlock.getComponent(ThreeBoxMesh).mesh

            const movingBlockPosition = movingBlockMesh.position
            const topBlockPosition = topBlockMesh.position

            const movingBlockDimensions = {
                w: movingBlockMesh.geometry.parameters.width,
                h: movingBlockMesh.geometry.parameters.height,
                d: movingBlockMesh.geometry.parameters.depth
            }
            const topBlockDimensions = {
                w: topBlockMesh.geometry.parameters.width,
                h: topBlockMesh.geometry.parameters.height,
                d: topBlockMesh.geometry.parameters.depth
            }

            const movingBlockXMin = movingBlockPosition.x - movingBlockDimensions.w / 2
            const movingBlockXMax = movingBlockPosition.x + movingBlockDimensions.w / 2
            const movingBlockZMin = movingBlockPosition.z - movingBlockDimensions.d / 2
            const movingBlockZMax = movingBlockPosition.z + movingBlockDimensions.d / 2

            const topBlockXMin = topBlockPosition.x - topBlockDimensions.w / 2
            const topBlockXMax = topBlockPosition.x + topBlockDimensions.w / 2
            const topBlockZMin = topBlockPosition.z - topBlockDimensions.d / 2
            const topBlockZMax = topBlockPosition.z + topBlockDimensions.d / 2

            const xDiff = Math.max(0, Math.min(movingBlockXMax, topBlockXMax) - Math.max(movingBlockXMin, topBlockXMin))
            const zDiff = Math.max(0, Math.min(movingBlockZMax, topBlockZMax) - Math.max(movingBlockZMin, topBlockZMin))

            if (xDiff === 0 || zDiff === 0) {
                this.game.finished = true
                Trengine.Events.send('GameFinished')
                Trengine.Assets.sounds['fail.wav'].play()
            } else {

                const newWidth = xDiff
                const newDepth = zDiff
                const newX = movingBlockPosition.x < topBlockPosition.x ? topBlockXMin + newWidth / 2 : topBlockXMax - newWidth / 2
                const newY = movingBlockPosition.y
                const newZ = movingBlockPosition.z < topBlockPosition.z ? topBlockZMin + newDepth / 2 : topBlockZMax - newDepth / 2

                this.scene.removeEntity(this.game.movingBlock)

                if (isPerfect(this.game.moveOnXAxis, topBlockDimensions, xDiff, zDiff)) {
                    if (this.game.moveOnXAxis) {
                        var newBlock = makeBlock(topBlockPosition.x, newY, topBlockPosition.z, topBlockDimensions.w + 0.07, topBlockDimensions.d, this.blockCount) // Full size
                    } else {
                        var newBlock = makeBlock(topBlockPosition.x, newY, topBlockPosition.z, topBlockDimensions.w, topBlockDimensions.d + 0.07, this.blockCount) // Full size
                    }
                    this.game.score += 3
                    Trengine.Assets.sounds['snap.wav'].play()
                } else {
                    var newBlock = makeBlock(newX, newY, newZ, newWidth, newDepth, this.blockCount)
                    this.game.score += 1
                }

                Trengine.Sounds.playSoundInPool('claves')

                Trengine.Events.send('ScoreChanged', this.game.score)

                this.game.topBlock = newBlock
                this.scene.addEntity(newBlock)

                this.game.moveOnXAxis = !this.game.moveOnXAxis
            }

            this.queries.blocks.forEach(entity => {
                const mesh = entity.getComponent(ThreeBoxMesh).mesh

                Trengine.Animator.animate({
                    target: mesh.position,
                    selector: 'y',
                    start: mesh.position.y,
                    stop: mesh.position.y - 0.12,
                    duration: 20,
                    easing: Easing.easeInOutCubic,
                    complete: 'BlockAnimationFinished'
                })
            })
        }

        this.queries.blocks.forEach(entity => {
            const mesh = entity.getComponent(ThreeBoxMesh).mesh
            if (mesh.position.y < -2) {
                this.scene.removeEntity(entity)
            }
        })
    }
}