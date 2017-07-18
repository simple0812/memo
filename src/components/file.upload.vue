<template>
  <span class="btn btn-primary fileinput-button">
    <i class="glyphicon glyphicon-upload"></i><span> 上传文件</span>
    <input id="fileupload" type="file" name="files" multiple="multiple" style="width: 90px; height: 30px; display: block;" />
  </span>
</template>

<script>
export default {
  data : function() {
    return {
      title : 'simple0812@sina.cn'
    };
  },
  props:['url', 'path', 'pid'],
  mounted : function() {
    var _this = this;
    var url = this.url ||  `/api/v1/upload?path=${this.path || ''}&pid=${this.pid || ''}`;

    $('#fileupload').fileupload({
      url: url,
      dataType: 'json',
      add: function (e, data) {
        data.submit();
      },
      done: function (e, data) {
        if(!data.result) return alert('未知的错误');
        if(data.result.status == 'fail') return alert(data.result.result);

        _this.$emit('done', data.result.result);
      },
      progressall: function (e, data) {
          var progress = parseInt(data.loaded / data.total * 100, 10);
          console.log('progress', progress)
          _this.$emit('progress', progress);
      }
    }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
  }
}
</script>

<style scoped>

</style>