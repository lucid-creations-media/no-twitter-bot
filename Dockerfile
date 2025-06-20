FROM node:lts-slim AS base

# Create app directory
WORKDIR /app

# Enable Corepack
RUN corepack enable

# Set Yarn to the latest stable version
RUN yarn set version stable

# Files required by yarn install
COPY package.json yarn.lock ./

# Install app dependencies
RUN yarn install --immutable

# Type check app
# RUN yarn typecheck

# Bundle app source
COPY . .


FROM base AS runner

# Bundle app source
COPY . .

# Install only production app dependencies
RUN yarn install --immutable

USER node

# Start the app
EXPOSE 80
CMD ["yarn", "start"]