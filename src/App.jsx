import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar/Navbar";
import CommandPalette from "./components/CommandPalette/CommandPalette";
import UploadModal from "./components/UploadModal/UploadModal";
import Toast from "./components/Toast/Toast";

// Pages
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import AskAI from "./pages/AskAI/AskAI";
import Documents from "./pages/Documents/Documents";
import DocumentViewer from "./pages/DocumentViewer/DocumentViewer";
import Collections from "./pages/Collections/Collections";
import Activity from "./pages/Activity/Activity";
import Settings from "./pages/Settings/Settings";

function AppContent() {
  const { currentPage, isAuthenticated } = useApp();

  // If viewing explicit login or register screens
  if (currentPage === "login" || (!isAuthenticated && currentPage !== "register")) {
    return (
      <>
        <Login />
        <Toast />
      </>
    );
  }

  if (currentPage === "register") {
    return (
      <>
        <Register />
        <Toast />
      </>
    );
  }

  // Render Authenticated Shell with STRICT HORIZONTAL TOP NAVBAR
  return (
    <div className="app-container">
      {/* Top Horizontal Navigation Bar - STRICTLY NO LEFT OR RIGHT SIDEBAR */}
      <Navbar />

      {/* Main Dynamic View Content */}
      <main className="main-content">
        {currentPage === "overview" && <Dashboard />}
        {currentPage === "ask-ai" && <AskAI />}
        {currentPage === "documents" && <Documents />}
        {currentPage === "document-viewer" && <DocumentViewer />}
        {currentPage === "collections" && <Collections />}
        {currentPage === "activity" && <Activity />}
        {currentPage === "settings" && <Settings />}
      </main>

      {/* Global Overlays & Modals */}
      <CommandPalette />
      <UploadModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
