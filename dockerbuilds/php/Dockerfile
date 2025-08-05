ARG PHP_VERSION
FROM php:${PHP_VERSION}-fpm-alpine

RUN docker-php-ext-install mysqli pdo pdo_mysql

# Set working directory
WORKDIR /var/www/html

# Copy existing application files
COPY ./www/html /var/www/html

# Set correct permissions
RUN chown -R www-data:www-data /var/www/html

CMD ["php-fpm"]
