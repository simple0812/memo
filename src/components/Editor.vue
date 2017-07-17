<template>
  <div >
    <div id="editorElem"></div>
  </div>
</template>

<script>
  import E from 'wangeditor'

  export default {
    name: 'editor',
    data () {
      return {
        editorContent: ''
      }
    },
    methods: {
      save: function () {
          alert(this.editorContent)
      }

    },
    mounted() {
      var editor = new E('#editorElem')
      console.log(editor)
      editor.customConfig.onchange = (html) => {
        this.editorContent = html
      }

      editor.create()
      
      $('.w-e-text-container').attr('style', 'border:1px solid #ccc; border-top:none; height:auto; min-height:500px;z-index:10000;')
      $('.w-e-text').attr('style', 'width:100%; height:100%;overflow-y:hidden;')
      $('#topNav').css('zIndex',10002);
    }
  }
</script>

<style scoped>
</style>