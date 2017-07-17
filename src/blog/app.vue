<template>
  <div class="container fixed-width" style="padding-bottom:30px;">
    <headex></headex>
    <div class="well well-sm">
      <div class="container fixed-width">
        <button type="button" class="btn btn-primary gap" id="btnCreate" onclick='location.href="/blog.html"'>
          <span class="glyphicon glyphicon-plus"></span> 添加
        </button>
      </div>
    </div>
    <editor></editor>
    <footex></footex>
  </div>
</template>

<script>
import Editor from '../components/Editor'
export default {
  name: 'app',
  components: {
    Editor
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
