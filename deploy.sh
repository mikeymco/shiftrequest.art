#!/bin/bash

# Build and deploy Jekyll site to S3 with CloudFront invalidation
set -e

echo "🔧 Installing dependencies..."
bundle install

echo "🏗️  Building Jekyll site..."
bundle exec jekyll build

echo "☁️  Syncing to S3..."
aws s3 sync _site/ s3://shiftrequest.art --delete --cache-control "max-age=300"

echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id E1BWJ4WRQFS1KQ --paths "/*"

echo "✅ Deployment complete!"
echo "🌐 Your site will be available at: https://shiftrequest.art"