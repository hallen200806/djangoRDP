# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from datetime import datetime

# Create your models here.

class Domain(models.Model):
    id=models.IntegerField(primary_key=True)
    name = models.CharField("领域模型名称", max_length=64)
    is_active = models.IntegerField()
    del_falg = models.IntegerField()
    desc = models.CharField('描述', max_length=255)
    create_time = models.DateTimeField(blank=True, null=True, default=datetime.now())
    class Meta:
        db_table='sys_domain'
