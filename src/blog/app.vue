<template>
  <div>
    <headex></headex>
    <div class="well well-sm"  style="position:fixed;top:50px; width:100%;z-index:10002">
      <div class="container fixed-width">
        <button type="button" class="btn btn-primary gap" id="btnCreate" @click='save'>
          <span class="glyphicon glyphicon-save"></span> 保存
        </button>
        <button type="button" class="btn btn-default gap" id="btnCreate" @click='edit'>
          <span class="glyphicon glyphicon-edit"></span> 编辑
        </button>
      </div>
    </div>
    
    <editor ref='ed'></editor>
    <footex></footex>
  </div>
</template>

<script>
import Editor from '../components/Editor'
export default {
  name: 'app',
  components: {
    Editor
  },
  methods:{
    save: function() {
      var _this = this;
      if(_this.$refs.ed.model.content == '') {
        return alert('content is empty');
      }

      if(_this.$refs.ed.model.content == '') {
        return alert('title is empty');
      }

      $.post('/api/v1/blog', _this.$refs.ed.model).then(doc => {
          if(!doc || doc.code !== 'success') 
            throw new Error(doc.message || 'res is empty');

          _this.$refs.ed.isEdit = false;
        }).fail(err => {
          console.log(err.message);
        });
    },
    edit: function() {
      this.$refs.ed.edit();
    }
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
