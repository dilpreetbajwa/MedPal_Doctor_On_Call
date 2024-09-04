# Doctor Appointment - Full Stack Appointment Website

##### To Setup Project Follow `project_setup.txt` documentation

## About The Project
The `DoctorOnCall` System facilitates patients in scheduling appointments with preferred doctors or Emergency Appointments set up via an online platform.
- Developed using the React, Nodejs, and MongoDB, it offers a professional website with dynamic functionalities.
- Key features include dynamic home, Email Notification, Filtering doctors, Setting up appointments and patients/doctors dashboards.
- Secure user login with validation mechanisms, appointment scheduling with access to doctor details, patient appointment management, doctor selection, and overall industries level code splitting followed.

## What Features Will You Find Here:
 - **Dynamic Homepage:** Conveniently gathers essential information on a single page.
 - **Easy Appointment Setup:** Seamlessly schedule appointments with doctors, featuring selectable available dates and time ranges.
 - **Dynamic Appointment Management:** Flexible time and date range selection for appointments.
 - **Doctor Selection:** Patients can choose their preferred doctor for appointments.
 - **Industry-standard Code Quality:** Utilization of top-notch code conventions, code splitting, and TypeScript in backend development.
 - **Email Notifications:** Automated email notifications for appointment setup and invoicing.
 - **Doctor Dashboard:** Dynamic dashboard for doctors to access patient information and provide online treatment with customizable prescriptions.
 - **Patient Dashboard:** Patients can track their treatment progress, view medications, prescriptions, and appointment details from a dynamic dashboard.
 - **Appointment Tracking:** Track appointment status using a unique tracking ID directly from the homepage.
 - **Dynamic Prescription and Invoice Generation:** Customized prescriptions and invoices tailored to each appointment.
 - **User Authentication:** Dynamic authentication system allowing user sign-in, sign-up, password recovery, and email verification (for doctors).
 - **Dynamic Doctor Filtering:** Advanced filtering options for doctors and appointment scheduling, along with blogging and service features.
 - **Ongoing Development:** Continued enhancements with an evolving admin system.
 - **Best Practices:** Adherence to industry best practices, ensuring reusable and maintainable code.

<!-- GETTING STARTED -->
## Getting Started
To begin using the DoctorOnCall System, follow these simple steps:

### Prerequisites
Before getting started with the DoctorOnCall System, ensure that you have the following prerequisites installed and set up:
* Install Node.js (globally)
  ```sh
  npm install npm@latest -g
  ```
* TypeScript (optional): TypeScript is used in the backend, ensure that you have TypeScript installed globally. You can install it using npm:
  ```sh
   npm install -g typescript
  ```
## Installation
To begin using the DoctorOnCall System, follow these simple steps:
### The front-end and Backend code are in the same directory, with the Backend API located at the ./api directory

```
# Setup Documentation

## Clone The Project
git clone https://github.com/dilpreetbajwa/MedPal_Doctor_On_Call.git

### Install Frontend
cd Doctor-Appointment
- npm install
- npm start

### Setup Database
1. Create an Atlas Account
Sign Up:

Go to the MongoDB Atlas website.
Click on "Get Started Free" and sign up using your email or a social login.
Verify Your Email:

Follow the instructions sent to your email to verify your account.
2. Create a Cluster
Log In to Atlas:

Once you’re logged in, you’ll be directed to the Atlas dashboard.
Create a New Project:

Click on “Projects” in the sidebar.
Click “Create New Project”.
Give your project a name and click “Create Project”.
Build a Cluster:

Inside your new project, click “Build a Cluster”.
Choose a cloud provider (AWS, GCP, or Azure) and a region for your cluster.
Select a cluster tier. The M0 tier is free and good for development purposes.
Click “Create Cluster”. This process might take a few minutes.
3. Configure Database Access
Create a Database User:

Go to the “Database Access” tab in the left sidebar.
Click “Add New Database User”.
Enter a username and password for the database user.
Assign roles (e.g., “Atlas Admin” or specific roles like “readWrite”).
Click “Add User”.
Whitelist Your IP Address:

Go to the “Network Access” tab.
Click “Add IP Address”.
You can either add your current IP address or use “0.0.0.0/0” to allow access from anywhere (note: the latter is less secure).
Click “Confirm”.
4. Connect to Your Cluster
Get Connection String:

Go to the “Clusters” tab.
Click on “Connect” for the cluster you just created.
Select “Connect Your Application”.
Choose the connection method (e.g., “Node.js” or “Python”) and copy the connection string provided.
Modify Connection String:

Replace <username> and <password> in the connection string with the credentials of the database user you created.
Optionally, specify the database name you want to connect to by appending /<database> to the connection string

### Setup Google App Password (For Email Notification)
1. Go to Google Account settings at https://myaccount.google.com/security?hl=en.
2. Navigate to Security > 2-Step Verification.
3. Scroll to the bottom of the page and find App passwords.
4. Select your project name and copy the generated password.
5. Paste the app password into .env as EMAIL_PASS.

### Setup Cloudinary to Upload Image
1. Create a Cloudinary Account at https://cloudinary.com/.
2. Login to your Cloudinary Account and copy all the credentials (e.g., Cloud name, API key, API secret).
3. Paste those credentials into the .env file.

### Install Backend
cd api
- npm install
### Start Backend
npm run dev

Happy coding! 🚀
```

Note: Please note that these are general instructions for setting up an Express API, and the specific implementation details may vary depending on your project's requirements. Before starting, make sure to read the project's documentation or readme file to obtain any specific instructions or requirements.

 
 This system offers a comprehensive and dynamic platform for managing doctor appointments, treatments, and patient interactions while maintaining high standards of code quality and user experience.

#### What Technology Are Using In This Project

**Frontend Technology Stack:** 
- **React**: A JavaScript library for building user interfaces, offering a component-based architecture for creating interactive UIs.
- **Redux Toolkit:** A state management library for React applications, providing predictable state management with a single source of truth.
- **Ant Design:** A UI library for React applications, offering a set of customizable and pre-designed components.
- **React Hook Form:** A library for managing form state and validation in React applications, providing a simple and intuitive API.
- **Axios**: A promise-based HTTP client for making HTTP requests, used for interacting with backend APIs.

**Back-End:** 
- **Express.js:** A web application framework for Node.js, used for building robust APIs and web applications
- **TypeScript:** A superset of JavaScript that adds static typing, enhancing code quality and maintainability.

 