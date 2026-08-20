"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then(setForm);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!form) return <p className="empty-state">Chargement…</p>;

  return (
    <div>
      <h1 className="admin-title">Réglages</h1>
      <p className="admin-subtitle">Uniquement ce qui existe déjà sur ton portfolio.</p>

      <form className="admin-card" onSubmit={handleSubmit}>
        <div className="field">
          <label>Titre du site (balise &lt;title&gt;)</label>
          <input value={form.siteTitle} onChange={(e) => setForm({ ...form, siteTitle: e.target.value })} />
        </div>
        <div className="field">
          <label>Description (SEO)</label>
          <textarea rows={3} value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} />
        </div>
        <div className="field">
          <label>Texte du pied de page</label>
          <input value={form.footerText} onChange={(e) => setForm({ ...form, footerText: e.target.value })} />
        </div>
        <button className="btn btn-primary" type="submit">Enregistrer</button>
        {saved && <p className="success-text">Réglages mis à jour.</p>}
      </form>
    </div>
  );
}
