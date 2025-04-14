#!/bin/sh
npm isntall

if [ "$DB_ENV" = "production" ]; then
    echo "Production Mode started."
    npm run build
elif [ "$DB_ENV" = "development" ]; then
    echo "Development Mode started."
    npm start
fi
