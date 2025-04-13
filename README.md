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

## Features

### View Patients



