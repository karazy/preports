FROM mongo:3.0.6

MAINTAINER Frederik Reifschneider

# set Bisnode npm registry
#RUN npm set registry http://npmregistry/

RUN mkdir -p /opt/yukon/node

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN npm -v

# install necessary npm packages
RUN npm install forever -g

# set Bisnode npm registry
#RUN npm set registry http://npmregistry/

# assign home
ENV HOME /opt/yukon/${APP_TYPE}

ENTRYPOINT ["/usr/local/bin/forever"]
CMD ["app.js"]

#Steps
# install cron and crontab

ADD backup.sh backup/
ADD rotate.sh backup/

#write out current crontab
RUN crontab -l > mycron
#echo new cron into cron file
RUN echo "0 0 * * * /backup/backup.sh" >> mycron
#install new cron file
RUN crontab mycron
RUN rm mycron

#Mount the backup volume
VOLUME [ "/opt/yukon/${APP_TYPE}" ]
