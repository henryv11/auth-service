
FROM node:15-alpine

# postgresql-dev for pg-native
# git, python, make, g++ for building
RUN set -x \
    && apk update \
    && apk add --no-cache --update postgresql-dev

WORKDIR /usr/src/app

COPY . .

RUN npm ci

EXPOSE 8080

CMD npm run dev

