"use client";

import type { VoucherConfig, VoucherRow } from "./VoucherApp";

interface Props {
  row: VoucherRow;
  config: VoucherConfig;
  forExport?: boolean;
}

export default function VoucherCard({ row, config, forExport = false }: Props) {
  const get = (field: string) => (field ? row[field] ?? "" : "");
  const name = get(config.nameField);
  const code = get(config.codeField);
  const value = get(config.valueField);
  const title = get(config.titleField) || "Gift Voucher";
  const expiry = get(config.expiryField);
  const accent = config.accentColor || "#c9a84c";

  return (
    <div
      style={{
        width: forExport ? "680px" : "100%",
        background: "#fff",
        borderRadius: forExport ? "0" : "12px",
        border: `1px solid ${accent}33`,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        boxShadow: forExport ? "none" : "0 4px 24px rgba(0,0,0,0.07)",
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: "5px", background: `linear-gradient(90deg, ${accent}, ${accent}88, ${accent})` }} />

      {/* Corner ornaments */}
      {["tl","tr","bl","br"].map((pos) => (
        <div
          key={pos}
          style={{
            position: "absolute",
            width: 36, height: 36,
            top: pos.startsWith("t") ? 14 : undefined,
            bottom: pos.startsWith("b") ? 14 : undefined,
            left: pos.endsWith("l") ? 14 : undefined,
            right: pos.endsWith("r") ? 14 : undefined,
            borderColor: accent,
            borderStyle: "solid",
            opacity: 0.4,
            borderWidth: pos === "tl" ? "2px 0 0 2px" : pos === "tr" ? "2px 2px 0 0" : pos === "bl" ? "0 0 2px 2px" : "0 2px 2px 0",
          }}
        />
      ))}

      <div style={{ padding: "28px 32px 24px" }}>
        {/* Brand + title row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", marginBottom: 2 }}>
              {config.brandName}
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 26, fontWeight: 700,
              color: "#1a1a2e", margin: 0, lineHeight: 1.2,
            }}>
              {title}
            </h2>
          </div>
          {value && (
            <div style={{
              background: accent,
              color: "#fff",
              padding: "6px 14px",
              borderRadius: 6,
              textAlign: "center",
              minWidth: 70,
            }}>
              <p style={{ fontSize: 10, opacity: 0.85, margin: "0 0 1px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Worth</p>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, margin: 0 }}>{value}</p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `${accent}22`, margin: "0 0 18px" }} />

        {/* Recipient */}
        {name && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa", marginBottom: 2 }}>Issued To</p>
            <p style={{ fontSize: 15, fontWeight: 500, color: "#1a1a2e", margin: 0 }}>{name}</p>
          </div>
        )}

        {/* Message */}
        {config.customMessage && (
          <p style={{ fontSize: 12, color: "#888", fontStyle: "italic", margin: "0 0 18px", lineHeight: 1.5 }}>
            "{config.customMessage}"
          </p>
        )}

        {/* Code + expiry row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          {code && (
            <div style={{
              background: "#f5f0e8",
              border: `1.5px dashed ${accent}66`,
              borderRadius: 6,
              padding: "8px 16px",
              flex: 1, minWidth: 120,
            }}>
              <p style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#aaa", margin: "0 0 2px" }}>Voucher Code</p>
              <p style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, letterSpacing: "0.12em", color: "#1a1a2e", margin: 0 }}>
                {code}
              </p>
            </div>
          )}
          {expiry && (
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#aaa", margin: "0 0 2px" }}>Valid Until</p>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#1a1a2e", margin: 0 }}>{expiry}</p>
            </div>
          )}
        </div>

        {/* Bottom accent line */}
        <div style={{ height: 1, background: `${accent}22`, margin: "20px 0 0" }} />
        <p style={{ fontSize: 9, color: "#ccc", marginTop: 8, letterSpacing: "0.06em", textAlign: "center" }}>
          {config.brandName} · Voucher
        </p>
      </div>
    </div>
  );
}
