# supermax
A mono repo minimaly maximum supermarket Business Operations Platform



# supermax: Lightweight Supermarket ERP

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Celery](https://img.shields.io/badge/Celery-37814A?style=for-the-badge&logo=celery&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

> **A "Minimally Maximum" Business Operations Platform bridging inventory, payroll, and financial ledgers into a single source of truth.**

## 🎯 The Objective
Most mid-sized retail operations duct-tape their back office together using disconnected HR software, inventory spreadsheets, and accounting tools. This creates data lag and financial discrepancies. 

**supermax** is built to demonstrate how to solve this using a unified, transactional architecture. It intentionally strips away enterprise bloat to focus on high-impact technical challenges: **ACID-compliant data flows, role-based access control (RBAC), and asynchronous background processing.**

## 🚀 Key Features & Technical Implementation

### 1. Unified Inventory & Financial Ledger
Inventory isn't just tracked; it is tied directly to the financial ledger. 
* **The Feature:** When stock is purchased and added to inventory, a corresponding expense is automatically logged in the financial ledger. 
* **The Tech:** Utilizes Django's `transaction.atomic()` block. If the financial ledger update fails, the inventory addition rolls back automatically, guaranteeing data integrity and preventing "ghost stock."

### 2. Automated Payroll Engine
Payroll calculation shouldn't be manual data entry.
* **The Feature:** Staff are assigned roles (Cashier, Manager, etc.) with specific hourly rates. At the end of the month, salaries are automatically calculated and logged as pending payouts.
* **The Tech:** Powered by **Celery and Redis**. A `celery-beat` cron job fires on the 1st of the month, querying staff data, executing the payroll logic, and batch-inserting the financial records in the background without blocking the main application thread.

### 3. Role-Based Staff & Communications 
Information needs to be siloed based on authority.
* **The Feature:** System admins can onboard/offboard staff and assign roles. Targeted announcements can be broadcasted globally or restricted to specific roles (e.g., "Cashiers Only").
* **The Tech:** Strict RBAC implemented via Django REST Framework permissions and JWT authentication. The React frontend consumes these permissions to dynamically render (or hide) dashboard widgets and navigation routes.

### 4. Financial Dashboard
* **The Feature:** A clean, at-a-glance visualization of Money In (Sales) vs. Money Out (Inventory + Payroll).
* **The Tech:** Uses complex Django ORM aggregations (`Sum`, `TruncMonth`) to efficiently group financial data at the database level before serving it to the React frontend for rendering via minimal geometric charts.

## 🛠️ Tech Stack

* **Frontend:** React, Vite, Tailwind CSS (Clean, light-themed corporate UI with deep blue `#1E3A5F` accents), Lucide Icons.
* **Backend:** Python, Django, Django REST Framework.
* **Database:** PostgreSQL.
* **Async Workers:** Celery, Redis.

## 💻 Quick Start

### Backend Setup
```bash
# Clone the repository
git clone [https://github.com/AIIM00773/supermax.git](https://github.com/AIIM00773/supermax.git)
cd supermax/backend

# Create virtual environment and install dependencies
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Setup Database and run migrations
python manage.py migrate

# Start Redis (requires Redis to be installed)
redis-server

# Start Celery worker and beat scheduler
celery -A supermax worker -l info
celery -A supermax beat -l info

# Run the Django server
python manage.py runserver
