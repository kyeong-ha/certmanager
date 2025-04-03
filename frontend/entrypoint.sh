#!/bin/sh


if [ "$DB_ENV" = "production" ]; then
    echo "Production Mode started."
    npm build
elif [ "$DB_ENV" = "development" ]; then
    echo "Development Mode started."
    npm start
fi
