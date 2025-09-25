#!/bin/bash

# Build and deploy Jekyll site to S3 with CloudFront invalidation
set -e

echo "🔧 Installing dependencies..."
bundle install

echo "🏗️  Building Jekyll site..."
JEKYLL_ENV=production bundle exec jekyll build

echo "☁️  Syncing to S3..."
if [ -z "$S3_BUCKET" ]; then
    echo "Error: S3_BUCKET environment variable is not set"
    exit 1
fi
aws s3 sync _site/ s3://$S3_BUCKET --delete --cache-control "max-age=300"

echo "🔄 Invalidating CloudFront cache..."
if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "Error: CLOUDFRONT_DISTRIBUTION_ID environment variable is not set"
    exit 1
fi
INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*" --query 'Invalidation.Id' --output text)
echo "   Created invalidation: $INVALIDATION_ID"

echo "✅ Deployment complete!"
if [ -n "$S3_BUCKET" ]; then
    echo "🌐 Your site will be available at: https://$S3_BUCKET"
else
    echo "🌐 Your site should be available at your configured domain"
fi