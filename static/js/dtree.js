/*--------------------------------------------------|
| dTree 2.05 | www.destroydrop.com/javascript/tree/ |
|---------------------------------------------------|
| Copyright (c) 2009-2010 Geir Landr?              |
|                                                   |
| This script can be used freely as long as all     |
| copyright messages are intact.                    |
|                                                   |
| Updated: 20.07.2009                               |
|--------------------------------------------------*/


//==================================================
// john 2017-06-30
//==================================================
//修改历史：
//1  将dtree修改成可以选择的权限树，
//   将name转变成<input type='checkbox'>
//
//==================================================
//节点对象  -- Node object
function Node(id, pid, cname, cvalue, cshow, cchecked, cdisabled, url, title, target, icon, iconOpen, open) {
    this.id = id;                        // int 每个节点都有唯一ID，增加节点时需要手工定义一个ID。 
    this.pid = pid;                      // int 父节点ID，根节点的父节点是-1。 
    this.cname = cname;                  // chechbox的名称    
    this.cvalue = cvalue;                // chechbox的值    
    this.cshow = cshow;                  // chechbox的显示    
    this.cchecked = cchecked || false;   // chechbox是否被选中，默认是不选   
    this.cdisabled = cdisabled || false; // chechbox是否可用，默认是可用    
    this.url = url || '#';               // 节点链接，默认是虚链接  String 节点URL（鼠标点击跳转地址） 
    this.title = title;                  // 鼠标移动到节点上显示的文字 
    this.target = target;                // String 页面跳转所在的frame 
    this.icon = icon;                    // String 节点关闭时显示的图标地址 
    this.iconOpen = iconOpen;            // String 节点打开时显示的图标地址 
    this._io = open || false;            // boolean 节点是否已打开，默认值false。 
    this._is = false;                    // boolean 节点是否已打开，默认值false。 
    this._ls = false;                    // boolean 是否是最后一个节点，默认值false。  
    this._hc = false;                    // boolean 是否有子节点，默认值false。 
    this._ai = 0;                        // int 在树的节点数组中的下标(位置)，默认值0。 
    this._p;                             // Node 父节点对象，默认值null。 
};

//树对象 Tree object
function dTree(objName, objbool) {        // void 构造方法，创建树对象。objName: 树名称。objbool：单选多选 true多选  false单选  默认单选         
    this.config = {
        target: null,            // 设置所有节点的target，默认null 
        folderLinks: false,      // 目录节点是否可以有链接,默认true 
        useSelection: false,     // 节点是否可以被选择(高亮),默认true
        useCookies: false,       // 设置使用cookies保存树的状态,默认true 
        useLines: true,          // 是否显示路径点线,默认true 
        useIcons: false,         // 是否显示图标,默认true 
        useStatusText: true,     // 是否在状态栏输出节点文字（替换原来的url显示）,默认false
        closeSameLevel: false,   // 是否自动关闭兄弟节点（当打开本节点时）,注意设置true时，openAll()和closeAll()不能工作，默认false 
        inOrder: false           // 如果父节点总是在子节点之前加入树，设置true有更好的效率，默认false 
    }
    this.icon = {
        root:        'img/base.gif',         // Node 根节点。 
        folder:      'img/folder.gif',       // Node 根节点。 
        folderOpen:  'img/folderopen.gif',   // 打开的文件夹,默认'img/folderOpen.gif' 
        node:        'img/page.gif',         // 打开的文件夹,默认'img/folderOpen.gif' 
        empty:       'img/empty.gif',        // 打开的文件夹,默认'img/folderOpen.gif' 
        line:        'img/line.gif',         // 竖线,默认'img/line.gif'
        join:        'img/join.gif',         // 丁线,默认'img/join.gif' 
        joinBottom:  'img/joinbottom.gif',   // 直角线,默认'img/joinbottom.gif' 
        plus:        'img/plus.gif',         // 加号丁线,默认'img/plus.gif' 
        plusBottom:  'img/plusbottom.gif',   // 加号直角线,默认'img/plusbottom.gif' 
        minus:       'img/minus.gif',        // 减号丁线,默认'img/minus.gif' 
        minusBottom: 'img/minusbottom.gif',  // 减号直角线,默认'img/minusbottom.gif'  
        nlPlus:      'img/nolines_plus.gif', // 减号直角线,默认'img/minusbottom.gif' 
        nlMinus:     'img/nolines_minus.gif' //无线减号,默认'img/nolines_minus.gif' 
    };
    this.obj = objName;          // String 树的名称，在创建树时定义。 
    this.aNodes = [];            // Node[] 树中的节点数组。 
    this.aIndent = [];           // [] 数组。
    this.root = new Node(-1);    // 根节点。 
    this.selectedNode = null;    // 当前选择的节点。
    this.selectedFound = false;  // 是否有选中节点，默认false。 
    this.completed = false;      // 树构建html是否已完成完成，默认false。
    this.RadioRocheckbox = objbool |false ;//单选多选
};

