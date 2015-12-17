FROM centos
MAINTAINER Alex Opryshko, Dmitry Rutsov

ENV LC_ALL="en_US.UTF-8"
ENV LANG="en_US.UTF-8"

RUN curl -sL https://rpm.nodesource.com/setup_5.x | bash -
RUN yum install -y nodejs npm ruby make
RUN gem install sass
RUN npm install -g grunt-cli

RUN mkdir -p /opt/space_wars

COPY . /opt/technocraft
RUN cd /opt/technocraft && npm i && grunt build

WORKDIR /opt/technocraft
EXPOSE 8000
ENTRYPOINT ["node", "app.js"]
