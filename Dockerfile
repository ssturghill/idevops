FROM node

WORKDIR /

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
	   git \
	&& rm -rf /var/lib/apt/lists/*

RUN npm install -g bower polymer-cli --unsafe-perm

COPY package*.json ./
COPY public/bower.json ./



#install node modules
RUN npm install

# Add app source files

COPY . ./

EXPOSE 80

CMD ["node", "bin/www"]
