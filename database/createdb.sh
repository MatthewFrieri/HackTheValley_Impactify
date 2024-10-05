#!/bin/bash

# Build the Docker image
docker build -t postgres-db .

# Run the Docker container with environment variables from .env
docker run --rm --env-file .env \
  --name postgres-container \
  -p 5432:5432 \
  -d postgres-db