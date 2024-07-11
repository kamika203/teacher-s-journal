"""
URL configuration for jouu project.

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
from django.urls import path, include, re_path
from kurs.views import *
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'groups', GroupViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'sheets', SheetViewSet)
router.register(r'sheets2', Sheet2ViewSet, basename='sheets2')
router.register(r'userss', CustomUserViewSet, basename='users')
router.register(r'users', UserViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'labs', LabViewSet)
router.register(r'journals', JournalViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include(router.urls)),
    path('api/v1/auth/', include('djoser.urls')),
    re_path('api/v1/auth/', include('djoser.urls.authtoken')),
    path('api/v1/auth/journals/sheet/<int:sheet_id>/', JournalBySheetView.as_view({'get':'list'}), name='journal-by-sheet'),
    path('api/v1/auth/group/students/<int:pk>/', UsersByGroupView.as_view(), name='users-by-group'),
    path('api/v1/auth/sheet/<int:pk>/', SheetDetailView.as_view(), name='sheet-detail'),
    path('api/v1/auth/teachers/', TeachersView.as_view({'get':'list'}), name='teachers'),
    path('api/v1/auth/journal/bulk_create_update/', BulkCreateUpdateJournal.as_view(), name='bulk-create-update-journal'),


]
