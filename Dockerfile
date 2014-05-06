# DOCKER-VERSION 0.8.0

FROM centos:6.4

# Enable EPEL for Node.js
RUN rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

# Install Node.js and npm
RUN yum install -y npm

# Bundle app source
ADD . /

RUN npm install

EXPOSE 3000
CMD ["npm", "start"]