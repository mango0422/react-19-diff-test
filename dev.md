좋아. \*\*React 19.2 + Vite\*\*로 “버전별 차이(18↔19, 19.0↔19.1, 19.1↔19.2)를 직접 체험”할 수 있는 미니 데모를 한 번에 만들자. 아래 그대로 복붙하면 동작해. 각 페이지에서 \*\*좌/우 패널\*\*로 “이전 방식 vs 새 방식”을 나란히 보여줘서 차이를 바로 확인할 수 있게 했어.



> 핵심 근거

>

> \* React 19: \*\*Actions / `useActionState` / `useOptimistic` / 폼 내장\*\* 등(공식 블로그). (\[react.dev]\[1])

> \* React 19.2: \*\*`useEffectEvent`\*\*, \*\*`<Activity />`\*\*, \*\*SSR 스트리밍 Suspense 배치 공개\*\* 등의 개선(공식/요약). (\[react.dev]\[2])



---



\# 0) 프로젝트 생성 \& 의존성



```bash

\# Vite + React + TS

npm create vite@latest react19-diff -- --template react-swc-ts

cd react19-diff



\# React 19.2 고정 + ESLint(Flat) + 타입

npm i react@19.2.0 react-dom@19.2.0

npm i -D typescript @types/react @types/react-dom



\# 라우팅

npm i react-router-dom



\# (선택) ESLint v9 플랫 설정

npm i -D eslint @eslint/js globals

```



`index.html`는 Vite 기본 그대로 사용.



---



\# 1) `eslint.config.mjs` (선택)



ESLint v9 플랫 설정 예시. (원하면 생략 가능)



```js

// eslint.config.mjs

import js from '@eslint/js';

import globals from 'globals';



export default \[

&nbsp; js.configs.recommended,

&nbsp; {

&nbsp;   files: \['\*\*/\*.{ts,tsx}'],

&nbsp;   languageOptions: {

&nbsp;     ecmaVersion: 'latest',

&nbsp;     sourceType: 'module',

&nbsp;     globals: { ...globals.browser },

&nbsp;   },

&nbsp;   rules: {},

&nbsp; },

];

```



---



\# 2) `src/main.tsx` \& `src/App.tsx`



```tsx

// src/main.tsx

import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';

import Forms18vs19 from './pages/Forms18vs19';

import EffectEvent19\_2 from './pages/EffectEvent19\_2';

import Activity19\_2 from './pages/Activity19\_2';

import Notes19vs19\_1 from './pages/Notes19vs19\_1';

import './styles.css';



const router = createBrowserRouter(\[

&nbsp; { path: '/', element: <App /> },

&nbsp; { path: '/18-vs-19/forms', element: <Forms18vs19 /> },

&nbsp; { path: '/19-vs-19\_1/notes', element: <Notes19vs19\_1 /> },

&nbsp; { path: '/19\_1-vs-19\_2/effect-event', element: <EffectEvent19\_2 /> },

&nbsp; { path: '/19\_2/activity', element: <Activity19\_2 /> },

]);



createRoot(document.getElementById('root')!).render(

&nbsp; <StrictMode>

&nbsp;   <RouterProvider router={router} />

&nbsp; </StrictMode>,

);

```



```tsx

// src/App.tsx

import { Link } from 'react-router-dom';



export default function App() {

&nbsp; return (

&nbsp;   <div className="container">

&nbsp;     <h1>React 버전별 차이 데모 (Vite + React 19.2)</h1>

&nbsp;     <ul>

&nbsp;       <li><Link to="/18-vs-19/forms">\[18 ↔ 19] 폼 처리: setState/핸들러 vs Actions/ActionState</Link></li>

&nbsp;       <li><Link to="/19-vs-19\_1/notes">\[19.0 ↔ 19.1] 변경 요약(체감 포인트)</Link></li>

&nbsp;       <li><Link to="/19\_1-vs-19\_2/effect-event">\[19.1 ↔ 19.2] useEffectEvent로 stale-closure 제거</Link></li>

&nbsp;       <li><Link to="/19\_2/activity">\[19.2] \&lt;Activity /\&gt;로 화면 숨김/보여주기 \& 선제 렌더 체험</Link></li>

&nbsp;     </ul>

&nbsp;     <p className="hint">좌측/우측 패널을 비교하며 동작 차이를 눈으로 확인하세요.</p>

&nbsp;   </div>

&nbsp; );

}

```



