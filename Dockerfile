FROM php:8.4-cli

RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y libzip-dev libssl-dev \
    && docker-php-ext-install pdo pdo_mysql zip ftp \
    && docker-php-ext-enable pdo_mysql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
    
RUN apt-get update && apt-get install -y libssl-dev \
    && docker-php-ext-install ftp

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www
COPY . .

RUN composer install

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
