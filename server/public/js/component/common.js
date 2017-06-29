Vue.component('headex', {
  template: `
        <div class="navbar navbar-inverse navbar-fixed-top" id="topNav" role="navigation" style="z-index: 1;">
            <div class="container">
                <div class="navbar-header">
                    <a class="navbar-brand" href="/" style="margin-top:-4px;"><i class="glyphicon glyphicon-home" style='margin-right:10px'></i>{{title}}</a>
                </div>
                <div class=" navbar-collapse">
                    <ul class="nav navbar-nav" id="headNav">
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                    </ul>
                </div>
            </div>
        </div>
    `,
    data: function() {
        return {
            title : '备忘录'
        };
    }
});

Vue.component('footex', {
  template: `
        <div class="navbar navbar-default  input-group-addon-format navbar-fixed-bottom" role="navigation" style="z-index: 2">
            <div class="container fixed-width" style="line-height: 50px; vertical-align: middle;">
                <a class="center-block text-center" id="loginNav" href="#">{{title}}</a>
            </div>
        </div>
    `,
    data: function() {
        return {
            title : 'simple0812@sina.cn'
        };
    }
})

