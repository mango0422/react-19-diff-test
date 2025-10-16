import { useState, useTransition } from "react";
import { useActionState, useOptimistic, type FormEvent } from "react"; // <- type-only import

// (가짜 API)
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function updateName(name: string) {
  await delay(800);
  if (name.trim().length < 2)
    throw new Error("이름은 2글자 이상이어야 합니다.");
  return name.toUpperCase();
}

export default function Forms18vs19() {
  return (
    <div className="container">
      <h1>[18 ↔ 19] 폼 처리 비교</h1>
      <div className="grid">
        <Card18 />
        <Card19 />
      </div>
      <div className="note">
        <b>포인트</b>: 19에서는 <code>form action</code> +{" "}
        <code>useActionState</code>로 pending/에러/낙관적 업데이트를
        보일러플레이트 거의 없이 처리.
      </div>
    </div>
  );
}

function Card18() {
  const [name, setName] = useState("");
  const [serverName, setServerName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const result = await updateName(name);
        setServerName(result);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "알 수 없는 오류");
      }
    });
  };

  return (
    <div className="card">
      <h2>React 18 스타일</h2>
      <form onSubmit={onSubmit} className="grid twoCols">
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름 입력"
        />
        <button className="btn" disabled={isPending}>
          업데이트
        </button>
      </form>
      {isPending && <p className="small">전송 중...</p>}
      {error && <p className="warn">{error}</p>}
      {serverName && <p className="ok">서버 저장: {serverName}</p>}
    </div>
  );
}

function Card19() {
  // 낙관적 UI(선반영)
  const [optimisticName, setOptimisticName] = useOptimistic<string | null>(
    null
  );

  // Actions + useActionState
  async function action(_prev: { error?: string | null }, formData: FormData) {
    const name = String(formData.get("name") ?? "");
    try {
      const result = await updateName(name);
      setOptimisticName(result); // 성공 시 즉시 반영
      return { error: null as string | null };
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : "알 수 없는 오류" };
    }
  }
  const [state, formAction, isPending] = useActionState(action, {
    error: null as string | null,
  });

  return (
    <div className="card">
      <h2>React 19 스타일 (Actions)</h2>
      <form action={formAction} className="grid twoCols">
        <input className="input" name="name" placeholder="이름 입력" />
        <button className="btn" disabled={isPending}>
          업데이트
        </button>
      </form>
      {isPending && <p className="small">전송 중...(pending 자동 관리)</p>}
      {state.error && <p className="warn">{state.error}</p>}
      {optimisticName && (
        <p className="ok">서버 저장(낙관적): {optimisticName}</p>
      )}
    </div>
  );
}
