# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password, check_password
# from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect

from django.contrib.auth.models import User
#用户管理以及权限管理模块
from django.urls import reverse
from django.views.generic import ListView
from django.http import HttpResponse,JsonResponse
from .models import *
from django.contrib.auth.decorators import login_required
from auth_role.permission import check_permission
from django.utils.decorators import method_decorator
#用户列表
#
@method_decorator(login_required, name='dispatch')
@method_decorator(check_permission, name='dispatch')
class AdminListView(ListView):
    model = User
    template_name = 'admin-list.html'
    context_object_name = 'user_list'
    paginate_by = 8
    ordering = 'date_joined'
    page_kwarg = 'p'
    def get_context_data(self, **kwargs):
        context = super(AdminListView, self).get_context_data(*kwargs)
        # context['username'] = 'zhiliao'
        paginator = context.get('paginator')
        page_obj = context.get('page_obj')
        pagination_data = self.get_pagination_data(paginator, page_obj, 3)
        context.update(pagination_data)
        return context
    def get_pagination_data(self, paginator, page_obj, around_count=2):
        current_page = page_obj.number
        num_pages = paginator.num_pages

        left_has_more = False
        right_has_more = False

        if current_page <= around_count + 2:
            left_pages = range(1, current_page)
        else:
            left_has_more = True
            left_pages = range(current_page - around_count, current_page)

        if current_page >= num_pages - around_count - 1:
            right_pages = range(current_page + 1, num_pages + 1)
        else:
            right_has_more = True
            right_pages = range(current_page + 1, current_page + around_count + 1)

        #查询总条数
        count=User.objects.all().count()
        return {
            'left_pages': left_pages,
            'right_pages': right_pages,
            'current_page': current_page,
            'left_has_more': left_has_more,
            'right_has_more': right_has_more,
            'num_pages': num_pages,
            'count':count
        }

#到用户添加
@login_required
@check_permission
def to_admin_add(request):
    return render(request, 'admin-add.html')

#用户添加
def admin_add(request):
    if request.method == 'POST':
        username=request.POST.get('username')
        email=request.POST.get('email')
        password=request.POST.get('pass')
        repassword=request.POST.get('repass')
        is_active=request.POST.get('is_active')
        print(username)
        print(email)
        print(password)
        print(repassword)
        print(is_active)
        if(password != repassword):
            context={
                'messg': '两次输入密码不同',
                'code': 300
            }
            print(context['messg'])
            return JsonResponse(context)
        else:
            User.objects.create_user(
                username=username,
                password=password,
                email=email,
                is_active=is_active
            )
            context = {
                'messg': '添加成功',
                'code':200
            }
            print(context['messg'])
            return JsonResponse(context)


    else:
        pass

#到用户修改
@login_required
@check_permission
def to_admin_edit(request):
    id=request.GET.get('id')
    print(id)
    user=User.objects.get(id=id)
    username=user.username
    email=user.email
    is_active=user.is_active
    context={
        'id':id,
        'username':username,
        'email':email,
        'is_active':is_active
    }
    return render(request, 'admin-edit.html',context=context)

#用户修改
def admin_edit(request):
    if request.method == 'POST':
        id=request.POST.get('id')
        username=request.POST.get('username')
        email=request.POST.get('email')
        old_pass=request.POST.get('old_pass')
        new_pass=request.POST.get('new_pass')
        new_repass=request.POST.get('repass_edit')
        is_active=request.POST.get('is_active')
        print(id)
        print(username)
        print(email)
        print(old_pass)
        print(new_pass)
        print(new_repass)
        print(is_active)
        old_pass=str(old_pass)

        context = {}
        #对原密码进行加密，用来和数据库中的原密码进行对比
        password = make_password(old_pass)
        user = User.objects.get(id=id)
        user = authenticate(username=user.username,password=old_pass)
        if user:
            print(1111)
            if new_pass != new_repass:
                context['messg'] = '两次密码输入不一致'
                context['code'] = 300
            else:
                user.username=username
                user.email=email
                user.is_active=is_active
                user.set_password(new_pass)
                user.save()
                context['messg']='修改成功'
                context['code']=200
        else:
            context['messg'] = '原密码错误'
            context['code'] = 300

        return JsonResponse(context,safe=False)

#用户激活
@login_required
@check_permission
def admin_active(request):
    if request.method == 'POST':
        id=request.POST.get('id')
        is_active=request.POST.get('is_active')
        print(id)
        print(is_active)
        context ={}
        user=User.objects.get(id=id)
        #停用
        if is_active == 'True':
            context['messg']='停用成功'
            user.is_active=0
            user.save()
            return JsonResponse(context)
        # 启用
        if is_active != 'True':
            context['messg'] = '启用成功'
            user.is_active = 1
            user.save()
            return JsonResponse(context)
    else:
        pass

#删除单个用户
@login_required
@check_permission
def admin_delete(request):
    if request.method == 'POST':
        id=request.POST.get('id')
        print(id)
        context ={}
        menuManage=User.objects.get(id=id).delete()
        context['messg']='删除成功'
        return JsonResponse(context)

    else:
        pass

#批量删除用户
@login_required
@check_permission
def admin_delete_much(request):
    if request.method == 'POST':
        check_id_list_values = request.POST.get('check_id_list_values')
        check_id_list_values = str(check_id_list_values)
        check_id_list_values = check_id_list_values.split(',')
        print(type(check_id_list_values))
        print(check_id_list_values)
        for check_id_value in check_id_list_values:
            id = int(check_id_value)
            print(id)
            user = User.objects.filter(id=id).delete()

        context={
            'messg':'批量删除成功'
        }
        return JsonResponse(context)





