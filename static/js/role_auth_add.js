window.onload=function () {
    var role_auth_add_btn=document.getElementById("role_auth_add_btn");
    role_auth_add_btn.onclick=function () {
        var role_id=document.getElementById("role_id").value;
        var check_auth_id_list=document.getElementById("check_auth_id_list").value;
        $.ajax({
            type:'POST',
            url:host+'/auth_role/roleAuthAdd/',
            data:{
                'role_id':role_id,
                'check_auth_id_list':check_auth_id_list
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