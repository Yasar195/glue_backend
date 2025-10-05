# Use AWS Lambda Node.js base image
FROM public.ecr.aws/lambda/nodejs:22

# Copy package files
COPY package*.json ${LAMBDA_TASK_ROOT}/

# Install dependencies
RUN npm ci --omit=dev

# Copy application code
COPY . ${LAMBDA_TASK_ROOT}/

# Build TypeScript if needed

RUN npm run build

# Set the CMD to your handler
CMD [ "dist/index.handler" ]