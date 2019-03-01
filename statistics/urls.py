"""DJSystem URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from . import views
urlpatterns = [
    url(r'line_view/', views.line_view,name='line_view'),
    url(r'bar_view/', views.bar_view,name='bar_view'),
    url(r'map_view/', views.map_view,name='map_view'),
    url(r'pie_view/', views.pie_view,name='pie_view'),
    url(r'radar_view/', views.radar_view,name='radar_view'),
    url(r'k_line_view/', views.k_line_view,name='k_line_view'),
    url(r'thermodynamic_view/', views.thermodynamic_view,name='thermodynamic_view'),
    url(r'meter_view/', views.meter_view,name='meter_view'),
]
