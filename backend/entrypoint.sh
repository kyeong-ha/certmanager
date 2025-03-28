#!/bin/sh

python manage.py migrate

if [ "$DJANGO_ENV" = "production" ]; then
    python manage.py collectstatic --noinput
    gunicorn cert_management.wsgi:application --bind 0.0.0.0:8000
else
    # Start the Django development server
    python manage.py runserver 0.0.0.0:8000
fi


#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.5
    done

    echo "PostgreSQL started"
fi

# Uncomment below to flush db e.g. after running tests
# Just make sure you really mean it 
# python manage.py flush --no-input

# We have base custom user model so need to makemigrations out of box
python manage.py makemigrations core

python manage.py migrate
python manage.py collectstatic --noinput

exec "$@"