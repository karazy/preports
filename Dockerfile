FROM node:0.12.7

MAINTAINER Frederik Reifschneider

# global variables
ENV APP_TYPE node
ENV NODE_ENV production
ENV USER_NAME bi-yukon

# set Bisnode npm registry
#RUN npm set registry http://npmregistry/

RUN mkdir -p /opt/yukon
RUN useradd -d /opt/yukon/${APP_TYPE} -ms /bin/bash -k /root/ ${USER_NAME}

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN npm -v

# install necessary npm packages
RUN npm install forever -g

# set Bisnode npm registry
#RUN npm set registry http://npmregistry/

# assign home
ENV HOME /opt/yukon/${APP_TYPE}

WORKDIR /opt/yukon/${APP_TYPE}

VOLUME [ "/opt/yukon/${APP_TYPE}" ]

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/forever"]
CMD ["app.js"]
