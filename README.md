# KB카드 업무매뉴얼 챗봇

KB카드 업무 관련 문의를 처리하는 RAG 기반 AI 챗봇 인터페이스입니다.

## 주요 기능

- 🤖 **다중 에이전트 지원**: 업무매뉴얼, 고객컨택 등 특화된 AI 에이전트
- 📚 **RAG 기반 답변**: 출처 문서와 함께 정확한 답변 제공
- 💬 **대화 이력 관리**: 대화 저장 및 불러오기 기능
- 🎨 **KB 디자인 시스템**: KB 브랜드 컬러 및 폰트 적용

## 기술 스택

- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **UI**: React 19

## 프로젝트 구조

```
chat-app/
├── app/                      # Next.js App Router
│   ├── chat/                # 채팅 페이지
│   │   └── page.tsx
│   ├── globals.css          # 글로벌 스타일 (CSS 변수 정의)
│   ├── layout.tsx           # 루트 레이아웃
│   └── page.tsx             # 홈 페이지
│
├── components/              # 재사용 가능한 컴포넌트
│   ├── icons/              # SVG 아이콘 컴포넌트
│   │   ├── ExternalLinkIcon.tsx
│   │   ├── LinkIcon.tsx
│   │   ├── MenuIcon.tsx
│   │   ├── SearchIcon.tsx
│   │   ├── SendIcon.tsx
│   │   ├── UserIcon.tsx
│   │   └── index.ts
│   ├── ChatArea.tsx        # 메인 채팅 영역
│   ├── KBLogo.tsx          # KB 로고 컴포넌트
│   ├── LeftSidebar.tsx     # 에이전트 선택 사이드바
│   └── RightSidebar.tsx    # 대화 이력 사이드바
│
├── config/                  # 설정 파일
│   └── agents.ts           # 에이전트 설정 및 메타데이터
│
├── constants/               # 상수 정의
│   └── index.ts            # 로딩 메시지, 타이밍 등
│
├── types/                   # TypeScript 타입 정의
│   └── chat.ts             # 채팅 관련 인터페이스
│
├── public/                  # 정적 파일
│   ├── KBFGText-Light.otf  # KB 폰트 (Light)
│   ├── KBFGText-Medium.otf # KB 폰트 (Medium)
│   └── kb-logo.webp        # KB 로고 이미지
│
└── package.json
```

## CSS 변수 시스템

글로벌 CSS 변수를 통해 일관된 디자인 시스템을 유지합니다.

### 색상 변수
```css
--color-kb-yellow: #FFBF00          /* KB 브랜드 컬러 */
--color-background: #f9fafc         /* 배경색 */
--color-white: #FFFFFF              /* 흰색 */
--color-border: #D9D9D9             /* 기본 테두리 */
--color-border-light: #E5E5E5       /* 연한 테두리 */
--color-border-hover: #CCCCCC       /* 호버 테두리 */
--color-text-primary: #333333       /* 주 텍스트 */
--color-text-secondary: #999999     /* 부 텍스트 */
--color-text-tertiary: #666666      /* 3차 텍스트 */
--color-text-placeholder: #BBBBBB   /* 플레이스홀더 */
--color-hover-bg: #eff2f7           /* 호버 배경 */
```

### 크기 변수
```css
--chat-max-width: 740px             /* 채팅 영역 최대 너비 */
--sidebar-width: 300px              /* 사이드바 너비 */
--title-bar-height: 56px            /* 타이틀바 높이 */
--input-height: 64px                /* 입력창 높이 */
--border-radius-lg: 24px            /* 큰 모서리 */
--border-radius-md: 16px            /* 중간 모서리 */
```

## 개발 가이드

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 애플리케이션이 실행됩니다.

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

## 컴포넌트 설명

### ChatArea
메인 채팅 인터페이스를 담당하며 다음 기능을 포함합니다:
- 메시지 표시 및 입력
- 로딩 상태 관리
- 출처 문서 표시
- 에이전트별 웰컴 메시지

### LeftSidebar
에이전트 선택 메뉴를 제공합니다:
- KB 로고
- 에이전트 아이콘 버튼 (업무매뉴얼, 고객컨택)
- 선택 상태 표시

### RightSidebar
대화 이력 관리 기능:
- 현재 대화 저장
- 저장된 대화 목록 표시
- 대화 불러오기
- 대화 삭제

### 아이콘 컴포넌트
재사용 가능한 SVG 아이콘:
- `SearchIcon`: 검색 아이콘
- `UserIcon`: 사용자 아이콘
- `MenuIcon`: 메뉴/닫기 토글 아이콘
- `SendIcon`: 전송 버튼 아이콘
- `LinkIcon`: 링크 아이콘
- `ExternalLinkIcon`: 외부 링크 아이콘

## 타입 정의

### Message
```typescript
interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
}
```

### Source
```typescript
interface Source {
  fileName: string;
  fileFormat: string;
  page: number;
  department: string;
  manager: string;
  url?: string;
}
```

### AgentConfig
```typescript
interface AgentConfig {
  id: string;
  name: string;
  icon: 'search' | 'user';
  title: string;
  description: string;
}
```

## 코드 스타일 가이드

### CSS 변수 사용
하드코딩된 색상 대신 CSS 변수를 사용하세요:

```tsx
// ❌ 나쁜 예
<div style={{ backgroundColor: '#f9fafc' }}>

// ✅ 좋은 예
<div style={{ backgroundColor: 'var(--color-background)' }}>
```

### 컴포넌트 재사용
반복되는 UI 요소는 컴포넌트로 추출하세요:

```tsx
// ❌ 나쁜 예
<Image src="/kb-logo.webp" width={28} height={28} />

// ✅ 좋은 예
<KBLogo size={28} />
```

### 타입 임포트
공유 타입은 `types/` 폴더에서 임포트하세요:

```tsx
import { Message, Source } from '@/types/chat';
```

## 향후 개선 사항

- [ ] 백엔드 API 연동
- [ ] 실시간 스트리밍 응답
- [ ] 대화 이력 로컬 스토리지 저장
- [ ] 다크 모드 지원
- [ ] 접근성 개선 (ARIA 라벨)
- [ ] 키보드 네비게이션
- [ ] 응답 평가 기능
- [ ] 파일 업로드 기능

## 라이선스

Internal Use Only - KB Card

## 문의

개발팀 문의: [담당자 이메일]
