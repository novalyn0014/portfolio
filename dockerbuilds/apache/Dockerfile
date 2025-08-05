# Use dynamic PHP version from .env
ARG PHP_VERSION
FROM php:${PHP_VERSION}-apache

# Enable required PHP extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set document root
WORKDIR /var/www/html

# Copy project files
COPY ./www/html /var/www/html

# Set permissions
RUN chown -R www-data:www-data /var/www/html
