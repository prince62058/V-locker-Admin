# V-Locker Admin Panel (React + Vite)

This is the Admin Dashboard for the V-Locker application. It provides a comprehensive interface for admins and dealers to manage customers, loans, devices, and financial transactions.

## Features

- **Dashboard**: Overview of total loans, active customers, EMI status, and revenue.
- **Customer Management**: Add, view, edit, and verify customers.
- **Device Management**: Lock/Unlock devices remotely, view device details (IMEI, Model).
- **Loan Management**: Approve/Reject loans, track EMI payments.
- **Dealer Management**: Create and manage dealer accounts.
- **Transaction History**: View all financial transactions.
- **Kiosk Mode Control**: Manage device locking policies.
- **QR Provisioning**: Generate QR codes for device enrollment.

## Tech Stack

- **Framework**: React.js (Vite)
- **UI Library**: Material UI (MUI)
- **State Management**: Redux Toolkit & React Redux
- **Routing**: React Router Dom
- **Form Handling**: React Hook Form + Yup/Zod
- **Charts**: ApexCharts
- **Maps**: Mapbox GL / React Map GL
- **Icons**: Iconify / MUI Icons

## Prerequisites

- Node.js (v16 or higher)
- NPM or Yarn

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/satyakabiroffical/V-Locker-React-Js-Admin.git
    cd V-Locker-React-Js-Admin
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory and add the following variables:

    ```env
    # API Base URL (Backend API)
    VITE_APP_API=https://vlockerbackend.onrender.com/api/

    # Base URL for Assets/Images
    VITE_APP_BASE_URL=https://vlockerbackend.onrender.com/

    # Socket URL (Real-time updates)
    VITE_APP_BASE_SOCKET=https://vlockerbackend.onrender.com
    ```

    *For local development, replace the URLs with your local backend address (e.g., `http://localhost:5000/`).*

4.  **Run the application:**

    *   **Development:**
        ```bash
        npm run dev
        # or
        yarn dev
        ```
    *   **Build for Production:**
        ```bash
        npm run build
        # or
        yarn build
        ```
    *   **Preview Production Build:**
        ```bash
        npm run start
        # or
        yarn start
        ```

## Folder Structure

```
src/
├── auth/           # Authentication guards and context
├── components/     # Reusable UI components
├── config-global.js # Global configuration
├── hooks/          # Custom React hooks
├── layouts/        # Dashboard and main layouts
├── locales/        # i18n localization files
├── pages/          # Application pages (routed)
├── redux/          # Redux slices and store
├── routes/         # Router configuration
├── sections/       # Feature-specific components (e.g., user, loan)
├── theme/          # MUI Theme configuration
├── utils/          # Helper functions
└── App.jsx         # Main application component
```

## License

Private
