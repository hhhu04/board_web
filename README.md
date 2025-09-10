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
- **GitHub Actions** - CI/CD 자동화

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

## 🚀 배포 방식

### 🌐 GitHub Actions + AWS S3 + CloudFront 배포

프로덕션 환경은 GitHub Actions를 통해 AWS S3에 정적 파일을 업로드하고 CloudFront 캐시를 무효화하는 방식으로 배포됩니다.

#### 배포 프로세스
1. **자동 트리거**: `main` 브랜치에 푸시 시 자동 배포 시작
2. **빌드**: Node.js 환경에서 프로덕션 빌드 수행
3. **S3 업로드**: 빌드된 정적 파일들을 S3 버킷에 동기화
4. **캐시 전략**: 
   - 정적 자산 (JS/CSS/이미지): 1년 캐시 (`max-age=31536000`)
   - HTML 파일: 캐시 방지 (`no-cache, no-store`)
5. **CloudFront 무효화**: 전체 캐시 무효화로 즉시 반영

#### 필요한 GitHub Secrets
```bash
# AWS 인증 정보
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# S3 및 CloudFront 설정
S3_BUCKET_NAME=your-s3-bucket-name
CLOUDFRONT_DISTRIBUTION_ID=your_cloudfront_distribution_id

# 애플리케이션 환경 변수
VITE_PROD_SERVER_URL=https://api.yourdomain.com/api
VITE_PROD_AUTH_URL=https://api.yourdomain.com/auth
VITE_PROD_COOKIE_DOMAIN=yourdomain.com
```

#### AWS 인프라 요구사항
- **S3 버킷**: 정적 웹사이트 호스팅 활성화
- **CloudFront 배포**: S3 버킷을 오리진으로 설정
- **Route 53** (선택사항): 커스텀 도메인 설정
- **ACM 인증서**: HTTPS 지원

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

### GitHub Actions CI/CD
프로덕션 배포는 완전 자동화된 파이프라인을 통해 진행됩니다:

1. **코드 체크아웃**: GitHub 저장소에서 최신 코드 가져오기
2. **Node.js 환경 설정**: Node.js 22 LTS 환경 구성
3. **의존성 설치**: `npm ci`로 정확한 버전 설치
4. **프로덕션 빌드**: 환경 변수와 함께 최적화된 빌드 생성
5. **AWS 인증**: IAM 자격 증명으로 AWS 서비스 접근
6. **S3 배포**: 
   - 기존 파일 삭제 후 새 파일 동기화 (`--delete`)
   - 정적 자산: 1년 캐시 설정
   - HTML 파일: 캐시 무효화 설정
7. **CloudFront 무효화**: 
   - 전체 경로 (`/*`) 캐시 무효화
   - 무효화 완료까지 대기
   - 즉시 업데이트 반영

### 캐시 전략
- **정적 자산 (JS/CSS/이미지)**: `max-age=31536000,public` (1년)
- **HTML 파일**: `max-age=0,no-cache,no-store,must-revalidate`
- **CloudFront**: 엣지 캐시 최적화로 글로벌 성능 향상

### 성능 최적화
- **Vite 빌드 최적화**: 코드 스플리팅 및 번들 최적화
- **이미지 최적화**: WebP 포맷 지원 및 지연 로딩
- **트리 쉐이킹**: 사용하지 않는 코드 제거
- **CloudFront CDN**: 전 세계 엣지 로케이션을 통한 빠른 콘텐츠 전송

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
