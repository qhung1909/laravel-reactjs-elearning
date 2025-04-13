FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    zip unzip curl libzip-dev libpq-dev git \
    && docker-php-ext-install pdo_mysql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
