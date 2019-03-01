#coding=UTF-8
#author:hailong
from django.contrib.auth.models import User
from django.shortcuts import render
from auth_role.models import *
from django.db.models import Q
from django.core.urlresolvers import resolve   #此方法可以将url地址转换成url的name

def perm_check(request, *args, **kwargs):
    url_obj = resolve(request.path_info)
    url_name = url_obj.url_name
    print(url_name)
    perm_name = ''
    #权限必须和urlname配合使得
    if url_name:
        #获取请求方法，和请求参数
        url_method, url_args = request.method, request.GET
        url_args_list = []
        if url_method == 'GET':
            url_method=1
        if url_method == 'POST':
            url_method=2
        # print('=======url_args==========')
        # print(url_args)
        #将各个参数名用逗号隔开组成字符串，因为数据库中是这样存的
        for k in url_args.keys():
            print(str(k))
            url_args_list.append(str(k))

        url_args_list = ','.join(url_args_list)
        #操作数据库
        #获取登录用户信息
        username=request.session['uname']
        # print('======username====')
        # print(username)
        user=User.objects.get(username=username)
        user_id=user.id
        # print('======user_id====')
        # print(user_id)
        #获取该用户下绑定的角色,一个用户可以有多个角色
        sysUserRoles=SysUserRole.objects.filter(user_id=user_id)
        for sysUserRole in sysUserRoles:
            role_id=sysUserRole.role_id.id
            # print('======role_id====')
            # print(role_id)
            #获取该角色下绑定的所有权限，一个角色可以有多个权限
            sysAuthRoles=SysAuthRole.objects.filter(role_id=role_id)
            for sysAuthRole in sysAuthRoles:
                permission_id=sysAuthRole.permission_id.id
                url=sysAuthRole.permission_id.url
                # print('======permission_id====')
                # print(permission_id)
                #如果不等于，则
                if url_name != url:
                    print('---->权限没有匹配')
                    continue
                else:
                    get_perm = Permission.objects.filter(id=permission_id,url=url_name,per_method=url_method,argument_list=url_args_list)
                    print(len(get_perm))
                    if get_perm:
                        for i in get_perm:
                            perm_name = i.name
                            perm_str = 'school.%s' % perm_name
                            if request.user.has_perm(perm_str):
                                print('====》权限已匹配')
                                return True
                            else:
                                print('---->权限没有匹配')
                                return False
                    else:
                        return False
    else:
        return False   #没有权限设置，默认不放过


def check_permission(fun):    #定义一个装饰器，在views中应用
    def wapper(request, *args, **kwargs):
        if perm_check(request, *args, **kwargs):  #调用上面的权限验证方法
            return fun(request, *args, **kwargs)
        return render(request, '403.html', locals())
    return wapper