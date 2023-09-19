# Builds and runs Knowhere

# === Build the sources
ARG repo=https://github.com/Squirrel-Network/Knowhere.git
ARG base_url=/knowhere
ARG repo_branch=master

FROM node:16.20-alpine3.16 AS builder

# === Prerequisites
RUN apk add --progress openssh git

# === Clone repo from the branch
WORKDIR /root
RUN mkdir -vp .ssh && \
    touch .ssh/known_hosts && \
    ssh-keyscan github.com >> .ssh/known_hosts
ARG repo
ARG repo_branch
RUN git clone --progress --verbose $repo --branch $repo_branch knowhere 2>&1

# === Install dependencies
WORKDIR /root/knowhere
RUN yarn set version stable && \
    yarn install \

# === Patch base url
ARG base_url
RUN sh -c "sed -i 's;/knowhere;$base_url;g' vue.config.js"

# === Start the build
RUN yarn build

# === Build the final image
FROM alpine:latest AS final

LABEL org.opencontainers.image.description="Nebula blacklist database" \
	org.opencontainers.image.authors="TheLonelyAdventurer" \
	org.opencontainers.image.version="1.0" \
	org.opencontainers.image.vendor="Squirrel Network" \
	org.opencontainers.image.title="Knowhere"

EXPOSE 80/tcp

RUN apk add lighttpd

# === Copy files
WORKDIR /var/www
COPY lighttpd.conf ./lighttpd.conf
RUN mkdir -v knowhere
COPY --from=builder /root/knowhere/dist/* ./knowhere
RUN mkdir -vp knowhere/css && \
    mkdir -vp knowhere/js && \
    mkdir -vp knowhere/img
RUN mv -v knowhere/*.js knowhere/js && \
    mv -v knowhere/*.map knowhere/js && \
    mv -v knowhere/*.css knowhere/css && \
    mv -v knowhere/*.svg knowhere/img && \
    mv -v knowhere/*.jpg knowhere/img

ENTRYPOINT lighttpd -D -f lighttpd.conf
