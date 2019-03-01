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

    url(r'auth_list/', views.AuthListView.as_view(),name='auth_list'),
    url(r'to_auth_add/', views.to_auth_add,name='to_auth_add'),
    url(r'auth_add/', views.auth_add,name='auth_add'),
    url(r'to_auth_edit/', views.to_auth_edit,name='to_auth_edit'),
    url(r'auth_edit/', views.auth_edit,name='auth_edit'),
    url(r'auth_active/', views.auth_active,name='auth_active'),
    url(r'auth_delete/', views.auth_delete,name='auth_delete'),
    url(r'auth_delete_much/', views.auth_delete_much,name='auth_delete_much'),



    url(r'role_list/', views.RoleListView.as_view(),name='role_list'),
    url(r'to_role_add/', views.to_role_add,name='to_role_add'),
    url(r'role_add/', views.role_add,name='role_add'),
    url(r'to_role_edit/', views.to_role_edit,name='to_role_edit'),
    url(r'role_edit/', views.role_edit,name='role_edit'),
    url(r'role_active/', views.role_active,name='role_active'),
    url(r'role_delete/', views.role_delete,name='role_delete'),
    url(r'role_delete_much/', views.role_delete_much,name='role_delete_much'),
    url(r'to_role_auth_view/', views.to_role_auth_view,name='to_role_auth_view'),
    url(r'roleAuthAdd/', views.roleAuthAdd,name='roleAuthAdd'),
    url(r'to_role_user_view/', views.to_role_user_view,name='to_role_user_view'),
    url(r'roleUserAdd/', views.roleUserAdd, name='roleUserAdd'),
]
