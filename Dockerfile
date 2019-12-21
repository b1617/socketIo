# Pull base image
FROM ubuntu:14.04

# Get https response package
RUN sudo apt-get update && sudo apt-get install -y apt-transport-https
# Install Node.js
RUN sudo apt-get install --yes curl
RUN sudo curl --silent --location https://deb.nodesource.com/setup_4.x | sudo bash -
RUN sudo apt-get install --yes nodejs
RUN sudo apt-get install --yes build-essential

# Bundle app source
COPY . /socketIo

# Install app dependencies
RUN cd /socketIo; npm install

# Binds to port 3000
EXPOSE  3000

#  Defines your runtime(define default command)
# These commands unlike RUN (they are carried out in the construction of the container) are run when the container
CMD ["node", "/socketIo/server.js"]