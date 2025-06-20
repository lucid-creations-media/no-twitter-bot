FROM node:lts-slim AS base

# Enable Corepack
RUN corepack enable

# Set Yarn to the latest stable version
RUN yarn set version stable

# Create app directory
WORKDIR /app

# Files required by yarn install
COPY package.json yarn.lock ./

# Install app dependencies
RUN yarn install

# Bundle app source
COPY . .

# Type check app
RUN yarn typecheck

FROM base AS runner

# Bundle app source
COPY . .

# Install only production app dependencies
RUN yarn install --frozen-lockfile

USER node

# Start the app
EXPOSE 80
CMD ["yarn", "start"]