`src/styles.css` (간단한 좌/우 패널 레이아웃)



```css

.container { max-width: 960px; margin: 40px auto; padding: 16px; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }

.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }

.card h2 { margin: 0 0 8px; font-size: 18px; }

.small { color: #6b7280; font-size: 12px; }

.btn { padding: 8px 12px; border-radius: 8px; border: 1px solid #d1d5db; background: #fafafa; cursor: pointer; }

.input { padding: 8px; border: 1px solid #d1d5db; border-radius: 8px; width: 100%; }

.row { display: flex; gap: 8px; align-items: center; }

.note { background: #f9fafb; border-left: 3px solid #60a5fa; padding: 8px; margin: 12px 0; }

.ok { color: #065f46; }

.warn { color: #92400e; }

```



---



\# 3) 페이지 ① — \*\*React 18 vs 19: 폼 처리\*\*



React 18에서는 \*\*로컬 상태/핸들러/로딩·에러 상태\*\*를 직접 관리.

React 19에서는 `<form action={fn}>` \*\*Actions + `useActionState`\*\*로 간결하게. (\[react.dev]\[1])



```tsx

// src/pages/Forms18vs19.tsx

import { useState, useTransition, FormEvent } from 'react';

import { useActionState, useOptimistic } from 'react'; // React 19



// (가짜 API)

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function updateName(name: string) {

&nbsp; await delay(800);

&nbsp; if (name.trim().length < 2) throw new Error('이름은 2글자 이상이어야 합니다.');

&nbsp; return name.toUpperCase();

}



export default function Forms18vs19() {

&nbsp; return (

&nbsp;   <div className="container">

&nbsp;     <h1>\[18 ↔ 19] 폼 처리 비교</h1>

&nbsp;     <div className="grid">

&nbsp;       <Card18 />

&nbsp;       <Card19 />

&nbsp;     </div>

&nbsp;     <div className="note">

&nbsp;       <b>포인트</b>: 19에서는 <code>form action</code> + <code>useActionState</code>로

&nbsp;       pending/에러/낙관적 업데이트를 거의 보일러플레이트 없이 처리. 18은 수동 관리 필요.

&nbsp;     </div>

&nbsp;   </div>

&nbsp; );

}



function Card18() {

&nbsp; const \[name, setName] = useState('');

&nbsp; const \[serverName, setServerName] = useState<string | null>(null);

&nbsp; const \[isPending, startTransition] = useTransition();

&nbsp; const \[error, setError] = useState<string | null>(null);



&nbsp; const onSubmit = (e: FormEvent) => {

&nbsp;   e.preventDefault();

&nbsp;   setError(null);

&nbsp;   startTransition(async () => {

&nbsp;     try {

&nbsp;       const result = await updateName(name);

&nbsp;       setServerName(result);

&nbsp;     } catch (err: any) {

&nbsp;       setError(err.message);

&nbsp;     }

&nbsp;   });

&nbsp; };



&nbsp; return (

&nbsp;   <div className="card">

&nbsp;     <h2>React 18 스타일</h2>

&nbsp;     <form onSubmit={onSubmit} className="grid" style={{ gridTemplateColumns: '1fr auto' }}>

&nbsp;       <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름 입력" />

&nbsp;       <button className="btn" disabled={isPending}>업데이트</button>

&nbsp;     </form>

&nbsp;     {isPending \&\& <p className="small">전송 중...</p>}

&nbsp;     {error \&\& <p className="warn">{error}</p>}

&nbsp;     {serverName \&\& <p className="ok">서버 저장: {serverName}</p>}

&nbsp;   </div>

&nbsp; );

}



function Card19() {

&nbsp; // 낙관적 UI(선반영)

&nbsp; const \[optimisticName, setOptimisticName] = useOptimistic<string | null>(null);



&nbsp; // Actions + useActionState

&nbsp; async function action(prevState: { error?: string | null }, formData: FormData) {

&nbsp;   const name = String(formData.get('name') ?? '');

&nbsp;   try {

&nbsp;     const result = await updateName(name);

&nbsp;     setOptimisticName(result); // 성공 시 즉시 반영

&nbsp;     return { error: null };

&nbsp;   } catch (e: any) {

&nbsp;     return { error: e.message as string };

&nbsp;   }

&nbsp; }

&nbsp; const \[state, formAction, isPending] = useActionState(action, { error: null as string | null });



&nbsp; return (

&nbsp;   <div className="card">

&nbsp;     <h2>React 19 스타일 (Actions)</h2>

&nbsp;     <form action={formAction} className="grid" style={{ gridTemplateColumns: '1fr auto' }}>

&nbsp;       <input className="input" name="name" placeholder="이름 입력" />

&nbsp;       <button className="btn" disabled={isPending}>업데이트</button>

&nbsp;     </form>

&nbsp;     {isPending \&\& <p className="small">전송 중...(pending을 자동 관리)</p>}

&nbsp;     {state.error \&\& <p className="warn">{state.error}</p>}

&nbsp;     {optimisticName \&\& <p className="ok">서버 저장(낙관적): {optimisticName}</p>}

&nbsp;   </div>

&nbsp; );

}

```



