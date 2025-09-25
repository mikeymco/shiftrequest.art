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

For local network access to server, use:

```bash
bundle exec jekyll serve --livereload --host=0.0.0.0 --port=4000
```

## Deployment

This site can be deployed to AWS S3 with CloudFront. Before deploying:

1. Copy the environment template: `cp .env.example .env`
2. Configure your AWS credentials and S3 bucket settings in `.env`
3. Run the deployment: `./deploy.sh`
