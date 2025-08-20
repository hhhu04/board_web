FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_SERVER_URL
ARG VITE_AUTH_URL
ARG VITE_APP_ENV

ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_AUTH_URL=$VITE_AUTH_URL
ENV VITE_APP_ENV=$VITE_APP_ENV

# 패키지 파일 복사 및 설치
COPY package.json package-lock.json ./
RUN npm ci

# 소스코드 복사 및 빌드
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# 빌드된 파일을 nginx로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]