"use client";
import { useEffect, useState } from "react";

type Img = { id: string; label: string; url: string };

export function ImagePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [images, setImages] = useState<Img[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    fetch("/api/images").then(r=>r.json()).then(d=>setImages(d.images || [])).catch(()=>{});
  }, []);

  const addImage = async () => {
    if (!newLabel || !newUrl) return;
    const res = await fetch("/api/images", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ label: newLabel, url: newUrl }) });
    if (res.ok) {
      const j = await res.json();
      setImages(prev=>[...prev, j.image]);
      onChange(j.image.url);
      setNewLabel(""); setNewUrl("");
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-auto p-1 border rounded">
        {images.map(im => (
          <button key={im.id} type="button" onClick={()=>onChange(im.url)} className={`border rounded overflow-hidden p-1 ${value===im.url ? "ring-2 ring-primary border-primary" : ""}`}>
            <img src={im.url} alt={im.label} className="w-full h-16 object-cover rounded" />
            <div className="text-xs mt-1 truncate">{im.label}</div>
          </button>
        ))}
        {images.length===0 && <div className="text-xs text-muted-foreground col-span-4 p-2">尚無圖片，請新增</div>}
      </div>
      <div className="flex gap-2">
        <input placeholder="名稱" value={newLabel} onChange={e=>setNewLabel(e.target.value)} className="flex-1 border rounded px-2 py-1 text-sm" />
        <input placeholder="https://..." value={newUrl} onChange={e=>setNewUrl(e.target.value)} className="flex-[2] border rounded px-2 py-1 text-sm" />
        <button type="button" onClick={addImage} className="px-3 py-1 text-sm bg-primary text-white rounded">新增到圖庫</button>
      </div>
      {value && <div className="text-xs text-muted-foreground">已選：<span className="break-all">{value}</span></div>}
    </div>
  );
}
