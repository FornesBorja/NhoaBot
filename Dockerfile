FROM node:18

RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "node", "src/index.js" ]