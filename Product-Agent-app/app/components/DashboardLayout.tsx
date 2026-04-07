"use client";

import { useEffect, useCallback } from "react";
import { SectionNav } from "./SectionNav";
import { EntityView } from "./EntityView";
import { MetricTreeView } from "./MetricTreeView";
import { PersonaSlideOver } from "./PersonaSlideOver";
import { AccountMenu } from "./AccountMenu";
import { useAppStore } from "@/app/lib/store";
import { Menu, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { initIfConsented } from "@/app/lib/analytics";
import { startAnalyticsSubscribers } from "@/app/lib/analytics-subscribers";
import { ConsentBanner } from "./ConsentBanner";

function useIsMobile() {
  // Only used for imperative checks (auto-close on nav).
  // Layout itself is driven by CSS breakpoints.
  const check = useCallback(() => typeof window !== "undefined" && window.innerWidth < 768, []);
  return check;
}

export function DashboardLayout() {
  const hydrate = useAppStore((s) => s.hydrate);
  const startPolling = useAppStore((s) => s.startPolling);
  const stopPolling = useAppStore((s) => s.stopPolling);
  const isHydrated = useAppStore((s) => s.isHydrated);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const currentEntityId = useAppStore((s) => s.currentEntityId);
  const viewMode = useAppStore((s) => s.viewMode);
  const isMobile = useIsMobile();

  useEffect(() => {
    hydrate().then(() => {
      startPolling();
      initIfConsented();
      startAnalyticsSubscribers();
    });
    return () => stopPolling();
  }, [hydrate, startPolling, stopPolling]);

  // Auto-close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile()) {
      setSidebarOpen(false);
    }
  }, [currentEntityId, isMobile, setSidebarOpen]);

  if (!isHydrated) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm animate-pulse">Loading…</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <div className="flex flex-1 overflow-hidden relative">

        {/* ── Mobile: hamburger button (visible < md, only when sidebar closed) ── */}
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="cursor-pointer md:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-popover border border-border-default text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu size={18} />
          </button>
        )}

        {/* ── Mobile: backdrop overlay ── */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-overlay z-30"
          />
        )}

        {/* ── Sidebar ── */}
        {/* Desktop: inline with transition. Mobile: fixed overlay. */}
        <div
          className={cn(
            // Base
            "shrink-0 border-r border-border overflow-y-auto bg-background transition-all duration-300",
            // Mobile: fixed overlay
            "fixed inset-y-0 left-0 z-40 md:relative md:inset-auto",
            // Width
            sidebarOpen ? "w-72" : "w-0",
            // Hide content when collapsed
            !sidebarOpen && "overflow-hidden"
          )}
        >
          {/* Mobile close button */}
          <div className="md:hidden flex justify-end p-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="cursor-pointer p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <SectionNav />
        </div>

        {/* ── Main content ── */}
        <main className={cn("flex-1 overflow-y-auto transition-[padding] duration-300", !sidebarOpen && "pl-10")}>
          {/* Desktop: toggle button (visible >= md) */}
          <button
            onClick={toggleSidebar}
            className={cn(
              "cursor-pointer hidden md:flex items-center justify-center",
              "absolute top-3 z-20 p-1.5 rounded-lg",
              "bg-popover border border-border-default text-muted-foreground hover:text-foreground transition-all duration-300",
              sidebarOpen ? "left-[282px]" : "left-3"
            )}
          >
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
          <AccountMenu />
          {viewMode === "metric-tree" ? <MetricTreeView /> : <EntityView />}
        </main>

        <PersonaSlideOver />
        <ConsentBanner />
      </div>
    </div>
  );
}
