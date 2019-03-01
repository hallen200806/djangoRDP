window.onload=function () {
    var role_edit_btn=document.getElementById("role_edit_btn");
    role_edit_btn.onclick=function () {

        var id=document.getElementById("id_edit").value;
        var role_name_edit=document.getElementById("role_name_edit").value;
        var role_desc_edit=document.getElementById("role_desc_edit").value;

        var is_active_1=document.getElementById("is_active_1_edit");
        var is_active_0=document.getElementById("is_active_0_edit");
        var is_active='';
        if (is_active_1.checked){
            is_active=is_active_1.value
        }
        if (is_active_0.checked){
            is_active=is_active_0.value
        }
        $.ajax({
            type:'POST',
            url:host+'/auth_role/role_edit/',
            data:{
                'id':id,
                'role_name':role_name_edit,
                'role_desc':role_desc_edit,
                'is_active':is_active
            },
            dataType:'JSON',
            success:function (data) {
                var messg=data.messg;
                xtalert.alertSuccessToast(messg);
                setTimeout(reload_authList, 1000);

            },
            error:function (error) {
                xtalert.alertError('保存失败，请重新提交');
            }
        })

    }

};


function reload() {
    window.location.reload();
}

function reload_authList() {
    window.location.href=host+'/auth_role/role_list/?p=1';
}