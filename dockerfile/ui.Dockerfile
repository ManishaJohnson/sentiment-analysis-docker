FROM node:14

WORKDIR /app

COPY sentiment-analysis-ui/package*.json ./
RUN npm install

COPY sentiment-analysis-ui .
RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]