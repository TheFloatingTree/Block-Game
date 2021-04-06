<template>
    <div class="container is-mobile">
        <div class="level move-down mb-0">
            <div class="level-item has-text-centered">
                <span class="big-text">{{ score }}</span>
            </div>
        </div>
        <transition name="slide-fade">
            <div class="level" v-if="scoreDelta">
                <div class="level-item has-text-centered">
                    <span class="small-text has-text-primary">{{
                        scoreDeltaText
                    }}</span>
                </div>
            </div>
        </transition>
        <transition name="slide-fade">
            <div v-if="gameFinished" class="move-down bottom">
                <div class="level">
                    <div class="level-item has-text-centered big-text">
                        Try Again?
                    </div>
                </div>
                <div class="level">
                    <div class="level-item has-text-centered big-text">
                        Space To Restart
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { Trengine } from "../../../Trengine/src/Engine/Trengine";
import { SingletonGame } from "../../Components/SingletonGame";
export default {
    mounted() {
        Trengine.Events.subscribe("ScoreChanged", this.scored);
        Trengine.Events.subscribe("GameFinished", this.onGameFinished);
    },
    data() {
        return {
            score: Trengine.ECS.scene.singletonComponents.getComponent(
                SingletonGame
            ).score,
            scoreDelta: null,
            gameFinished: false,
        };
    },
    methods: {
        scored(payload) {
            this.scoreDelta = payload - this.score;
            this.score = payload;

            setTimeout(this.removeScoreDelta, 500);
        },
        removeScoreDelta() {
            this.scoreDelta = null;
        },
        onGameFinished() {
            this.gameFinished = true;
        },
    },
    computed: {
        scoreDeltaText() {
            return this.scoreDelta <= 1
                ? `+${this.scoreDelta}`
                : `+${this.scoreDelta} Perfect!`;
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
    width: 100vw;
    height: 100vh;
}

.bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    margin-bottom: 6rem;
}

.big-text {
    font-size: 3rem;
    font-weight: bold;
}

.small-text {
    font-size: 2rem;
}

.move-down {
    margin-top: 6rem;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.2s ease;
}

.slide-fade-enter {
    transform: translateY(20px);
    opacity: 0;
}

.slide-fade-leave-to {
    opacity: 0;
}
</style>