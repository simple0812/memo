<template>
  <div class="navbar navbar-inverse navbar-fixed-top" id="topNav" role="navigation" style="z-index: 1;">
    <div class="container">
      <div class="navbar-header">
        <a class="navbar-brand" href="/" style="margin-top:-4px;"><i class="glyphicon glyphicon-home" style='margin-right:10px'></i>{{title}}</a>
      </div>
      <div class=" navbar-collapse">
        <ul class="nav navbar-nav" id="headNav">
          <li>
            <a href="/link.html" v-curr>链接</a>
          </li>
          <li>
            <a href="/catalog.html" v-curr >博客</a>
          </li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import '../shared/activeCurrLink.js';
  export default {
    data : function() {
      return {
        title : '备忘录'
      };
    },
    methods: {
      
    }
  }
</script>

<style scoped>

</style>