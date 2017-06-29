String.format = function() {
    if (arguments.length == 0)
        return null;

    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }

    return str;
}


function pagerDelegate(obj, method, mode) {
    var delegate = function () {
        var args = [];
        args.push(mode);
        method.apply(obj, args);
    };

    return delegate;
}

function Pager(pageSize, recordCount, pageindex, _condition, callBack) {
    this.pageSize = pageSize;
    this.recordcount = recordCount;
    this.pageIndex = pageindex;
    this.temppage = this.pageIndex;
    this.callback = callBack;
    this.condition = _condition;

    this.interval = 3;
    this.absdiff = (this.interval - 1) / 2;

    this.pagecount = Math.ceil(this.recordcount / this.pageSize);
    if (this.pageIndex > this.pagecount)
        this.pageIndex = this.pagecount;

    this.create = function () {
        return function () {
            this.renderHtml.apply(this, arguments);
        }
    }


    if (this.pagecount == 0)
        this.pagecount = 1;

    if (this.pageIndex == 0)
        this.pageIndex = 1;

    this.flag = false;
    var aaaa = this;

    this.pref = (arguments.length > 5) ? arguments[5] : "";

    if (typeof ($(window).hashchange) != "undefined") {
        $(window).hashchange(function () {
            var hashPage = location.hash.substr(location.hash.indexOf("page") + 4);

            if (hashPage.length <= 0)
                hashPage = 1;

            var tt = pagerDelegate(aaaa, callBack, { "mode": "nums", "val": parseInt(hashPage) });

            if (aaaa.flag != true && (("#" + aaaa.pref + "page" + hashPage == location.hash) || (hashPage == 1 && location.hash == "#"))) {
                tt();
            }


            aaaa.flag = false;
        });
    }
}

Pager.prototype.getDefaultIndex = function () {
    var hashPage = location.hash.substr(location.hash.indexOf("page") + 4);
    if (hashPage.length <= 0)
        return 1;
    else
        return parseInt(hashPage);
}

Pager.prototype.renderHtml = function () {
    var _container = arguments[0];
    _container.innerHTML = "";
    _container.appendChild(document.createTextNode(String.format("共{0}条数据 {1} / {2}页 ",
        this.recordcount, this.pageIndex, this.pagecount)));

    // 第一页
    var firstA = document.createElement("A");

    firstA.appendChild(document.createTextNode("首页"));
    firstA.setAttribute("href", "javascript:void(0)");
    firstA.onclick = pagerDelegate(this, this.callback, { "mode": "first" });

    _container.appendChild(firstA);
    _container.appendChild(document.createTextNode(" "));

    // 上一页
    var previousA = document.createElement("A");

    previousA.appendChild(document.createTextNode("上一页"));
    previousA.setAttribute("href", "javascript:void(0)");
    previousA.onclick = pagerDelegate(this, this.callback, { "mode": "previous" });

    _container.appendChild(previousA);
    _container.appendChild(document.createTextNode(" "));

    // 下一页
    var nextA = document.createElement("A");

    nextA.appendChild(document.createTextNode("下一页"));
    nextA.setAttribute("href", "javascript:void(0)");
    nextA.onclick = pagerDelegate(this, this.callback, { "mode": "next" });

    _container.appendChild(nextA);
    _container.appendChild(document.createTextNode(" "));

    // 末页
    var lastA = document.createElement("A");

    lastA.appendChild(document.createTextNode("末页"));
    lastA.setAttribute("href", "javascript:void(0)");
    lastA.onclick = pagerDelegate(this, this.callback, { "mode": "last" });

    _container.appendChild(lastA);
    _container.appendChild(document.createTextNode(" "));

}

