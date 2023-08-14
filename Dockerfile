FROM node:18.17-alpine3.17 AS development
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
#RUN npx prisma generate 
RUN npx prisma generate && npm run build

FROM node:18.17-alpine3.17 AS production
WORKDIR /app
COPY --from=development /app/src ./src
RUN npm prune --production

EXPOSE 4000
CMD ["npm", "run", "docker:build"]
