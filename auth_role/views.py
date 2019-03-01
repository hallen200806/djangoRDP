# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db.models import Q
from django.shortcuts import render

from .models import *
from django.http import HttpResponse,JsonResponse

from django.views.generic import ListView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from auth_role.permission import check_permission
from django.contrib.auth.models import User


#权限列表
@method_decorator(login_required, name='dispatch')
@method_decorator(check_permission, name='dispatch')
class AuthListView(ListView):
    model = Permission
    template_name = 'auth-list.html'
    context_object_name = 'auth_list'
    paginate_by = 8
    ordering = 'create_time'
    page_kwarg = 'p'
    def get_context_data(self, **kwargs):
        context = super(AuthListView, self).get_context_data(*kwargs)
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
        count=Permission.objects.all().count()

        return {
            'left_pages': left_pages,
            'right_pages': right_pages,
            'current_page': current_page,
            'left_has_more': left_has_more,
            'right_has_more': right_has_more,
            'num_pages': num_pages,
            'count':count
        }

#到权限添加页面
@login_required
@check_permission
def to_auth_add(request):
    # 添加上级权限的时候下拉显示
    permissions = Permission.objects.all()
    permissions_list = []
    for permission in permissions:
        id = permission.id
        name = permission.name
        permission_dict = {
            'id': id,
            'name': name
        }
        permissions_list.append(permission_dict)

    context={
        'permissions_list':permissions_list
    }

    return render(request, 'auth-add.html',context=context)

#添加权限
def auth_add(request):
    if request.method == 'POST':
        role_parent_id=request.POST.get('role_parent_id')
        role_name=request.POST.get('role_name')
        role_url=request.POST.get('role_url')
        role_method=request.POST.get('role_method')
        role_arguments=request.POST.get('role_arguments')
        role_desc=request.POST.get('role_desc')
        is_active=request.POST.get('is_active')
        print('============auth_add')
        print(role_parent_id)

        permission=Permission(
            name=role_name,
            url=role_url,
            per_method=role_method,
            argument_list=role_arguments,
            describe=role_desc,
            is_active=is_active,
            del_falg=0,
            parent_id=role_parent_id
        )
        permission.save()

        context={
            'messg':'添加成功'
        }
        return JsonResponse(context)

#到权限编辑页面
@login_required
@check_permission
def to_auth_edit(request):
    id=request.GET.get('id')
    print(id)
    permission=Permission.objects.get(id=id)

    name=permission.name
    parent_id=permission.parent_id
    url=permission.url
    per_method=permission.per_method
    argument_list=permission.argument_list
    describe=permission.describe
    create_time=permission.create_time
    is_active=permission.is_active
    parent_name=''
    if parent_id != 0:
        permission_parent=Permission.objects.get(id=parent_id)
        parent_name=permission_parent.name

    # 添加上级权限的时候下拉显示
    permissions = Permission.objects.all()
    permissions_list = []
    for permission in permissions:
        id = permission.id
        name = permission.name
        if name != parent_name:
            permission_dict = {
                'id': id,
                'name': name
            }
            permissions_list.append(permission_dict)

    context={
        'id':id,
        'name':name,
        'url':url,
        'per_method':per_method,
        'describe':describe,
        'argument_list':argument_list,
        'create_time':create_time,
        'is_active':is_active,
        'parent_id':parent_id,
        'parent_name':parent_name,
        'permissions_list':permissions_list
    }
    return render(request,'auth-edit.html',context=context)

#权限编辑
def auth_edit(request):
    if request.method == 'POST':
        id=request.POST.get('id')
        role_parent_id=request.POST.get('role_parent_id_edit')
        role_name=request.POST.get('role_name')
        role_url=request.POST.get('role_url')
        role_method=request.POST.get('role_method')
        role_arguments=request.POST.get('role_arguments')
        role_desc=request.POST.get('role_desc')
        is_active=request.POST.get('is_active')

        permission=Permission.objects.get(id=id)

        permission.name=role_name
        permission.url=role_url
        permission.per_method=role_method
        permission.argument_list=role_arguments
        permission.describe=role_desc
        permission.is_active=is_active
        permission.parent_id=role_parent_id
        permission.create_time=datetime.now()

        permission.save()



        context={
            'messg':'修改成功'
        }
        return JsonResponse(context)

