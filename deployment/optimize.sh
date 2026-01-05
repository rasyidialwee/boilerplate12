#!/bin/bash

# Clear the application cache
php artisan cache:clear

# Clear the compiled views
php artisan view:clear

# Optimize the application
php artisan optimize

# Optimize the event listeners
php artisan event:cache

# Refreshing the pulse record
php artisan pulse:purge --force

# Optimize the application's packages
php artisan package:discover --ansi

# Run any additional optimization commands specific to your application

echo "Application optimization complete!"
