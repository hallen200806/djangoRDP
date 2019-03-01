# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

#统计图模块

#折线图
def line_view(request):
    return render(request,'echarts_line.html')

#柱状图
def bar_view(request):
    return render(request,'echarts_bar.html')

#地图
def map_view(request):
    return render(request,'echarts_map.html')

#饼图
def pie_view(request):
    return render(request,'echarts_pie.html')

#雷达图
def radar_view(request):
    return render(request,'echarts_radar.html')

#K线图
def k_line_view(request):
    return render(request,'echarts_k_line.html')

#热力图
def thermodynamic_view(request):
    return render(request,'echarts_thermodynamic.html')

# 仪表图
def meter_view(request):
    return render(request,'echarts_meter.html')