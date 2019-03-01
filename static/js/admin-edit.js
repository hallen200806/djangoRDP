window.onload=function () {
    var admin_edit_but=document.getElementById("admin_edit_but");
    admin_edit_but.onclick=function () {
        var id=document.getElementById("id_edit").value;
        var username=document.getElementById("username_edit").value;
        var email=document.getElementById("email_dit").value;
        var old_pass=document.getElementById("old_pass_edit").value;
        var new_pass=document.getElementById("new_pass_edit").value;
        var repass_edit=document.getElementById("repass_edit").value;
        var is_active_1=document.getElementById("is_active_1_edit");
        var is_active_0=document.getElementById("is_active_0_edit");
        is_active='';
        if (is_active_1.checked){
            is_active=is_active_1.value
        }
        if (is_active_0.checked){
            is_active=is_active_0.value
        }
        $.ajax({
            type:'POST',
            url:host+'/auth_user/admin_edit/',
            data:{
                'id':id,
                'username':username,
                'email':email,
                'old_pass':old_pass,
                'new_pass':new_pass,
                'repass_edit':repass_edit,
                'is_active':is_active
            },
            dataType:'JSON',
            success:function (data) {
                var messg=data.messg;
                var code=data.code;
                if(code == 200){
                    xtalert.alertSuccessToast(messg);
                    setTimeout(reload_menuList, 1000);
                }
                if(code == 300){
                    xtalert.alertError(messg);
                    // setTimeout(reload_menuList, 1000);
                }


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
    window.location.href=host+'/auth_user/AdminListView/?p=1';
}