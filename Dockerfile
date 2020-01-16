FROM node:10

# Ajout des sources
ADD . /app/

# Changement du repertoire courant
WORKDIR /app
#ADD . /app/
#COPY . /app/

# Installation des dépendances
RUN npm install

# Binds to port 3000
EXPOSE  3000
VOLUME /app/logs

CMD npm run start