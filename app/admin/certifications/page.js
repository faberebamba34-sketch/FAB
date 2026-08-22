"use client";

import { useEffect, useState } from "react";
import FileUpload from "../_components/FileUpload";

const EMPTY_FORM = {
  id: null,
  title: "",
  organization: "",
  description: "",
  date: "",
  imageUrl: "",
  certificateUrl: "",
  order: 0,
};

export default function CertificationsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/certifications");
    setItems(await res.json());
  }
  useEffect(() => { load(); }, []);

  function startEdit(item) {
    setForm({
      ...item,
      date: item.date ? item.date.slice(0, 10) : "",
    });
    setShowForm(true);
  }
  function startNew() {
    setForm({ ...EMPTY_FORM, order: items.length });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      title: form.title,
      organization: form.organization,
      description: form.description || null,
      date: form.date || null,
      imageUrl: form.imageUrl || null,
      certificateUrl: form.certificateUrl || null,
      order: Number(form.order),
    };
    const url = form.id ? `/api/admin/certifications/${form.id}` : "/api/admin/certifications";
    const method = form.id ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setShowForm(false);
    setForm(EMPTY_FORM);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer cette formation/certification ?")) return;
    await fetch(`/api/admin/certifications/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="admin-title">Formations &amp; Certifications</h1>
      <p className="admin-subtitle">Gère ton parcours académique et tes certificats.</p>

      <button className="btn btn-primary" onClick={showForm ? () => setShowForm(false) : startNew} style={{ marginBottom: 20 }}>
        {showForm ? "Fermer" : "+ Ajouter"}
      </button>

      {showForm && (
        <form className="admin-card" onSubmit={handleSubmit}>
          <h2>{form.id ? "Modifier" : "Nouvelle formation / certification"}</h2>
          <div className="field-row">
            <div className="field">
              <label>Titre</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="field">
              <label>Organisme</label>
              <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} required />
            </div>
          </div>
          <div className="field">
            <label>Description</label>
            <textarea rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="field">
              <label>Ordre d'affichage</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            </div>
          </div>
          <div className="field-row">
            <FileUpload
              label="Image du certificat"
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
              accept="image/*"
            />
            <FileUpload
              label="Fichier du certificat (PDF)"
              value={form.certificateUrl}
              onChange={(url) => setForm({ ...form, certificateUrl: url })}
              accept="application/pdf"
              isPdf
            />
          </div>
          <button className="btn btn-primary" type="submit">{form.id ? "Enregistrer" : "Créer"}</button>
        </form>
      )}

      <div className="admin-card">
        {items.length === 0 ? (
          <p className="empty-state">Aucune formation enregistrée pour l'instant.</p>
        ) : (
          <div className="table-scroll">
            <table className="admin-table">
            <thead><tr><th>Titre</th><th>Organisme</th><th>Date</th><th></th></tr></thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>{c.organization}</td>
                  <td>{c.date ? new Date(c.date).toLocaleDateString("fr-FR") : "—"}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-sm" onClick={() => startEdit(c)}>Modifier</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
