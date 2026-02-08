import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Telescope,
  Search,
  Calendar,
  Activity,
  Waves,
  Zap,
  BookOpen,
  Database,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  {
    title: "Catalog Explorer",
    href: "/catalog",
    icon: Search,
    description: "Search astronomical objects",
  },
  {
    title: "Observation Planner",
    href: "/planner",
    icon: Calendar,
    description: "Plan your observations",
  },
  {
    title: "Light Curve Lab",
    href: "/lightcurve",
    icon: Activity,
    description: "Analyze photometry data",
  },
  {
    title: "Spectroscopy Studio",
    href: "/spectroscopy",
    icon: Waves,
    description: "Spectral analysis tools",
  },
  {
    title: "Transient Watch",
    href: "/transients",
    icon: Zap,
    description: "Detect anomalies",
  },
  {
    title: "Research Assistant",
    href: "/research",
    icon: BookOpen,
    description: "AI-powered Q&A",
  },
  {
    title: "Survey Miner",
    href: "/survey",
    icon: Database,
    description: "Query survey datasets",
  },
];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-nebula">
          <Telescope className="h-5 w-5 text-white" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col animate-fade-in">
            <span className="font-semibold text-sidebar-foreground">Astronomy</span>
            <span className="text-xs text-muted-foreground">Data Navigator</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Tooltip key={item.href} delayDuration={0}>
            <TooltipTrigger asChild>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )
                }
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110",
                  isCollapsed ? "mx-auto" : ""
                )} />
                {!isCollapsed && (
                  <div className="flex flex-col animate-fade-in">
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs opacity-70">{item.description}</span>
                  </div>
                )}
              </NavLink>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="bg-popover border-border">
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-center text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
