# syntax=docker/dockerfile:1.7

ARG HUGO_VERSION
ARG UV_VERSION=0.11.16

FROM ghcr.io/astral-sh/uv:${UV_VERSION} AS uv

FROM ghcr.io/gohugoio/hugo:${HUGO_VERSION}
COPY --from=uv /uv /uvx /bin/

LABEL maintainer="CoMSES Net <support@comses.net>"

USER root

RUN git config --system --add safe.directory /src && \
    apk add --no-cache go python3

WORKDIR /src

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

ENV PATH="/src/node_modules/.bin:${PATH}"
ENV NODE_PATH="/src/node_modules"

COPY . .

USER hugo

CMD ["server", "--bind", "0.0.0.0"]
