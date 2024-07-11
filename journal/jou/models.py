from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField("Почта",unique=True)
    first_name = models.CharField("Имя",max_length=30)
    last_name = models.CharField("Фамилия",max_length=30)
    middle_name = models.CharField("Отчество",max_length=30, null=True, blank=True)
    phone = models.CharField("Телефон",max_length=15, null=True, blank=True)
    ROLE_CHOICES = (
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    )
    role = models.CharField("Роль",max_length=7, choices=ROLE_CHOICES)
    group = models.ForeignKey('Group', null=True, blank=True, on_delete=models.SET_NULL, related_name='users')  # Only for students

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True,
        help_text=(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Group(models.Model):
    name = models.CharField("Название группы",max_length=100)
    year_of_admission = models.IntegerField("Дата поступления")
    year_of_completion = models.IntegerField("Дата выпуска")
    course = models.IntegerField("Курс",null=True, blank=True)

    def __str__(self):
        return self.name


class Subject(models.Model):
    name = models.CharField("Название предмета",max_length=100)

    def __str__(self):
        return self.name


class Sheet(models.Model):
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'teacher'})
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

    def __str__(self):
        return f" {self.subject} {self.group}"


class Attendance(models.Model):
    sheet = models.ForeignKey(Sheet, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    date = models.DateField("Дата")

    def __str__(self):
        return 'V'


class Lab(models.Model):
    sheet = models.ForeignKey(Sheet, on_delete=models.CASCADE)
    name = models.CharField("Название лабораторной работы",max_length=100)
    max_score = models.IntegerField("Максимальная оценка")

    def __str__(self):
        return self.name


class Journal(models.Model):
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'student'})
    grade = models.IntegerField("Оценка")

    def __str__(self):
        return f" {self.grade}"
