ARG HUGO_VERSION=0.139.5
FROM ghcr.io/gohugoio/hugo:v${HUGO_VERSION}

LABEL maintainer="CoMSES Net <support@comses.net>"

WORKDIR /src
COPY . /src/

RUN git config --global --add safe.directory /src

RUN hugo mod tidy
RUN npm install

CMD ["server"]
