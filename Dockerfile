# syntax=docker/dockerfile:1.7@sha256:a57df69d0ea827fb7266491f2813635de6f17269be881f696fbfdf2d83dda33e

ARG HUGO_VERSION

FROM ghcr.io/gohugoio/hugo:${HUGO_VERSION}@sha256:608a19e34f86de36773503adbaab174fc28a6e338dc7904e03c70320b003a153

LABEL maintainer="CoMSES Net <support@comses.net>"

USER root

WORKDIR /src

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

USER hugo

CMD ["version"]
