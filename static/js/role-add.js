window.onload=function () {
    var role_add_btn=document.getElementById("role_add_btn");
    role_add_btn.onclick=function () {
        var role_name=document.getElementById("role_name").value;
        var role_desc=document.getElementById("role_desc").value;
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
            xtalert.alertError('角色名称不能为空');
            return false;
        }

        $.ajax({
            type:'POST',
            url:host+'/auth_role/role_add/',
            data:{
                'role_name':role_name,
                'role_desc':role_desc,
                'is_active':is_active
            },
            dataType:'JSON',
            success:function (data) {
                var messg=data.messg;
                var code=data.code;
                xtalert.alertSuccessToast(messg);
                setTimeout(reload_roleList, 1000);

            },
            error:function (error) {
                xtalert.alertError(error.messg);
            }
        })
    }
};

function reload_roleList() {
    window.location.href=host+'/auth_role/role_list/?p=1';
}