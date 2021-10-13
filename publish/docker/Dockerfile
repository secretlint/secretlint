FROM node:12-alpine

LABEL maintainer="azu <azuciao@gmail.com>"
LABEL description="Docker Container for secretlint"

ARG SECRETLINT_VERSION
ENV SECRETLINT_VERSION ${SECRETLINT_VERSION:-4.0.0}

ENV SECRETLINTRC /.secretlintrc.json
COPY .secretlintrc.json $SECRETLINTRC
RUN npm install -g secretlint@${SECRETLINT_VERSION} @secretlint/secretlint-rule-preset-recommend@${SECRETLINT_VERSION} && \
    rm -rf /usr/share/man /tmp/* \
           /root/.npm /root/.node-gyp \
           /usr/lib/node_modules/npm/man \
           /usr/lib/node_modules/npm/doc \
           /usr/lib/node_modules/npm/html

ENV PATH=/usr/lib/node_modules/.bin:$PATH
