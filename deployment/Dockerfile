# Stage 1: Build frontend
FROM node:22 AS frontend
WORKDIR /app

# Copy package files
COPY package*.json ./
# Copy config files
COPY vite.config.ts tsconfig.json ./
# Copy resources directory
COPY resources/ ./resources/
# Copy public directory (needed for build output)
COPY public/ ./public/
# Install npm dependencies and build
RUN npm ci --no-audit --no-fund \
    && npm run build


# Stage 2: Build backend
FROM php:8.4-fpm
WORKDIR /var/www/html
ARG UID

# Install system dependencies
 RUN apt update && apt install -y --no-install-recommends \
    git gnupg curl wget zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev gpg sshpass lsb-release libmagickwand-dev && rm -rf /var/lib/apt/lists/*

# Update PHP configuration
RUN mv $PHP_INI_DIR/php.ini-production $PHP_INI_DIR/php.ini \
&& sed -i 's/max_execution_time = 30/max_execution_time = 60/' $PHP_INI_DIR/php.ini \
&& sed -i 's/memory_limit = 128M/memory_limit = 1024M/' $PHP_INI_DIR/php.ini \
&& sed -i 's/post_max_size = 8M/post_max_size = 256M/' $PHP_INI_DIR/php.ini \
&& sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 256M/' $PHP_INI_DIR/php.ini

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Additonal extensions
RUN wget https://github.com/FriendsOfPHP/pickle/releases/latest/download/pickle.phar && chmod +x pickle.phar && mv pickle.phar /usr/bin/pickle
RUN pickle install igbinary && pickle install redis && docker-php-ext-enable igbinary redis

# Clear cache
RUN apt clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

#Create system user to run Composer and Artisan Commands
RUN useradd -u $UID -g www-data -m -s /bin/bash skyrem \
    && mkdir -p /home/skyrem/.composer \
    && chown -R skyrem:www-data /home/skyrem


# Install composer dependencies
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
COPY composer* .
RUN composer install \
    --ignore-platform-reqs \
    --no-interaction \
    --no-scripts \
    --prefer-dist \
    --no-dev \
    --optimize-autoloader

# Copy application source files
COPY . .

# Copy built frontend assets (overwrite the placeholder from previous copy)
COPY --from=frontend /app/public/build public/build

# Declare volumes to preserve built assets when parent directory is mounted
VOLUME /var/www/html/vendor
VOLUME /var/www/html/public/build

USER skyrem

EXPOSE 9000
