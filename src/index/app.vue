<template>
    <div id="example" >
        <h1 @click='foo($event)'>{{ msg }}</h1>
        <ul>
            <li v-for="(n, i) in arr">{{n}}{{i}}</li>
        </ul>
    </div>
</template>

<script>
import * as _ from 'lodash'
export default {
    data : function() {
        return {
            msg: `Hello World!`,
            arr:[1, 2, 3].map(n => n + 1)
        }
    },
    methods: {
        foo:function(evt) {
            console.log(evt)
            console.log($(evt.target).html())
        }
    }
}
</script>

<style scoped>
#example {
    background: yellow;
    height: 100vh;
}
</style>