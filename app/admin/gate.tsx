"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function AdminGate() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const submit = async () => {
    const res = await fetch("/api/admin/auth", { method: "POST", body: JSON.stringify({ pin: pw, secret: pw }), headers: { "Content-Type": "application/json" } });
    if (res.ok) location.reload();
    else setErr("PIN 碼錯誤，請確認 .env 的 ADMIN_PIN / ADMIN_SECRET");
  };
  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader><CardTitle>管理者驗證</CardTitle><p className="text-sm text-muted-foreground">請輸入 PIN 碼以進入管理區（預設 ADMIN_PIN=1234 或 ADMIN_SECRET=classroom123）</p></CardHeader>
      <CardContent className="space-y-3">
        <Label>PIN 碼 / 暗號</Label>
        <Input type="password" value={pw} onChange={(e)=>setPw(e.target.value)} placeholder="ADMIN_PIN" onKeyDown={e=> e.key==="Enter" && submit()} />
        {err && <p className="text-sm text-destructive">{err}</p>}
        <Button onClick={submit} className="w-full">進入管理區</Button>
      </CardContent>
    </Card>
  );
}
