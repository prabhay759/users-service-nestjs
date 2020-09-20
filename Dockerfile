FROM node:12-alpine

WORKDIR /app

COPY node_modules ./node_modules
COPY dist ./dist
COPY package.json package-lock.json ./

ENV NODE_ENV=production
RUN npm rebuild

ENV PORT=80
EXPOSE 80
CMD ["npm", "run", "start:prod"]
