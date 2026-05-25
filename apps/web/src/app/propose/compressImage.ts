// Browser-side image compression for proposal uploads. Phones routinely
// produce 8-15 MB photos, which blow past Vercel's ~4.5 MB request body
// limit and our 5 MB per-file cap. Re-encoding to JPEG at a sane max
// dimension brings a typical phone shot to ~300-500 KB.

export type CompressOptions = {
  maxDimension: number;
  quality: number;
};

const DEFAULTS: CompressOptions = {
  maxDimension: 2000,
  quality: 0.82,
};

export async function compressImage(
  file: File,
  opts: Partial<CompressOptions> = {},
): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  const { maxDimension, quality } = { ...DEFAULTS, ...opts };

  let bitmap: ImageBitmap;
  try {
    // imageOrientation: "from-image" applies EXIF rotation so iPhone
    // portraits don't end up sideways after re-encode.
    bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
  } catch {
    return file;
  }

  try {
    const { width: srcW, height: srcH } = bitmap;
    const scale = Math.min(1, maxDimension / Math.max(srcW, srcH));
    const destW = Math.max(1, Math.round(srcW * scale));
    const destH = Math.max(1, Math.round(srcH * scale));

    const canvas = document.createElement("canvas");
    canvas.width = destW;
    canvas.height = destH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    // Flatten alpha onto white — we re-encode to JPEG which has no alpha.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, destW, destH);
    ctx.drawImage(bitmap, 0, 0, destW, destH);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
    if (!blob) return file;

    // If re-encoding somehow made the file larger (already-tiny JPEGs
    // can do this), keep the original.
    if (blob.size >= file.size) return file;

    return new File([blob], replaceExtension(file.name, "jpg"), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } finally {
    bitmap.close();
  }
}

function replaceExtension(name: string, ext: string): string {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  return `${base}.${ext}`;
}
