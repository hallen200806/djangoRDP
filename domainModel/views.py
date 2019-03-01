# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

from django.views.generic import ListView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from auth_role.permission import check_permission
from .models import *
from django.http import HttpResponse,JsonResponse
# Create your views here.


#领域模型列表
@method_decorator(login_required, name='dispatch')
# @method_decorator(check_permission, name='dispatch')
class DomainListView(ListView):
    model = Domain
    template_name = 'domain-list.html'
    context_object_name = 'domain_list'
    paginate_by = 8
    ordering = 'create_time'
    page_kwarg = 'p'
    def get_context_data(self, **kwargs):
        context = super(DomainListView, self).get_context_data(*kwargs)
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
        count=Domain.objects.all().count()

        return {
            'left_pages': left_pages,
            'right_pages': right_pages,
            'current_page': current_page,
            'left_has_more': left_has_more,
            'right_has_more': right_has_more,
            'num_pages': num_pages,
            'count':count
        }

#到领域模型添加页面
# @login_required
# @check_permission
def to_domain_add(request):

    return render(request,'domain-add.html')

#领域模型添加
def domain_add(request):
    if request.method == 'POST':
        domain_name=request.POST.get('domain_name')
        domain_desc=request.POST.get('domain_desc')
        is_active=request.POST.get('is_active')

        domain=Domain(
            name=domain_name,
            desc=domain_desc,
            is_active=is_active,
            del_falg=0
        )
        domain.save()

        context={
            'messg':'添加成功'
        }
        return JsonResponse(context)

#到领域模型编辑页面
# @login_required
# @check_permission
def to_domain_edit(request):
    id=request.GET.get('id')
    print(id)
    domain=Domain.objects.get(id=id)

    name=domain.name
    desc=domain.desc
    create_time=domain.create_time
    is_active=domain.is_active

    context={
        'id':id,
        'name':name,
        'desc':desc,
        'create_time':create_time,
        'is_active':is_active
    }
    return render(request,'domain-edit.html',context=context)

#领域模型编辑
def domain_edit(request):
    if request.method == 'POST':
        id=request.POST.get('id')
        domain_name=request.POST.get('domain_name_edit')
        domain_desc=request.POST.get('domain_desc_edit')
        is_active=request.POST.get('is_active')

        domain=Domain.objects.get(id=id)

        domain.name=domain_name
        domain.desc=domain_desc
        domain.is_active=is_active
        domain.create_time=datetime.now()

        domain.save()



        context={
            'messg':'修改成功'
        }
        return JsonResponse(context)


#领域模型的启用和停用
# @login_required
# @check_permission
def domain_active(request):
    if request.method == 'POST':
        id=request.POST.get('id')
        is_active=request.POST.get('is_active')
        print(id)
        print(is_active)
        context ={}
        permission=Domain.objects.get(id=id)
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


#领域模型的单个删除
# @login_required
# @check_permission
def domain_delete(request):
    if request.method == 'POST':
        id=request.POST.get('id')
        print(id)
        context ={}
        permission=Domain.objects.get(id=id).delete()
        context['messg']='删除成功'
        return JsonResponse(context)

    else:
        pass

#领域模型的批量删除
# @login_required
# @check_permission
def domain_delete_much(request):
    if request.method == 'POST':
        check_id_list_values = request.POST.get('check_id_list_values')
        check_id_list_values = str(check_id_list_values)
        check_id_list_values = check_id_list_values.split(',')
        print(type(check_id_list_values))
        print(check_id_list_values)
        for check_id_value in check_id_list_values:
            id = int(check_id_value)
            print(id)
            permission = Domain.objects.filter(id=id).delete()

        context={
            'messg':'批量删除成功'
        }
        return JsonResponse(context)


#到领域模型属性管理
def to_domain_parms_manage(request):
    return render(request,'domain_parms_manage.html')

def domain_parms_manage(request):
    context={
        'messg':'操作成功'
    }
    return JsonResponse(context)

