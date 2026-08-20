"use client";

import { useEffect, useState } from "react";
import FileUpload from "../_components/FileUpload";

export default function ProfilePage() {
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((data) =>
        setForm({
          ...data,
          github: data.socials?.github || "",
          linkedin: data.socials?.linkedin || "",
          whatsapp: data.socials?.whatsapp || "",
          instagram: data.socials?.instagram || "",
          youtube: data.socials?.youtube || "",
        })
      );
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      name: form.name,
      title: form.title,
      bio: form.bio,
      photoUrl: form.photoUrl || null,
      cvUrl: form.cvUrl || null,
      email: form.email,
      phone: form.phone || null,
      address: form.address || null,
      socials: {
        github: form.github || undefined,
        linkedin: form.linkedin || undefined,
        whatsapp: form.whatsapp || undefined,
        instagram: form.instagram || undefined,
        youtube: form.youtube || undefined,
      },
    };
    await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!form) return <p className="empty-state">Chargement…</p>;

  return (
    <div>
      <h1 className="admin-title">Profil</h1>
      <p className="admin-subtitle">Ces informations alimentent la page d'accueil de ton portfolio.</p>

      <form className="admin-card" onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field">
            <label>Nom</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Titre professionnel</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
        </div>

        <div className="field">
          <label>Présentation</label>
          <textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>

        <div className="field-row">
          <FileUpload
            label="Photo de profil"
            value={form.photoUrl}
            onChange={(url) => setForm({ ...form, photoUrl: url })}
            accept="image/*"
          />
          <FileUpload
            label="CV (PDF)"
            value={form.cvUrl}
            onChange={(url) => setForm({ ...form, cvUrl: url })}
            accept="application/pdf"
            isPdf
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <label>Téléphone</label>
            <input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>

        <div className="field">
          <label>Coordonnées (ville, pays…)</label>
          <input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>

        <h2 style={{ marginTop: 24 }}>Réseaux sociaux</h2>
        <div className="field-row">
          <div className="field">
            <label>GitHub</label>
            <input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/..." />
          </div>
          <div className="field">
            <label>LinkedIn</label>
            <input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>WhatsApp (numéro, ex : 2250700000000)</label>
            <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          </div>
          <div className="field">
            <label>Instagram</label>
            <input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
          </div>
        </div>
        <div className="field">
          <label>YouTube</label>
          <input value={form.youtube} onChange={(e) => setForm({ ...form, youtube: e.target.value })} />
        </div>

        <button className="btn btn-primary" type="submit">Enregistrer</button>
        {saved && <p className="success-text">Profil mis à jour.</p>}
      </form>
    </div>
  );
}
