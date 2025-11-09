#!/bin/sh

set -e

echo "MinIO is ready. Configuring mc client..."

# Configure MinIO client
mc alias set myminio http://minio:9000 ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD}

# Create bucket if it doesn't exist
echo "Creating bucket 'toilets' if it doesn't exist..."
mc mb myminio/toilets --ignore-existing

# Set bucket policy to public read (adjust as needed)
echo "Setting bucket policy..."
mc anonymous set download myminio/toilets

# Upload sample images if they exist
if [ -d "/sample-images" ] && [ "$(ls -A /sample-images)" ]; then
    echo "Uploading sample images to MinIO..."
    mc cp --recursive /sample-images/* myminio/toilets/
    echo "Sample images uploaded successfully!"
else
    echo "No sample images found in /sample-images, skipping upload."
fi

echo "MinIO initialization complete!"