@login_required
@check_permission
#权限启用和停用
def auth_active(request):
    if request.method == 'POST':
        id=request.POST.get('id')
        is_active=request.POST.get('is_active')
        print(id)
        print(is_active)
        context ={}
        permission=Permission.objects.get(id=id)
        #停用
        if is_active == '1':
            context['messg']='停用成功'
            permission.is_active=0
            permission.save()
            return JsonResponse(context,safe=False)
        # 启用
        if is_active == '0':
            context['messg'] = '启用成功'
            permission.is_active = 1
            permission.save()
            return JsonResponse(context,safe=False)
    else:
        pass

#权限的单个删除
@login_required
@check_permission
def auth_delete(request):
    if request.method == 'POST':
        id=request.POST.get('id')
        print(id)
        context ={}
        permission=Permission.objects.get(id=id).delete()
        context['messg']='删除成功'
        return JsonResponse(context)

    else:
        pass

#权限的批量删除
@login_required
@check_permission
def auth_delete_much(request):
    if request.method == 'POST':
        check_id_list_values = request.POST.get('check_id_list_values')
        check_id_list_values = str(check_id_list_values)
        check_id_list_values = check_id_list_values.split(',')
        print(type(check_id_list_values))
        print(check_id_list_values)
        for check_id_value in check_id_list_values:
            id = int(check_id_value)
            print(id)
            permission = Permission.objects.filter(id=id).delete()

        context={
            'messg':'批量删除成功'
        }
        return JsonResponse(context)




#角色列表
@method_decorator(login_required, name='dispatch')
@method_decorator(check_permission, name='dispatch')
class RoleListView(ListView):
    model = SysRole
    template_name = 'role-list.html'
    context_object_name = 'sysRole_list'
    paginate_by = 8
    ordering = 'create_time'
    page_kwarg = 'p'
    def get_context_data(self, **kwargs):
        context = super(RoleListView, self).get_context_data(*kwargs)
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
        count=SysRole.objects.all().count()

        return {
            'left_pages': left_pages,
            'right_pages': right_pages,
            'current_page': current_page,
            'left_has_more': left_has_more,
            'right_has_more': right_has_more,
            'num_pages': num_pages,
            'count':count
        }


#到角色添加页面
@login_required
@check_permission
def to_role_add(request):
    return render(request,'role_add.html')


#角色添加
def role_add(request):
    if request.method == 'POST':
        role_name =request.POST.get('role_name')
        role_desc=request.POST.get('role_desc')
        is_active=request.POST.get('is_active')
        sysRole=SysRole(
            role_name=role_name,
            desc=role_desc,
            is_active=is_active,
            del_falg=0
        )
        sysRole.save()
        context={
            'messg':"添加成功"
        }
        return JsonResponse(context)
    else:
        return HttpResponse('get')

#到角色编辑页面
@login_required
@check_permission
def to_role_edit(request):
    id=request.GET.get('id')
    print(id)
    sysRole=SysRole.objects.get(id=id)
    role_name=sysRole.role_name
    desc=sysRole.desc
    is_active=sysRole.is_active

    context={
        'id':id,
        'role_name':role_name,
        'desc':desc,
        'is_active':is_active
    }
    return render(request,'role_edit.html',context=context)

#角色编辑
def role_edit(request):
    if request.method == 'POST':
        id=request.POST.get('id')
        role_name=request.POST.get('role_name')
        role_desc=request.POST.get('role_desc')
        is_active=request.POST.get('is_active')

        sysRole=SysRole.objects.get(id=id)

        sysRole.role_name=role_name
        sysRole.is_active=is_active
        sysRole.desc=role_desc

        sysRole.save()


        context={
            'messg':'修改成功'
        }
        return JsonResponse(context)

#角色启用和停用
@login_required
@check_permission
def role_active(request):
    if request.method == 'POST':
        id=request.POST.get('id')
        is_active=request.POST.get('is_active')
        print(id)
        print(is_active)
        context ={}
        sysRole=SysRole.objects.get(id=id)
        #停用
        if is_active == '1':
            context['messg']='停用成功'
            sysRole.is_active=0
            sysRole.save()
            return JsonResponse(context,safe=False)
        # 启用
        if is_active == '0':
            context['messg'] = '启用成功'
            sysRole.is_active = 1
            sysRole.save()
            return JsonResponse(context,safe=False)
    else:
        pass

#角色单个删除
@login_required
@check_permission
def role_delete(request):
    if request.method == 'POST':
        id=request.POST.get('id')
        print(id)
        context ={}
        sysRole=SysRole.objects.get(id=id).delete()
        context['messg']='删除成功'
        return JsonResponse(context)

    else:
        pass


