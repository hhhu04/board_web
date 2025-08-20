FROM node:22-alpine AS builder

WORKDIR /app

ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_AUTH_URL=$VITE_AUTH_URL
ENV VITE_APP_ENV=$VITE_APP_ENV

# 패키지 파일 복사 및 설치
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 소스코드 복사 및 빌드
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# 빌드된 파일을 nginx로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]