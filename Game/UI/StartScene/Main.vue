<template>
    <div class="container">
        <div class="level move-down">
            <div class="level-item has-text-centered">
                <span class="big-text"> Really Cool Block Stacking Game </span>
            </div>
        </div>
        <div class="level">
            <div class="level-item has-text-centered">
                <span class="big-text"> Press Space To Begin </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.container {
    width: 100vw;
    height: 100vh;
}

.move-down {
    margin-top: 6rem;
}

.slide-fade-enter-active {
    transition: all 0.7s ease;
}

.slide-fade-enter {
    transform: translateY(30px);
    opacity: 0;
}

.big-text {
    font-size: 3rem;
    font-weight: bold;
}
</style>