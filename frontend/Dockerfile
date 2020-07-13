FROM node:12.18.0-buster AS builder

WORKDIR /home/node

# Install app dependencies
COPY package*.json ./

RUN npm ci

# Build app
COPY . .

RUN npm run build

# Remove dev packages
RUN npm prune --production

# Create production image
FROM node:12.18.0-buster-slim

# Run as an unprivileged user
WORKDIR /home/node
USER node

# Install app
COPY --from=builder /home/node/package*.json ./
COPY --from=builder /home/node/src src/
COPY --from=builder /home/node/index.js index.js
COPY --from=builder /home/node/node_modules node_modules/
COPY --from=builder /home/node/user-function.desc .
COPY --from=builder /home/node/shop.proto .
COPY --from=builder /home/node/shoppingcart.proto .
COPY --from=builder /home/node/public public/

# Run
EXPOSE 8080
ENTRYPOINT [ "npm", "start" ]
