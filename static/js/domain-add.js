window.onload=function () {
    var domain_add_btn=document.getElementById("domain_add_btn");
    domain_add_btn.onclick=function () {
        var domain_name=document.getElementById("domain_name").value;
        var domain_desc=document.getElementById("domain_desc").value;

        var is_active=0;
        var is_active_1=document.getElementById("is_active_1");
        var is_active_0=document.getElementById("is_active_0");
        if (is_active_1.checked){
            is_active=is_active_1.value
        }
        if (is_active_0.checked){
            is_active=is_active_0.value
        }
        if(domain_name == ''){
            xtalert.alertError('领域模型名称不能为空');
            return false;
        }

        $.ajax({
            type:'POST',
            url:host+'/domainModel/domain_add/',
            data:{
                'domain_name':domain_name,
                'domain_desc':domain_desc,
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
    window.location.href=host+'/domainModel/domain_list/?p=1';
}