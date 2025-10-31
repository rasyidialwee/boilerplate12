# Laravel 12 React Starter Kit

A modern Laravel 12 application with React and TypeScript, powered by Inertia.js and Tailwind CSS. This project uses Laravel Sail for a seamless Docker-based development environment.

## 🚀 Tech Stack

- **Backend**: Laravel 12 (PHP 8.4+)
- **Frontend**: React 19 with TypeScript
- **Framework**: Inertia.js
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite
- **Containerization**: Laravel Sail (Docker)
- **Database**: MySQL 8.0
- **Cache/Sessions**: Redis
- **Queue**: Redis (via Laravel Horizon)
- **Websockets**: Laravel Reverb
- **Email Testing**: Mailpit
- **Code Quality**: Larastan (PHPStan), Rector
- **Permissions**: Spatie Laravel Permission
- **Frontend Tools**: ESLint, Prettier

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop) or Docker Engine with Docker Compose
- [Git](https://git-scm.com/downloads)
- (Optional) [Node.js](https://nodejs.org/) and [Composer](https://getcomposer.org/) if you prefer not to use Sail

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd boilerplate12
```

### 2. Install Dependencies with Composer

**First-time setup** - Run this command to install Composer dependencies using Docker (required before using Sail):

```bash
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php84-composer:latest \
    composer install --ignore-platform-reqs
```

**Alternative**: If you have Composer installed locally:

```bash
composer install
```

### 3. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Or if using Sail:

```bash
sail cp .env.example .env
```

### 4. Generate Application Key

```bash
sail artisan key:generate
```

### 5. Install Node Dependencies

```bash
sail npm install
```

### 6. Build Assets

```bash
sail npm run build
```

Or for development (watch mode):

```bash
sail npm run dev
```

### 7. Run Database Migrations

```bash
sail artisan migrate
```

### 8. Seed Roles and Permissions

```bash
sail artisan db:seed
```

This will create initial roles (admin, user) and permissions (view telescope, view horizon). Only the admin role has access to Telescope and Horizon dashboards. Assign roles to users as needed.

## 🏃 Starting Development

### Using Laravel Sail (Recommended)

Start all services:

```bash
sail up -d
```

Or use the shorter alias (if configured):

```bash
sail up -d
```

This will start:

- **Laravel Application**: `http://localhost` (or port specified in `APP_PORT`)
- **Vite Dev Server**: `http://localhost:5173`
- **MySQL**: Port `3306`
- **Redis**: Port `6379`
- **Mailpit Dashboard**: `http://localhost:8025`

**Note**: Reverb websocket server should be started separately with `sail artisan reverb:start`

### Running Artisan Commands

All artisan commands should be prefixed with `sail`:

```bash
# Run migrations
sail artisan migrate

# Create a controller
sail artisan make:controller ExampleController

# Clear cache
sail artisan cache:clear

# Run tests
sail artisan test
```

### Running NPM Commands

Similarly, npm commands should be prefixed:

```bash
# Development mode (watch)
sail npm run dev

# Build for production
sail npm run build

# Run linter
sail npm run lint

# Format code
sail npm run format

# Type checking
sail npm run types
```

### Convenience Setup Script

**Note**: This script is only available after Sail is installed (after step 2). For first-time setup, follow the step-by-step instructions above.

After Sail is installed, you can use the built-in setup script for subsequent setups:

```bash
sail composer run setup
```

This will automatically:

- Install Composer dependencies
- Copy `.env.example` to `.env` if it doesn't exist
- Generate application key
- Run migrations
- Install npm dependencies
- Build assets

## 🔧 Available Services

When running `sail up`, the following services are available:

| Service         | URL/Port                     | Description                                           |
| --------------- | ---------------------------- | ----------------------------------------------------- |
| **Laravel App** | `http://localhost`           | Main application                                      |
| **Vite**        | `http://localhost:5173`      | Frontend development server                           |
| **MySQL**       | `localhost:3306`             | Database server                                       |
| **Redis**       | `localhost:6379`             | Cache and session store                               |
| **Mailpit**     | `http://localhost:8025`      | Email testing dashboard                               |
| **Horizon**     | `http://localhost/horizon`   | Queue management dashboard (requires permission)      |
| **Telescope**   | `http://localhost/telescope` | Application debugging dashboard (requires permission) |
| **Reverb**      | `localhost:8080`             | WebSocket server (run via `artisan reverb:start`)     |

## 📝 Environment Configuration

Key environment variables to configure in your `.env` file:

```env
APP_NAME=Laravel
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_DATABASE=laravel
DB_USERNAME=sail
DB_PASSWORD=password

# Queue Configuration (for Horizon)
QUEUE_CONNECTION=redis

# Broadcasting Configuration (for Reverb)
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=app-id
REVERB_APP_KEY=app-key
REVERB_APP_SECRET=app-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http

# Telescope Configuration
TELESCOPE_ENABLED=true

# Horizon Configuration
HORIZON_PREFIX=horizon
HORIZON_BALANCE=auto

# Vite will automatically use the correct host
VITE_APP_NAME="${APP_NAME}"
```

**Note**: When using Laravel Sail, database credentials default to:

- **Username**: `sail`
- **Password**: `password`
- **Database**: Value from `DB_DATABASE` in `.env`

## 🧪 Development Commands

### PHP/Laravel

```bash
# Run tests
sail artisan test

# Run Pint (code formatter)
sail artisan pint

# Start queue worker (or use Horizon)
sail artisan queue:work

# Start Horizon (recommended for Redis queues)
sail artisan horizon

# Start Pail (log viewer)
sail artisan pail
```

### Code Analysis & Refactoring

This project includes [Larastan](https://github.com/larastan/larastan) (PHPStan for Laravel) for static analysis and [Rector](https://github.com/rectorphp/rector) for automated refactoring.

#### Larastan (Static Analysis)

Larastan adds static analysis capabilities to detect bugs and potential issues in your code before runtime.

```bash
# Run Larastan analysis
sail composer analyse
```

Larastan is configured in `phpstan.neon` with level 5 analysis. It analyzes:

- `app/` - Application code
- `config/` - Configuration files
- `database/` - Migrations, seeders, factories
- `routes/` - Route definitions

#### Rector (Automated Refactoring)

Rector automates code refactoring and can help upgrade your codebase to newer Laravel versions and best practices.

```bash
# Preview changes (dry-run mode)
sail composer rector

# Apply Rector fixes
sail composer rector:fix
```

Rector is configured in `rector.php` and automatically applies Laravel-specific rules based on your Laravel version. It processes:

- `app/` - Application code
- `config/` - Configuration files
- `database/` - Migrations, seeders, factories
- `routes/` - Route definitions

**Note**: Always review the changes in dry-run mode (`composer rector`) before applying fixes (`composer rector:fix`).

### Frontend

```bash
# Development with hot reload
sail npm run dev

# Build for production
sail npm run build

# Build with SSR support
sail npm run build:ssr

# Lint and fix
sail npm run lint

# Format code
sail npm run format

# Type checking
sail npm run types
```

#### ESLint and Prettier

This project uses ESLint for code linting and Prettier for code formatting.

```bash
# Run ESLint to check and fix code issues
sail npm run lint

# Format code with Prettier
sail npm run format

# Check if code is formatted correctly
sail npm run format:check
```

ESLint is configured in `eslint.config.js` with React, TypeScript, and Prettier integration. Prettier is configured in `.prettierrc` with Tailwind CSS plugin support.

### Queue Management (Laravel Horizon)

Horizon provides a dashboard and monitoring for your Redis queues. Access it at `http://localhost/horizon` (requires permission: `view horizon`).

```bash
# Start Horizon
sail artisan horizon

# Pause Horizon
sail artisan horizon:pause

# Continue Horizon
sail artisan horizon:continue

# Terminate Horizon
sail artisan horizon:terminate

# View Horizon status
sail artisan horizon:status
```

**Note**: Only users with the `view horizon` permission can access the Horizon dashboard. Assign the `admin` role to grant access.

### Application Debugging (Laravel Telescope)

Telescope provides insights into your application's requests, commands, jobs, and more. Access it at `http://localhost/telescope` (requires permission: `view telescope`).

Telescope is enabled in both development and production environments. Access is controlled via Spatie permissions - users must have the `view telescope` permission.

**Note**: Only users with the `view telescope` permission can access the Telescope dashboard. Assign the `admin` role to grant access.

### WebSockets (Laravel Reverb)

Reverb provides a WebSocket server for real-time features. Start it with:

```bash
# Start Reverb server
sail artisan reverb:start

# Start Reverb in development mode (with debugging)
sail artisan reverb:start --debug

# Start Reverb with specific host and port
sail artisan reverb:start --host=0.0.0.0 --port=8080
```

Reverb configuration is in `config/reverb.php` and can be customized via environment variables in `.env`.

### Permissions (Spatie Laravel Permission)

This project uses Spatie Laravel Permission for role-based access control. Initial roles and permissions are seeded via `RolePermissionSeeder`.

**Initial Roles:**

- `admin` - Has access to Telescope and Horizon dashboards
- `user` - Normal user with no special dashboard access

**Initial Permissions:**

- `view telescope` - Access to Telescope dashboard (admin only)
- `view horizon` - Access to Horizon dashboard (admin only)

**Assigning Roles to Users:**

```php
$user = User::find(1);
$user->assignRole('admin');  // Grant admin access
// or
$user->assignRole('user');   // Grant normal user access
```

**Checking Permissions:**

```php
$user->hasPermissionTo('view telescope');
$user->hasRole('admin');
```

## 🛑 Stopping Services

To stop all Sail services:

```bash
sail down
```

To stop and remove volumes (⚠️ this will delete database data):

```bash
sail down -v
```

## 📦 Project Structure

```text
boilerplate12/
├── app/                    # Laravel application code
├── bootstrap/              # Laravel bootstrap files
├── config/                 # Configuration files
├── database/               # Migrations, seeders, factories
├── public/                 # Public web root
├── resources/
│   ├── css/               # Stylesheets
│   ├── js/                # React/TypeScript source files
│   └── views/             # Blade templates (if any)
├── routes/                 # Route definitions
├── storage/                # Storage files
├── tests/                  # Test files
├── vendor/                 # Composer dependencies
├── compose.yaml            # Docker Compose configuration
├── composer.json           # PHP dependencies
├── package.json            # Node.js dependencies
├── phpstan.neon            # Larastan (PHPStan) configuration
├── rector.php              # Rector configuration
└── vite.config.ts          # Vite configuration
```

## 🔍 Troubleshooting

### Permission Issues

If you encounter permission issues, you may need to fix file permissions:

```bash
sail shell
chmod -R 775 storage bootstrap/cache
chown -R sail:sail storage bootstrap/cache
```

### Port Already in Use

If ports are already in use, modify the ports in your `.env` file:

```env
APP_PORT=8000
VITE_PORT=5174
FORWARD_DB_PORT=3307
```

### Clearing Cache

```bash
sail artisan cache:clear
sail artisan config:clear
sail artisan view:clear
sail artisan route:clear
```

### Rebuilding Containers

If you need to rebuild containers:

```bash
sail build --no-cache
```

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Sail Documentation](https://laravel.com/docs/sail)
- [Laravel Horizon Documentation](https://laravel.com/docs/horizon)
- [Laravel Telescope Documentation](https://laravel.com/docs/telescope)
- [Laravel Reverb Documentation](https://laravel.com/docs/reverb)
- [Inertia.js Documentation](https://inertiajs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Spatie Laravel Permission Documentation](https://spatie.be/docs/laravel-permission)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [Larastan Documentation](https://github.com/larastan/larastan)
- [Rector Laravel Documentation](https://github.com/driftingly/rector-laravel)

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
