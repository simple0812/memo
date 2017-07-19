import 'bootstrap'
import * as _ from 'lodash';

import Vue from 'vue'
import Headex from '../components/headex.vue';
import Footex from '../components/footex.vue';
import Pager from '../components/pager';

Vue.component('headex', Headex)
Vue.component('footex', Footex)
Vue.component('pager', Pager)

window.onload = function() {
  new Vue({
    el: '#app',
    data: {
      msg: 'xxxx',
      model: {
        id:0,
        isChecked: false,
        description: '',
        link: ''
      },
      pageCondition: {
        pageSize:10,
        pageIndex:1,
        keyword:''
      },
      models:[]
    },
    components:[Headex, Footex],
    computed: {
      isSelectAll:function() {
        return this.models.length && _.every(this.models, 'isChecked');
      }
    },
    methods: {
      navigate: function(id) {
        location.href = '/blog.html?id=' + id;
      },
      show: function(evt) {
        if(evt.keyCode !== 13) return;
        this.search();
      },
      remove: function(index, md) {
        if(!confirm('确定要删除吗')) return;
        $.ajax({
          url:'/api/v1/blog',
          type: "DELETE",
          data: JSON.stringify([md.id]),
          dataType: "json",
          contentType: "application/json"
        }).then(doc => {
          if(!doc || doc.code !== 'success') 
              throw new Error(doc.message || 'res is empty');

          this.models.splice(index, 1);
        }).fail(err => {
          console.log(err.messaage);
        });
      },
      removeAll: function() {
        if(!confirm('确定要删除吗')) return;
        console.log(_)
        var x = _.chain(this.models).filter({isChecked: true}).map( (each) => each.id).value();
        var _this = this;
        $.ajax({
          url:'/api/v1/blog',
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

