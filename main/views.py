# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect

# Create your views here.
from django.urls import reverse

from menu_manage.views import *
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

#登录限制
@login_required
def main(request):
    #session中的用户信息
    uname=request.session['uname']

    comment_list = []
    # 一级
    # 获取kvm_info信息
    menuManages = MenuManage.objects.filter(is_active=1)
    # 将db_id存成列表,避免级别的数字重复
    list_hive_db_metas = []
    for menuManage in menuManages:
        dict_hive_db_meta = {
            "level": menuManage.id,
            "name": menuManage.name,
            "parent_id": menuManage.parent_id,
            "path": menuManage.path,
            "icon": menuManage.icon,
            "children_comments": []
        }
        # 循环将字典添加到列表中
        comment_list.append(dict_hive_db_meta)
    print(comment_list)

    comment_dict = {}

    for i in comment_list:
        comment_dict[i["level"]] = i

    ret = []
    for comment in comment_list:
        parent_id = comment['parent_id']
        if parent_id != 0:  # 当parent_id字段不为空
            comment_dict[parent_id]['children_comments'].append(comment)
        #  parent_id值不为空,就是别人的子集,所以添加到相应父级的children_comments下.
        else:
            ret.append(comment)  # 把一些不要的数据取出来,


    #parent_id列表，为了识别是否有下级菜单
    menuManage_list=[]
    menuManages=MenuManage.objects.all()
    for menuManage in menuManages:
        parent_id=menuManage.parent_id
        menuManage_list.append(parent_id)
    context={
        'ret':ret,
        'menuManage_list':menuManage_list,
        'uname':uname
    }


    return render(request,'index.html',context=context)


def login_out(request):
    request.session.clear()
    return redirect(reverse('main:login'))
def login_user(request):
    if request.method == "GET":
        return render(request,'login.html')

    elif request.method == "POST":
        params = request.POST
        uname = params.get('uname')
        upwd = params.get('upwd')
        user = authenticate(username=uname, password=upwd)
        print(user)
        if user:
            # print(user)
            login(request,user)
            request.session['uname'] = uname
            # 登录成功以后重定向到主页
            data = {
                'status': 'success',
                'msg': '登录成功'
            }
            # print('$' * 30)
            # print(reverse("main:index"))
            # print('$' * 30)
            # return HttpResponse(json.dumps(data))
            return redirect(reverse("main:main"))

        else:
            data = {
                'status': 'error',
                'msg': '用户名或密码错误'
            }
            # return HttpResponse(json.dumps(data))
            # return HttpResponse('用户名或密码错误')
            return render(request, '404.html')


def welcome(request):
    return render(request,'welcome.html')
