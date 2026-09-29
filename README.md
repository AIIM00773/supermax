# Supermax: Lightweight Supermarket ERP

> A “minimally maximum” business operations platform that unifies inventory, payroll, and financial ledgers into a single source of truth.

## Overview

Many mid-sized retail operations rely on disconnected HR systems, inventory spreadsheets, and accounting tools. This fragmentation creates data delays, duplicated work, and financial discrepancies.

**Supermax** demonstrates how these operational workflows can be unified through a transactional architecture. The project intentionally avoids unnecessary enterprise complexity and focuses on high-impact engineering challenges, including:

- ACID-compliant data flows
- Role-based access control (RBAC)
- Automated payroll processing
- Asynchronous background tasks
- Inventory and financial ledger integration

## Key Features

### 1. Unified Inventory and Financial Ledger

Inventory activity is linked directly to the financial ledger, helping ensure that stock movements and their associated financial transactions remain consistent.

### 2. Automated Payroll Engine

Payroll calculations are generated from staff and attendance data, reducing manual data entry and improving calculation accuracy.

### 3. Role-Based Staff Management and Communications

Access to operational information is restricted according to user roles and responsibilities. This helps keep sensitive staff, payroll, and financial data appropriately siloed.

### 4. Financial Dashboard

A centralized dashboard provides an at-a-glance view of:

- Money coming in from sales
- Money going out through inventory purchases
- Payroll and other operational expenses

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Python, Django, Django REST Framework
- **Database:** SQLite3

## Quick Start

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/AIIM00773/supermax.git

# Navigate to the backend
cd supermax/backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate

# On macOS/Linux:
source venv/bin/activate

# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Start the Django development server
python manage.py runserver

````


The backend will be available at:
text

http://127.0.0.1:8000/

### Project Status

The frontend and backend are currently developed as separate components. Both are functional within their respective environments, but they are not yet fully integrated into a complete end-to-end application.

To complete the integration:

    Implement the frontend API service layer.
    Connect frontend components to the existing Django REST Framework endpoints.
    Configure the frontend and backend base URLs.
    Add authentication and token-handling logic.
    Verify data flow across inventory, payroll, staff, and financial modules.
    Add integration tests for the primary workflows.

### Contributing
No contributions are allowed yet 