Pager.prototype.renderNumberStyleHtml = function () {
    var _container = arguments[0];
    _container.innerHTML = "";

    var _containerUl = $("<ul></ul>").get(0)
    $(_containerUl).addClass("pagination");


    var _liele = $("<li></li>").get(0)
    var _spanele = $("<span></span>").get(0)

    $(_spanele).addClass("pageinfo");
    _liele.appendChild(_spanele);


    var allStrong1 = $("<strong></strong>").get(0);
    var allStrong2 = $("<strong></strong>").get(0);

    allStrong1.appendChild(document.createTextNode(String.format(" {2} ",
        this.recordcount, this.pageIndex, this.pagecount)));
    allStrong2.appendChild(document.createTextNode(String.format(" {0} ",
        this.recordcount, this.pageIndex, this.pagecount)));
    _spanele.appendChild(document.createTextNode("共"));
    _spanele.appendChild(allStrong1);
    _spanele.appendChild(document.createTextNode("页"));
    _spanele.appendChild(allStrong2);
    _spanele.appendChild(document.createTextNode("条"));

    _containerUl.appendChild(_liele);


    // 第一页
    var firstLi = $("<li></li>").get(0)
    var firstA = $("<a></a>").get(0)


    firstA.appendChild(document.createTextNode("首页"));
    firstA.setAttribute("href", "javascript:void(0)");
    firstA.onclick = pagerDelegate(this, this.callback, { "mode": "first" });
    firstLi.appendChild(firstA);

    _containerUl.appendChild(firstLi);
    _containerUl.appendChild(document.createTextNode(" "));

    // 上一页
    var previousLi = $("<li></li>").get(0);
    var previousA = $("<a></a>").get(0)

    previousA.appendChild(document.createTextNode(" 上一页 "));
    previousA.setAttribute("href", "javascript:void(0)");
    previousA.onclick = pagerDelegate(this, this.callback, { "mode": "previous" });
    previousLi.appendChild(previousA);

    _containerUl.appendChild(previousLi);
    _containerUl.appendChild(document.createTextNode(" "));

    // 此处开始渲染中间页码串
    if (this.pageIndex + this.absdiff > this.interval && this.pageIndex + this.absdiff <= this.pagecount)
        this.generateNumsText(this.pageIndex - this.absdiff, this.pageIndex + this.absdiff, _containerUl);
    else if (this.pageIndex + this.absdiff <= this.interval)
        this.generateNumsText(1, this.interval, _containerUl);
    else if (this.pageIndex + this.absdiff > this.pagecount)
        this.generateNumsText(this.pagecount - this.interval + 1, this.pagecount, _containerUl);

    // 下一页
    var nextLi = $("<li></li>").get(0);
    var nextA = $("<a></a>").get(0)

    nextA.appendChild(document.createTextNode(" 下一页 "));
    nextA.setAttribute("href", "javascript:void(0)");
    nextA.onclick = pagerDelegate(this, this.callback, { "mode": "next" });

    nextLi.appendChild(nextA);
    _containerUl.appendChild(nextLi);
    _containerUl.appendChild(document.createTextNode(" "));

    // 末页
    var lastLi = $("<li></li>").get(0);
    var lastA = $("<a></a>").get(0)


    lastA.appendChild(document.createTextNode("末页"));
    lastA.setAttribute("href", "javascript:void(0)");
    lastA.onclick = pagerDelegate(this, this.callback, { "mode": "last" });

    lastLi.appendChild(lastA);
    _containerUl.appendChild(lastLi);
    _containerUl.appendChild(document.createTextNode(" "));

    // 页码输入框
    var txtLi = $("<li></li>").get(0);
    var txtSpan = $("<span></span>").get(0)

    $(txtSpan).addClass("pageinput");
    txtLi.appendChild(txtSpan);
    var txtGo = $("<INPUT />").get(0)

    $(txtGo).addClass("pagetxt")
    txtGo.setAttribute("type", "text");
    txtGo.setAttribute("name", "gopage");
    txtGo.setAttribute("id", "gopage");
    txtGo.setAttribute("size", "2");
    txtGo.setAttribute("value", this.pageIndex);
    txtGo.onchange = pagerDelegate(this, this.handleTextChanged, { "objRef": txtGo });

    txtSpan.appendChild(txtGo);

    // Go按钮
    var btnGo = $("<a></a>").get(0)
    btnGo.setAttribute("href", "javascript:void(0)");
    btnGo.appendChild(document.createTextNode(" GO "));

    btnGo.onclick = pagerDelegate(this, this.callback, { "mode": "inputnums" });
    txtSpan.appendChild(btnGo);
    _containerUl.appendChild(txtLi);
    _containerUl.appendChild(document.createTextNode(""));


    _container.appendChild(_containerUl);
}

