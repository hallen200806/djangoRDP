window.onload=function () {
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

};


function reload() {
    window.location.reload();
}

function reload_menuList() {
    window.location.href=host+'/menu_manage/menu_list/?p=1';
}