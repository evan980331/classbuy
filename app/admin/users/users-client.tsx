"use client";
import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { updateUserSeat, updateUserName, createUser, deleteUser } from "@/app/actions/user";
import { useRouter } from "next/navigation";

export default function UsersClient({ users }: { users: any[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string|null>(null);
  const [form, setForm] = useState({ name: "", seatNo: "", role: "USER" as "USER"|"ADMIN" });

  const onCreate = () => {
    start(async()=>{
      try {
        const seat = form.seatNo ? Number(form.seatNo) : null;
        await createUser(form.name, seat, form.role);
        setMsg("新增成功"); setForm({ name:"", seatNo:"", role:"USER" }); router.refresh();
      } catch(e:any){ setMsg(e.message); }
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">座號管理</h1>
      <p className="text-sm text-muted-foreground">設定 1~34 號座號，坐號需唯一。admin 可在此設定。</p>

      <Card>
        <CardHeader><CardTitle>新增使用者</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            <div><Label>姓名</Label><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="例：王小明" /></div>
            <div><Label>座號 (1~34)</Label><Input type="number" value={form.seatNo} onChange={e=>setForm({...form,seatNo:e.target.value})} placeholder="留空表示未分配" /></div>
            <div><Label>角色</Label>
              <Select value={form.role} onChange={e=>setForm({...form, role: e.target.value as any})}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </Select>
            </div>
          </div>
          {msg && <div className="text-sm p-2 bg-muted rounded">{msg}</div>}
          <Button onClick={onCreate} disabled={pending}>新增</Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-3">
        {users.map(u=> <UserRow key={u.id} u={u} />)}
      </div>
    </div>
  );
}

function UserRow({ u }: { u: any }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [seat, setSeat] = useState(u.seatNo ? String(u.seatNo) : "");
  const [name, setName] = useState(u.name);
  const [msg, setMsg] = useState<string|null>(null);

  const save = () => {
    start(async()=>{
      try {
        if (name !== u.name) await updateUserName(u.id, name);
        const s = seat ? Number(seat) : null;
        if (s !== u.seatNo) await updateUserSeat(u.id, s);
        setMsg("已儲存"); router.refresh();
      } catch(e:any){ setMsg(e.message); }
      setTimeout(()=>setMsg(null),2000);
    });
  };

  return (
    <Card>
      <CardContent className="pt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">{u.seatNo ? `${u.seatNo}號` : "未分配"} - {u.name}</span>
          <Badge variant={u.role==="ADMIN"?"default":"secondary"}>{u.role}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label className="text-xs">姓名</Label><Input value={name} onChange={e=>setName(e.target.value)} className="h-8" /></div>
          <div><Label className="text-xs">座號</Label><Input type="number" value={seat} onChange={e=>setSeat(e.target.value)} placeholder="1~34" className="h-8" /></div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" disabled={pending} onClick={save}>儲存</Button>
          <Button size="sm" variant="destructive" disabled={pending} onClick={()=> start(async()=>{ if(!confirm(`刪除 ${u.name}？`)) return; try{ await deleteUser(u.id); router.refresh(); }catch(e:any){ setMsg(e.message); } })}>刪除</Button>
        </div>
        {msg && <div className="text-xs p-1 bg-muted rounded">{msg}</div>}
      </CardContent>
    </Card>
  );
}
