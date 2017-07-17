<template>
  <div style="margin-top:50px;" class="container fixed-width">
    <div class="input-group" style="margin:20px 0;"  v-show="isEdit" >
      <span class="input-group-addon addon-width-4 " style="">标题:</span>
      <input class="form-control" style="width:290px;" id="txtLink" type="text" v-model="model.title"/>
    </div>
    <h1 v-show="!isEdit" v-html="model.title" style="text-align:center;"></h1>
    <div id="editorElem" v-show='isEdit'></div>
    <div v-show="!isEdit" v-html='model.content'>
    </div>
  </div>
</template>

<script>
  import E from 'wangeditor'
  function queryString(item){
    var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
    return svalue ? svalue[1] : svalue;
  }

  export default {
    name: 'editor',
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
    methods: {
      save: function () {
        
      },
      edit: function () {
        this.isEdit = true;
        this.ed.txt.html(this.model.content)
      }
    },
    mounted() {
      this.ed.customConfig.onchange = (html) => {
        console.log('abc')
        this.model.content = html
      }

      this.ed.create()
      // ed.txt.html('<h1>请输入标题</h1>');
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

<style scoped>
</style>