from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

# Register your models here.


class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('middle_name', 'phone', 'role', 'group')}),
    )


admin.site.register(User, CustomUserAdmin)
admin.site.register(Group)
admin.site.register(Subject)
admin.site.register(Sheet)
admin.site.register(Attendance)
admin.site.register(Lab)
admin.site.register(Journal)
