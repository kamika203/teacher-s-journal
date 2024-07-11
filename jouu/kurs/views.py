from django.shortcuts import render
from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsTeacherOrStaff, IsStudent, IsTeacherAndSubjectLeader
from djoser.views import UserViewSet
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import views, status
from django.db import transaction

# Create your views here.


class CustomUserViewSet(UserViewSet):
    def create(self, request, *args, **kwargs):
        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by('course','name')
    serializer_class = GroupSerializer
    permission_classes = [AllowAny]


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().order_by('name')
    serializer_class = SubjectSerializer
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update']:
            self.permission_classes = [IsTeacherOrStaff]
        elif self.action in ['list', 'retrieve']:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()


class SheetViewSet(viewsets.ModelViewSet):
    queryset = Sheet.objects.all()
    serializer_class = SheetSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsTeacherOrStaff]
        elif self.action in ['list', 'retrieve']:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return Sheet.objects.filter(teacher=user)
        elif user.role == 'student':
            return Sheet.objects.filter(group=user.group)
        elif user.role == 'staff':
            return Sheet.objects.all()
        return Sheet.objects.none()

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsTeacherOrStaff]
        elif self.action in ['list', 'retrieve']:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()


class LabViewSet(viewsets.ModelViewSet):
    queryset = Lab.objects.all()
    serializer_class = LabSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsTeacherOrStaff]
        elif self.action in ['list', 'retrieve']:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return Lab.objects.filter(sheet__teacher=user)
        elif user.role == 'student':
            return Lab.objects.filter(sheet__group=user.group)
        return Lab.objects.none()

    def perform_create(self, serializer):
        serializer.save()


class JournalViewSet(viewsets.ModelViewSet):
    queryset = Journal.objects.all()
    serializer_class = JournalSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsTeacherOrStaff]
        elif self.action in ['list', 'retrieve']:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()


class JournalBySheetView(viewsets.ModelViewSet):
    serializer_class = JournalSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsTeacherAndSubjectLeader]
        elif self.action in ['list', 'retrieve']:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def get_queryset(self):
        sheet_id = self.kwargs['sheet_id']
        return Journal.objects.filter(lab__sheet_id=sheet_id)

    def perform_create(self, serializer):
        sheet_id = self.kwargs['sheet_id']
        sheet = Sheet.objects.get(id=sheet_id)

        # Ensure the user is the teacher for the sheet
        if sheet.teacher != self.request.user:
            raise serializers.ValidationError("You are not the teacher assigned to this sheet.")

        serializer.save()


class UsersByGroupView(generics.RetrieveAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def get(self, request, *args, **kwargs):
        group = self.get_object()
        students = group.users.filter(role='student').order_by('last_name', 'first_name')
        data = {
            "group": GroupSerializer(group).data,
            "students": [{"id": student.id, "name": f"{student.last_name} {student.first_name} {student.middle_name}", 'email':student.email, "phone": student.phone} for student in students],
        }
        return Response(data)


    # def get_queryset(self):
    #     group_id=self.kwargs['group']
    #     return User.objects.filter(group=group_id)


class SheetDetailView(generics.RetrieveAPIView):
    queryset = Sheet.objects.all()
    serializer_class = SheetDetailSerializer

    def get(self, request, *args, **kwargs):
        sheet = self.get_object()
        students = sheet.group.users.filter(role='student').order_by('last_name', 'first_name')
        labs = Lab.objects.filter(sheet=sheet)
        attendances = Attendance.objects.filter(student__in=students, sheet=sheet)
        journals = Journal.objects.filter(student__in=students, lab__in=labs)

        attendance_by_date = {}
        for attendance in attendances:
            date_str = attendance.date.strftime('%Y-%m-%d')
            if date_str not in attendance_by_date:
                attendance_by_date[date_str] = []
            attendance_by_date[date_str].append(attendance.student_id)

        data = {
            "sheet": SheetDetailSerializer(sheet).data,
            "students": [{"id": student.id, "name": f"{student.last_name} {student.first_name} "} for student in students],
            "labs": [{"id": lab.id, "name": lab.name} for lab in labs],
            "attendances":  attendance_by_date,
            "journals": [{"id": journal.id, "grade": journal.grade, "student": journal.student_id, "lab": journal.lab_id} for journal in journals],
        }
        return Response(data)


class TeachersView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        return User.objects.filter(role='teacher').order_by('last_name', 'first_name')


class Sheet2ViewSet(viewsets.ModelViewSet):
    queryset = Sheet.objects.all()
    serializer_class = Sheet2Serializer

    def perform_create(self, serializer):
        serializer.save()


class BulkCreateUpdateJournal(views.APIView):
    def post(self, request, *args, **kwargs):
        data = request.data

        try:
            with transaction.atomic():
                for entry in data:
                    journal_id = entry.get('id')
                    if journal_id:
                        # Update existing entry
                        journal = Journal.objects.get(id=journal_id)
                        journal.grade = entry.get('grade', journal.grade)
                        journal.save()
                    else:
                        # Create new entry
                        Journal.objects.create(
                            lab=Lab.objects.get(id=entry['lab_id']),
                            student=User.objects.get(id=entry['student_id']),
                            grade=entry['grade']
                        )
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
