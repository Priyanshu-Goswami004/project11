import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useProfile } from "@/hooks/useProfile";

export function JoinClassDialog() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { onJoined } = useProfile();

  async function submit() {
    setLoading(true); setError(null);
    try {
      const resp = await api.joinClass({ joinCode: code.trim().toUpperCase(), displayName: name.trim() });
      onJoined(resp);
      setOpen(false);
    } catch (e: any) {
      setError(e.message?.slice(0,200) ?? "Failed");
    } finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700">Join Class</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join your class</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="code">Class code</Label>
            <Input id="code" value={code} onChange={e=>setCode(e.target.value)} placeholder="e.g. 7GH2KQ" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Your nickname</Label>
            <Input id="name" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Simran" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button disabled={loading || code.trim().length<4 || name.trim().length<2} onClick={submit}>
            {loading?"Joining...":"Join"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
