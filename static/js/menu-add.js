window.onload=function () {
    var menu_add_btn=document.getElementById("menu_add_btn");
    menu_add_btn.onclick=function () {
        var name=document.getElementById("name").value;
        var parent_id=document.getElementById("parent_id").value;
        var icon=document.getElementById("icon").value;
        var path=document.getElementById("path").value;
        var is_active=0;
        var is_active_1=document.getElementById("is_active_1");
        var is_active_0=document.getElementById("is_active_0");
        if (is_active_1.checked){
            is_active=is_active_1.value
        }
        if (is_active_0.checked){
            is_active=is_active_0.value
        }
        var desc=document.getElementById("desc").value;
        $.ajax({
            type:'POST',
            url:host+'/menu_manage/menu_add/',
            data:{
                'name':name,
                'parent_id':parent_id,
                'icon':icon,
                'is_active':is_active,
                'desc':desc,
                'path':path
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

    };

};


function reload() {
    window.location.reload();
}

function reload_menuList() {
    window.location.href=host+'/menu_manage/menu_list/?p=1';
}