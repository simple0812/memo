<template>
  <div class="page_y" id="pager"></div>
</template>
<script>
import * as _ from 'lodash';
export default {
  computed: {
    xcondition: function() {
      var p =  {
        pageSize:10,
        pageIndex:1
      };

      return _.extend(p, this.condition);
    },
    pager: function() {
      return new Pager(this.xcondition.pageSize, 0, 1, this.xcondition, this.execPage, -1);
    }
  },
  methods:{
    execPage: function() {
      console.log('execPage')
      var _this = this;
      _this.pager.moveIndicator(arguments[0]); 

      $.getJSON(_this.url, _this.xcondition).then(ret => {
        if(!ret || ret.code!='success') {
          throw new Error(ret.message);
        }

        _this.pager.setRecordCount(ret.total || 0);
        _this.pager.renderNumberStyleHtml($('#pager').get(0));

        var t =ret.result.map(item => {
          item.isChecked = false;
          return item;
        });
        this.$emit('page', t);
      }).fail(err => {
        console.log(err.message);
      });
    },
    rendex: function(ret) {
      this.pager.setRecordCount(ret.total || 0);
      this.pager.renderNumberStyleHtml($('#pager').get(0));
    }
  },
  props:["condition", 'url'],
  mounted: function() {
    console.log('xxxx')
    this.pager.moveIndicator(arguments[0]);
  }
}
</script>

<style scoped>

</style>