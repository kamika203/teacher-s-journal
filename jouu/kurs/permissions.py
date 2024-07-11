from rest_framework import permissions

class IsTeacherOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        if hasattr(request.user, 'role'):
            return request.user.role == 'teacher' or request.user.role == 'staff'
        return False

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        if hasattr(request.user, 'role'):
            return request.user.role == 'student'
        return False


class IsTeacherAndSubjectLeader(permissions.BasePermission):
    def has_permission(self, request, view):
        # Check if the user is authenticated and is a teacher
        return request.user.is_authenticated and request.user.role == 'teacher'

    def has_object_permission(self, request, view, obj):
        # Check if the user is the teacher associated with the sheet
        return obj.lab.sheet.teacher == request.user
