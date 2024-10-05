#!/bin/bash

# Build the Docker image
docker build -t react-frontend .

# Exit if the build failed
if [ $? -ne 0 ]; then
  exit 1
fi

# Run the Docker container with environment variables from .env
docker run --rm \
  --name react-container \
  -p 5173:5173 \
  -d react-frontend