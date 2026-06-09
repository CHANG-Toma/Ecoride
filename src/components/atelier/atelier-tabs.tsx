/**
 * Navigation par onglets de l'espace atelier (Inventaire / Sorties / Reparations).
 */
"use client";

import { useState, type ReactNode } from "react";

type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

type AtelierTabsProps = {
  tabs: Tab[];
};

export function AtelierTabs({ tabs }: AtelierTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-[var(--primary)] text-white"
                : "bg-white text-[var(--accent-strong)] hover:bg-[var(--background)]"
            }`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>{tabs.find((tab) => tab.id === activeTab)?.content}</div>
    </div>
  );
}
