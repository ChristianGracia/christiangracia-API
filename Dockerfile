# STAGE 1
FROM node:12-alpine as builder
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm config set unsafe-perm true
RUN npm install -g typescript
RUN npm install -g ts-node
USER node
RUN npm install
COPY --chown=node:node . .
RUN npm run build

# STAGE 2
FROM node:12-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN apk add chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV NODE_ENV=production
WORKDIR /home/node/app
COPY package*.json ./
COPY .env ./
COPY src/files/ ./build/src/files
COPY src/assets/ ./build/src/assets
COPY src/views/ ./build/src/views
USER node

RUN npm install --production
COPY --from=builder /home/node/app/build ./build

CMD [ "node", "build/src/server.js" ]