"use client";

import { useRef, useState } from "react";
import type { VoucherConfig, VoucherRow } from "./VoucherApp";
import VoucherCard from "./VoucherCard";

interface Props {
  data: VoucherRow[];
  config: VoucherConfig;
  onBack: () => void;
}

export default function PreviewStep({ data, config, onBack }: Props) {
  const [exporting, setExporting] = useState(false);
  const [exportingIndex, setExportingIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = data.filter((row) => {
    if (!search) return true;
    return Object.values(row).some((v) => String(v).toLowerCase().includes(search.toLowerCase()));
  });

  const exportSingle = async (row: VoucherRow, index: number) => {
    setExportingIndex(index);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");

      // Render a hidden offscreen card
      const container = document.createElement("div");
      container.style.cssText = "position:fixed;top:-9999px;left:-9999px;";
      document.body.appendChild(container);

      const { createRoot } = await import("react-dom/client");
      const React = (await import("react")).default;
      const root = createRoot(container);

      await new Promise<void>((resolve) => {
        root.render(
          React.createElement(VoucherCard, { row, config, forExport: true })
        );
        setTimeout(resolve, 300);
      });

      const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width / 3, canvas.height / 3] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 3, canvas.height / 3);

      const codePart = config.codeField ? row[config.codeField] || `voucher-${index + 1}` : `voucher-${index + 1}`;
      pdf.save(`${codePart}.pdf`);

      root.unmount();
      document.body.removeChild(container);
    } catch (err) {
      console.error(err);
      alert("Export failed. Please try again.");
    }
    setExportingIndex(null);
  };

  const exportAllPDF = async () => {
    setExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");
      const React = (await import("react")).default;
      const { createRoot } = await import("react-dom/client");

      const pdf = new jsPDF({ orientation: "landscape", unit: "px" });
      let first = true;

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const container = document.createElement("div");
        container.style.cssText = "position:fixed;top:-9999px;left:-9999px;";
        document.body.appendChild(container);
        const root = createRoot(container);

        await new Promise<void>((resolve) => {
          root.render(React.createElement(VoucherCard, { row, config, forExport: true }));
          setTimeout(resolve, 300);
        });

        const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
          scale: 2, backgroundColor: "#ffffff", useCORS: true,
        });
        const imgData = canvas.toDataURL("image/png");
        const w = canvas.width / 2;
        const h = canvas.height / 2;

        if (!first) pdf.addPage([w, h], "landscape");
        else {
          // resize first page
          (pdf as any).internal.pageSize.width = w;
          (pdf as any).internal.pageSize.height = h;
        }
        pdf.addImage(imgData, "PNG", 0, 0, w, h);
        first = false;

        root.unmount();
        document.body.removeChild(container);
      }

      pdf.save(`vouchers-${Date.now()}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Bulk export failed. Please try again.");
    }
    setExporting(false);
  };

  const exportAllImages = async () => {
    setExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const React = (await import("react")).default;
      const { createRoot } = await import("react-dom/client");

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const container = document.createElement("div");
        container.style.cssText = "position:fixed;top:-9999px;left:-9999px;";
        document.body.appendChild(container);
        const root = createRoot(container);

        await new Promise<void>((resolve) => {
          root.render(React.createElement(VoucherCard, { row, config, forExport: true }));
          setTimeout(resolve, 300);
        });

        const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
          scale: 3, backgroundColor: "#ffffff", useCORS: true,
        });

        const link = document.createElement("a");
        const codePart = config.codeField ? row[config.codeField] || `voucher-${i + 1}` : `voucher-${i + 1}`;
        link.download = `${codePart}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        await new Promise((r) => setTimeout(r, 200));

        root.unmount();
        document.body.removeChild(container);
      }
    } catch (err) {
      console.error(err);
      alert("Image export failed.");
    }
    setExporting(false);
  };

  return (
    <div>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-3xl font-bold" style={{ color: "var(--ink)" }}>
            {data.length} Voucher{data.length !== 1 ? "s" : ""}
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "#888" }}>Review and export below.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={onBack} className="btn-outline px-4 py-2 rounded-lg text-sm">← Back</button>
          <button
            onClick={exportAllImages}
            disabled={exporting}
            className="btn-outline px-4 py-2 rounded-lg text-sm"
          >
            {exporting ? "Exporting…" : "↓ All as PNG"}
          </button>
          <button
            onClick={exportAllPDF}
            disabled={exporting}
            className="btn-gold px-5 py-2 rounded-lg text-sm"
          >
            {exporting ? "Generating PDF…" : "↓ All as PDF"}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search vouchers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 text-sm rounded-lg px-4 py-2 outline-none"
          style={{ border: "1.5px solid var(--border)", background: "#fff", color: "var(--ink)" }}
        />
        {search && (
          <span className="ml-3 text-sm" style={{ color: "#aaa" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((row, i) => (
          <div key={i} className="group relative">
            <VoucherCard row={row} config={config} />
            <div className="mt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => exportSingle(row, i)}
                disabled={exportingIndex === i}
                className="text-xs px-3 py-1.5 rounded-lg btn-gold"
              >
                {exportingIndex === i ? "Exporting…" : "↓ Export PDF"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: "#aaa" }}>
          No vouchers match your search.
        </div>
      )}
    </div>
  );
}
