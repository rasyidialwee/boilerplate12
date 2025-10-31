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
- **Queue**: Database driver
- **Websockets**: Soketi (Pusher alternative)
- **Email Testing**: Mailpit
- **Code Quality**: Larastan (PHPStan), Rector

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
- **Soketi (Websockets)**: Port `6001`

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

| Service         | URL/Port                | Description                             |
| --------------- | ----------------------- | --------------------------------------- |
| **Laravel App** | `http://localhost`      | Main application                        |
| **Vite**        | `http://localhost:5173` | Frontend development server             |
| **MySQL**       | `localhost:3306`        | Database server                         |
| **Redis**       | `localhost:6379`        | Cache and session store                 |
| **Mailpit**     | `http://localhost:8025` | Email testing dashboard                 |
| **Soketi**      | `localhost:6001`        | WebSocket server for real-time features |

## 📝 Environment Configuration

Key environment variables to configure in your `.env` file:

```env
APP_NAME=Laravel
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_DATABASE=laravel
DB_USERNAME=sail
DB_PASSWORD=password

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

# Start queue worker
sail artisan queue:work

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
- [Inertia.js Documentation](https://inertiajs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Larastan Documentation](https://github.com/larastan/larastan)
- [Rector Laravel Documentation](https://github.com/driftingly/rector-laravel)

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
