FROM node:20-alpine

WORKDIR /app

RUN npm install -g expo-cli@latest

COPY package*.json ./
RUN npm install --engine-strict=false

COPY . .

EXPOSE 8081
EXPOSE 19000
EXPOSE 19001

ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

CMD ["npx", "expo", "start", "--host", "lan"]