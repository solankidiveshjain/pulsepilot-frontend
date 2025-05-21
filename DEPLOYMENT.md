# PulsePilot Frontend Deployment Guide

This document outlines the steps required to deploy the PulsePilot frontend application. It includes details for both local development and production deployment.

## Prerequisites

- Node.js v18+
- Docker and Docker Compose (for containerized deployment)
- Git

## Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/your-organization/pulsepilot-frontend.git
   cd pulsepilot-frontend
   ```

2. Install dependencies:

   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. View the application at [http://localhost:3000](http://localhost:3000)

## Production Deployment

### Using Docker

1. Build and start the application using Docker Compose:

   ```bash
   docker-compose up -d --build
   ```

2. The application will be available at [http://localhost:3000](http://localhost:3000)

### Cloud Deployment

The application can be deployed to various cloud platforms:

#### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure the following environment variables:

   - `NEXT_PUBLIC_API_URL`: URL to your API endpoint

3. Deploy with the Vercel CLI:
   ```bash
   npm install -g vercel
   vercel
   ```

#### AWS Amplify

1. Connect your repository to AWS Amplify
2. Configure the build settings as follows:
   - Build command: `npm run build`
   - Output directory: `.next`

#### Azure Static Web Apps

1. Use the Azure CLI to deploy:
   ```bash
   az staticwebapp create --name pulsepilot-frontend --resource-group YOUR_RESOURCE_GROUP --source . --location "West US 2" --branch main
   ```

## Environment Variables

- `NEXT_PUBLIC_API_URL`: URL to your API endpoint
- `NODE_ENV`: Set to 'production' for production deployments

## API Integration

The frontend integrates with the following API endpoints:

1. GET `/comments/feed` - Fetches paginated list of comments
2. GET `/posts/:postId` - Fetches post details for a specific post
3. GET `/comments/:commentId/thread` - Fetches comment thread details
4. POST `/comments/bulk-action` - Handles bulk actions on comments
5. GET `/comments/metrics` - Fetches metrics for comments

## Performance Optimizations

The deployment includes the following optimizations:

- Docker multi-stage builds for reduced image size
- Next.js static optimization
- Image optimization with Next.js
- Caching for improved performance
- CDN distribution for static assets

## Monitoring and Maintenance

- Health check endpoint at `/api/health`
- Use Docker's built-in health check for container monitoring
- Set up monitoring with your preferred provider (e.g., DataDog, New Relic)

## Troubleshooting

Common issues and solutions:

1. **Build Failures**: Run `npm run build -- --verbose` to get detailed error information
2. **Container Issues**: Check logs with `docker-compose logs pulsepilot-frontend`
3. **Permission Issues**: Ensure proper permissions for the `.next` directory

## Support

For additional support, contact the development team at support@example.com
