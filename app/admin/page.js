"use client";

import { useEffect, useState } from "react";
import { IconFolder, IconStar, IconRocket, IconPencil, IconTrash, IconCap, IconMail } from "./_components/Icons";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/admin/dashboard/stats").then((r) => r.json()).then(setStats);
  }, []);

  if (!stats) return <p className="empty-state">Chargement…</p>;

  const cards = [
    { label: "Projets (total)", value: stats.projects.total, icon: IconFolder, color: "c-green" },
    { label: "Publiés", value: stats.projects.published, icon: IconStar, color: "c-gold" },
    { label: "En cours", value: stats.projects.inProgress, icon: IconRocket, color: "c-orange" },
    { label: "Brouillons", value: stats.projects.draft, icon: IconPencil, color: "c-green" },
    { label: "Archivés", value: stats.projects.archived, icon: IconTrash, color: "c-danger" },
    { label: "Compétences", value: stats.skillsCount, icon: IconCap, color: "c-green" },
    { label: "Certifications", value: stats.certificationsCount, icon: IconCap, color: "c-green" },
    { label: "Messages", value: stats.messages.total, icon: IconMail, color: "c-green" },
    { label: "Messages non lus", value: stats.messages.unread, icon: IconMail, color: "c-gold" },
  ];

  return (
    <div>
      <h1 className="admin-title">Dashboard</h1>
      <p className="admin-subtitle">Vue d'ensemble de ton portfolio.</p>

      <div className="admin-stats-grid">
        {cards.map((c) => (
          <div className="admin-stat-card" key={c.label}>
            <div className={`stat-icon ${c.color}`}><c.icon /></div>
            <div>
              <div className="admin-stat-num">{c.value}</div>
              <div className="admin-stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h2>Derniers projets</h2>
        {stats.recentProjects.length === 0 ? (
          <p className="empty-state">Aucun projet pour l'instant.</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Titre</th><th>Statut</th><th>Date</th><th></th></tr></thead>
            <tbody>
              {stats.recentProjects.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td><span className={`badge badge-${p.status}`}>{p.status}</span></td>
                  <td>{new Date(p.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td>
                    {p.mainImageUrl ? (
                      <img src={p.mainImageUrl} alt="" className="table-thumb" />
                    ) : (
                      <div className="table-thumb" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-card">
        <h2>Derniers messages</h2>
        {stats.recentMessages.length === 0 ? (
          <p className="empty-state">Aucun message pour l'instant.</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Nom</th><th>Email</th><th>Date</th><th>Statut</th></tr></thead>
            <tbody>
              {stats.recentMessages.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{new Date(m.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td><span className={`badge badge-${m.status}`}>{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
