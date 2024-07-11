from rest_framework import serializers
from .models import *
from djoser.serializers import UserCreateSerializer, UserSerializer
from rest_framework.exceptions import ValidationError


class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'middle_name', 'phone', 'password', 'role', 'group')

    def create(self, validated_data):
        print(validated_data)  # Add this line to debug
        try:
            return super().create(validated_data)
        except ValidationError as e:
            print(e.detail)  # Add this line to log validation errors
            raise e


class UserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'middle_name', 'phone', 'role', 'group')


class BasicUser(UserSerializer):
    class Meta(UserSerializer.Meta):
        model =User
        fields = ('id','first_name','last_name','group')


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'year_of_admission', 'year_of_completion', 'course']


class MiniGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id','name']


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']


class SheetSerializer(serializers.ModelSerializer):
    teacher = serializers.StringRelatedField(default=serializers.CurrentUserDefault())
    subject = SubjectSerializer()
    group = MiniGroupSerializer()

    class Meta:
        model = Sheet
        fields = '__all__'


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request', None)

        if request and hasattr(request, 'user'):
            user = request.user
            if user.role == 'teacher':
                # Remove the teacher field if the viewer is a teacher
                representation.pop('teacher', None)

        return representation


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
        fields = '__all__'

    def validate(self, attrs):
        user = self.context['request'].user
        lab = attrs.get('lab')

        if lab.sheet.teacher != user:
            raise serializers.ValidationError("You are not the teacher assigned to this sheet.")

        return attrs


class SheetDetailSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer()
    group = GroupSerializer()

    class Meta:
        model = Sheet
        fields = '__all__'


class Sheet2Serializer(serializers.ModelSerializer):
    class Meta:
        model=Sheet
        fields='__all__'