//添加一个新节点到节点数组中   --Adds a new node to the node array
dTree.prototype.add = function (id, pid, cname, cvalue, cshow, cchecked, cdisabled, url, title, target, icon, iconOpen, open) {
    this.aNodes[this.aNodes.length] = new Node(id, pid, cname, cvalue, cshow, cchecked, cdisabled, url, title, target, icon, iconOpen, open);
};

//打开/关闭所有节点   Open/close all nodes
dTree.prototype.openAll = function () {
    this.oAll(false);
};
dTree.prototype.closeAll = function () {
    this.oAll(true);
};

//树输出到页面中  -- Outputs the tree to the page
dTree.prototype.toString = function () {
    var str = '<div class="dtree_Tree">\n';
    if (document.getElementById) {
        if (this.config.useCookies) this.selectedNode = this.getSelected();
        str += this.addNode(this.root);
    } else str += 'Browser not supported.';
    str += '</div>';
    if (!this.selectedFound) this.selectedNode = null;
    this.completed = true;
    return str;
};

//创建树形结构  -- Creates the tree structure
dTree.prototype.addNode = function (pNode) {
    var str = '';
    var n = 0;
    if (this.config.inOrder) n = pNode._ai;
    for (n; n < this.aNodes.length; n++) {
        if (this.aNodes[n].pid == pNode.id) {
            var cn = this.aNodes[n];
            cn._p = pNode;
            cn._ai = n;
            this.setCS(cn);
            if (!cn.target && this.config.target) cn.target = this.config.target;
            if (cn._hc && !cn._io && this.config.useCookies) cn._io = this.isOpen(cn.id);
            if (!this.config.folderLinks && cn._hc) cn.url = null;
            if (this.config.useSelection && cn.id == this.selectedNode && !this.selectedFound) {
                cn._is = true;
                this.selectedNode = n;
                this.selectedFound = true;
            }
            str += this.node(cn, n);
            if (cn._ls) break;
        }
    }
    return str;
};



