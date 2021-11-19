FROM node:14-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# expose app
EXPOSE 3000

# add app
COPY . ./

# build
RUN npm run build

# start app
CMD ["npm", "run", "serve"]
