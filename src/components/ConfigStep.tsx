"use client";

import type { VoucherConfig, VoucherRow } from "./VoucherApp";
import VoucherCard from "./VoucherCard";

interface Props {
  headers: string[];
  config: VoucherConfig;
  setConfig: React.Dispatch<React.SetStateAction<VoucherConfig>>;
  onBack: () => void;
  onNext: () => void;
  sampleRow?: VoucherRow;
}

const ACCENT_PRESETS = ["#c9a84c", "#c0392b", "#2980b9", "#27ae60", "#8e44ad", "#1a1a2e"];

export default function ConfigStep({ headers, config, setConfig, onBack, onNext, sampleRow }: Props) {
  const set = (key: keyof VoucherConfig) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) =>
    setConfig((p) => ({ ...p, [key]: e.target.value }));

  const fieldMap: { key: keyof VoucherConfig; label: string; hint: string }[] = [
    { key: "nameField", label: "Recipient Name", hint: "Who the voucher is for" },
    { key: "codeField", label: "Voucher Code", hint: "The unique code" },
    { key: "valueField", label: "Value / Discount", hint: "e.g. £20 Off, 30%" },
    { key: "titleField", label: "Voucher Title (optional)", hint: "e.g. Gift Card, Promo" },
    { key: "expiryField", label: "Expiry Date (optional)", hint: "Valid until…" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Left: form */}
      <div>
        <h2 className="font-display text-3xl font-bold mb-1" style={{ color: "var(--ink)" }}>Configure</h2>
        <p className="text-sm mb-8" style={{ color: "#888" }}>Map your columns and set the brand details.</p>

        {/* Column mapping */}
        <div className="mb-6">
          <p className="text-xs font-medium mb-3 uppercase tracking-widest" style={{ color: "var(--gold)" }}>Column Mapping</p>
          <div className="space-y-3">
            {fieldMap.map(({ key, label, hint }) => (
              <div key={key} className="flex items-center gap-3">
                <label className="w-40 text-sm shrink-0" style={{ color: "var(--ink)" }}>
                  {label}
                </label>
                <select
                  value={config[key]}
                  onChange={set(key)}
                  className="flex-1 text-sm rounded-lg px-3 py-2 outline-none"
                  style={{ border: "1.5px solid var(--border)", background: "#fff", color: "var(--ink)" }}
                >
                  <option value="">— not used —</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Brand */}
        <div className="mb-6">
          <p className="text-xs font-medium mb-3 uppercase tracking-widest" style={{ color: "var(--gold)" }}>Brand</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="w-40 text-sm shrink-0" style={{ color: "var(--ink)" }}>Brand Name</label>
              <input
                type="text"
                value={config.brandName}
                onChange={set("brandName")}
                className="flex-1 text-sm rounded-lg px-3 py-2 outline-none"
                style={{ border: "1.5px solid var(--border)", background: "#fff", color: "var(--ink)" }}
                placeholder="My Brand"
              />
            </div>
            <div className="flex items-start gap-3">
              <label className="w-40 text-sm shrink-0 pt-2" style={{ color: "var(--ink)" }}>Message</label>
              <textarea
                value={config.customMessage}
                onChange={set("customMessage")}
                rows={2}
                className="flex-1 text-sm rounded-lg px-3 py-2 outline-none resize-none"
                style={{ border: "1.5px solid var(--border)", background: "#fff", color: "var(--ink)" }}
                placeholder="Thank you for choosing us."
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="w-40 text-sm shrink-0" style={{ color: "var(--ink)" }}>Accent Colour</label>
              <div className="flex items-center gap-2">
                {ACCENT_PRESETS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setConfig((p) => ({ ...p, accentColor: c }))}
                    className="w-6 h-6 rounded-full transition-transform"
                    style={{
                      background: c,
                      transform: config.accentColor === c ? "scale(1.25)" : "scale(1)",
                      outline: config.accentColor === c ? `2px solid ${c}` : "none",
                      outlineOffset: "2px",
                    }}
                  />
                ))}
                <input
                  type="color"
                  value={config.accentColor}
                  onChange={set("accentColor")}
                  className="w-6 h-6 rounded cursor-pointer border-0"
                  title="Custom colour"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onBack} className="btn-outline px-5 py-2 rounded-lg text-sm">← Back</button>
          <button onClick={onNext} className="btn-gold px-6 py-2 rounded-lg text-sm">
            Preview Vouchers →
          </button>
        </div>
      </div>

      {/* Right: live preview */}
      <div>
        <p className="text-xs font-medium mb-3 uppercase tracking-widest" style={{ color: "var(--gold)" }}>Live Preview</p>
        {sampleRow ? (
          <VoucherCard row={sampleRow} config={config} />
        ) : (
          <div className="rounded-xl p-8 text-center text-sm" style={{ color: "#aaa", border: "1px dashed var(--border)" }}>
            No data to preview
          </div>
        )}
      </div>
    </div>
  );
}
