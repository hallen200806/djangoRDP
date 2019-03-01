# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from datetime import datetime
class MenuManage(models.Model):
    id=models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    is_active = models.IntegerField()
    del_falg = models.IntegerField()
    parent_id = models.IntegerField()
    icon = models.CharField(max_length=255, blank=True, null=True)
    desc = models.CharField(max_length=255, blank=True, null=True)
    path = models.CharField(max_length=255, blank=True, null=True)
    create_time = models.DateTimeField(blank=True, null=True,default=datetime.now())
    class Meta:
        db_table = 'menu_manage'
