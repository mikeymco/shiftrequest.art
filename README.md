# shiftrequest.art

A Jekyll-based art gallery website with automated image processing and gallery generation.

## Development

This site is built using Jekyll and can be run locally for development:

```bash
# Install dependencies
bundle install

# Serve the site locally
bundle exec jekyll serve --livereload
```

The site will be available at `http://localhost:4000/`

## Deployment

This site can be deployed to AWS S3 with CloudFront. Before deploying:

1. Copy the environment template: `cp .env.example .env`
2. Configure your AWS credentials and S3 bucket settings in `.env`
3. Update `_config.yml` with your Google Analytics ID if needed
4. Run the deployment: `./deploy.sh`

**Security Note**: Make sure to never commit real credentials, API keys, or sensitive configuration values to the repository. Use environment variables for all sensitive data.

## Configuration

- AWS credentials should be set via environment variables
- S3 bucket name and CloudFront distribution ID should be configured in your environment
- Google Analytics tracking ID should be updated in `_config.yml`