//创建节点图标,url和文本  --Creates the node icon, url and text
dTree.prototype.node = function (node, nodeId) {
    var str = "";
    if (node.pid == -1) {
        str += '<div class="dTreeNode rootNode">' + this.indent(node, nodeId);
    }
    else {
        str += '<div class="dTreeNode">' + this.indent(node, nodeId);
    }
    if (this.config.useIcons) {
        if (!node.icon) node.icon = (this.root.id == node.pid) ? this.icon.root : ((node._hc) ? this.icon.folder : this.icon.node);
        if (!node.iconOpen) node.iconOpen = (node._hc) ? this.icon.folderOpen : this.icon.node;
        if (this.root.id == node.pid) {
            node.icon = this.icon.root;
            node.iconOpen = this.icon.root;
        }
        str += '<img id="i' + this.obj + nodeId + '" src="' + ((node._io) ? node.iconOpen : node.icon) + '" alt="" />';
    }
    if (node.url) {
        str += '<a id="s' + this.obj + nodeId + '" class="' + ((this.config.useSelection) ? ((node._is ? 'nodeSel' : 'node')) : 'node') + '" href="' + node.url + '"';
        if (node.title) str += ' title="' + node.title + '"';
        if (node.target) str += ' target="' + node.target + '"';
        if (this.config.useStatusText) str += ' onmouseover="window.status=\'' + node.cname + '\';return true;" onmouseout="window.status=\'\';return true;" ';
        if (this.config.useSelection && ((node._hc && this.config.folderLinks) || !node._hc))
            str += ' onclick="javascript: ' + this.obj + '.s(' + nodeId + ');"';
        str += '>';
    }
    else if ((!this.config.folderLinks || !node.url) && node._hc && node.pid != this.root.id)
        str += '<a href="javascript: ' + this.obj + '.o(' + nodeId + ');" class="node">';

    //===============================================
    //2009-07-11 将原链接的节点修改为 checkbox
    //===============================================
    //str += node.name;

    if (node.pid == this.root.id) {
        if (node.pid == -1) {
            str += "<a>";
        }
        str += node.cname;
    } else {
        var checkboxSyntax = "";
        //是否可用
        if (node.cchecked) {
            checkboxSyntax = "<span class='dtree_node' node_id='" + node.id + "'>" + node.cshow + "</span>";
        }
        else {            
            /**组装checkbox开始*/            
            if (this.RadioRocheckbox) {
                checkboxSyntax = "<input type='checkbox' desc='" + node.cshow + "' name='" + node.cname + "' id='" + node.cname + "_" + node.id + "' cshow='" + node.cshow + "'  value='" + node.cvalue + "' onClick='javascript: " + this.obj + ".checkNode(" + node.id + "," + node.pid + "," + node._hc + ",this.checked);' ";
            }
            else {
                checkboxSyntax = "<input type='radio' desc='" + node.cshow + "' name='" + node.cname + "' id='" + node.cname + "_" + node.id + "' cshow='" + node.cshow + "' value='" + node.cvalue + "' onClick='javascript: " + this.obj + ".checkNode(" + node.id + "," + node.pid + "," + node._hc + ",this.checked);' ";
            }
            if (node.cchecked)
                checkboxSyntax += " checked ";

            if (node.cdisabled)
                checkboxSyntax += " disabled ";

            checkboxSyntax += ">" + "<span class='dtree_node' node_id='" + node.id + "'>" + node.cshow + "</span>";
            /**组装checkbox结束*/
        }
        str += checkboxSyntax;
    }

    if (node.url || ((!this.config.folderLinks || !node.url) && node._hc)) str += '</a>';
    str += '</div>';
    if (node._hc) {
        str += '<div id="d' + this.obj + nodeId + '" class="clip" style="display:' + ((this.root.id == node.pid || node._io) ? 'block' : 'none') + ';">';
        str += this.addNode(node);
        str += '</div>';
    }
    this.aIndent.pop();
    return str;
};

//添加空和行图标  -- Adds the empty and line icons
dTree.prototype.indent = function (node, nodeId) {
    var str = '';
    if (this.root.id != node.pid) {
        for (var n = 0; n < this.aIndent.length; n++)
            str += '<img src="' + ((this.aIndent[n] == 1 && this.config.useLines) ? this.icon.line : this.icon.empty) + '" alt="" />';
        (node._ls) ? this.aIndent.push(0) : this.aIndent.push(1);
        if (node._hc) {
            str += '<a href="javascript: ' + this.obj + '.o(' + nodeId + ');"><img id="j' + this.obj + nodeId + '" src="';
            if (!this.config.useLines) str += (node._io) ? this.icon.nlMinus : this.icon.nlPlus;
            else str += ((node._io) ? ((node._ls && this.config.useLines) ? this.icon.minusBottom : this.icon.minus) : ((node._ls && this.config.useLines) ? this.icon.plusBottom : this.icon.plus));
            str += '" alt="" /></a>';
        } else str += '<img src="' + ((this.config.useLines) ? ((node._ls) ? this.icon.joinBottom : this.icon.join) : this.icon.empty) + '" alt="" />';
    }
    return str;
};

//检查是否有任何一个节点的孩子如果是最后一个兄弟姐妹  -- Checks if a node has any children and if it is the last sibling
dTree.prototype.setCS = function (node) {
    var lastId;
    for (var n = 0; n < this.aNodes.length; n++) {
        if (this.aNodes[n].pid == node.id) node._hc = true;
        if (this.aNodes[n].pid == node.pid) lastId = this.aNodes[n].id;
    }
    if (lastId == node.id) node._ls = true;
};

