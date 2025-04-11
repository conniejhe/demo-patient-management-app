from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils.translation import gettext_lazy as _
from rest_framework import exceptions, serializers

from .models import Patient, PatientAddress, PatientCustomFieldValue, CustomField

User = get_user_model()


class UserCurrentSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name"]


class UserCurrentErrorSerializer(serializers.Serializer):
    username = serializers.ListSerializer(child=serializers.CharField(), required=False)
    first_name = serializers.ListSerializer(
        child=serializers.CharField(), required=False
    )
    last_name = serializers.ListSerializer(
        child=serializers.CharField(), required=False
    )


class UserChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={"input_type": "password"}, write_only=True)
    password_new = serializers.CharField(style={"input_type": "password"})
    password_retype = serializers.CharField(
        style={"input_type": "password"}, write_only=True
    )

    default_error_messages = {
        "password_mismatch": _("Current password is not matching"),
        "password_invalid": _("Password does not meet all requirements"),
        "password_same": _("Both new and current passwords are same"),
    }

    class Meta:
        model = User
        fields = ["password", "password_new", "password_retype"]

    def validate(self, attrs):
        request = self.context.get("request", None)

        if not request.user.check_password(attrs["password"]):
            raise serializers.ValidationError(
                {"password": self.default_error_messages["password_mismatch"]}
            )

        try:
            validate_password(attrs["password_new"])
        except ValidationError as e:
            raise exceptions.ValidationError({"password_new": list(e.messages)}) from e

        if attrs["password_new"] != attrs["password_retype"]:
            raise serializers.ValidationError(
                {"password_retype": self.default_error_messages["password_invalid"]}
            )

        if attrs["password_new"] == attrs["password"]:
            raise serializers.ValidationError(
                {"password_new": self.default_error_messages["password_same"]}
            )
        return super().validate(attrs)


class UserChangePasswordErrorSerializer(serializers.Serializer):
    password = serializers.ListSerializer(child=serializers.CharField(), required=False)
    password_new = serializers.ListSerializer(
        child=serializers.CharField(), required=False
    )
    password_retype = serializers.ListSerializer(
        child=serializers.CharField(), required=False
    )


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={"input_type": "password"}, write_only=True)
    password_retype = serializers.CharField(
        style={"input_type": "password"}, write_only=True
    )

    default_error_messages = {
        "password_mismatch": _("Password are not matching."),
        "password_invalid": _("Password does not meet all requirements."),
    }

    class Meta:
        model = User
        fields = ["username", "password", "password_retype"]

    def validate(self, attrs):
        password_retype = attrs.pop("password_retype")

        try:
            validate_password(attrs.get("password"))
        except exceptions.ValidationError:
            self.fail("password_invalid")

        if attrs["password"] == password_retype:
            return attrs

        return self.fail("password_mismatch")

    def create(self, validated_data):
        with transaction.atomic():
            user = User.objects.create_user(**validated_data)

        return user


class UserCreateErrorSerializer(serializers.Serializer):
    username = serializers.ListSerializer(child=serializers.CharField(), required=False)
    password = serializers.ListSerializer(child=serializers.CharField(), required=False)
    password_retype = serializers.ListSerializer(
        child=serializers.CharField(), required=False
    )

    
class PatientCustomFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomField
        fields = ['id', 'name', 'field_type', 'description']

class PatientCustomFieldValueSerializer(serializers.ModelSerializer):
    custom_field = PatientCustomFieldSerializer()
    class Meta:
        model = PatientCustomFieldValue
        fields = ['custom_field', 'value']

class PatientAddressListSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientAddress
        fields = ['address_type', 'full_address', 'is_primary']

class PatientAddressCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientAddress
        fields = ['address_type', 'street_address', 'city', 'state', 'postal_code', 'is_primary']

class PatientCustomFieldValueCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientCustomFieldValue
        fields = ['custom_field', 'text_value', 'number_value']

class PatientCustomFieldValueListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for displaying custom field values in list view.
    """
    custom_field = serializers.CharField(source='custom_field.name')

    class Meta:
        model = PatientCustomFieldValue
        fields = ['custom_field', 'value']

class PatientListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing patients in a table view with simplified address display.
    """
    addresses = PatientAddressListSerializer(many=True)
    custom_field_values = PatientCustomFieldValueListSerializer(many=True)

    class Meta:
        model = Patient
        fields = ['id', 'full_name', 'first_name', 'middle_name', 'last_name', 'date_of_birth', 'status', 'created_at', 'addresses', 'custom_field_values']

class PatientCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating patients with detailed address fields.
    """
    addresses = PatientAddressCreateSerializer(many=True)
    custom_field_values = PatientCustomFieldValueCreateSerializer(many=True, required=False)

    class Meta:
        model = Patient
        fields = [
            'first_name', 
            'middle_name',
            'last_name', 
            'date_of_birth', 
            'status',
            'addresses',
            'custom_field_values'
        ]

    def create(self, validated_data):
        addresses_data = validated_data.pop('addresses')
        custom_field_values_data = validated_data.pop('custom_field_values', [])
        
        patient = Patient.objects.create(**validated_data)
        
        for address_data in addresses_data:
            PatientAddress.objects.create(patient=patient, **address_data)
            
        for field_value_data in custom_field_values_data:
            PatientCustomFieldValue.objects.create(patient=patient, **field_value_data)
            
        return patient

    def update(self, instance, validated_data):
        addresses_data = validated_data.pop('addresses', [])
        custom_field_values_data = validated_data.pop('custom_field_values', [])
        
        # Update patient fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update addresses
        instance.addresses.all().delete()  # Remove existing addresses
        for address_data in addresses_data:
            PatientAddress.objects.create(patient=instance, **address_data)
            
        # Update custom field values
        instance.custom_field_values.all().delete()  # Remove existing values
        for field_value_data in custom_field_values_data:
            PatientCustomFieldValue.objects.create(patient=instance, **field_value_data)
            
        return instance
