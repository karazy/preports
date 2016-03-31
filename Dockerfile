FROM node:4.2

MAINTAINER Frederik Reifschneider

# global variables
ENV APP_DIR preports
ENV NODE_ENV production

RUN mkdir -p /opt/preports

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN npm -v

# install necessary npm packages
RUN npm install forever -g

ENV HOME /opt/${APP_DIR}

WORKDIR /opt/${APP_DIR}

VOLUME [ "/opt/${APP_DIR}" ]

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/forever"]
CMD ["app/app.js"]
