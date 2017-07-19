import 'bootstrap'
import * as _ from 'lodash';

import Vue from 'vue'
import Headex from '../components/headex.vue';
import Footex from '../components/footex.vue';
import Pager from '../components/pager.vue';
import Uploader from '../components/file.upload.vue';

Vue.component('headex', Headex)
Vue.component('footex', Footex)
Vue.component('pager', Pager)
Vue.component('uploader', Uploader)

window.onload = function() {
  new Vue({
    el: '#app',
    data: {
      msg: '',
      model: {
        id:0,
        isChecked: false,
        description: '',
        link: ''
      },
      pageCondition: {
        pageSize:10,
        pageIndex:1,
        keyword:'',
        type:''
      },
      models:[],
      fileuploadProgress:0
    },
    components:[Headex, Footex],
    computed: {
      isSelectAll:function() {
        return this.models.length && _.every(this.models, 'isChecked');
      }
    },
    methods: {
      mouseover: function(md) {
        $('#hoverspan' + md.id).show();
      },
      mouseout: function(md) {
        $('#hoverspan' + md.id).hide();
      },
      show: function(evt) {
        if(evt.keyCode !== 13) return;
        this.search();
      },
      uploadProgress: function(progress) {
        this.fileuploadProgress = progress;
      },
      uploadDone: function(files) {
        setTimeout((function() {
          this.fileuploadProgress = 0;
        }).bind(this), 1000)
      },
      showMkDialog: function() {
        $('#Newfolder').modal('show');
        $('#Newfolder').on('shown.bs.modal', function (e) {
          $('#foldername').focus();
        })
      },
      showMvDialog: function(name, xinput) {
        var p = _.some(this.models, 'isChecked');
        $('#Movefile').modal('show');
      },

      searchByType: function(type) {
          this.pageCondition.type = type;
          this.search();
      },
      mkdir:function(modal) {
        var name = $('#foldername').val();
        if(name.trim() === '') return;
        var p = {
          name :name,
          pid: '',
          path:''
        };

        $.post('/api/v1/mkdir', p).then(doc => {
          if(!doc || doc.code !== 'success') 
              throw new Error(doc.message || 'res is empty');

          $(modal).modal('hide');
          doc.result.isChecked = false;
          this.search();
        }).fail(err => {
          $(modal).modal('hide');
          console.log(err.message);
        });
      },
      rename:function() {
      },
      mv:function() {

      },
      send:function() {
        $.post('/api/v1/memo', this.model).then(doc => {
          if(!doc || doc.code !== 'success') 
              throw new Error(doc.message || 'res is empty');

          $('#myModal').modal('hide');

          doc.result.isChecked = false;
          this.search();
        }).fail(err => {
          $('#myModal').modal('hide');
          console.log(err.message);
        });
      },
      remove: function( md) {
        if(!confirm('确定要删除吗')) return;
        $.ajax({
          url:'/api/v1/file',
          type: "DELETE",
          data: JSON.stringify([md.id]),
          dataType: "json",
          contentType: "application/json"
        }).then(doc => {
          if(!doc || doc.code !== 'success') 
            throw new Error(doc.message || 'res is empty');

          this.search();
        }).fail(err => {
          console.log(err.messaage);
        });
      },
      removeAll: function() {
        if(!confirm('确定要删除吗')) return;
        var x = _.chain(this.models).filter({isChecked: true}).map((each) => each.id).value();
        var _this = this;
        $.ajax({
          url:'/api/v1/file',
          type: "DELETE",
          data: JSON.stringify(x),
          dataType: "json",
          contentType: "application/json"
        }).then(doc => {
          if(!doc || doc.code !== 'success') 
            throw new Error(doc.message || 'res is empty');

          _this.search();
        }).fail(err => {
          console.log(err.messaage);
        });
      },
      search: function(md) {
        this.$refs.page.execPage();
      },
      select: function(evt) {
        var p = $(evt.target).prop('checked');
        this.models.forEach(each => {
          each.isChecked = p;
        });
      },
      onPage: function(docs) {
        this.models = docs;
      }
    },
    watch: {
    },
    mounted : function() {
      this.search();
    }
  });
}

