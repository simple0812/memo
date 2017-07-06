import Vue from 'vue'
Vue.directive('curr', {
  // 当绑定元素插入到 DOM 中。
  inserted: function (el) {
    var x = location.pathname.indexOf($(el).attr('href')) !== -1 ? 'active' :'' ;
    $(el).addClass(x);
  }
})