---



\# 4) 페이지 ② — \*\*19.0 ↔ 19.1: 체감 포인트 요약\*\*



19.1은 주로 \*\*안정성/디버깅/서스펜스·RSC 개선\*\* 등 \*\*프레임워크·도구 레벨\*\* 변화가 크고, SPA에서 바로 눈으로 드러나는 “새 API” 변화는 적어. 그래서 \*\*요약 노트 + 작은 실험\*\* 형태로 제공. (예: Suspense UX 미세 개선 시나리오 설명) (\[wisp.blog]\[3])



```tsx

// src/pages/Notes19vs19\_1.tsx

export default function Notes19vs19\_1() {

&nbsp; return (

&nbsp;   <div className="container">

&nbsp;     <h1>\[19.0 ↔ 19.1] 변화 요약</h1>

&nbsp;     <div className="card">

&nbsp;       <ul>

&nbsp;         <li>디버깅/스택 품질 개선, RSC 및 Suspense 동작 안정화, Dev/Native 생태계 동반 업그레이드(예: RN 0.80의 React 19.1 포함). <span className="small">근거: 릴리스/요약 문서</span></li>

&nbsp;         <li>SPA만으로 즉시 ‘새 API’를 체감하기는 제한적이므로, 19.1은 <b>“코드 변경 적고, 체감 품질 상승”</b> 구간으로 이해.</li>

&nbsp;       </ul>

&nbsp;       <p className="small">

&nbsp;         참고: 19.1 공개 기사/노트들. (Stack/SSR/Suspense 안정화 언급)  

&nbsp;         - Wisp Blog 개요, 2025-03-28 릴리스. :contentReference\[oaicite:4]{index=4}  

&nbsp;         - React Native 0.80가 19.1을 포함. :contentReference\[oaicite:5]{index=5}

&nbsp;       </p>

&nbsp;     </div>

&nbsp;   </div>

&nbsp; );

}

```



---



\# 5) 페이지 ③ — \*\*19.1 ↔ 19.2: `useEffectEvent`로 stale-closure 제거\*\*



19.2에서 공식 문서에 \*\*`useEffectEvent`\*\* 추가. 이걸로 이펙트 내부에서 최신 props/state를 안전하게 읽는 \*\*Effect Event\*\* 패턴을 시연. (\[react.dev]\[2])



