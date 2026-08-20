"use client";

import { useEffect, useState } from "react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(null);

  async function load() {
    const url = filter ? `/api/admin/messages?status=${filter}` : "/api/admin/messages";
    const res = await fetch(url);
    setMessages(await res.json());
  }
  useEffect(() => { load(); }, [filter]);

  async function setStatus(id, status) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer ce message ?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    setOpen(null);
    load();
  }

  function openMessage(m) {
    setOpen(m);
    if (m.status === "UNREAD") setStatus(m.id, "READ");
  }

  return (
    <div>
      <h1 className="admin-title">Messages</h1>
      <p className="admin-subtitle">Les messages reçus via le formulaire de contact de ton site.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["", "UNREAD", "READ", "ARCHIVED"].map((s) => (
          <button key={s} className="btn btn-sm" onClick={() => setFilter(s)} style={{ borderColor: filter === s ? "var(--accent)" : "var(--border)" }}>
            {s === "" ? "Tous" : s}
          </button>
        ))}
      </div>

      <div className="admin-card">
        {messages.length === 0 ? (
          <p className="empty-state">Aucun message.</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Nom</th><th>Email</th><th>Sujet</th><th>Date</th><th>Statut</th><th></th></tr></thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id} style={{ cursor: "pointer" }} onClick={() => openMessage(m)}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.subject || "—"}</td>
                  <td>{new Date(m.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td><span className={`badge badge-${m.status}`}>{m.status}</span></td>
                  <td onClick={(e) => e.stopPropagation()} style={{ display: "flex", gap: 6 }}>
                    {m.status !== "UNREAD" && <button className="btn btn-sm" onClick={() => setStatus(m.id, "UNREAD")}>Non lu</button>}
                    {m.status !== "ARCHIVED" && <button className="btn btn-sm" onClick={() => setStatus(m.id, "ARCHIVED")}>Archiver</button>}
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(m.id)}>Suppr.</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open && (
        <div className="admin-card">
          <h2>Message de {open.name}</h2>
          <p className="admin-subtitle">{open.email} — {new Date(open.createdAt).toLocaleString("fr-FR")}</p>
          {open.subject && <p><strong>Sujet :</strong> {open.subject}</p>}
          <p style={{ whiteSpace: "pre-wrap" }}>{open.message}</p>
          <button className="btn" onClick={() => setOpen(null)}>Fermer</button>
        </div>
      )}
    </div>
  );
}
