FROM node:11
RUN mkdir -p /app/app
WORKDIR /app
COPY package-lock.json /app
COPY package.json /app
RUN npm install
COPY migrations /app/migrations
COPY seeders /app/seeders
COPY app /app/app
COPY .sequelizerc /app
COPY sequelize.config.js /app
COPY .env /app
COPY graphqlTypedefs.js /app
COPY index.js /app
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "/app/index.js"]
