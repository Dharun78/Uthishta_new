#!/bin/bash

# GJTS Karnataka Website - AWS Deployment Script
# This script automates deployment to AWS EC2/ECS

set -e

echo "🚀 GJTS Karnataka Website - AWS Deployment"
echo "=========================================="

# Configuration
APP_NAME="gjts-karnataka"
AWS_REGION="${AWS_REGION:-ap-south-1}"
ECR_REPO_NAME="${APP_NAME}-repo"
ECS_CLUSTER_NAME="${APP_NAME}-cluster"
ECS_SERVICE_NAME="${APP_NAME}-service"
TASK_FAMILY="${APP_NAME}-task"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install it first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Step 1: Build Docker image
echo -e "\n${YELLOW}📦 Building Docker image...${NC}"
docker build -t ${APP_NAME}:latest .

# Step 2: Create ECR repository if it doesn't exist
echo -e "\n${YELLOW}🏗️  Setting up ECR repository...${NC}"
aws ecr describe-repositories --repository-names ${ECR_REPO_NAME} --region ${AWS_REGION} 2>/dev/null || \
    aws ecr create-repository --repository-name ${ECR_REPO_NAME} --region ${AWS_REGION}

# Step 3: Get ECR login credentials
echo -e "\n${YELLOW}🔐 Logging into ECR...${NC}"
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.${AWS_REGION}.amazonaws.com

# Step 4: Tag and push image to ECR
echo -e "\n${YELLOW}⬆️  Pushing image to ECR...${NC}"
ECR_URI=$(aws ecr describe-repositories --repository-names ${ECR_REPO_NAME} --region ${AWS_REGION} --query 'repositories[0].repositoryUri' --output text)
docker tag ${APP_NAME}:latest ${ECR_URI}:latest
docker push ${ECR_URI}:latest

# Step 5: Create ECS cluster if it doesn't exist
echo -e "\n${YELLOW}🏗️  Setting up ECS cluster...${NC}"
aws ecs describe-clusters --clusters ${ECS_CLUSTER_NAME} --region ${AWS_REGION} 2>/dev/null || \
    aws ecs create-cluster --cluster-name ${ECS_CLUSTER_NAME} --region ${AWS_REGION}

# Step 6: Register task definition
echo -e "\n${YELLOW}📝 Registering ECS task definition...${NC}"
cat > task-definition.json <<EOF
{
  "family": "${TASK_FAMILY}",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "${APP_NAME}",
      "image": "${ECR_URI}:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/${APP_NAME}",
          "awslogs-region": "${AWS_REGION}",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
EOF

aws ecs register-task-definition --cli-input-json file://task-definition.json --region ${AWS_REGION}

# Step 7: Create or update ECS service
echo -e "\n${YELLOW}🚀 Deploying to ECS...${NC}"
SERVICE_EXISTS=$(aws ecs describe-services --cluster ${ECS_CLUSTER_NAME} --services ${ECS_SERVICE_NAME} --region ${AWS_REGION} --query 'services[0].status' --output text 2>/dev/null || echo "MISSING")

if [ "$SERVICE_EXISTS" = "MISSING" ]; then
    echo "Creating new ECS service..."
    # Note: You need to provide VPC subnets and security groups
    echo -e "${YELLOW}⚠️  Please create the service manually with proper VPC configuration${NC}"
else
    echo "Updating existing ECS service..."
    aws ecs update-service \
        --cluster ${ECS_CLUSTER_NAME} \
        --service ${ECS_SERVICE_NAME} \
        --task-definition ${TASK_FAMILY} \
        --force-new-deployment \
        --region ${AWS_REGION}
fi

# Cleanup
rm -f task-definition.json

echo -e "\n${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "\n${YELLOW}📋 Next Steps:${NC}"
echo "1. Configure environment variables in ECS task definition"
echo "2. Set up Application Load Balancer"
echo "3. Configure Route 53 for custom domain"
echo "4. Set up CloudFront CDN"
echo "5. Configure MongoDB Atlas connection"
echo "6. Set up SMTP credentials for email notifications"