//返回选中的节点  -- Returns the selected node
dTree.prototype.getSelected = function () {
    var sn = this.getCookie('cs' + this.obj);
    return (sn) ? sn : null;
};

//===============================
// john 2017-06-30
//
//作用：移除结果中选择的值，并且移除树形中选中的值
//参数：obj obj对象
//      event event对象
//===============================
dTree.prototype.doRemove = function (obj, event) {    
    var width = $(obj).width();
    var left = $(obj).position().left;
    var e = event || window.event;
    var x = IsIE(GetVersion()) ? e.x : e.pageX;
    if (x > left + width - 9) {
        $(obj).parent().remove();
        var userid = $(obj).parent().attr("uid");
        var type = $(obj).parent().attr("mytype");
        if (this.RadioRocheckbox) {
            var $chk = $('.dtree_Tree a input[type="checkbox"][value="' + userid + '"]');
            if ($chk.length > 0) {
                $chk.attr('checked', false);
            }
        }
        else {
            var $chk = $('.dtree_Tree a input[type="radio"][value="' + userid + '"]');
            if ($chk.length > 0) {
                $chk.attr('checked', false);
            }
        }
    }
}


//===============================
// john 2017-06-30
//
//作用：选中节点对象
//参数：nobj node对象
//      cobj checkbox对象
//===============================
dTree.prototype.checkNode = function (id, pid, _hc, checked) {
    ////1、递归选父节点对象（无论是叶节点还是中间节点）
    ////判断同级中有无被选中的，如果有选中的就不可以反选
    //if (!this.isHaveBNode(id, pid)) {
    //    if (checked) {
    //        //选中就一直选到根节点
    //        this.checkPNodeRecursion(pid, checked);
    //    } else {
    //        //去掉选中仅将其父节点去掉选中
    //        this.checkPNode(pid, checked);
    //    }
    //}

    ////2、如果是中间结点，具有儿子，递归选子节点对象		
    //if (_hc)
    //    this.checkSNodeRecursion(id, checked);
    var count = 0;
    var obj = document.all.authority;

    for (i = 0; i < obj.length; i++) {        
        if (obj[i].checked) {            
            if (!this.RadioRocheckbox) {
                $("#ulSelected").empty();
            }            
            if ($("#ulSelected #user_" + obj[i].value + "").length>0) {               
            }
            else {
                var strU = '<li id="user_' + obj[i].value + '"  uid="' + obj[i].value + '" name="' + obj[i].getAttribute("cshow") + '" mytype="2"> <div class="selectedUser" onmouseover="showRemove(this)" onmouseout="hideRemove(this)" onmousemove="setRemove(this,event)" onclick="javascript: ' + this.obj + '.doRemove(this,event);" style="cursor: pointer;">' + obj[i].getAttribute("cshow") + ' </div></li>';
                $("#ulSelected").append(strU);
                count++;
            }
        }
        else {
            $("#ulSelected #user_" + obj[i].value + "").remove();
        }
    }
}

//===============================
// john 2017-06-30
//
//作用：判断同级中有无被选中的
//参数：id 节点id
//      pid 节点的父节点id
//===============================
dTree.prototype.isHaveBNode = function (id, pid) {
    var isChecked = false
    for (var n = 0; n < this.aNodes.length; n++) {
        // 不是节点自身、具有同父节点兄弟节点
        if (this.aNodes[n].pid != -1 && this.aNodes[n].id != id && this.aNodes[n].pid == pid) {
            if (eval("document.all." + this.aNodes[n].cname + "_" + this.aNodes[n].id + ".checked"))
                isChecked = true;
        }
    }
    return isChecked;
};

