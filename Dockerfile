FROM node:12-alpine AS base

RUN mkdir -p /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --only=prod

FROM base AS build
RUN npm install
COPY . .
RUN npm run build

FROM base AS release
COPY --from=build /app/dist/ ./dist
EXPOSE 80
CMD [ "npm",  "run", "start:prod" ]
