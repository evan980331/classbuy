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
    const res = await fetch("/api/admin/auth", { method: "POST", body: JSON.stringify({ secret: pw }), headers: { "Content-Type": "application/json" } });
    if (res.ok) location.reload();
    else setErr("暗號錯誤，請確認 ADMIN_SECRET");
  };
  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardHeader><CardTitle>管理者驗證</CardTitle><p className="text-sm text-muted-foreground">請輸入暗號以進入管理區（預設 classroom123）</p></CardHeader>
      <CardContent className="space-y-3">
        <Label>暗號</Label>
        <Input type="password" value={pw} onChange={(e)=>setPw(e.target.value)} placeholder="ADMIN_SECRET" />
        {err && <p className="text-sm text-destructive">{err}</p>}
        <Button onClick={submit} className="w-full">進入管理區</Button>
      </CardContent>
    </Card>
  );
}
