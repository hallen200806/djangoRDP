window.onload=function () {
    var auth_add_btn=document.getElementById("auth_add_btn");
    auth_add_btn.onclick=function () {
        var role_name=document.getElementById("role_name").value;
        var role_url=document.getElementById("role_url").value;
        var role_method=document.getElementById("role_method").value;
        var role_arguments=document.getElementById("role_arguments").value;
        var role_desc=document.getElementById("role_desc").value;
        var role_parent_id=document.getElementById("role_parent_id").value;
        var is_active=0;
        var is_active_1=document.getElementById("is_active_1");
        var is_active_0=document.getElementById("is_active_0");
        if (is_active_1.checked){
            is_active=is_active_1.value
        }
        if (is_active_0.checked){
            is_active=is_active_0.value
        }
        if(role_name == ''){
            xtalert.alertError('权限名称不能为空');
            return false;
        }
        if(role_url == ''){
            xtalert.alertError('URL不能为空');
            return false;
        }

        $.ajax({
            type:'POST',
            url:host+'/auth_role/auth_add/',
            data:{
                'role_parent_id':role_parent_id,
                'role_name':role_name,
                'role_url':role_url,
                'role_method':role_method,
                'role_arguments':role_arguments,
                'role_desc':role_desc,
                'is_active':is_active
            },
            dataType:'JSON',
            success:function (data) {
                var messg=data.messg;
                var code=data.code;
                xtalert.alertSuccessToast(messg);
                setTimeout(reload_authList, 1000);

            },
            error:function (error) {
                xtalert.alertError(error.messg);
            }
        })
    }
};

function reload_authList() {
    window.location.href=host+'/auth_role/auth_list/?p=1';
}