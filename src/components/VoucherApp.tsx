"use client";

import { useState, useRef, useCallback } from "react";
import UploadStep from "./UploadStep";
import ConfigStep from "./ConfigStep";
import PreviewStep from "./PreviewStep";

export type VoucherRow = Record<string, string>;

export type VoucherConfig = {
  titleField: string;
  codeField: string;
  valueField: string;
  nameField: string;
  expiryField: string;
  customMessage: string;
  brandName: string;
  accentColor: string;
};

type Step = "upload" | "config" | "preview";

export default function VoucherApp() {
  const [step, setStep] = useState<Step>("upload");
  const [data, setData] = useState<VoucherRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [config, setConfig] = useState<VoucherConfig>({
    titleField: "",
    codeField: "",
    valueField: "",
    nameField: "",
    expiryField: "",
    customMessage: "Thank you for choosing us.",
    brandName: "My Brand",
    accentColor: "#c9a84c",
  });

  const handleDataLoaded = (rows: VoucherRow[], cols: string[]) => {
    setData(rows);
    setHeaders(cols);
    // Auto-detect common field names
    const find = (terms: string[]) =>
      cols.find((c) => terms.some((t) => c.toLowerCase().includes(t))) ?? "";
    setConfig((prev) => ({
      ...prev,
      codeField: find(["code", "voucher", "coupon", "id"]),
      valueField: find(["value", "amount", "discount", "off", "price"]),
      nameField: find(["name", "recipient", "customer", "to"]),
      expiryField: find(["expir", "valid", "date", "until", "end"]),
      titleField: find(["title", "type", "category", "description"]),
    }));
    setStep("config");
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold" style={{ color: "var(--ink)" }}>
              Voucher<span style={{ color: "var(--gold)" }}>Forge</span>
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#888" }}>
              Upload · Configure · Export
            </p>
          </div>
          {/* Step indicators */}
          <div className="flex items-center gap-2 text-sm">
            {(["upload", "config", "preview"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                  style={{
                    background: step === s ? "var(--gold)" : step === "preview" && s !== "preview" ? "var(--ink)" : "transparent",
                    border: `1.5px solid ${step === s || (step === "preview" && s !== "preview") ? "transparent" : "var(--gold-light)"}`,
                    color: step === s ? "var(--ink)" : step === "preview" && s !== "preview" ? "var(--cream)" : "#aaa",
                  }}
                >
                  {i + 1}
                </div>
                <span style={{ color: step === s ? "var(--ink)" : "#aaa" }} className="hidden sm:inline capitalize">
                  {s}
                </span>
                {i < 2 && <span style={{ color: "#ccc" }}>›</span>}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {step === "upload" && <UploadStep onDataLoaded={handleDataLoaded} />}
        {step === "config" && (
          <ConfigStep
            headers={headers}
            config={config}
            setConfig={setConfig}
            onBack={() => setStep("upload")}
            onNext={() => setStep("preview")}
            sampleRow={data[0]}
          />
        )}
        {step === "preview" && (
          <PreviewStep
            data={data}
            config={config}
            onBack={() => setStep("config")}
          />
        )}
      </main>
    </div>
  );
}
