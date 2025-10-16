/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */ // 데모 목적: Before 컴포넌트에서 일부러 의존성 누락
import { useEffect, useState, useEffectEvent } from "react";

export default function EffectEvent19_2() {
  return (
    <div className="container">
      <h1>[19.1 ↔ 19.2] useEffectEvent 데모</h1>
      <div className="grid">
        <Before />
        <After />
      </div>
      <div className="note">
        <b>포인트</b>: 19.2의 <code>useEffectEvent</code>는 이펙트의 “비반응적
        로직”을 분리해 의존성 배열 걱정 없이 <i>항상 최신 상태</i>에 접근하도록
        보장.
      </div>
    </div>
  );
}

function Before() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      // stale-closure 예시: 의존성 미관리 시 오래된 count를 참조할 수 있음
      console.log("(19.1 이전 패턴) count =", count);
    }, 1000);
    return () => clearInterval(id);
  }, []); // ❗ 의도적으로 의존성 누락 (데모용)

  return (
    <div className="card">
      <h2>이전 패턴 (stale 가능)</h2>
      <div className="row">
        <button className="btn" onClick={() => setCount((c) => c + 1)}>
          +1
        </button>
        <span>count: {count}</span>
      </div>
      <p className="small">
        콘솔을 보세요. count가 오래된 값으로 찍힐 수 있음.
      </p>
    </div>
  );
}

function After() {
  const [count, setCount] = useState(0);

  const logLatest = useEffectEvent(() => {
    // 항상 최신 count를 읽음
    console.log("(19.2) 최신 count =", count);
  });

  useEffect(() => {
    const id = setInterval(() => logLatest(), 1000);
    return () => clearInterval(id);
  }, [logLatest]); // 안정적 핸들러

  return (
    <div className="card">
      <h2>useEffectEvent로 해결(19.2)</h2>
      <div className="row">
        <button className="btn" onClick={() => setCount((c) => c + 1)}>
          +1
        </button>
        <span>count: {count}</span>
      </div>
      <p className="small">콘솔을 보세요. 항상 최신 값이 출력.</p>
    </div>
  );
}
