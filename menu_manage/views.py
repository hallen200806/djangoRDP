# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json

from django.core.paginator import Paginator
from django.shortcuts import render
from models import *
from django.views.generic import ListView
from django.http import JsonResponse,HttpResponse
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from auth_role.permission import check_permission
# Create your views here.

#菜单列表
@method_decorator(login_required, name='dispatch')
@method_decorator(check_permission, name='dispatch')
class MenuListView(ListView):
    model = MenuManage
    template_name = 'menu-list.html'
    context_object_name = 'menuManage_list'
    paginate_by = 8
    ordering = 'create_time'
    page_kwarg = 'p'

    def get_context_data(self, **kwargs):
        context = super(MenuListView, self).get_context_data(*kwargs)
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
        count=MenuManage.objects.all().count()

        comment_list = []
        # 一级
        # 获取kvm_info信息
        menuManages = MenuManage.objects.all()
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

        # parent_id列表，为了识别是否有下级菜单
        menuManage_list = []
        menuManages = MenuManage.objects.all()
        for menuManage in menuManages:
            parent_id = menuManage.parent_id
            menuManage_list.append(parent_id)

        return {
            'left_pages': left_pages,
            'right_pages': right_pages,
            'current_page': current_page,
            'left_has_more': left_has_more,
            'right_has_more': right_has_more,
            'num_pages': num_pages,
            'count':count,
            'ret': ret
        }

#左侧点击生成列表
# @login_required
# @check_permission
def menu_ajax_list(request):
    if request.method == 'POST':
        id=request.POST.get('id')
        print(id)
        menu_list = []
        menuManages=MenuManage.objects.filter(parent_id=id)
        # 父节点名称
        parent_menuManage=MenuManage.objects.get(id=id)
        parent_name = parent_menuManage.name
        # 父节点名称

        for menuManage in menuManages:
            name=menuManage.name
            id=menuManage.id
            create_time=menuManage.create_time
            desc=menuManage.desc
            is_active=menuManage.is_active
            menuManage_dict={
                'id':id,
                'name':name,
                'parent_name':parent_name,
                # 'create_time':create_time,
                'create_time':'2019/01/13',
                'desc':desc,
                'is_active':is_active
            }
            menu_list.append(menuManage_dict)

        print(len(menu_list))

        # response = JsonResponse(menu_list,safe=False)
        # return response
        result = json.dumps(menu_list)
        return HttpResponse(json.dumps(menu_list),content_type='application/json')
    else:
        pass

#到菜单添加页面
@login_required
@check_permission
def to_menu_add(request):
    # 菜单下拉菜单
    menuManage_list = MenuManage.objects.all()
    context={
        'menuManage_list':menuManage_list
    }
    return render(request, 'menu-add.html',context=context)

#菜单添加
def menu_add(request):
    if request.method == 'POST':
        name =request.POST.get('name')
        parent_id=request.POST.get('parent_id')
        icon=request.POST.get('icon')
        is_active=request.POST.get('is_active')
        desc=request.POST.get('desc')
        path=request.POST.get('path')
        menuManage=MenuManage(
            name=name,
            parent_id=parent_id,
            is_active=is_active,
            desc=desc,
            path=path,
            del_falg=0
        )
        menuManage.save()
        context={
            'messg':"添加成功"
        }
        return JsonResponse(context)
    else:
        return HttpResponse('get')

#到菜单编辑页面
@login_required
@check_permission
def to_menu_edit(request):
    id=request.GET.get('id')
    print(id)
    menuManage=MenuManage.objects.get(id=id)
    name=menuManage.name
    parent_id=menuManage.parent_id
    icon=menuManage.icon
    is_active=menuManage.is_active
    desc=menuManage.desc
    path=menuManage.path

    #查找父节点的名称
    parent_name=''
    if parent_id != 0:
        menuManage=MenuManage.objects.get(id=parent_id)
        parent_name=menuManage.name

    # 菜单下拉菜单
    menuManage_list = MenuManage.objects.all()

    context={
        'id':id,
        'name':name,
        'parent_name':parent_name,
        'parent_id':parent_id,
        'icon':icon,
        'is_active':is_active,
        'desc':desc,
        'path':path,
        'menuManage_list':menuManage_list
    }
    return render(request,'menu-edit.html',context=context)

