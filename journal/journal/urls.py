"""
URL configuration for journal project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from jou.views import *
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'sheets', SheetViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'labs', LabViewSet)
router.register(r'journals', JournalViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/csrf/', csrf_token_view, name='csrf_token'),
    path('api/v1/auth/bd/', include(router.urls)),
    path('api/v1/auth/', include('djoser.urls')),
    path('api/v1/auth/', include('djoser.urls.authtoken')),

    # path('accounts/profile/', include(router.urls)),
    # path('api/v1/auth/', include('rest_framework.urls')),
    path('api/v1/login/', login_view),
    #path('api/v1/token/', obtain_auth_token, name='api_token_auth'),
    #path('api/v1/register/', UserRegistrationView.as_view(), name='user_registration'),
]
