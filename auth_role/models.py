# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from datetime import datetime

# from django.contrib.auth.models import User
from django.conf import settings

#角色表
class SysRole(models.Model):
    id=models.IntegerField(primary_key=True)
    role_name = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.IntegerField()
    del_falg = models.IntegerField()
    desc = models.CharField(max_length=255, blank=True, null=True)
    create_time = models.DateTimeField(blank=True, null=True,default=datetime.now())
    class Meta:
        db_table = 'sys_role'

#权限表
class Permission(models.Model):
    id=models.IntegerField(primary_key=True)
    name = models.CharField("权限名称", max_length=64)
    url = models.CharField('URL名称', max_length=255)
    per_method = models.SmallIntegerField('请求方法',default=1)#(1, 'GET'), (2, 'POST')
    argument_list = models.CharField('参数列表', max_length=255, help_text='多个参数之间用英文半角逗号隔开', blank=True, null=True)
    is_active = models.IntegerField()
    del_falg = models.IntegerField()
    parent_id = models.IntegerField()
    describe = models.CharField('描述', max_length=255)
    create_time = models.DateTimeField(blank=True, null=True, default=datetime.now())

    def __str__(self):
        return self.name

    class Meta:
        db_table='sys_permission'
        verbose_name = '权限表'
        verbose_name_plural = verbose_name
        #权限信息，这里定义的权限的名字，后面是描述信息，描述信息是在django admin中显示权限用的
        # permissions = (
        #     ('students_list', '查看学员信息表'),
        #     ('views_student_info', '查看学员详细信息'),
        # )

#角色权限关联表sys_auth_role
class SysAuthRole(models.Model):
    id = models.IntegerField(primary_key=True)
    permission_id = models.ForeignKey('Permission', models.DO_NOTHING, blank=True, null=True,db_column='permission_id')
    role_id = models.ForeignKey('SysRole', models.DO_NOTHING, blank=True, null=True,db_column='role_id')
    create_time = models.DateTimeField(blank=True, null=True,default=datetime.now())

    class Meta:
        db_table = 'sys_auth_role'


#用户角色关联表sys_user_role

class SysUserRole(models.Model):
    id = models.IntegerField(primary_key=True)
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, models.DO_NOTHING, blank=True, null=True,db_column='user_id')
    role_id = models.ForeignKey(SysRole, models.DO_NOTHING, blank=True, null=True,db_column='role_id')
    create_time = models.DateTimeField(blank=True, null=True,default=datetime.now())

    class Meta:
        db_table = 'sys_user_role'
