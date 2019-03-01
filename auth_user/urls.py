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
    url(r'AdminListView/', views.AdminListView.as_view(),name='AdminListView'),
    url(r'to_admin_add/', views.to_admin_add,name='to_admin_add'),
    url(r'admin_add/', views.admin_add,name='admin_add'),
    url(r'to_admin_edit/', views.to_admin_edit,name='to_admin_edit'),
    url(r'admin_edit/', views.admin_edit,name='admin_edit'),
    url(r'admin_active/', views.admin_active,name='admin_active'),
    url(r'admin_delete/', views.admin_delete,name='admin_delete'),
    url(r'admin_delete_much/', views.admin_delete_much,name='admin_delete_much'),

]
