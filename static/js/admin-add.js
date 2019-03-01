window.onload=function () {
    var admin_add_btn=document.getElementById("admin_add_btn");
    admin_add_btn.onclick=function () {
        var username=document.getElementById("username").value;
        var email=document.getElementById("email").value;
        var pass=document.getElementById("pass").value;
        var repass=document.getElementById("repass").value;
        var is_active=0;
        var is_active_1=document.getElementById("is_active_1");
        var is_active_0=document.getElementById("is_active_0");
        if (is_active_1.checked){
            is_active=is_active_1.value
        }
        if (is_active_0.checked){
            is_active=is_active_0.value
        }
        if(username == ''){
            xtalert.alertError('用户名不能为空');
            return false;
        }
        if(pass == ''){
            xtalert.alertError('密码不能为空');
            return false;
        }
        if(repass == ''){
            xtalert.alertError('确认密码不能为空');
            return false;
        }
        $.ajax({
            type:'POST',
            url:host+'/auth_user/admin_add/',
            data:{
                'username':username,
                'email':email,
                'pass':pass,
                'repass':repass,
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
                else {
                    xtalert.alertError(messg);
                }


            },
            error:function (error) {
                xtalert.alertError(error.messg);
            }
        })
    }
};

function reload_menuList() {
    window.location.href=host+'/auth_user/AdminListView/?p=1';
}