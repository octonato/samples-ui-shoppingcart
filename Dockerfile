FROM node:12.16.3-alpine
WORKDIR /opt/frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm rebuild
# remove dev-dependencies
RUN npm prune --production

EXPOSE 3000
ENV DEBUG=cloudstate*
ENTRYPOINT [ "npm", "run", "start-no-prestart" ]
