# My Shop - E-commerce Platform

This is a full-featured e-commerce platform built with a Laravel backend and a React frontend. It includes a customer-facing storefront and a comprehensive admin panel for managing the store.

## Features

### Customer Features
- **User Authentication:** Secure registration and login for customers.
- **Product Catalog:** Browse products by category.
- **Shopping Cart:** Add products to a cart, which persists across sessions for logged-in users and uses a guest ID for visitors.
- **Checkout:** Smooth checkout process with options to pay via PayPal or Stripe.
- **Order History:** View past orders and their details.
- **User Profile:** Manage personal information and password.

### Admin Features
- **Admin Authentication:** Separate, secure login for administrators.
- **Dashboard:** An overview of store activity.
- **Product Management:** Create, read, update, and delete products.
- **Category Management:** Manage product categories.
- **Order Management:** View and manage customer orders.
- **User Management:** View and manage customer accounts.
- **Inventory Management:** Track product stock levels.

## Tech Stack

- **Backend:** Laravel 11
- **Frontend:** React
- **Database:** MySQL
- **Web Server:** Apache/Nginx
- **Payment Integration:** PayPal, Stripe
- **Build Tool:** Vite

## Installation

Follow these steps to get the project running on your local machine.

### Prerequisites
- PHP >= 8.2
- Composer
- Node.js & npm
- A local web server environment (like WAMP, XAMPP, or Laravel Valet)
- MySQL

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/my-shop.git
cd my-shop
```

### 2. Install Dependencies
Install both PHP and JavaScript dependencies.
```bash
composer install
npm install
```

### 3. Set Up Environment
Copy the example environment file and generate an application key.
```bash
cp .env.example .env
php artisan key:generate
```
Next, open the `.env` file and configure your database connection settings (`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).

### 4. Run Database Migrations
Apply the database schema to your database.
```bash
php artisan migrate
```

### 5. Seed the Database
This will seed the database with initial data, including an admin user.
```bash
php artisan db:seed
```

### 6. Run the Servers
Start the Laravel and Vite development servers.
```bash
# In one terminal, run the Laravel server
php artisan serve

# In another terminal, run the Vite server for frontend assets
npm run dev
```
The application should now be accessible at the URL provided by `php artisan serve` (usually `http://127.0.0.1:8000`).

## Admin Credentials

After seeding the database, you can log in to the admin panel using the following credentials:

- **Email:** `admin@example.com`
- **Password:** `password`

The admin panel is accessible at `/admin`.
