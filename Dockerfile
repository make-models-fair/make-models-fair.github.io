# syntax=docker/dockerfile:1.7@sha256:a57df69d0ea827fb7266491f2813635de6f17269be881f696fbfdf2d83dda33e

ARG HUGO_VERSION

FROM ghcr.io/gohugoio/hugo:${HUGO_VERSION}@sha256:4cc9f383086c0fba180efcf7132cf2f025969c462fedf5fcd2bf921915416797

LABEL maintainer="CoMSES Net <support@comses.net>"

USER root

WORKDIR /src

COPY package.json package-lock.json ./
# npm ci requires Hugo's generated workspace, even when root pins own its assets.
COPY packages/ ./packages/
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Use the embedded Dart Sass implementation required by Docsy, as in OMF.
# npm can otherwise select the pure-JS fallback's identically named executable.
RUN chmod +x /src/node_modules/sass-embedded/dist/bin/sass.js && \
    ln -sf ../sass-embedded/dist/bin/sass.js /src/node_modules/.bin/sass
ENV PATH="/src/node_modules/.bin:${PATH}"

USER hugo

CMD ["version"]
