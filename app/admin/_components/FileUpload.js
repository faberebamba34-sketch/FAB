"use client";

import { useState } from "react";

export default function FileUpload({ label, value, onChange, accept = "image/*", isPdf = false }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de l'envoi.");
      onChange(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="field">
      <label>{label}</label>

      {value && !isPdf && (
        <img src={value} alt="" className="upload-preview" />
      )}
      {value && isPdf && (
        <a href={value} target="_blank" rel="noopener" className="upload-file-link">
          📄 Fichier actuel — ouvrir
        </a>
      )}

      <div className="upload-row">
        <label className="btn btn-sm upload-btn">
          {uploading ? "Envoi…" : value ? "Remplacer" : "Choisir un fichier"}
          <input type="file" accept={accept} onChange={handleFile} disabled={uploading} hidden />
        </label>
        {value && (
          <button type="button" className="btn btn-sm btn-danger" onClick={() => onChange("")}>
            Retirer
          </button>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
