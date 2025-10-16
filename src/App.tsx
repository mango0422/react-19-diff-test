// src/App.tsx
import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="container">
      <h1>React 버전별 차이 데모 (Vite + React 19.2)</h1>
      <ul>
        <li>
          <Link to="/18-vs-19/forms">
            [18 ↔ 19] 폼 처리: setState/핸들러 vs Actions/ActionState
          </Link>
        </li>
        <li>
          <Link to="/19-vs-19_1/notes">
            [19.0 ↔ 19.1] 변경 요약(체감 포인트)
          </Link>
        </li>
        <li>
          <Link to="/19_1-vs-19_2/effect-event">
            [19.1 ↔ 19.2] useEffectEvent로 stale-closure 제거
          </Link>
        </li>
        <li>
          <Link to="/19_2/activity">
            [19.2] &lt;Activity /&gt;로 화면 숨김/보여주기 & 선제 렌더 체험
          </Link>
        </li>
      </ul>
      <p className="hint">
        좌측/우측 패널을 비교하며 동작 차이를 눈으로 확인하세요.
      </p>
    </div>
  );
}
