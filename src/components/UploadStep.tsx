"use client";

import { useCallback, useState } from "react";
import type { VoucherRow } from "./VoucherApp";

interface Props {
  onDataLoaded: (rows: VoucherRow[], cols: string[]) => void;
}

export default function UploadStep({ onDataLoaded }: Props) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      setError("");
      setLoading(true);
      try {
        const ext = file.name.split(".").pop()?.toLowerCase();

        if (ext === "csv") {
          const Papa = (await import("papaparse")).default;
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              const rows = results.data as VoucherRow[];
              if (!rows.length) { setError("File appears to be empty."); setLoading(false); return; }
              onDataLoaded(rows, Object.keys(rows[0]));
              setLoading(false);
            },
            error: () => { setError("Could not parse CSV."); setLoading(false); },
          });
        } else if (ext === "xlsx" || ext === "xls") {
          const XLSX = await import("xlsx");
          const buffer = await file.arrayBuffer();
          const wb = XLSX.read(buffer);
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json<VoucherRow>(ws, { defval: "" });
          if (!rows.length) { setError("Spreadsheet appears to be empty."); setLoading(false); return; }
          onDataLoaded(rows, Object.keys(rows[0]));
          setLoading(false);
        } else {
          setError("Please upload a .csv or .xlsx file.");
          setLoading(false);
        }
      } catch {
        setError("Failed to read file. Please try again.");
        setLoading(false);
      }
    },
    [onDataLoaded]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="font-display text-4xl font-bold mb-3" style={{ color: "var(--ink)" }}>
          Upload Your Data
        </h2>
        <p style={{ color: "#666" }}>
          Drop a CSV or Excel file containing your voucher data — one row per voucher.
        </p>
      </div>

      {/* Drop zone */}
      <label
        className={`upload-zone rounded-xl p-12 flex flex-col items-center cursor-pointer block ${dragging ? "drag-over" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
        />
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} />
            <span style={{ color: "var(--gold)" }}>Reading file…</span>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 mb-4 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.1)" }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--gold)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--ink)" }}>
              Drag & drop your file here
            </p>
            <p className="text-xs" style={{ color: "#999" }}>or click to browse</p>
            <div className="mt-4 flex gap-2">
              {["CSV", "XLSX", "XLS"].map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(201,168,76,0.15)", color: "var(--gold)" }}>
                  {t}
                </span>
              ))}
            </div>
          </>
        )}
      </label>

      {error && (
        <p className="mt-3 text-sm text-center" style={{ color: "var(--rose)" }}>{error}</p>
      )}

      {/* Sample format hint */}
      <div className="mt-8 rounded-lg p-4" style={{ background: "rgba(201,168,76,0.06)", border: "1px solid var(--border)" }}>
        <p className="text-xs font-medium mb-2" style={{ color: "var(--gold)" }}>EXPECTED FORMAT</p>
        <div className="overflow-x-auto">
          <table className="text-xs w-full">
            <thead>
              <tr style={{ color: "#888" }}>
                {["Name", "Code", "Value", "Expiry"].map((h) => (
                  <th key={h} className="text-left pr-4 pb-1 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody style={{ color: "var(--ink)" }}>
              <tr>
                <td className="pr-4">Jane Smith</td>
                <td className="pr-4">SAVE20</td>
                <td className="pr-4">£20 Off</td>
                <td>31 Dec 2025</td>
              </tr>
              <tr style={{ color: "#aaa" }}>
                <td className="pr-4">John Doe</td>
                <td className="pr-4">VIP50</td>
                <td className="pr-4">50% Off</td>
                <td>30 Jun 2025</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs mt-2" style={{ color: "#aaa" }}>Column names can be anything — you'll map them in the next step.</p>
      </div>
    </div>
  );
}
