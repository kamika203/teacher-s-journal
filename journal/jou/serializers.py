from rest_framework import serializers
from .models import User, Group, Subject, Sheet, Attendance, Lab, Journal
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer, UserSerializer as BaseUserSerializer





# class UserRegistrationSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)
#
#     class Meta:
#         model = User
#         fields = ['username', 'email', 'first_name', 'last_name', 'middle_name', 'phone', 'role', 'group', 'password']
#
#     def create(self, validated_data):
#         user = User(
#             username=validated_data['username'],
#             email=validated_data['email'],
#             first_name=validated_data['first_name'],
#             last_name=validated_data['last_name'],
#             middle_name=validated_data.get('middle_name'),
#             phone=validated_data.get('phone'),
#             role=validated_data['role'],
#             group=validated_data.get('group'),
#         )
#         user.set_password(validated_data['password'])
#         user.save()
#         return user


class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'middle_name', 'phone', 'password', 'role', 'group')



class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'middle_name', 'phone', 'role', 'group')


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'year_of_admission', 'year_of_completion', 'course']


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']


class SheetSerializer(serializers.ModelSerializer):
    teacher = serializers.HiddenField(default=serializers.CurrentUserDefault)

    class Meta:
        model = Sheet
        fields = ['id', 'teacher', 'subject', 'group']


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ['id', 'sheet', 'student', 'date']


class LabSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lab
        fields = ['id', 'sheet', 'name', 'max_score']


class JournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journal
        fields = ['id', 'lab', 'student', 'grade']