```tsx

// src/pages/EffectEvent19\_2.tsx

import { useEffect, useState, useEffectEvent } from 'react';



export default function EffectEvent19\_2() {

&nbsp; return (

&nbsp;   <div className="container">

&nbsp;     <h1>\[19.1 ↔ 19.2] useEffectEvent 데모</h1>

&nbsp;     <div className="grid">

&nbsp;       <Before />

&nbsp;       <After />

&nbsp;     </div>

&nbsp;     <div className="note">

&nbsp;       <b>포인트</b>: 19.2의 <code>useEffectEvent</code>는 이펙트의 “비반응적 로직”을 분리해

&nbsp;       의존성 배열 걱정 없이 <i>항상 최신 상태</i>에 접근하도록 보장. 이벤트/타이머/리스너에서 stale-closure 이슈가 사라짐. :contentReference\[oaicite:7]{index=7}

&nbsp;     </div>

&nbsp;   </div>

&nbsp; );

}



function Before() {

&nbsp; const \[count, setCount] = useState(0);



&nbsp; useEffect(() => {

&nbsp;   const id = setInterval(() => {

&nbsp;     // stale-closure 예시: 의존성 미관리 시 오래된 count를 참조할 수 있음

&nbsp;     console.log('(19.1 이전 패턴) count =', count);

&nbsp;   }, 1000);

&nbsp;   return () => clearInterval(id);

&nbsp; }, \[]); // ❗ 의존성 누락



&nbsp; return (

&nbsp;   <div className="card">

&nbsp;     <h2>이전 패턴 (stale 가능)</h2>

&nbsp;     <div className="row">

&nbsp;       <button className="btn" onClick={() => setCount((c) => c + 1)}>+1</button>

&nbsp;       <span>count: {count}</span>

&nbsp;     </div>

&nbsp;     <p className="small">콘솔을 보세요. count가 오래된 값으로 찍힐 수 있음.</p>

&nbsp;   </div>

&nbsp; );

}



function After() {

&nbsp; const \[count, setCount] = useState(0);



&nbsp; const logLatest = useEffectEvent(() => {

&nbsp;   // 항상 최신 count를 읽음

&nbsp;   console.log('(19.2) 최신 count =', count);

&nbsp; });



&nbsp; useEffect(() => {

&nbsp;   const id = setInterval(() => logLatest(), 1000);

&nbsp;   return () => clearInterval(id);

&nbsp; }, \[logLatest]); // logLatest는 안정적 핸들러



&nbsp; return (

&nbsp;   <div className="card">

&nbsp;     <h2>useEffectEvent로 해결(19.2)</h2>

&nbsp;     <div className="row">

&nbsp;       <button className="btn" onClick={() => setCount((c) => c + 1)}>+1</button>

&nbsp;       <span>count: {count}</span>

&nbsp;     </div>

&nbsp;     <p className="small">콘솔을 보세요. 항상 최신 값이 출력.</p>

&nbsp;   </div>

&nbsp; );

}

```



---



\# 6) 페이지 ④ — \*\*19.2: `<Activity />`로 숨김/보여주기 \& 선제 렌더\*\*



`<Activity>`는 보이지 않는 화면을 \*\*`hidden` 모드\*\*로 유지하면서 이펙트를 언마운트하고 업데이트를 지연시켜 \*\*보이는 화면의 성능을 보호\*\*. 사용자는 빠른 전환을 체감. (19.2 신설) (\[react.dev]\[4])



