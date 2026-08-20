"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconFolder, IconUser, IconHome, IconMenu, IconClose, IconSearch, IconSun, IconMoon } from "./_components/Icons";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: IconHome },
  { href: "/admin/projects", label: "Projets", icon: IconFolder },
  { href: "/admin/skills", label: "Compétences" },
  { href: "/admin/certifications", label: "Formations" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/profile", label: "Profil", icon: IconUser },
  { href: "/admin/settings", label: "Réglages" },
];

const MOBILE_TABS = [
  { href: "/admin", label: "Dashboard", icon: IconHome },
  { href: "/admin/projects", label: "Projets", icon: IconFolder },
  { href: "/admin/profile", label: "Profil", icon: IconUser },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [me, setMe] = useState(null);
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    fetch("/api/admin/auth/me").then((r) => r.json()).then(setMe);
    fetch("/api/admin/profile").then((r) => r.json()).then(setProfile);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
  }, [theme]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const initials = (me?.email || "?").slice(0, 2).toUpperCase();

  return (
    <div className="admin-shell">
      {/* ---- Sidebar (desktop) ---- */}
      <aside className="admin-sidebar">
        <div className="admin-logo">&lt;FB/&gt; admin</div>
        <a href="/admin/projects" className="admin-new-btn">+ Nouveau projet</a>
        {NAV.map((item) => (
          <a key={item.href} href={item.href} className={`admin-nav-link${pathname === item.href ? " active" : ""}`}>
            {item.label}
          </a>
        ))}
        <div className="admin-nav-spacer" />
        <a href="/" className="admin-nav-link" target="_blank" rel="noopener">↗ Voir le site</a>
        <button className="admin-logout-btn" onClick={handleLogout}>Déconnexion</button>
      </aside>

      <div className="admin-col">
        {/* ---- Topbar (desktop) ---- */}
        <div className="admin-topbar">
          <div className="admin-search">
            <IconSearch />
            <input placeholder="Rechercher" />
          </div>
          <div className="theme-pill">
            <button className={theme === "light" ? "active" : ""} onClick={() => setTheme("light")} aria-label="Thème clair">
              <IconSun />
            </button>
            <button className={theme === "dark" ? "active moon" : ""} onClick={() => setTheme("dark")} aria-label="Thème sombre">
              <IconMoon />
            </button>
          </div>
          <div className="user-chip">
            {profile?.photoUrl ? (
              <img src={profile.photoUrl} alt="" className="user-chip-avatar" />
            ) : (
              <div className="user-chip-avatar">{initials}</div>
            )}
            <div className="user-chip-info">
              <span className="user-chip-name">{(profile?.name || "Admin").toUpperCase()}</span>
              <span className="user-chip-email">{me?.email}</span>
            </div>
          </div>
        </div>

        {/* ---- Topbar (mobile) ---- */}
        <div className="mobile-topbar">
          <div className="admin-logo" style={{ margin: 0 }}>&lt;FB/&gt; admin</div>
          {profile?.photoUrl ? (
            <img src={profile.photoUrl} alt="" className="user-chip-avatar" style={{ width: 30, height: 30 }} />
          ) : (
            <div className="user-chip-avatar" style={{ width: 30, height: 30 }}>{initials}</div>
          )}
        </div>

        <main className="admin-main">{children}</main>
      </div>

      {/* ---- Bottom nav (mobile) ---- */}
      <nav className="mobile-bottom-nav">
        {MOBILE_TABS.map((tab) => (
          <a key={tab.href} href={tab.href} className={pathname === tab.href ? "active" : ""}>
            <tab.icon />
            {tab.label}
          </a>
        ))}
        <button onClick={() => setMenuOpen(true)}>
          <IconMenu />
          Menu
        </button>
      </nav>

      <div className={`mobile-menu-sheet${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)}>
        <div className="sheet-inner" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <strong>Menu</strong>
            <button className="btn btn-sm" onClick={() => setMenuOpen(false)}><IconClose /></button>
          </div>
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className={`admin-nav-link${pathname === item.href ? " active" : ""}`} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href="/" className="admin-nav-link" target="_blank" rel="noopener">↗ Voir le site</a>
          <button className="admin-logout-btn" onClick={handleLogout}>Déconnexion</button>
        </div>
      </div>
    </div>
  );
}
