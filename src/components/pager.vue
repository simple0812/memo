<template>
  <div class="page_y" id="pager"></div>
</template>

<script>
export default {
  computed: {
    condition: function() {
      var kw = this.keyword || '';
      return {
        pageSize:10,
        pageIndex:1,
        keyword: kw
      };
    },
    pager: function() {
      return new Pager(this.condition.pageSize, 0, 1, this.condition, this.execPage, -1);
    }
  },
  methods:{
    execPage: function() {
      var _this = this;
      _this.pager.moveIndicator(arguments[0]); 

      $.getJSON('/api/v1/memo/page', _this.condition).then(ret => {
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
  props:["keyword"],
  mounted: function() {
    this.pager.moveIndicator(arguments[0]);
  }
}
</script>

<style scoped>

</style>