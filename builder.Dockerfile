FROM node:16-alpine AS builder

ADD . .
RUN /scripts/build.sh

FROM amazon/aws-cli:2.13.17 AS deployer

COPY --from=builder /build .
ADD ./scripts .
RUN /scripts/deploy.sh
