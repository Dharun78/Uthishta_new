# AWS Deployment Guide for GJTS Karnataka Website

## Overview
This guide covers deploying the GJTS Karnataka website to AWS using multiple deployment options.

## Prerequisites
- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Docker installed locally
- Node.js 18+ installed
- MongoDB Atlas account (recommended) or AWS DocumentDB

## Deployment Options

### Option 1: AWS Elastic Container Service (ECS) with Fargate (Recommended)
**Best for**: Production-ready, scalable deployment

#### Steps:
1. **Build and push Docker image**
   ```bash
   chmod +x aws-deploy.sh
   ./aws-deploy.sh
   ```

2. **Configure environment variables in ECS**
   - MONGODB_URI
   - JWT_SECRET
   - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
   - NODE_ENV=production

3. **Set up Application Load Balancer**
   - Create ALB in same VPC as ECS
   - Configure target group for port 3000
   - Add health check endpoint: /api/health

4. **Configure auto-scaling**
   - Min tasks: 2
   - Max tasks: 10
   - Target CPU: 70%

### Option 2: AWS Amplify (Easiest)
**Best for**: Quick deployment, automatic CI/CD

#### Steps:
1. Push code to GitHub
2. Connect repository to AWS Amplify
3. Configure build settings
4. Add environment variables
5. Deploy automatically on push

### Option 3: AWS EC2 (Traditional)
**Best for**: Full control, custom configurations

#### Steps:
1. Launch EC2 instance (t3.medium recommended)
2. Install Docker and Docker Compose
3. Clone repository
4. Run: `docker-compose up -d`

## Post-Deployment Configuration

### 1. MongoDB Setup
**Option A: MongoDB Atlas (Recommended)**
- Create cluster in AWS ap-south-1
- Whitelist ECS/EC2 IP addresses
- Get connection string

**Option B: AWS DocumentDB**
- Create cluster in same VPC
- Configure security groups
- Use MongoDB-compatible connection string

### 2. Email Configuration (SMTP)
Configure one of:
- AWS SES (Simple Email Service)
- SendGrid
- Gmail SMTP

### 3. Static Assets (S3 + CloudFront)
```bash
# Upload static assets to S3
aws s3 sync ./public s3://gjts-karnataka-assets

# Create CloudFront distribution
# Point to S3 bucket
# Configure custom domain
```

### 4. Domain Configuration
- Register domain or use existing
- Configure Route 53 hosted zone
- Create A record pointing to ALB/CloudFront
- Add SSL certificate via ACM

### 5. Monitoring & Logging
- Enable CloudWatch Logs
- Set up CloudWatch Alarms
- Configure X-Ray for tracing

## Environment Variables

Create `.env.production`:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gjts
JWT_SECRET=your-super-secret-jwt-key-change-this
SMTP_HOST=email-smtp.ap-south-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
SMTP_FROM=noreply@gjts-karnataka.edu.in
```

## Cost Estimation (Monthly)

### Small Scale (< 1000 users/day)
- ECS Fargate: $30-50
- MongoDB Atlas M10: $57
- ALB: $20
- CloudFront: $5-10
- **Total: ~$120/month**

### Medium Scale (1000-5000 users/day)
- ECS Fargate: $100-150
- MongoDB Atlas M20: $140
- ALB: $20
- CloudFront: $20-30
- **Total: ~$300/month**

## Security Checklist
- [ ] Enable VPC with private subnets
- [ ] Configure security groups (allow only necessary ports)
- [ ] Use AWS Secrets Manager for sensitive data
- [ ] Enable WAF on ALB
- [ ] Configure HTTPS only
- [ ] Enable CloudTrail for audit logs
- [ ] Set up IAM roles with least privilege
- [ ] Enable encryption at rest and in transit

## CI/CD Pipeline
GitHub Actions workflow is configured in `.github/workflows/deploy.yml`

Required GitHub Secrets:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- MONGODB_URI
- JWT_SECRET
- SMTP credentials

## Rollback Strategy
```bash
# List previous task definitions
aws ecs list-task-definitions --family-prefix gjts-karnataka-task

# Rollback to previous version
aws ecs update-service \
  --cluster gjts-karnataka-cluster \
  --service gjts-karnataka-service \
  --task-definition gjts-karnataka-task:PREVIOUS_VERSION
```

## Support & Troubleshooting
- Check CloudWatch Logs for application errors
- Monitor ECS service events
- Verify security group rules
- Test database connectivity
- Validate environment variables

## Next Steps After Deployment
1. Test all features thoroughly
2. Set up monitoring dashboards
3. Configure backup strategy
4. Document runbooks
5. Train team on AWS console
6. Set up staging environment
7. Configure disaster recovery

For questions, contact: devops@gjts-karnataka.edu.in
