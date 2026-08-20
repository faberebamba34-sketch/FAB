"use client";

import { useEffect, useState } from "react";

const EMPTY_FORM = { id: null, name: "", level: 50, icon: "", order: 0 };

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/skills");
    setSkills(await res.json());
  }
  useEffect(() => { load(); }, []);

  function startEdit(skill) {
    setForm(skill);
    setShowForm(true);
  }
  function startNew() {
    setForm({ ...EMPTY_FORM, order: skills.length });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { name: form.name, level: Number(form.level), icon: form.icon || null, order: Number(form.order) };
    const url = form.id ? `/api/admin/skills/${form.id}` : "/api/admin/skills";
    const method = form.id ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setShowForm(false);
    setForm(EMPTY_FORM);
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer cette compétence ?")) return;
    await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="admin-title">Compétences</h1>
      <p className="admin-subtitle">Gère les compétences affichées sur ton portfolio.</p>

      <button className="btn btn-primary" onClick={showForm ? () => setShowForm(false) : startNew} style={{ marginBottom: 20 }}>
        {showForm ? "Fermer" : "+ Ajouter une compétence"}
      </button>

      {showForm && (
        <form className="admin-card" onSubmit={handleSubmit}>
          <h2>{form.id ? "Modifier" : "Nouvelle compétence"}</h2>
          <div className="field-row">
            <div className="field">
              <label>Nom</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="field">
              <label>Icône (nom ou URL)</label>
              <input value={form.icon || ""} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Niveau (0–100)</label>
              <input type="number" min="0" max="100" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
            </div>
            <div className="field">
              <label>Ordre d'affichage</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary" type="submit">{form.id ? "Enregistrer" : "Créer"}</button>
        </form>
      )}

      <div className="admin-card">
        {skills.length === 0 ? (
          <p className="empty-state">Aucune compétence pour l'instant.</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Nom</th><th>Niveau</th><th>Ordre</th><th></th></tr></thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.level}%</td>
                  <td>{s.order}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-sm" onClick={() => startEdit(s)}>Modifier</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
