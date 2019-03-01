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

    url(r'domain_list/', views.DomainListView.as_view(),name='domain_list'),
    url(r'to_domain_add/', views.to_domain_add,name='to_domain_add'),
    url(r'domain_add/', views.domain_add,name='domain_add'),
    url(r'to_domain_edit/', views.to_domain_edit,name='to_domain_edit'),
    url(r'domain_edit/', views.domain_edit,name='domain_edit'),
    url(r'domain_active/', views.domain_active,name='domain_active'),
    url(r'domain_delete/', views.domain_delete,name='domain_delete'),
    url(r'domain_delete_much/', views.domain_delete_much,name='domain_delete_much'),
    url(r'to_domain_parms_manage/', views.to_domain_parms_manage,name='to_domain_parms_manage'),
    url(r'domain_parms_manage/', views.domain_parms_manage,name='domain_parms_manage'),

]
