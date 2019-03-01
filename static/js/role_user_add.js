window.onload=function () {
    var role_user_add_btn=document.getElementById("role_user_add_btn");
    role_user_add_btn.onclick=function () {
        var role_id_add=document.getElementById("role_id_add").value;
        var role_user_select_list=[];
        //获取多选框的值
        $("#role_user_select :selected").each(function(){
         role_user_select_list.push($(this).val());
        });

        // alert(role_user_select_list);
        $.ajax({
            type:'POST',
            url:host+'/auth_role/roleUserAdd/',
            data:{
                'role_id_add':role_id_add,
                'role_user_select_list':role_user_select_list
            },
            dataType:'JSON',
            traditional:true,
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