# Board Web - 게임 정보 대시보드

React + Vite 기반의 게임 정보 조회 웹 애플리케이션입니다. 던전앤파이터(DNF), 사이퍼즈 등 게임의 캐릭터 정보, 타임라인, 통계 등을 제공합니다.

## 🚀 주요 기능

- **사용자 인증**: JWT 기반 로그인/회원가입 시스템
- **게임 정보 조회**: 
  - DNF 캐릭터 정보, 장비, 아바타, 버프 정보
  - 게임 타임라인 및 활동 내역
  - 무한 스크롤 기반 데이터 로딩
- **반응형 UI**: Bootstrap 기반의 모바일 친화적 디자인
- **글로벌 로딩 관리**: API 요청 시 통합 로딩 오버레이
- **상태 관리**: Zustand를 통한 클라이언트 상태 관리

## 🛠 기술 스택

### Frontend
- **React 19** - UI 라이브러리
- **Vite** - 빌드 도구 및 개발 서버
- **React Router DOM** - SPA 라우팅
- **TanStack React Query** - 서버 상태 관리 및 데이터 캐싱
- **Zustand** - 클라이언트 상태 관리
- **Axios** - HTTP 클라이언트
- **Bootstrap & React Bootstrap** - UI 컴포넌트
- **react-cookies** - 쿠키 관리

### Development & Build
- **ESLint** - 코드 품질 관리
- **Docker & Nginx** - 컨테이너화 및 배포

## 📁 프로젝트 구조

```
src/
├── api/                    # API 관련 모듈
│   ├── Axios.interceptor.jsx   # Axios 인터셉터 (인증, 로딩)
│   ├── Api.service.jsx         # API 서비스 함수들
│   └── game/                   # 게임 관련 API
├── components/             # 재사용 가능한 컴포넌트
│   └── LoadingOverlay.jsx     # 글로벌 로딩 오버레이
├── helpers/               # 유틸리티 함수들
│   ├── AuthHelper.jsx         # 인증 토큰 관리
│   ├── CookieHelper.jsx       # 쿠키 관리 (보안 설정 포함)
│   └── NavigationHelper.jsx   # React Router 네비게이션
├── pages/                 # 페이지 컴포넌트들
│   ├── auth/                  # 로그인/회원가입
│   ├── game/                  # 게임 정보 페이지들
│   ├── layout/                # 레이아웃 컴포넌트
│   └── mypage/               # 마이페이지
├── store/                 # 상태 관리
│   ├── UserStore.jsx          # 사용자 상태 (Zustand)
│   └── LoadingStore.jsx       # 로딩 상태 관리
└── styles/               # CSS 스타일 시트
```

## 🔧 환경 설정

### 환경 변수
프로젝트는 다음 환경 변수들을 사용합니다:

```bash
# .env.local (로컬 개발)
VITE_SERVER_URL=http://localhost:8080/api
VITE_AUTH_URL=http://localhost:8080/auth
VITE_APP_ENV=local
VITE_APP_COOKIE_DOMAIN=localhost

# .env.development (개발 서버)
VITE_SERVER_URL=https://dev-api.example.com/api
VITE_AUTH_URL=https://dev-api.example.com/auth
VITE_APP_ENV=development
VITE_APP_COOKIE_DOMAIN=example.com

# .env.prod (운영 서버)
VITE_SERVER_URL=https://api.example.com/api
VITE_AUTH_URL=https://api.example.com/auth
VITE_APP_ENV=production
VITE_APP_COOKIE_DOMAIN=example.com
```

## 🚀 개발 및 실행

### 로컬 개발 환경
```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행 (.env.local 사용)
npm run local

# 개발 환경으로 실행 (.env.development 사용)
npm run dev

# 운영 환경으로 실행 (.env.prod 사용)
npm run prod
```

### 빌드
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 코드 품질 검사
npm run lint
```

## 🐳 Docker 배포

### Docker 이미지 빌드
```bash
# 환경 변수와 함께 빌드
docker build \
  --build-arg VITE_SERVER_URL=https://api.example.com/api \
  --build-arg VITE_AUTH_URL=https://api.example.com/auth \
  --build-arg VITE_APP_ENV=production \
  --build-arg VITE_APP_COOKIE_DOMAIN=example.com \
  -t board-web .
```

### Docker 실행
```bash
# 컨테이너 실행
docker run -d -p 80:80 board-web
```

### Docker Compose (예시)
```yaml
version: '3.8'
services:
  board-web:
    build:
      context: .
      args:
        VITE_SERVER_URL: https://api.example.com/api
        VITE_AUTH_URL: https://api.example.com/auth
        VITE_APP_ENV: production
        VITE_APP_COOKIE_DOMAIN: example.com
    ports:
      - "80:80"
    restart: unless-stopped
```

## 🔐 보안 기능

### 인증 시스템
- **JWT 토큰 기반 인증**: Access Token + Refresh Token
- **자동 토큰 갱신**: Axios 인터셉터를 통한 투명한 토큰 갱신
- **보안 쿠키**: `secure`, `sameSite` 속성 적용

### 보안 설정
- **HTTPS 강제**: 운영 환경에서 secure 쿠키 사용
- **CSRF 방지**: SameSite=strict 쿠키 설정
- **XSS 방지**: 적절한 데이터 이스케이핑

## 🎯 핵심 기능 상세

### 1. 글로벌 로딩 관리
- 모든 API 요청에 대한 통합 로딩 상태 관리
- 파비콘을 활용한 시각적 로딩 인디케이터
- 다중 요청 처리 및 카운팅

### 2. 게임 데이터 처리
- **DNF API 연동**: 캐릭터 정보, 장비, 타임라인
- **무한 스크롤**: React Query의 useInfiniteQuery 활용
- **실시간 데이터**: 타임라인 및 활동 내역 실시간 업데이트

### 3. 상태 관리 아키텍처
- **서버 상태**: React Query (캐싱, 동기화)
- **클라이언트 상태**: Zustand (사용자 정보, UI 상태)
- **세션 관리**: SessionStorage 기반 영속성

## 🔄 배포 파이프라인

### Multi-stage Docker Build
1. **Builder Stage**: Node.js 환경에서 소스 빌드
2. **Production Stage**: Nginx Alpine으로 정적 파일 서빙
3. **최적화**: 이미지 크기 최소화 및 캐싱 전략

### Nginx 설정
- **SPA 라우팅**: `try_files`를 통한 클라이언트 라우팅 지원
- **정적 파일 캐싱**: JS/CSS/이미지 파일 1년 캐싱
- **압축**: Gzip 압축을 통한 전송 최적화

## 📋 주요 의존성

```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-router-dom": "^7.8.1",
    "@tanstack/react-query": "^5.84.2",
    "zustand": "^5.0.7",
    "axios": "^1.11.0",
    "bootstrap": "^5.3.7",
    "react-bootstrap": "^2.10.10",
    "react-cookies": "^0.1.1"
  }
}
```

## 🐛 문제 해결

### 일반적인 문제들
1. **CORS 에러**: 서버에서 CORS 설정 확인
2. **토큰 만료**: 자동 갱신 로직이 작동하는지 확인
3. **라우팅 404**: Nginx 설정에서 `try_files` 확인

### 개발 환경 문제
1. **환경 변수 로딩**: `.env.*` 파일이 올바른 위치에 있는지 확인
2. **포트 충돌**: 다른 서비스가 해당 포트를 사용하고 있는지 확인

## 📄 라이센스

이 프로젝트는 개인 프로젝트입니다.

## 🤝 기여

프로젝트 개선을 위한 제안이나 버그 리포트는 언제든 환영합니다.