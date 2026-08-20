"use client";

import { useEffect, useState } from "react";
import FileUpload from "../_components/FileUpload";

const STATUSES = ["DRAFT", "IN_PROGRESS", "PUBLISHED", "ARCHIVED"];
const EMPTY_FORM = {
  id: null,
  title: "",
  description: "",
  technologies: "",
  githubUrl: "",
  demoUrl: "",
  category: "",
  mainImageUrl: "",
  images: [],
  status: "DRAFT",
  featured: false,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/projects");
    setProjects(await res.json());
  }

  useEffect(() => { load(); }, []);

  function startEdit(project) {
    setForm({
      id: project.id,
      title: project.title,
      description: project.description,
      technologies: (project.technologies || []).join(", "),
      githubUrl: project.githubUrl || "",
      demoUrl: project.demoUrl || "",
      category: project.category || "",
      mainImageUrl: project.mainImageUrl || "",
      images: (project.images || []).map((i) => i.url),
      status: project.status,
      featured: project.featured,
    });
    setShowForm(true);
  }

  function startNew() {
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const payload = {
      title: form.title,
      description: form.description,
      technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
      githubUrl: form.githubUrl || null,
      demoUrl: form.demoUrl || null,
      category: form.category || null,
      mainImageUrl: form.mainImageUrl || null,
      images: form.images,
      status: form.status,
      featured: form.featured,
    };

    const url = form.id ? `/api/admin/projects/${form.id}` : "/api/admin/projects";
    const method = form.id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur.");
      return;
    }
    setShowForm(false);
    setForm(EMPTY_FORM);
    load();
  }

  async function quickUpdate(id, patch) {
    await fetch(`/api/admin/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer ce projet définitivement ?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="admin-title">Projets</h1>
      <p className="admin-subtitle">Ajoute, modifie ou change le statut de tes projets.</p>

      <button className="btn btn-primary" onClick={showForm ? () => setShowForm(false) : startNew} style={{ marginBottom: 20 }}>
        {showForm ? "Fermer" : "+ Ajouter un projet"}
      </button>

      {showForm && (
        <form className="admin-card" onSubmit={handleSubmit}>
          <h2>{form.id ? "Modifier le projet" : "Nouveau projet"}</h2>

          <div className="field">
            <label>Titre</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div className="field">
            <label>Description</label>
            <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="field">
            <label>Technologies (séparées par des virgules)</label>
            <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="PHP, MySQL, Bootstrap 5" />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Lien GitHub</label>
              <input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
            </div>
            <div className="field">
              <label>Lien de démonstration</label>
              <input value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Catégorie</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Web, Mobile…" />
            </div>
            <FileUpload
              label="Image principale"
              value={form.mainImageUrl}
              onChange={(url) => setForm({ ...form, mainImageUrl: url })}
              accept="image/*"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Statut</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <label>&nbsp;</label>
              <div className="checkbox-row">
                <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                <label htmlFor="featured">Projet à la une</label>
              </div>
            </div>
          </div>

          <div className="field">
            <label>Galerie (plusieurs images)</label>
            {form.images.length > 0 && (
              <div className="gallery-preview">
                {form.images.map((url, i) => (
                  <div className="gallery-thumb" key={url + i}>
                    <img src={url} alt="" />
                    <button
                      type="button"
                      className="gallery-remove"
                      onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="btn btn-sm upload-btn" style={{ width: "fit-content" }}>
              + Ajouter des images
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  for (const file of files) {
                    const fd = new FormData();
                    fd.append("file", file);
                    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                    const data = await res.json();
                    if (res.ok) setForm((f) => ({ ...f, images: [...f.images, data.url] }));
                  }
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary" type="submit">{form.id ? "Enregistrer" : "Créer"}</button>
        </form>
      )}

      <div className="admin-card">
        {projects.length === 0 ? (
          <p className="empty-state">Aucun projet. Ajoute ton premier projet ci-dessus.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Statut</th>
                <th>À la une</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>
                    <select
                      value={p.status}
                      onChange={(e) => quickUpdate(p.id, { status: e.target.value })}
                      style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 8px", fontSize: 12 }}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <input type="checkbox" checked={p.featured} onChange={(e) => quickUpdate(p.id, { featured: e.target.checked })} />
                  </td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-sm" onClick={() => startEdit(p)}>Modifier</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Supprimer</button>
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
