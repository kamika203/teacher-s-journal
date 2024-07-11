from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.teacher == request.user

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        if hasattr(request.user, 'role'):
            return request.user.role == 'teacher'
        return False

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        if hasattr(request.user, 'role'):
            return request.user.role == 'student'
        return False
