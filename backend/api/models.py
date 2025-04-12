from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    modified_at = models.DateTimeField(_("modified at"), auto_now=True)

    class Meta:
        db_table = "users"
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def __str__(self):
        return self.email if self.email else self.username

class PatientStatus(models.TextChoices):
    INQUIRY = 'INQUIRY', _('Inquiry')
    ONBOARDING = 'ONBOARDING', _('Onboarding')
    ACTIVE = 'ACTIVE', _('Active')
    CHURNED = 'CHURNED', _('Churned')

class StateChoices(models.TextChoices):
    CA = 'CA', _('California')
    NY = 'NY', _('New York')
    TX = 'TX', _('Texas')
    FL = 'FL', _('Florida')
    IL = 'IL', _('Illinois')
    MA = 'MA', _('Massachusetts')
    WA = 'WA', _('Washington')
    # Add more states as needed for your MVP

class AddressType(models.TextChoices):
    HOME = 'HOME', _('Home')
    WORK = 'WORK', _('Work')

class CustomFieldType(models.TextChoices):
    TEXT = 'TEXT', _('Text')
    NUMBER = 'NUMBER', _('Number')

class CustomField(models.Model):
    id = models.AutoField(primary_key=True)
    provider = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="custom_fields",
        verbose_name=_("provider")
    )
    name = models.CharField(_("field name"), max_length=100)
    field_type = models.CharField(
        _("field type"),
        max_length=20,
        choices=CustomFieldType.choices
    )
    description = models.TextField(_("description"), blank=True, null=True)
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    modified_at = models.DateTimeField(_("modified at"), auto_now=True)

    class Meta:
        db_table = "custom_fields"
        verbose_name = _("custom field")
        verbose_name_plural = _("custom fields")
        unique_together = ['provider', 'name']

    def __str__(self):
        return f"{self.name} ({self.get_field_type_display()})"

class Patient(models.Model):
    id = models.AutoField(primary_key=True)
    provider = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="patients",
        verbose_name=_("provider")
    )
    first_name = models.CharField(_("first name"), max_length=100)
    middle_name = models.CharField(_("middle name"), max_length=100, blank=True, null=True)
    last_name = models.CharField(_("last name"), max_length=100)
    date_of_birth = models.DateField(_("date of birth"))
    status = models.CharField(
        _("status"),
        max_length=20,
        choices=PatientStatus.choices,
    )
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    modified_at = models.DateTimeField(_("modified at"), auto_now=True)

    class Meta:
        db_table = "patients"
        verbose_name = _("patient")
        verbose_name_plural = _("patients")

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def full_name(self):
        if self.middle_name:
            return f"{self.first_name} {self.middle_name} {self.last_name}"
        return f"{self.first_name} {self.last_name}"

class PatientAddress(models.Model):
    id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="addresses"
    )
    address_type = models.CharField(
        _("address type"),
        max_length=4,
        choices=AddressType.choices
    )
    street_address = models.CharField(_("street address"), max_length=255)
    city = models.CharField(_("city"), max_length=100)
    state = models.CharField(
        _("state"),
        max_length=2,
        choices=StateChoices.choices
    )
    postal_code = models.CharField(_("postal code"), max_length=20)
    is_primary = models.BooleanField(_("primary address"))
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    modified_at = models.DateTimeField(_("modified at"), auto_now=True)

    class Meta:
        db_table = "patient_addresses"
        verbose_name = _("patient address")
        verbose_name_plural = _("patient addresses")

    @property
    def full_address(self):
        return f"{self.street_address}, {self.city}, {self.state} {self.postal_code}"

    def __str__(self):
        return f"{self.street_address}, {self.city}, {self.state} {self.postal_code}"

class PatientCustomFieldValue(models.Model):
    id = models.AutoField(primary_key=True)
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="custom_field_values"
    )
    custom_field = models.ForeignKey(
        CustomField,
        on_delete=models.CASCADE,
        related_name="field_values"
    )
    text_value = models.TextField(_("text value"), blank=True, null=True)
    number_value = models.DecimalField(
        _("number value"),
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    modified_at = models.DateTimeField(_("modified at"), auto_now=True)

    class Meta:
        db_table = "patient_custom_field_values"
        verbose_name = _("patient custom field value")
        verbose_name_plural = _("patient custom field values")
        unique_together = ['patient', 'custom_field']

    def __str__(self):
        return f"{self.custom_field.name}: {self.get_value()}"

    def clean(self):
        if self.custom_field.field_type == CustomFieldType.TEXT:
            if not self.text_value:
                raise ValidationError(_('Text value is required for text custom fields.'))
            if self.number_value is not None:
                raise ValidationError(_('Number value should be null for text custom fields.'))
        elif self.custom_field.field_type == CustomFieldType.NUMBER:
            if self.number_value is None:
                raise ValidationError(_('Number value is required for number custom fields.'))
            if self.text_value:
                raise ValidationError(_('Text value should be null for number custom fields.'))

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    @property
    def value(self):
        if self.custom_field.field_type == CustomFieldType.NUMBER:
            return self.number_value
        return self.text_value
