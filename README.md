# FixMyStreet – Frontend

## Project Overview

FixMyStreet is a community-based infrastructure reporting platform designed to help residents report and track problems affecting their neighbourhoods.

The platform allows residents to submit reports about infrastructure issues, attach photographic evidence, and monitor the progress of submitted reports. Administrators can manage reports and update their statuses.

The frontend provides a responsive and user-friendly interface for residents and administrators.

## Features

- Resident and administrator registration and login.
- Role-based access control.
- Resident dashboard.
- Administrator dashboard.
- Submit infrastructure reports.
- Upload photographs as evidence.
- View and manage submitted reports.
- Update report statuses.
- Search public reports by suburb or location.
- Public Explore Reports section.
- Neighbourhood-based report separation.

## Technologies Used

- React
- JavaScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Supabase Authentication and Storage (through the backend API)

## Project Structure

```text
FixMyStreet/
│
├── public/
├── src/
│   ├── api.js
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Aaliyah-Fransman/FixMyStreet.git
```

### 2. Navigate into the project

```bash
cd FixMyStreet
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure the backend URL

Create a `.env` file in the frontend root directory.

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, replace the local URL with the deployed backend API URL.

### 5. Start the development server

```bash
npm run dev
```

### 6. Build the project

```bash
npm run build
```

## Backend Integration

The frontend communicates with the FixMyStreet backend through REST API requests.

The backend handles authentication, report management, image uploads, and database operations.

## Deployment

The frontend can be deployed using Netlify or another compatible static hosting provider.

Remember to configure the `VITE_API_URL` environment variable with the deployed backend API address.

## Security

- Authentication is handled through the backend and Supabase.
- Protected routes restrict access according to user roles.
- Environment variables must not contain private credentials committed to GitHub.
- The frontend must never contain a Supabase service-role key.

## Project Purpose

FixMyStreet aims to encourage community participation, improve visibility of infrastructure problems, and provide a central platform for tracking neighbourhood issues.

---

**Project:** FixMyStreet  
**Application Type:** Full-stack Community Reporting Platform  
**Frontend:** React and Vite