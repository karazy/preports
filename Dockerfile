FROM node:4.2

MAINTAINER Frederik Reifschneider

# global variables
ENV APP_TYPE node
ENV NODE_ENV production
ENV USER_NAME bi-yukon

RUN mkdir -p /opt/yukon/node

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN npm -v

# install necessary npm packages
RUN npm install forever -g


# assign home
ENV HOME /opt/yukon/${APP_TYPE}

WORKDIR /opt/yukon/${APP_TYPE}

VOLUME [ "/opt/yukon/${APP_TYPE}" ]

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/forever"]
CMD ["app.js"]
