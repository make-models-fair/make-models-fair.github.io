ARG HUGO_VERSION=0.164.0
FROM ghcr.io/gohugoio/hugo:v${HUGO_VERSION}

LABEL maintainer="CoMSES Net <support@comses.net>"

USER root

WORKDIR /src
COPY . /src/

RUN git config --global --add safe.directory /src

# Install Node.js/npm for PostCSS.
RUN apk add --no-cache nodejs npm

# Install front-end tooling.
RUN npm install

CMD ["server", "--bind", "0.0.0.0"]
