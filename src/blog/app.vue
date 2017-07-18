<template>
  <div>
    <headex></headex>
    <div class="well well-sm"  style="position:fixed;top:50px; width:100%;z-index:10002">
      <div class="container fixed-width">
        <button  v-show="isEdit" type="button" class="btn btn-primary gap" id="btnCreate" @click='save'>
          <span class="glyphicon glyphicon-save"></span> 保存
        </button>
        <button  v-show="!isEdit" type="button" class="btn btn-default gap" id="btnCreate" @click='edit'>
          <span class="glyphicon glyphicon-edit"></span> 编辑
        </button>
      </div>
    </div>
    
    <div style="margin-top:50px; margin-bottom:50px;" class="container fixed-width">
      <div class="input-group" style="margin:20px 0;"  v-show="isEdit" >
        <span class="input-group-addon addon-width-4 " style="">标题:</span>
        <input class="form-control col-xs-12" id="txtLink" type="text" v-model="model.title"/>
      </div>
      <h1 v-show="!isEdit" v-html="model.title" style="text-align:center; margin:40px 0"></h1>
      <div id="editorElem" v-show='isEdit'></div>
      <div v-show="!isEdit" v-html='model.content'>
      </div>
    </div>
    <footex></footex>
  </div>
</template>

<script>
import E from 'wangeditor'
function queryString(item){
  var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
  return svalue ? svalue[1] : svalue;
}

export default {
  name: 'app',
  data () {
    return {
      model:{
        id: 0,
        content: '',
        title:'',
      },
      isEdit : true
    }
  },
  computed:{
    ed : function() {
      return  new E('#editorElem');
    }
  },
  methods:{
    save: function() {
      var _this = this;
      if(_this.model.content == '') {
        return alert('content is empty');
      }

      if(_this.model.content == '') {
        return alert('title is empty');
      }

      $.post('/api/v1/blog', _this.model).then(doc => {
          if(!doc || doc.code !== 'success') 
            throw new Error(doc.message || 'res is empty');

          _this.isEdit = false;
          _this.model.id = doc.result.id;
        }).fail(err => {
          console.log(err.message);
        });
    },
    edit: function() {
      this.isEdit = true;
      this.ed.txt.html(this.model.content)
    }
  },
  mounted() {
      this.ed.customConfig.onchange = (html) => {
        this.model.content = html
      }

      this.ed.create()
      $('.w-e-text-container').attr('style', 'border:1px solid #ccc; border-top:none; height:auto; min-height:500px;z-index:10000;')
      $('.w-e-text').attr('style', 'width:100%; height:100%;overflow-y:hidden;')
      $('#topNav').css('zIndex',10002);

      var id = queryString('id');

      if(id) {
        this.isEdit = false;
        var _this = this;
        this.model.id = id;
        $.get('/api/v1/blog/'+ id).then(doc => {
          if(!doc || doc.code !== 'success') 
            throw new Error(doc.message || 'res is empty');

            _this.model.content = doc.result.content || '';
            _this.model.title = doc.result.title || 'title';
            _this.ed.txt.html(_this.ed.txt.html());
        }).fail(err => {
          console.log(err.message);
        });
      } else {
        this.isEdit = true;
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