#菜单编辑
def menu_edit(request):
    if request.method == 'POST':
        id=request.POST.get('id')
        name=request.POST.get('name')
        parent_id=request.POST.get('parent_id')
        icon=request.POST.get('icon')
        is_active=request.POST.get('is_active')
        desc=request.POST.get('desc')
        path=request.POST.get('path')

        menuManage=MenuManage.objects.get(id=id)

        menuManage.name=name
        menuManage.parent_id=parent_id
        menuManage.icon=icon
        menuManage.is_active=is_active
        menuManage.desc=desc
        menuManage.path=path
        menuManage.create_time = datetime.now()
        menuManage.save()


        context={
            'messg':'修改成功'
        }
        return JsonResponse(context)

#菜单启用和停用
@login_required
@check_permission
def menu_active(request):
    if request.method == 'POST':
        id=request.POST.get('id')
        is_active=request.POST.get('is_active')
        # print(id)
        # print(is_active)
        menuManage=MenuManage.objects.get(id=id)
        #停用
        if is_active == '1':
            menuManage.is_active=0
            menuManage.save()
            context = {
                'messg': '停用成功'
            }
            return JsonResponse(context)
        # 启用
        if is_active == '0':
            menuManage.is_active = 1
            menuManage.save()
            context = {
                'messg': '启用成功'
            }
            return JsonResponse(context)
    else:
        pass

#菜单单个删除
@login_required
@check_permission
def menu_delete(request):
    if request.method == 'POST':
        id=request.POST.get('id')
        print(id)
        context ={}
        menuManage=MenuManage.objects.get(id=id).delete()
        context['messg']='删除成功'
        return JsonResponse(context)

    else:
        pass

#搜索
def mune_search(request):
    if request.method == 'POST':
        name=request.POST.get('name')
        print(name)
        menuManages_list=[]
        menuManages=MenuManage.objects.filter(name=name,del_falg=0)
        for menuManage in menuManages:
            name=menuManage.name
            level=menuManage.level
            create_time=menuManage.create_time
            desc = menuManage.desc
            is_active=menuManage.is_active
            menuManage_dict={
                'name':name,
                'level':level,
                'create_time':create_time,
                'desc':desc,
                'is_active':is_active
            }
            menuManages_list.append(menuManage_dict)


        page_num = request.GET.get('page_num')
        if page_num == None:
            page_num = 1
        else:
            page_num = int(page_num)

        # 分页，传入数据，每页10条
        paginator = Paginator(menuManages_list, 7)
        # 如果不输入页数，默认显示第一页
        # 获取所有页的当前页
        page = paginator.page(page_num)
        menuManages_list = page.object_list

        context = {
            'hive_col_tbl_db_list': menuManages_list,
            'page_range': paginator.page_range,
            'page': page,
        }
        # return render(request, 'menu-list.html', context=context)
        return HttpResponse('search')

#菜单批量删除
@login_required
@check_permission
def mune_delete_much(request):
    if request.method == 'POST':
        check_id_list_values = request.POST.get('check_id_list_values')
        check_id_list_values = str(check_id_list_values)
        check_id_list_values = check_id_list_values.split(',')
        print(type(check_id_list_values))
        print(check_id_list_values)
        for check_id_value in check_id_list_values:
            id = int(check_id_value)
            print(id)
            senPolicyRef = MenuManage.objects.filter(id=id).delete()

        context={
            'messg':'批量删除成功'
        }
        return JsonResponse(context)
