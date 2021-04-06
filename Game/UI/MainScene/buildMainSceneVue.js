import Vue from '../../../Trengine/node_modules/vue'
import Main from './Main.vue'

export function buildMainSceneVue() {

    require('../Assets/main.scss')

    return new Vue({
        render: h => h(Main)
    })
}