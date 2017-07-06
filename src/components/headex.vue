<template>
    <div class="navbar navbar-inverse navbar-fixed-top" id="topNav" role="navigation" style="z-index: 1;">
        <div class="container">
            <div class="navbar-header">
                <a class="navbar-brand" href="/" style="margin-top:-4px;"><i class="glyphicon glyphicon-home" style='margin-right:10px'></i>{{title}}</a>
            </div>
            <div class=" navbar-collapse">
                <ul class="nav navbar-nav" id="headNav">
                    <li>
                        <a href="/index.html" :class="isCurr('/index')">链接</a>
                   </li>
                   <li>
                        <a href="/catalog.html" :class="isCurr('/catalog')">博客</a>
                   </li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data : function() {
        return {
            title : '备忘录'
        };
    },
    methods: {
        isCurr:function(url) {
            if(url === '/index' && location.pathname === '/') return 'active';
            return location.pathname.indexOf(url) !== -1 ? 'active' :'' ;
        }
    }
}
</script>

<style scoped>

</style>