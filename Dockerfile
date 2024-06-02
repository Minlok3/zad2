FROM scratch as builder

# ADD alpine-minirootfs-3.19.1-aarch64.tar /
ADD alpine-minirootfs-3.19.1-x86_64.tar /

RUN apk update && \
    apk upgrade && \
    apk add --no-cache nodejs=20.12.1-r0 \
    npm=10.2.5-r0 && \
    rm -rf /etc/apk/cache

RUN addgroup -S node && \
    adduser -S node -G node

USER node

WORKDIR /home/node/app

COPY --chown=node:node server.js ./server.js
COPY --chown=node:node package.json ./package.json

RUN npm install
RUN npm install moment-timezone



FROM node:iron-alpine3.19

RUN apk add --update --no-cache curl

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY --from=builder --chown=node:node /home/node/app/server.js ./server.js
COPY --from=builder --chown=node:node /home/node/app/node_modules ./node_modules

LABEL org.opencontainers.image.author="Tomasz Kobus"

EXPOSE 3000

HEALTHCHECK --interval=4s --timeout=20s --start-period=2s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

ENTRYPOINT ["node", "server.js"]
