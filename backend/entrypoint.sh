#!/bin/sh

python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput

if [ "$DB_ENV" = "production" ]; then
    echo "Production Mode started."
    gunicorn config.wsgi:application --bind 0.0.0.0:8000
elif [ "$DB_ENV" = "development" ]; then
    echo "Development Mode started."
    python manage.py runserver 0.0.0.0:8000
fi
