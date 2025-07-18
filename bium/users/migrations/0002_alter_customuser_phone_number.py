# Generated by Django 5.2.1 on 2025-07-04 07:31

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='phone_number',
            field=models.CharField(blank=True, max_length=11, null=True, unique=True, validators=[django.core.validators.RegexValidator(regex='^01([0|1|6|7|8|9]?)-?(\\d{3,4})-?(\\d{4})$')]),
        ),
    ]