//===============================
// john 2017-06-30
//
//作用：递归选中父节点对象
//参数：pid 节点的父节点id
//      ischecked 是否被选中
//===============================
dTree.prototype.checkPNodeRecursion = function (pid, ischecked) {
    for (var n = 0; n < this.aNodes.length; n++) {
        if (this.aNodes[n].pid != -1 && this.aNodes[n].id == pid) {
            eval("document.all." + this.aNodes[n].cname + "_" + this.aNodes[n].id + ".checked = " + ischecked);
            this.checkPNodeRecursion(this.aNodes[n].pid, ischecked);
            break;
        }
    }
};

//===============================
// john 2017-06-30
//
//作用：递归选中子节点对象
//参数：id 节点id
//      ischecked 是否被选中
//===============================
dTree.prototype.checkSNodeRecursion = function (id, ischecked) {
    for (var n = 0; n < this.aNodes.length; n++) {
        if (this.aNodes[n].pid != -1 && this.aNodes[n].pid == id) {
            eval("document.all." + this.aNodes[n].cname + "_" + this.aNodes[n].id + ".checked = " + ischecked);
            this.checkSNodeRecursion(this.aNodes[n].id, ischecked);
        }
    }
};

//===============================
// john 2017-06-30
//
//作用：仅选中父节点对象
//参数：pid 节点的父节点id
//      ischecked 是否被选中
//===============================
dTree.prototype.checkPNode = function (pid, ischecked) {
    for (var n = 0; n < this.aNodes.length; n++) {
        if (this.aNodes[n].pid != -1 && this.aNodes[n].id == pid) {
            eval("document.all." + this.aNodes[n].cname + "_" + this.aNodes[n].id + ".checked = " + ischecked);
            break;
        }
    }
};

//突出了选中的节点  -- Highlights the selected node
dTree.prototype.s = function (id) {
    if (!this.config.useSelection) return;
    var cn = this.aNodes[id];
    if (cn._hc && !this.config.folderLinks) return;
    if (this.selectedNode != id) {
        if (this.selectedNode || this.selectedNode == 0) {
            eOld = document.getElementById("s" + this.obj + this.selectedNode);
            eOld.className = "node";
        }
        eNew = document.getElementById("s" + this.obj + id);
        eNew.className = "nodeSel";
        this.selectedNode = id;
        if (this.config.useCookies) this.setCookie('cs' + this.obj, cn.id);
    }
};

//开关打开或关闭   Toggle Open or close
dTree.prototype.o = function (id) {
    var cn = this.aNodes[id];
    this.nodeStatus(!cn._io, id, cn._ls);
    cn._io = !cn._io;
    if (this.config.closeSameLevel) this.closeLevel(cn);
    if (this.config.useCookies) this.updateCookie();
};

//打开或关闭所有节点  -- Open or close all nodes
dTree.prototype.oAll = function (status) {
    for (var n = 0; n < this.aNodes.length; n++) {
        if (this.aNodes[n]._hc && this.aNodes[n].pid != this.root.id) {
            this.nodeStatus(status, n, this.aNodes[n]._ls)
            this.aNodes[n]._io = status;
        }
    }
    if (this.config.useCookies) this.updateCookie();
};

//打开树到一个特定的节点  -- Opens the tree to a specific node
dTree.prototype.openTo = function (nId, bSelect, bFirst) {
    if (!bFirst) {
        for (var n = 0; n < this.aNodes.length; n++) {
            if (this.aNodes[n].id == nId) {
                nId = n;
                break;
            }
        }
    }
    var cn = this.aNodes[nId];
    if (cn.pid == this.root.id || !cn._p) return;
    cn._io = true;
    cn._is = bSelect;
    if (this.completed && cn._hc) this.nodeStatus(true, cn._ai, cn._ls);
    if (this.completed && bSelect) this.s(cn._ai);
    else if (bSelect) this._sn = cn._ai;
    this.openTo(cn._p._ai, false, true);
};

//关闭所有节点相同的层次上,某些节点   --Closes all nodes on the same level as certain node
dTree.prototype.closeLevel = function (node) {
    for (var n = 0; n < this.aNodes.length; n++) {
        if (this.aNodes[n].pid == node.pid && this.aNodes[n].id != node.id && this.aNodes[n]._hc) {
            this.nodeStatus(false, n, this.aNodes[n]._ls);
            this.aNodes[n]._io = false;
            this.closeAllChildren(this.aNodes[n]);
        }
    }
}

