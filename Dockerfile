# Setting the base to nodejs 8.9.4
FROM node:8.9.4-slim

# Adds backports
RUN awk '$1 ~ "^deb" { $3 = $3 "-backports"; print; exit }' /etc/apt/sources.list > /etc/apt/sources.list.d/backports.list

# Installs git, unoconv and chinese fonts
RUN apt-get update

RUN DEBIAN_FRONTEND=noninteractive apt-get -t jessie-backports install -y git unoconv=0.7-1.1~bpo8+1 ttf-wqy-zenhei fonts-arphic-ukai fonts-arphic-uming && apt-get clean



#ENTRYPOINT /usr/bin/unoconv --listener --server=0.0.0.0 --port=2002

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 8080 
CMD [ "npm", "start" ]
