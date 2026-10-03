import React from "react";
import { useApp } from "../../context/AppContext";
import {
  UploadCloud,
  Sparkles,
  MessageSquareQuote,
  Eye,
  FolderPlus,
  Clock,
  ArrowRight,
  FileText
} from "lucide-react";
import "./Activity.css";

const ICON_MAP = {
  UploadCloud,
  Sparkles,
  MessageSquareQuote,
  Eye,
  FolderPlus
};

export default function Activity() {
  const { activityList, openDocumentViewer, askAI } = useApp();

  // Group activity by dateGroup ('Today', 'Yesterday', 'Earlier this week')
  const groups = activityList.reduce((acc, item) => {
    const groupName = item.dateGroup || "Today";
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(item);
    return acc;
  }, {});

  const handleItemAction = (item) => {
    if (item.docId) {
      openDocumentViewer(item.docId);
    } else if (item.type === "query") {
      const match = item.title.match(/Asked "(.*)"/);
      if (match && match[1]) {
        askAI(match[1]);
      }
    }
  };

  return (
    <div className="activity-page">
      {/* Header */}
      <div className="activity-header">
        <div>
          <h1 className="page-title">Recent Activity</h1>
          <p className="page-subtitle">Track your document activity and AI interactions.</p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="timeline-container">
        {Object.entries(groups).map(([groupTitle, items]) => (
          <div key={groupTitle} className="timeline-date-group">
            <div className="timeline-group-header">
              <span className="timeline-group-pill">{groupTitle}</span>
              <span className="timeline-group-line" />
            </div>

            <div className="timeline-items-list">
              {items.map(item => {
                const Icon = ICON_MAP[item.icon] || FileText;
                return (
                  <div
                    key={item.id}
                    className="timeline-item-card"
                    onClick={() => handleItemAction(item)}
                  >
                    <div
                      className="timeline-icon-box"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="timeline-content">
                      <div className="timeline-item-top">
                        <span className="timeline-item-title">{item.title}</span>
                        <span className="timeline-time-badge">{item.time || item.timestamp}</span>
                      </div>
                      <p className="timeline-item-desc">{item.description}</p>
                    </div>

                    {item.docId && (
                      <div className="timeline-action-arrow">
                        <ArrowRight size={15} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
