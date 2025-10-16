/* eslint-disable react-refresh/only-export-components */
import { useState, Activity } from "react";

function HeavyPanel() {
  // 무거운 연산 시뮬레이션 (빈 블록 대신 실연산으로 no-empty 회피)
  let acc = 0;
  // 약 ~300ms CPU 작업 흉내(환경에 따라 다름)
  const targetMs = 300;
  const start = performance.now();
  while (performance.now() - start < targetMs) {
    for (let i = 0; i < 5_000; i++) acc += Math.sqrt(i);
  }
  return (
    <div className="card">무거운 패널 렌더 완료 (acc={Math.round(acc)})</div>
  );
}

export default function Activity19_2() {
  const [showHeavy, setShowHeavy] = useState(false);

  return (
    <div className="container">
      <h1>[19.2] &lt;Activity/&gt; 데모</h1>
      <div className="row">
        <button className="btn" onClick={() => setShowHeavy((v) => !v)}>
          {showHeavy ? "숨기기" : "보이기"}
        </button>
        <span className="small">hidden 모드에서 UI 영향 최소화</span>
      </div>

      <div className="card">
        <p>항상 부드러워야 하는 상단 영역</p>
      </div>

      <Activity mode={showHeavy ? "visible" : "hidden"}>
        <HeavyPanel />
      </Activity>

      <div className="note">
        <b>포인트</b>: <code>hidden</code>일 때 자식 이펙트를 언마운트/업데이트
        지연 ⇒ 보이는 UI 프레임 저하 방지, 전환 시 이미 준비된 화면으로 빠르게
        전환.
      </div>
    </div>
  );
}