//关闭所有一个节点和节点点所有子节点 -- Closes all children of a node
dTree.prototype.closeAllChildren = function (node) {
    for (var n = 0; n < this.aNodes.length; n++) {
        if (this.aNodes[n].pid == node.id && this.aNodes[n]._hc) {
            if (this.aNodes[n]._io) this.nodeStatus(false, n, this.aNodes[n]._ls);
            this.aNodes[n]._io = false;
            this.closeAllChildren(this.aNodes[n]);
        }
    }
}

// 更改节点的状态(打开或关闭) Change the status of a node(open or closed)
dTree.prototype.nodeStatus = function (status, id, bottom) {
    eDiv = document.getElementById('d' + this.obj + id);
    eJoin = document.getElementById('j' + this.obj + id);
    if (this.config.useIcons) {
        eIcon = document.getElementById('i' + this.obj + id);
        eIcon.src = (status) ? this.aNodes[id].iconOpen : this.aNodes[id].icon;
    }
    eJoin.src = (this.config.useLines) ?
	((status) ? ((bottom) ? this.icon.minusBottom : this.icon.minus) : ((bottom) ? this.icon.plusBottom : this.icon.plus)) :
	((status) ? this.icon.nlMinus : this.icon.nlPlus);
    eDiv.style.display = (status) ? 'block' : 'none';
};


//[Cookie]清除Cookie -- [Cookie] Clears a cookie
dTree.prototype.clearCookie = function () {
    var now = new Date();
    var yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);
    this.setCookie('co' + this.obj, 'cookieValue', yesterday);
    this.setCookie('cs' + this.obj, 'cookieValue', yesterday);
};

// [Cookie] 在Cookie中设置值 --[Cookie] Sets value in a cookie
dTree.prototype.setCookie = function (cookieName, cookieValue, expires, path, domain, secure) {
    document.cookie =
		escape(cookieName) + '=' + escape(cookieValue)
		+ (expires ? '; expires=' + expires.toGMTString() : '')
		+ (path ? '; path=' + path : '')
		+ (domain ? '; domain=' + domain : '')
		+ (secure ? '; secure' : '');
};

//[Cookie]从Cookie中得到了一个值 -- [Cookie] Gets a value from a cookie
dTree.prototype.getCookie = function (cookieName) {
    var cookieValue = '';
    var posName = document.cookie.indexOf(escape(cookieName) + '=');
    if (posName != -1) {
        var posValue = posName + (escape(cookieName) + '=').length;
        var endPos = document.cookie.indexOf(';', posValue);
        if (endPos != -1) cookieValue = unescape(document.cookie.substring(posValue, endPos));
        else cookieValue = unescape(document.cookie.substring(posValue));
    }
    return (cookieValue);
};

//[Cookie]将打开节点的id作为字符串返回  -- [Cookie] Returns ids of open nodes as a string
dTree.prototype.updateCookie = function () {
    var str = '';
    for (var n = 0; n < this.aNodes.length; n++) {
        if (this.aNodes[n]._io && this.aNodes[n].pid != this.root.id) {
            if (str) str += '.';
            str += this.aNodes[n].id;
        }
    }
    this.setCookie('co' + this.obj, str);
};

// [Cookie]检查一个节点id是否在Cookie中-- [Cookie] Checks if a node id is in a cookie
dTree.prototype.isOpen = function (id) {
    var aOpen = this.getCookie('co' + this.obj).split('.');
    for (var n = 0; n < aOpen.length; n++)
        if (aOpen[n] == id) return true;
    return false;
};

// 如果Push和pop不是由浏览器实现的-- If Push and pop is not implemented by the browser
if (!Array.prototype.push) {
    Array.prototype.push = function array_push() {
        for (var i = 0; i < arguments.length; i++)
            this[this.length] = arguments[i];
        return this.length;
    }
};
if (!Array.prototype.pop) {
    Array.prototype.pop = function array_pop() {
        lastElement = this[this.length - 1];
        this.length = Math.max(this.length - 1, 0);
        return lastElement;
    }
};