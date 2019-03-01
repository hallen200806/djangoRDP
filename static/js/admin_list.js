window.onload=function (ev) {
    // 启用和停用
    var is_active_btns=document.getElementsByClassName("is_active_btn");
    for(var i=0;i<is_active_btns.length;i++){
        is_active_btns[i].onclick=function () {
            var input_id_tag=this.previousElementSibling || this.previousSibling;
            var input_active__tag=input_id_tag.previousElementSibling || input_id_tag.previousSibling;
            var id=input_id_tag.value;
            var is_active=input_active__tag.value;
            $.ajax({
                type:'POST',
                url:host+'/auth_user/admin_active/',
                data:{
                    'id':id,
                    'is_active':is_active
                },
                dataType:'JSON',
                success:function (data) {
                    var messg=data.messg;
                    xtalert.alertSuccessToast(messg);
                    setTimeout(reload,1000);
                },
                error:function (error) {
                    xtalert.alertErrorToast(error.messg);
                    setTimeout(reload,1000);
                }
            })
        }
    }

    //删除
    var delete_btns=document.getElementsByClassName("delete_btn");
    for(var j=0;j<delete_btns.length;j++){
        delete_btns[j].onclick=function () {
            if(!confirm('你确定要删除吗?')){
                return false
            }
            var input_id_tag=this.previousElementSibling || this.previousSibling;
            var id_delete=input_id_tag.value;
            $.ajax({
                type:'POST',
                url:host+'/auth_user/admin_delete/',
                data:{
                    'id':id_delete
                },
                dataType:'JSON',
                success:function (data) {
                    var messg=data.messg;
                    xtalert.alertSuccessToast(messg);
                    setTimeout(reload,1000);
                },
                error:function (error) {
                    xtalert.alertErrorToast(error.messg);
                    setTimeout(reload,1000);
                }
            })
        }
    }

    //批量删除
    var id_list_checks=document.getElementsByClassName("id_list_check");
    check_id_data_list=[];
    for(var q=0;q<id_list_checks.length;q++){
        id_list_checks[q].onclick=function () {
            var nextSibling=this.nextSibling || this.nextElementSibling;
            var inpt_tag=nextSibling.nextSibling || nextSibling.nextElementSibling;
            var input_id_value=inpt_tag.value;
            if(this.checked){
                check_id_data_list.push(input_id_value);
            }
            if(!this.checked){
                var index = check_id_data_list.indexOf(input_id_value);
                check_id_data_list.splice(index, 1);
                // check_id_data_list.remove(input_id_value);
            }
            // alert(check_id_data_list);
            var check_id_list=document.getElementById("check_id_list");
            check_id_list.value=check_id_data_list;
        };

    }

    var delete_much=document.getElementById("delete_much");
    delete_much.onclick=function (ev2) {

        if(!confirm('你确认要批量删除吗?')){
            return false
        }
        else {
            var check_id_list=document.getElementById("check_id_list");
            check_id_list.value=check_id_data_list;
            var check_id_list_values=check_id_list.value;
            $.ajax({
                type: 'POST',
                url:host+'/auth_user/admin_delete_much/',
                data: {
                 'check_id_list_values': check_id_list_values
                },
                dataType: 'JSON',
                success: function (data) {
                    var messg=data.messg;
                    xtalert.alertSuccessToast(messg);
                    setTimeout(reload, 1000);
                },
                error: function (error) {
                    alert("请求异常")
                }
            })

        }


    }


};

function reload() {
    window.location.reload();
}