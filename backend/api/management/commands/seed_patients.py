from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import Patient, CustomField, PatientCustomFieldValue, PatientStatus, StateChoices, PatientAddress, AddressType, CustomFieldType
from django.contrib.auth import get_user_model
import random
from datetime import datetime, timedelta
import faker

User = get_user_model()
fake = faker.Faker()

class Command(BaseCommand):

    def handle(self, *args, **options):
        # Get the providers
        provider1 = User.objects.get(id=1)
        provider2 = User.objects.get(id=2)

        # Create custom fields for providers
        referred_by_field = CustomField.objects.create(
            provider=provider1,
            name="Referred By",
            field_type=CustomFieldType.TEXT,
            description="Name of the person who referred the patient"
        )

        visits_field = CustomField.objects.create(
            provider=provider2,
            name="Number of Visits",
            field_type=CustomFieldType.NUMBER,
            description="Total number of visits by the patient"
        )

        # Generate 20 patients (10 for each provider)
        providers = [(provider1, referred_by_field), (provider2, visits_field)]
        
        for provider, custom_field in providers:
            for _ in range(10):
                # Generate random patient data
                dob = fake.date_of_birth(minimum_age=18, maximum_age=90)
                
                patient = Patient.objects.create(
                    provider=provider,
                    first_name=fake.first_name(),
                    last_name=fake.last_name(),
                    middle_name=fake.first_name() if random.random() > 0.5 else None,
                    date_of_birth=dob,
                    status=random.choice(list(PatientStatus.choices))[0]
                )

                # Create address for patient
                PatientAddress.objects.create(
                    patient=patient,
                    address_type=AddressType.HOME,
                    street_address=fake.street_address(),
                    city=fake.city(),
                    state=random.choice(list(StateChoices.choices))[0],
                    postal_code=fake.postcode(),
                    is_primary=True
                )

                # Add custom field values
                if provider.id == 1:
                    # For provider 1: Referred By (text)
                    PatientCustomFieldValue.objects.create(
                        patient=patient,
                        custom_field=custom_field,
                        text_value=f"Dr. {fake.last_name()}"
                    )
                else:
                    # For provider 2: Number of Visits (number)
                    PatientCustomFieldValue.objects.create(
                        patient=patient,
                        custom_field=custom_field,
                        number_value=random.randint(1, 20)
                    )