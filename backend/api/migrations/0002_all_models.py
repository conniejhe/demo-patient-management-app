# Generated by Django 5.1.4 on 2025-04-11 05:11

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=100, verbose_name='first name')),
                ('middle_name', models.CharField(blank=True, max_length=100, null=True, verbose_name='middle name')),
                ('last_name', models.CharField(max_length=100, verbose_name='last name')),
                ('date_of_birth', models.DateField(verbose_name='date of birth')),
                ('status', models.CharField(choices=[('INQUIRY', 'Inquiry'), ('ONBOARDING', 'Onboarding'), ('ACTIVE', 'Active'), ('CHURNED', 'Churned')], default='INQUIRY', max_length=20, verbose_name='status')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created at')),
                ('modified_at', models.DateTimeField(auto_now=True, verbose_name='modified at')),
            ],
            options={
                'verbose_name': 'patient',
                'verbose_name_plural': 'patients',
                'db_table': 'patients',
            },
        ),
        migrations.CreateModel(
            name='CustomField',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100, verbose_name='field name')),
                ('field_type', models.CharField(choices=[('TEXT', 'Text'), ('NUMBER', 'Number')], default='TEXT', max_length=20, verbose_name='field type')),
                ('description', models.TextField(blank=True, null=True, verbose_name='description')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created at')),
                ('modified_at', models.DateTimeField(auto_now=True, verbose_name='modified at')),
                ('provider', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='custom_fields', to=settings.AUTH_USER_MODEL, verbose_name='provider')),
            ],
            options={
                'verbose_name': 'custom field',
                'verbose_name_plural': 'custom fields',
                'db_table': 'custom_fields',
                'unique_together': {('provider', 'name')},
            },
        ),
        migrations.CreateModel(
            name='PatientAddress',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('address_type', models.CharField(choices=[('HOME', 'Home'), ('WORK', 'Work')], default='HOME', max_length=4, verbose_name='address type')),
                ('street_address', models.CharField(max_length=255, verbose_name='street address')),
                ('city', models.CharField(max_length=100, verbose_name='city')),
                ('state', models.CharField(choices=[('CA', 'California'), ('NY', 'New York'), ('TX', 'Texas'), ('FL', 'Florida'), ('IL', 'Illinois'), ('MA', 'Massachusetts'), ('WA', 'Washington')], default='CA', max_length=2, verbose_name='state')),
                ('postal_code', models.CharField(max_length=20, verbose_name='postal code')),
                ('is_primary', models.BooleanField(default=False, verbose_name='primary address')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created at')),
                ('modified_at', models.DateTimeField(auto_now=True, verbose_name='modified at')),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='addresses', to='api.patient')),
            ],
            options={
                'verbose_name': 'patient address',
                'verbose_name_plural': 'patient addresses',
                'db_table': 'patient_addresses',
            },
        ),
        migrations.CreateModel(
            name='PatientCustomFieldValue',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('text_value', models.TextField(blank=True, null=True, verbose_name='text value')),
                ('number_value', models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True, verbose_name='number value')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created at')),
                ('modified_at', models.DateTimeField(auto_now=True, verbose_name='modified at')),
                ('custom_field', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='field_values', to='api.customfield')),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='custom_field_values', to='api.patient')),
            ],
            options={
                'verbose_name': 'patient custom field value',
                'verbose_name_plural': 'patient custom field values',
                'db_table': 'patient_custom_field_values',
                'unique_together': {('patient', 'custom_field')},
            },
        ),
    ]