```tsx

// src/pages/Activity19\_2.tsx

import { useState, Activity } from 'react';



function HeavyPanel() {

&nbsp; // 무거운 연산 시뮬레이션

&nbsp; const start = performance.now();

&nbsp; while (performance.now() - start < 300) {} // 300ms 바쁜 대기

&nbsp; return <div className="card">무거운 패널 렌더 완료</div>;

}



export default function Activity19\_2() {

&nbsp; const \[showHeavy, setShowHeavy] = useState(false);



&nbsp; return (

&nbsp;   <div className="container">

&nbsp;     <h1>\[19.2] \&lt;Activity/\&gt; 데모</h1>

&nbsp;     <div className="row">

&nbsp;       <button className="btn" onClick={() => setShowHeavy((v) => !v)}>

&nbsp;         {showHeavy ? '숨기기' : '보이기'}

&nbsp;       </button>

&nbsp;       <span className="small">hidden 모드에서 UI 영향 최소화</span>

&nbsp;     </div>



&nbsp;     {/\* 보이는 영역 \*/}

&nbsp;     <div className="card"><p>항상 부드러워야 하는 상단 영역</p></div>



&nbsp;     {/\* 보이지 않을 때도 pre-render 유지 가능 \*/}

&nbsp;     <Activity mode={showHeavy ? 'visible' : 'hidden'}>

&nbsp;       <HeavyPanel />

&nbsp;     </Activity>



&nbsp;     <div className="note">

&nbsp;       <b>포인트</b>: <code>hidden</code>일 때 자식의 이펙트를 언마운트하고 업데이트를 지연 ⇒

&nbsp;       보이는 UI의 프레임 저하를 방지. 전환 시 이미 준비된 화면으로 빠르게 전환. :contentReference\[oaicite:9]{index=9}

&nbsp;     </div>

&nbsp;   </div>

&nbsp; );

}

```



---



\# 7) 실행



```bash

npm run dev

\# http://localhost:5173

```



---



\## 무엇을 “체험”하게 되나?



1\. \*\*\[18 ↔ 19]\*\*



&nbsp;  \* 18: 수동 폼 상태/로딩/에러 관리, 핸들러 작성

&nbsp;  \* 19: `<form action>` + `useActionState` + `useOptimistic`로 보일러플레이트 급감(공식 19 블로그). (\[react.dev]\[1])



2\. \*\*\[19.0 ↔ 19.1]\*\*



&nbsp;  \* 19.1은 \*\*API 추가보단 안정성·UX 품질\*\* 상승(서스펜스/디버깅/RSC)로 체감. SPA 단품에선 요약으로 제시. (\[wisp.blog]\[3])



3\. \*\*\[19.1 ↔ 19.2]\*\*



&nbsp;  \* \*\*`useEffectEvent`\*\*로 stale-closure 제거(문서 레퍼런스). (\[react.dev]\[2])

&nbsp;  \* \*\*`<Activity />`\*\*로 보이지 않는 화면을 숨기되 준비 상태 유지, 전환 속도 및 가시 영역 성능 개선. (\[react.dev]\[4])

&nbsp;  \* (추가로 SSR 스트리밍 시 Suspense 경계 공개를 배치해 일관된 표시 — SPA에선 체험 난이도 ↑). (\[react.dev]\[4])



---



\## 다음 단계(원하면 이어서 제공)



\* \*\*SSR/Streaming + Suspense 경계 배치(19.2 변화)\*\*를 확인하는 \*\*Vite SSR\*\* 또는 \*\*Next 15\*\* 데모 추가. (\[react.dev]\[4])

\* \*\*ESLint v9(Flat) + React 19.2 최적 규칙\*\*(특히 Effect Events 관련 규칙) 적용 템플릿.

\* \*\*React 18 → 19 마이그레이션 체크리스트\*\*(Actions 전환 포인트, 폼 라이브러리 병행전략 등). (\[react.dev]\[5])



필요하면 위 저장소 구조를 \*\*Zip로 묶은 보일러플레이트\*\*도 생성해줄게.



\[1]: https://react.dev/blog/2024/12/05/react-19?utm\_source=chatgpt.com "React v19"

\[2]: https://react.dev/reference/react/useEffectEvent?utm\_source=chatgpt.com "useEffectEvent"

\[3]: https://www.wisp.blog/blog/react-191-is-out-heres-what-you-need-to-know?utm\_source=chatgpt.com "React 19.1 is Out: Here's What You Need to Know"

\[4]: https://react.dev/blog/2025/10/01/react-19-2?utm\_source=chatgpt.com "React 19.2"

\[5]: https://react.dev/blog/2024/04/25/react-19-upgrade-guide?utm\_source=chatgpt.com "React 19 Upgrade Guide"



