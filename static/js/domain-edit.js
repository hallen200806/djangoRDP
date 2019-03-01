window.onload=function () {
    var domain_edit_btn=document.getElementById("domain_edit_btn");
    domain_edit_btn.onclick=function () {

        var id=document.getElementById("id_edit").value;
        var domain_name_edit=document.getElementById("domain_name_edit").value;
        var domain_desc_edit=document.getElementById("domain_desc_edit").value;

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
            url:host+'/domainModel/domain_edit/',
            data:{
                'id':id,
                'domain_name_edit':domain_name_edit,
                'domain_desc_edit':domain_desc_edit,
                'is_active':is_active
            },
            dataType:'JSON',
            success:function (data) {
                var messg=data.messg;
                xtalert.alertSuccessToast(messg);
                setTimeout(reload_authList, 1000);

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

function reload_authList() {
    window.location.href=host+'/domainModel/domain_list/?p=1';
}