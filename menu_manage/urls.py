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
    url(r'menu_list/', views.MenuListView.as_view(),name='menu_list'),
    url(r'menu_ajax_list/', views.menu_ajax_list,name='menu_ajax_list'),
    url(r'to_menu_add/', views.to_menu_add,name='to_menu_add'),
    url(r'menu_add/', views.menu_add,name='menu_add'),
    url(r'to_menu_edit/', views.to_menu_edit,name='to_menu_edit'),
    url(r'menu_edit/', views.menu_edit,name='menu_edit'),
    url(r'menu_active/', views.menu_active,name='menu_active'),
    url(r'menu_delete/', views.menu_delete,name='menu_delete'),
    url(r'mune_search/', views.mune_search,name='mune_search'),
    url(r'mune_delete_much/', views.mune_delete_much,name='mune_delete_much'),
]
