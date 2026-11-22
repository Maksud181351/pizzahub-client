"use client";
import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/api";
import { Spinner } from "@/components/ui/skeleton";

/** Uploads picked files to ImgBB (through /api/upload) and reports the hosted URLs. */
export function ImageUpload({ value = [], onChange, max = 4, label = "Add image" }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);

  const pick = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, max - value.length);
    e.target.value = "";
    if (!files.length) return;
    setBusy(true);
    try {
      const urls = [];
      for (const f of files) urls.push(await uploadImage(f));
      onChange([...value, ...urls]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div key={url} className="relative size-24 overflow-hidden rounded-lg border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Upload ${i + 1}`} className="size-full object-cover" />
            <button type="button" onClick={() => onChange(value.filter((u) => u !== url))} className="absolute right-1 top-1 rounded-full bg-black/65 p-1 text-white" aria-label="Remove image">
              <X className="size-3" />
            </button>
          </div>
        ))}
        {value.length < max && (
          <button type="button" disabled={busy} onClick={() => input.current?.click()} className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-line text-xs text-muted hover:border-oven hover:text-ink disabled:opacity-60">
            {busy ? <Spinner className="py-0" /> : (<><ImagePlus className="size-5" />{label}</>)}
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple={max > 1} className="hidden" onChange={pick} />
    </div>
  );
}
