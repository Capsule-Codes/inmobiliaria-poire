"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";

type FileDropzoneProps = {
  onFilesSelected: (files: File[]) => void;
  accept?: string[];
  maxFiles?: number;
  multiple?: boolean;
  className?: string;
};

export function FileDropzone({
  onFilesSelected,
  accept,
  maxFiles = 5,
  multiple = true,
  className,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleOpen = () => {
    inputRef.current?.click();
  };

  const isAccepted = (file: File) => {
    if (!accept || accept.length === 0) return true;
    return accept.includes(file.type);
  };

  const collectFiles = (list: FileList | null) => {
    if (!list) return [] as File[];
    const files = Array.from(list).filter((f) => isAccepted(f));
    return files.slice(0, maxFiles);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = collectFiles(e.target.files);
    if (files.length) onFilesSelected(files);
    // reset input to allow re-selecting the same file
    e.currentTarget.value = "";
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = collectFiles(e.dataTransfer?.files ?? null);
    if (files.length) onFilesSelected(files);
  };

  return (
    <div className={className}>
      <div
        role="button"
        aria-label="Sube o arrastra aqui las imagenes"
        onClick={handleOpen}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center w-full h-40 rounded-md border-2 border-dashed transition-colors cursor-pointer ${
          dragActive ? "border-secondary bg-secondary/10" : "border-muted-foreground/30 hover:border-secondary"
        }`}
      >
        <Plus className="h-6 w-6 text-muted-foreground mb-2" />
        <span className="text-sm text-muted-foreground">Sube o arrastra aqui las imagenes</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={onInputChange}
        multiple={multiple}
        accept={(accept ?? []).join(",")}
      />
    </div>
  );
}

