FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npx playwright install --with-deps
COPY . .
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh
CMD ["npm", "run", "test"]