#角色批量删除
@login_required
@check_permission
def role_delete_much(request):
    if request.method == 'POST':
        check_id_list_values = request.POST.get('check_id_list_values')
        check_id_list_values = str(check_id_list_values)
        check_id_list_values = check_id_list_values.split(',')
        print(type(check_id_list_values))
        print(check_id_list_values)
        for check_id_value in check_id_list_values:
            id = int(check_id_value)
            print('==========')
            print(id)
            sysRole = SysRole.objects.filter(id=id).delete()

        context={
            'messg':'批量删除成功'
        }
        return JsonResponse(context)


#到权限配置页面
@login_required
@check_permission
def to_role_auth_view(request):
    role_id=request.GET.get('id')
    print(role_id)
    sysRole=SysRole.objects.get(id=role_id)
    role_name=sysRole.role_name
    desc=sysRole.desc

    #权限树的生成
    auth_idList = []
    auth_pIdList = []
    auth_nameList = []
    permissions = Permission.objects.all()
    for permission in permissions:
        id = permission.id
        pId = permission.parent_id
        name = permission.name

        auth_idList.append(id)
        auth_pIdList.append(pId)
        auth_nameList.append(name)



    #查询已经绑定到该角色下的权限
    sysAuthRoles=SysAuthRole.objects.filter(role_id=role_id)
    permission_id_list=[]
    for sysAuthRole in sysAuthRoles:
        permission_id=sysAuthRole.permission_id.id
        permission_id_list.append(permission_id)

    context={
        'id': role_id,
        'role_name':role_name,
        'desc':desc,
        'auth_idList':auth_idList,
        'auth_pIdList':auth_pIdList,
        'auth_nameList':auth_nameList,
        'permission_id_list':permission_id_list
    }

    return render(request,'role_auth_add.html',context=context)

#添加权限
def roleAuthAdd(request):
    if request.method == 'POST':
        role_id=request.POST.get('role_id')
        #先清空该角色下的权限，再添加
        SysAuthRole.objects.filter(role_id=role_id).delete()

        #添加权限
        check_auth_id_list=request.POST.get('check_auth_id_list')

        check_id_list_values = str(check_auth_id_list)
        check_id_list_values = check_id_list_values.split(',')
        #去除最后一个空的
        check_id_list_values=check_id_list_values[:-1]

        print(check_id_list_values)
        for check_id_value in check_id_list_values:
            permission_id = int(check_id_value)
            permission=Permission.objects.get(id=permission_id)
            sysRole=SysRole.objects.get(id=role_id)
            sysAuthRole=SysAuthRole(
                permission_id=permission,
                role_id=sysRole
            )
            sysAuthRole.save()

        context={
            'messg':'添加权限成功'
        }
        return JsonResponse(context)


#到用户配置页面
@login_required
@check_permission
def to_role_user_view(request):
    role_id = request.GET.get('id')
    print(role_id)
    sysRole = SysRole.objects.get(id=role_id)
    role_name = sysRole.role_name
    desc = sysRole.desc
    #用户信息渲染
    users=User.objects.all()
    users_list=[]
    for user in users:
        user_id=user.id
        username=user.username
        users_dict={
            'user_id':user_id,
            'username':username
        }
        users_list.append(users_dict)

    #查询该角色下的用户信息
    sysUserRoles=SysUserRole.objects.filter(role_id=role_id)
    sysUserRoles_id_list=[]
    for sysUserRole in sysUserRoles:
        user_id=sysUserRole.user_id.id
        sysUserRoles_id_list.append(user_id)

    context = {
        'id':role_id,
        'role_name': role_name,
        'desc': desc,
        'users_list':users_list,
        'sysUserRoles_id_list':sysUserRoles_id_list
    }
    return render(request,'role_user_add.html',context=context)

#添加用户配置
def roleUserAdd(request):
    if request.method == 'POST':
        role_id=request.POST.get('role_id_add')
        #先清空改角色下配置的所有的用户，然后在添加
        sysUserRole=SysUserRole.objects.filter(role_id=role_id).delete()

        role_user_select_list=request.POST.getlist('role_user_select_list')

        for role_user_select in role_user_select_list:
            user_id=int(role_user_select)
            sysRole=SysRole.objects.get(id=role_id)
            user=User.objects.get(id=user_id)
            sysUserRole=SysUserRole(
                user_id=user,
                role_id=sysRole
            )
            sysUserRole.save()

        context={
            'messg':'用户配置成功'
        }
        return JsonResponse(context)
