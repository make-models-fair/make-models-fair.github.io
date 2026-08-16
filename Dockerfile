# syntax=docker/dockerfile:1.7

ARG HUGO_VERSION

FROM ghcr.io/gohugoio/hugo:${HUGO_VERSION}

LABEL maintainer="CoMSES Net <support@comses.net>"

USER root

WORKDIR /src

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .
RUN npm run bibliography

USER hugo

CMD ["server", "--bind", "0.0.0.0"]