Pager.prototype.renderSimpleNumberStyleHtml = function () {
    var _container = arguments[0];
    _container.innerHTML = "";

    var _containerUl = document.createElement("<span>");

    // 此处开始渲染中间页码串
    if (this.pageIndex + this.absdiff > this.interval && this.pageIndex + this.absdiff <= this.pagecount)
        this.generateNumsText_1(this.pageIndex - this.absdiff, this.pageIndex + this.absdiff, _containerUl);
    else if (this.pageIndex + this.absdiff <= this.interval)
        this.generateNumsText_1(1, this.interval, _containerUl);
    else if (this.pageIndex + this.absdiff > this.pagecount)
        this.generateNumsText_1(this.pagecount - this.interval + 1, this.pagecount, _containerUl);

    // 上一页

    var previousA = document.createElement("A");

    previousA.appendChild(document.createTextNode(" 上一页 "));
    previousA.setAttribute("href", "javascript:void(0)");
    previousA.setAttribute("className", "wy_pr_bn");
    previousA.onclick = pagerDelegate(this, this.callback, { "mode": "previous" });


    _containerUl.appendChild(previousA);
    _containerUl.appendChild(document.createTextNode(" "));
    // 下一页

    var nextA = document.createElement("A");

    nextA.appendChild(document.createTextNode(" 下一页 "));
    nextA.setAttribute("href", "javascript:void(0)");
    nextA.setAttribute("className", "wy_next_bn");
    nextA.onclick = pagerDelegate(this, this.callback, { "mode": "next" });

    _containerUl.appendChild(nextA);
    _containerUl.appendChild(document.createTextNode(" "));


    var _containerSpan = document.createElement("<span>");
    _containerSpan.setAttribute("className", "span_wy01");


    _containerSpan.appendChild(document.createTextNode(String.format("共{2}页 ",
        this.recordcount, this.pageIndex, this.pagecount)));

    _container.appendChild(_containerSpan);
    _container.appendChild(_containerUl);
}

Pager.prototype.moveIndicator = function () {
    if (arguments.length != 1 || arguments[0] == null || arguments[0].mode == null)
        return;

    switch (arguments[0].mode) {
        case "first":
            this.pageIndex = 1;

            break;
        case "previous":
            this.pageIndex -= 1;

            if (this.pageIndex < 1)
                this.pageIndex = 1;

            break;
        case "next":
            this.pageIndex += 1;

            if (this.pageIndex > this.pagecount)
                this.pageIndex = this.pagecount;

            break;
        case "last":
            this.pageIndex = this.pagecount;

            break;
        case "nums":
            this.pageIndex = arguments[0].val;

            break;
        case "inputnums":
            this.pageIndex = this.temppage;

            break;
    }

    if (this.condition && this.condition.pageIndex) {
        this.flag = true;

        this.condition.pageIndex = this.pageIndex;

        var pageHash = "#" + this.pref + "page" + this.pageIndex.toString();

        window.navigator.userAgent.toLowerCase().indexOf('msie') > -1 ? $.locationHash(pageHash) : location.hash = pageHash;
    }
}

Pager.prototype.setRecordCount = function () {
    this.recordcount = arguments[0];

    this.pagecount = Math.ceil(this.recordcount / this.pageSize);
    if (this.pageIndex > this.pagecount)
        this.pageIndex = this.pagecount;

    if (this.pagecount == 0)
        this.pagecount = 1;

    if (this.pageIndex == 0)
        this.pageIndex = 1;
}

Pager.prototype.setInterval = function () {
    this.interval = arguments[0];
    this.absdiff = (this.interval - 1) / 2;
}

Pager.prototype.generateNumsText = function () {
    var _container = arguments[2];
    if (arguments[0] < 1)
        arguments[0] = 1;
    if (arguments[1] > this.pagecount)
        arguments[1] = this.pagecount;

    for (var i = arguments[0]; i <= arguments[1]; i++) {

        var numsLi = $("<li></li>").get(0);
        var numsA = $("<a></a>").get(0);

        if (i == this.pageIndex) {
            $(numsLi).addClass("thisclass");
            numsA.appendChild(document.createTextNode(String.format(" {0} ", i)));
        }
        else
            numsA.appendChild(document.createTextNode(i.toString()));

        numsA.setAttribute("href", "javascript:void(0)");
        numsA.onclick = pagerDelegate(this, this.callback, { "mode": "nums", "val": i });

        numsLi.appendChild(numsA);
        _container.appendChild(numsLi);
        _container.appendChild(document.createTextNode(" "));
    }
}

Pager.prototype.generateNumsText_1 = function () {
    var _container = arguments[2];
    if (arguments[0] < 1)
        arguments[0] = 1;
    if (arguments[1] > this.pagecount)
        arguments[1] = this.pagecount;

    for (var i = arguments[0]; i <= arguments[1]; i++) {

        var numsA = $("<a></a>").get(0);
        if (i == this.pageIndex) {
            $(numsA).addClass("seleced");

            numsA.appendChild(document.createTextNode(String.format(" {0} ", i)));
        }
        else
            numsA.appendChild(document.createTextNode(i.toString()));

        numsA.setAttribute("href", "javascript:void(0)");
        numsA.onclick = pagerDelegate(this, this.callback, { "mode": "nums", "val": i });

        _container.appendChild(numsA);
        _container.appendChild(document.createTextNode(" "));
    }
}

Pager.prototype.handleTextChanged = function () {
    this.temppage = arguments[0].objRef.value;
}


if ( typeof define === "function" && define.amd ) {
    define(['hashChange'], function () { return Pager; } );
}



