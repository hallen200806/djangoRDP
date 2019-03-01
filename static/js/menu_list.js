window.onload=function (ev) {
    var size = 8,
	allData = null,
	entity = '',
	pageNow = '',
    pageTotal = '';

    // 启用和停用
    var is_active_btns=document.getElementsByClassName("is_active_btn");
    for(var i=0;i<is_active_btns.length;i++){
        is_active_btns[i].onclick=function () {
            var input_id_tag=this.previousElementSibling || this.previousSibling;
            var input_active__tag=input_id_tag.previousElementSibling || input_id_tag.previousSibling;
            var id=input_id_tag.value;
            var is_active=input_active__tag.value;
            $.ajax({
                type:'POST',
                url:host+'/menu_manage/menu_active/',
                data:{
                    'id':id,
                    'is_active':is_active
                },
                dataType:'JSON',
                success:function (data) {
                    var messg=data.messg;
                    xtalert.alertSuccessToast(messg);
                    setTimeout(reload,1000);
                },
                error:function (error) {
                    xtalert.alertErrorToast('服务异常');
                    setTimeout(reload,1000);
                }
            })
        }
    }

    //删除
    var delete_btns=document.getElementsByClassName("delete_btn");
    for(var j=0;j<delete_btns.length;j++){
        delete_btns[j].onclick=function () {
            if(!confirm('你确定要删除吗?')){
                return false
            }
            var input_id_tag=this.previousElementSibling || this.previousSibling;
            var id_delete=input_id_tag.value;
            $.ajax({
                type:'POST',
                url:host+'/menu_manage/menu_delete/',
                data:{
                    'id':id_delete
                },
                dataType:'JSON',
                success:function (data) {
                    var messg=data.messg;
                    xtalert.alertSuccessToast(messg);
                    setTimeout(reload,1000);
                },
                error:function (error) {
                    xtalert.alertErrorToast(error.messg);
                    setTimeout(reload,1000);
                }
            })
        }
    }

    //批量删除
    var id_list_checks=document.getElementsByClassName("id_list_check");
    check_id_data_list=[];
    for(var q=0;q<id_list_checks.length;q++){
        id_list_checks[q].onclick=function () {
            var nextSibling=this.nextSibling || this.nextElementSibling;
            var inpt_tag=nextSibling.nextSibling || nextSibling.nextElementSibling;
            var input_id_value=inpt_tag.value;
            if(this.checked){
                check_id_data_list.push(input_id_value);
            }
            if(!this.checked){
                var index = check_id_data_list.indexOf(input_id_value);
                check_id_data_list.splice(index, 1);
                // check_id_data_list.remove(input_id_value);
            }
            var check_id_list=document.getElementById("check_id_list");
            check_id_list.value=check_id_data_list;
        };

    }

    var delete_much=document.getElementById("delete_much");
    delete_much.onclick=function (ev2) {

        if(!confirm('你确认要批量删除吗?')){
            return false
        }
        else {
            var check_id_list=document.getElementById("check_id_list");
            check_id_list.value=check_id_data_list;
            var check_id_list_values=check_id_list.value;
            $.ajax({
                type: 'POST',
                url:host+'/menu_manage/mune_delete_much/',
                data: {
                 'check_id_list_values': check_id_list_values
                },
                dataType: 'JSON',
                success: function (data) {
                    var messg=data.messg;
                    xtalert.alertSuccessToast(messg);
                    setTimeout(reload, 1000);
                },
                error: function (error) {
                    alert("请求异常")
                }
            })

        }


    };

    //左侧点击生成列表
    var current_node=document.getElementsByClassName("current_node");
    for(var h=0;h<current_node.length;h++){
        current_node[h].onclick=function () {
            var text_tag=this.previousSibling || this.previousElementSibling;
            var inputHidden_id_tag=text_tag.previousSibling || text_tag.previousElementSibling;
            console.log(inputHidden_id_tag);
            var id=inputHidden_id_tag.value;
            $.ajax({
                type: 'POST',
                url:host+'/menu_manage/menu_ajax_list/',
                data: {
                 'id': id
                },
                // dataType: 'JSON',
                tradition:true,   //原生模式
                success: function (data) {
                    allData = data;
                    pageTotal = Math.ceil(allData.length/size);
                    render(1);
                    renderPagenation(pageTotal);
                    var pages = document.getElementsByClassName('page');
                    for(var i=0; i<pages.length; i++){
                        pages[i].onclick = function(e){
                            pageNow = e.currentTarget.innerText;
                            render(pageNow);
                            var childs=this.parentNode.parentNode.childNodes;
                            for(var l=0;l<childs.length;l++){
                                childs[l].className="";
                            }
                            var parent=this.parentNode;
                            parent.className="active"
                        }
                    }
                    document.getElementsByClassName('prev')[0].onclick = pre;
                    document.getElementsByClassName('next')[0].onclick = next;

                },
                error: function (error) {
                    alert("请求异常")
                }
            })
        }
    }
    function pre(){

        pageNow = pageNow - 1 <= 1 ? 1 : pageNow - 1;
        render(pageNow)
    }
    function next(){
        pageNow = pageNow + 1 >= pageTotal ? pageTotal : pageNow + 1;
        render(pageNow)
    }
    function renderPagenation(length) {
        var length = length;
        var page = document.getElementById("rule_page");
        page.innerHTML = '';
        var str = '';
            str += '<a href="#" aria-label="Previous" class="prev">' +
                          '<span aria-hidden="true"><<</span>' +
                        '</a>';
        for(var i=1;i<=length;i++){
           str += "<a href='#' class='num page'  id='page'>"+i+"</a>";
        }
        str += '<a href="#" aria-label="Next" class="next">' +
                  '<span aria-hidden="true">>></span>' +
                '</a>';
        page.innerHTML = str;
    }
    function render(currentPage) {
        var currentPage = allData.slice((currentPage - 1) * size, currentPage * size);
        // alert(currentPage);
        var tbody_menu = document.getElementById("tbody_menu");
        var childs = tbody_menu.childNodes;
        for (var k = childs.length - 1; k >= 0; k--) {
                tbody_menu.removeChild(childs[k]);
        }
        for (var i = 0; i < currentPage.length; i++) {
            var td1 = document.createElement("td");
            var attr='';
            attr+='<input type="checkbox" class="i-checks id_list_check">';
            attr+='<input type="hidden" value='+id+'';
            attr+='<input type="hidden" id="check_id_list" name="check_id_list">';
            td1.innerHTML = attr;

            var arr = [];
            var id = currentPage[i].id;
            var name = currentPage[i].name;
            var parent_name = currentPage[i].parent_name;
            var create_time = currentPage[i].create_time;
            var desc = currentPage[i].desc;
            var is_active = currentPage[i].is_active;

            arr.push(id);
            arr.push(name);
            arr.push(parent_name);
            arr.push(create_time);
            arr.push(desc);
            var is_active_tag='';
            var astr = '';
            if(is_active == 0){
                is_active_tag = '<span class="layui-btn layui-btn-normal layui-btn-mini  layui-btn-disabled">'+'已停用'+'</span>';
                astr+='<input type="hidden" value="'+is_active+'">';
                astr+='<input type="hidden" value="'+id+'">';
                astr+='<a title="启用" class="is_active_btn" style="cursor: pointer">'+'<i class="layui-icon">&#xe62f;</i></a>';
                // astr+='<a title="编辑"  onclick="x_admin_show('+"编辑,"+'{% url "menu_manage:to_menu_edit" %}?id='+id+')" href="javascript:;"><i class="layui-icon">&#xe642;</i></a>';
                astr+='<input type="hidden" value="'+id+'">';
                astr+='<a title="删除" style="cursor: pointer" class="delete_btn"><i class="layui-icon">&#xe640;</i></a>';
            }
            if(is_active == 1){
                is_active_tag ='<span class="layui-btn layui-btn-normal layui-btn-mini">'+'已启用'+'</span>';
                astr+='<input type="hidden" value="'+is_active+'">';
                astr+='<input type="hidden" value="'+id+'">';
                astr+='<a title="停用" class="is_active_btn" style="cursor: pointer">'+'<i class="layui-icon">&#xe601;</i></a>';
                // astr+='<a title="编辑"  onclick="x_admin_show('+'编辑,'+'"/menu_manage/to_menu_edit/?id='+id+"')" href="javascript:;"><i class="layui-icon">&#xe642;</i></a>';
                // astr+='<a title="编辑"  onclick="x_admin_show(\'编辑,'+'{% url \'auth_user:to_admin_edit\' %}?id={{ user.id }}\')"'+'href="javascript:;">'+'<i class="layui-icon">&#xe642;</i>'+'</a>';


                astr+='<input type="hidden" value="'+id+'">';
                astr+='<a title="删除" style="cursor: pointer" class="delete_btn"><i class="layui-icon">&#xe640;</i></a>';
            }
            var td6 = document.createElement("td");
            td6.innerHTML = is_active_tag;

            var tr = document.createElement("tr");
            tr.appendChild(td1);

            for (var j = 0; j < arr.length; j++) {
                var td = document.createElement("td");
                td.innerText = arr[j];
                tr.appendChild(td);
            }
            tr.appendChild(td6);

            var td7 = document.createElement("td");
            td7.innerHTML = astr;

            tr.appendChild(td7);
            tbody_menu.appendChild(tr);

        }



        // 启用和停用
    var is_active_btns=document.getElementsByClassName("is_active_btn");
    for(var t=0;t<is_active_btns.length;t++){
        is_active_btns[t].onclick=function () {
            var input_id_tag=this.previousElementSibling || this.previousSibling;
            var input_active__tag=input_id_tag.previousElementSibling || input_id_tag.previousSibling;
            var id=input_id_tag.value;
            var is_active=input_active__tag.value;
            $.ajax({
                type:'POST',
                url:host+'/menu_manage/menu_active/',
                data:{
                    'id':id,
                    'is_active':is_active
                },
                dataType:'JSON',
                success:function (data) {
                    var messg=data.messg;
                    xtalert.alertSuccessToast(messg);
                    setTimeout(reload,1000);
                },
                error:function (error) {
                    xtalert.alertErrorToast(error.messg);
                    setTimeout(reload,1000);
                }
            })
        }
    }

    //删除
    var delete_btns=document.getElementsByClassName("delete_btn");
    for(var u=0;u<delete_btns.length;u++){
        delete_btns[u].onclick=function () {
            alert(111);
            var input_id_tag=this.previousElementSibling || this.previousSibling;
            var id_delete=input_id_tag.value;
            $.ajax({
                type:'POST',
                url:host+'/menu_manage/menu_delete/',
                data:{
                    'id':id_delete
                },
                dataType:'JSON',
                success:function (data) {
                    var messg=data.messg;
                    xtalert.alertSuccessToast(messg);
                    setTimeout(reload,1000);
                },
                error:function (error) {
                    xtalert.alertErrorToast(error.messg);
                    setTimeout(reload,1000);
                }
            })
        }
    }

    //编辑
    var menu_edit_but=document.getElementById("menu_edit_but");
    menu_edit_but.onclick=function () {
        var id=document.getElementById("id_edit").value;
        var name=document.getElementById("name_edit").value;
        var parent_id_edit=document.getElementById("parent_id_edit").value;
        var icon=document.getElementById("icon_edit").value;
        var path_edit=document.getElementById("path_edit").value;
        var is_active_1=document.getElementById("is_active_1_edit");
        var is_active_0=document.getElementById("is_active_0_edit");
        if (is_active_1.checked){
            is_active=is_active_1.value
        }
        if (is_active_0.checked){
            is_active=is_active_0.value
        }
        var desc=document.getElementById("desc_edit").value;
        $.ajax({
            type:'POST',
            url:host+'/menu_manage/menu_edit/',
            data:{
                'id':id,
                'name':name,
                'parent_id':parent_id_edit,
                'icon':icon,
                'is_active':is_active,
                'desc':desc,
                'path':path_edit
            },
            dataType:'JSON',
            success:function (data) {
                var messg=data.messg;
                xtalert.alertSuccessToast(messg);
                setTimeout(reload_menuList, 1000);

            },
            error:function (error) {
                console.log(error);
                xtalert.alertError('保存失败，请重新提交');
            }
        })

    }



    }

};

function reload() {
    window.location.reload();
}

