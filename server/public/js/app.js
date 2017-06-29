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
    computed: {
        isSelectAll:function() {
            return this.models.length && _.every(this.models, 'isChecked');
        }
    },
    methods: {
        create:function() {
            $.post('/api/v1/memo', this.model).then(doc => {
                if(!doc || doc.code !== 'success') 
                    throw new Error(doc.message || 'res is empty');

                if($('#myModal').data('action') !== 'update') {
                    doc.result.isChecked = false;
                    this.search();
                }

                $('#myModal').modal('hide');
                $('#myModal').data('action', '');
                this.model = {
                    id:null,
                    isChecked: false,
                    description: '',
                    link: ''
                };
            }).fail(err => {
                $('#myModal').modal('hide');
                $('#myModal').data('action', '');
                this.model = {
                    id:null,
                    isChecked: false,
                    description: '',
                    link: ''
                };
                console.log(err.message);
            });
        },
        remove: function(index, md) {
            if(!confirm('确定要删除吗')) return;
            $.ajax({
                url:'/api/v1/memo',
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
            var x = _.chain(this.models).where({isChecked: true}).pluck('id').value();
            var _this = this;
            $.ajax({
                url:'/api/v1/memo',
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
        update: function(md) {
            this.model = md;
            this.model.isChecked =false;
            $('#myModal').data('action', 'update');
            $('#myModal').modal('show');
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
