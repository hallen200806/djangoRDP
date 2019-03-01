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
from django.conf.urls import url,include
from django.contrib import admin

urlpatterns = [
    url(r'', include('main.urls',namespace='main')),
    url(r'auth_user/', include('auth_user.urls',namespace='auth_user')),
    url(r'statistics/', include('statistics.urls',namespace='statistics')),
    url(r'menu_manage/', include('menu_manage.urls',namespace='menu_manage')),
    url(r'auth_role/', include('auth_role.urls',namespace='auth_role')),
    url(r'domainModel/', include('domainModel.urls',namespace='domainModel')),
]
