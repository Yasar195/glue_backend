# Use AWS Lambda Node.js base image
FROM public.ecr.aws/lambda/nodejs:22

# Copy package files
COPY package*.json ${LAMBDA_TASK_ROOT}/

# Copy applicaapplicationtion code
COPY . ${LAMBDA_TASK_ROOT}/

# Install ALL dependencies (including dev dependencies for build)
RUN npm ci

# Build the application
RUN npm run build
RUN prisma generate
# Remove dev dependencies to reduce image size
RUN npm prune --omit=dev

# Set the CMD to your handler
CMD [ "dist/index.handler" ]