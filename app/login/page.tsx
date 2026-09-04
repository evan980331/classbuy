"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [step, setStep] = useState<1|2>(1);
  const [seatNo, setSeatNo] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [needSet, setNeedSet] = useState(false);
  const [msg, setMsg] = useState<string|null>(null);
  const router = useRouter();

  const verifyIdentity = async () => {
    setMsg(null);
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ seatNo: Number(seatNo), name }) });
    const j = await res.json();
    if (j.needSetPassword) {
      setNeedSet(true);
      setStep(2);
      setMsg("首次登入，請設定密碼（至少4字元）");
      return;
    }
    if (!res.ok) { setMsg(j.error || "驗證失敗"); return; }
    setNeedSet(false);
    setStep(2);
  };

  const doLogin = async () => {
    setMsg(null);
    const body:any = { seatNo: Number(seatNo), name, password };
    if (needSet) body.setPassword = true;
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await res.json();
    if (!res.ok) { setMsg(j.error || "登入失敗"); return; }
    router.push("/");
    router.refresh();
  };

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader><CardTitle>登入 - 座號 / 姓名 / 密碼</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {step===1 && (
          <>
            <div><Label>座號</Label><Input type="number" value={seatNo} onChange={e=>setSeatNo(e.target.value)} placeholder="1~35 (不含9)" /></div>
            <div><Label>姓名</Label><Input value={name} onChange={e=>setName(e.target.value)} placeholder="座號姓名" /></div>
            <Button className="w-full" onClick={verifyIdentity}>下一步</Button>
          </>
        )}
        {step===2 && (
          <>
            <div className="text-sm text-muted-foreground">座號 {seatNo} - {name} {needSet ? "（首次設定密碼）" : ""}</div>
            <div><Label>{needSet ? "設定密碼" : "輸入密碼"}</Label><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder={needSet ? "至少4字元" : "請輸入密碼"} /></div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={()=>{setStep(1); setPassword(""); setMsg(null);}}>返回</Button>
              <Button className="flex-1" onClick={doLogin}>{needSet ? "設定並登入" : "登入"}</Button>
            </div>
          </>
        )}
        {msg && <div className={`text-sm p-2 rounded ${msg.includes("成功")||msg.includes("設定")?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}`}>{msg}</div>}
      </CardContent>
    </Card>
  );
}
