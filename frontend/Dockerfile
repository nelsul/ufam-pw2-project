FROM node:22-alpine3.22 AS build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine3.22 AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json .
RUN npm ci --omit=dev
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./
EXPOSE 3000
CMD [ "npm", "start" ]

FROM node:22-alpine3.22 AS development
WORKDIR /app
ENV NODE_ENV=development
EXPOSE 3000
CMD [ "npm", "run", "dev" ]
