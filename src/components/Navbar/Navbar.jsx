import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  LayoutDashboard,
  Sparkles,
  FileText,
  Folder,
  Activity,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  UploadCloud,
  CheckCircle,
  Menu,
  X
} from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const {
    currentPage,
    setCurrentPage,
    currentUser,
    theme,
    toggleTheme,
    notifications,
    markAllNotificationsRead,
    setIsCommandPaletteOpen,
    setIsUploadModalOpen,
    setIsAuthenticated,
    addToast
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "ask-ai", label: "Ask AI", icon: Sparkles },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "collections", label: "Collections", icon: Folder },
    { id: "activity", label: "Activity", icon: Activity }
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentPage("login");
    setIsUserMenuOpen(false);
    addToast("Signed out successfully.", "info");
  };

  return (
    <header className="top-navbar">
      <div className="top-navbar-inner">
        {/* Brand Logo & Title */}
        <div className="brand-container" onClick={() => handleNavClick("overview")}>
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <path d="M12 18v-5"/>
              <path d="M9.5 15.5 12 13l2.5 2.5"/>
            </svg>
          </div>
          <div className="brand-info">
            <div className="brand-name">
              AI-PIRS<span>.</span>
            </div>
            <div className="brand-subtitle">Personal Document Intelligence</div>
          </div>
        </div>

        {/* STRICT HORIZONTAL CENTER NAVIGATION */}
        <nav className="nav-links-center" aria-label="Main horizontal navigation">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-item-btn ${isActive ? "active" : ""}`}
                id={`nav-item-${item.id}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Search, Upload, Notifications, Theme, User Avatar */}
        <div className="navbar-right">
          {/* Global Search shortcut button */}
          <button
            className="navbar-search-btn"
            onClick={() => setIsCommandPaletteOpen(true)}
            title="Search documents and queries (Cmd+K)"
            aria-label="Open global search palette"
          >
            <Search size={15} />
            <span className="search-label">Search documents...</span>
            <span className="search-shortcut-badge">⌘K</span>
          </button>

          {/* Quick Upload action */}
          <button
            className="navbar-upload-btn"
            onClick={() => setIsUploadModalOpen(true)}
            title="Upload new document"
          >
            <UploadCloud size={16} />
            <span>Upload</span>
          </button>

          {/* Notification Button & Dropdown */}
          <div style={{ position: "relative" }} ref={notifRef}>
            <button
              className="icon-action-btn"
              onClick={() => setIsNotificationsOpen(prev => !prev)}
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && <span className="notification-badge" />}
            </button>

            {isNotificationsOpen && (
              <div className="notifications-dropdown">
                <div className="notifications-top-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="badge badge-orange" style={{ padding: "2px 6px" }}>
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      className="btn-ghost"
                      style={{ fontSize: "0.75rem", padding: "4px 8px" }}
                      onClick={markAllNotificationsRead}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="notifications-list">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`notification-card ${!notif.read ? "unread" : ""}`}
                    >
                      <CheckCircle size={16} color="var(--color-orange)" style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <div className="notification-title">{notif.title}</div>
                        <div className="notification-desc">{notif.description}</div>
                        <div className="notification-time">{notif.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            className="icon-action-btn"
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* User Profile Avatar Dropdown */}
          <div style={{ position: "relative" }} ref={userMenuRef}>
            <button
              className="user-avatar-btn"
              onClick={() => setIsUserMenuOpen(prev => !prev)}
              aria-expanded={isUserMenuOpen}
              aria-label="User menu"
            >
              <div className="user-avatar-placeholder">
                {currentUser.name.charAt(0)}
              </div>
              <span className="user-avatar-name">{currentUser.name.split(" ")[0]}</span>
              <ChevronDown size={14} color="var(--text-secondary)" />
            </button>

            {isUserMenuOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="dropdown-user-name">{currentUser.name}</div>
                  <div className="dropdown-user-email">{currentUser.email}</div>
                </div>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setCurrentPage("settings");
                    setIsUserMenuOpen(false);
                  }}
                >
                  <User size={16} />
                  <span>Profile</span>
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setCurrentPage("settings");
                    setIsUserMenuOpen(false);
                  }}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    toggleTheme();
                    setIsUserMenuOpen(false);
                  }}
                >
                  {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                  <span>Appearance: {theme === "light" ? "Light" : "Dark"}</span>
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    addToast("AI-PIRS Documentation & Help loaded.", "info");
                    setIsUserMenuOpen(false);
                  }}
                >
                  <HelpCircle size={16} />
                  <span>Help & Docs</span>
                </button>

                <div className="dropdown-divider" />

                <button className="dropdown-item danger" onClick={handleSignOut}>
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-nav-toggle"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-nav-links">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`mobile-nav-item ${isActive ? "active" : ""}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => {
                setIsUploadModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="btn btn-primary"
              style={{ marginTop: "12px", width: "100%" }}
            >
              <UploadCloud size={18} />
              <span>Upload Document</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
