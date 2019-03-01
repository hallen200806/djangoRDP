window.onload=function () {
    //点击添加行开始
		var show_count = 20;   //要显示的条数
		var count = 1;    //递增的开始值，这里是你的ID
		//添加行
		var btn_addtr=document.getElementById("btn_addtr");
		btn_addtr.onclick=function () {
			var length = $("#dynamicTable tbody tr").length;
			if (length < show_count)    //点击时候，如果当前的数字小于递增结束的条件
			{
				$("#tab11 tbody tr").clone().appendTo("#dynamicTable tbody");   //在表格后面添加一行
				changeIndex();//更新行号
			}
		};


};

function changeIndex() {
			var i = 1;
			$("#dynamicTable tbody tr").each(function () { //循环tab tbody下的tr
				$(this).find("input[name='NO']").val(i++);//更新行号
			});
		}
function deltr(opp) {
			var length = $("#dynamicTable tbody tr").length;
			//alert(length);

            $(opp).parent().parent().remove();//移除当前行
            changeIndex();

			/*if (length <= 1) {
				alert("至少保留一行");
			}
			else {
				$(opp).parent().parent().remove();//移除当前行
				changeIndex();
			}*/
		}


function reload_roleList() {
    window.location.href=host+'/auth_role/role_list/?p=1';
}