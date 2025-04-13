# Patient Management Dashboard

An MVP for a patient management dashboard built with Django backend and Next.js frontend. This project was boostrapped using the [Turbo](https://github.com/unfoldadmin/turbo/tree/main) boilerplate from [unfoldadmin](https://unfoldadmin.com/). The boilerplate combines both Django and Next.js under a single pre-configured repository and includes a user authentication workflow with username/password out-of-the-box. It also includes a docker-compose file for starting up all of the services with a single command. The following dependencies were leveraged:

Backend:
- djangorestframework (included in unfold): REST API support
- djangorestframework-simplejwt (included in unfold): JWT auth for REST API
- drf-spectacular (included in unfold): OpenAPI schema generator

Frontend:
- next-auth (included in unfold): Next.js authentication
- react-hook-form (included in unfold): Handling of React forms
- zod (included in unfold): Schema validation
- shadcn: Customizable component library
- react-query: client-side data fetching library

## Backend Project Structure
The following files were created or modified as part of this MVP.

```
backend
| - api       // available sites
|   - api.py      // contains API endpoints (Django ViewSets)
|   - models.py   // contains Django models
|   - serializers.py  // contains Django serializers (for conversion between model instances and native Python data types and JSON)
```

## Frontend Project Structure
The following files were created or modified as part of this MVP.

```
frontend
| - apps
|   - web
|     - app
|       - patients
|         - page.tsx  // entrypoint for patient dashboard page
|     - components
|       - custom-fields      // components for viewing and configuring provider-defined custom fields
|       - data-table-utils   // utility components for constructing ShadCN data table   
|       - forms
|         - patient   // form components for registering and updating patient data
|       - patient-table   // components for rendering patient dashboard table
|     - lib     // contains custom hooks, utility functions for API calls, and form validation schemas
```

## Features

### View Patients
![image](https://github.com/user-attachments/assets/2d987273-0da1-42e2-a73b-3393d2dd550d)

### Edit Patient Profile
![image](https://github.com/user-attachments/assets/5b248583-c5ca-489a-8885-db81ed13a169)

### Create New Patient Profile
![image](https://github.com/user-attachments/assets/4b0bd8ca-c669-432c-bd69-51a5e7a7b40a)

### Manage Custom Fields
![image](https://github.com/user-attachments/assets/afc82ef3-6012-454b-b659-8b3af0e90a15)



