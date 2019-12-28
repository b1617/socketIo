FROM ubuntu:14.04

# Get https response package
RUN sudo apt-get update && sudo apt-get install -y apt-transport-https
# Install Node.js
RUN sudo apt-get install --yes curl
RUN sudo curl --silent --location https://deb.nodesource.com/setup_11.x | sudo bash -
RUN sudo apt-get install --yes nodejs
RUN sudo apt-get install --yes build-essential

# Ajout du fichier de dépendances package.json
ADD app/package.json /app/

# Changement du repertoire courant
WORKDIR /app

# Installation des dépendances
RUN npm install

# Ajout des sources
ADD . /app/

# Binds to port 3000
EXPOSE  3000
VOLUME /app/logs

#  Defines your runtime(define default command)
# These commands unlike RUN (they are carried out in the construction of the container) are run when the container
CMD npm run start