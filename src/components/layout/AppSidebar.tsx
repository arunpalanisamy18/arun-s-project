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
  Compass,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const navItems = [
  { title: "Catalog Explorer", href: "/catalog", icon: Search, description: "Search astronomical objects" },
  { title: "Observation Planner", href: "/planner", icon: Calendar, description: "Plan your observations" },
  { title: "Light Curve Lab", href: "/lightcurve", icon: Activity, description: "Analyze photometry data" },
  { title: "Spectroscopy Studio", href: "/spectroscopy", icon: Waves, description: "Spectral analysis tools" },
  { title: "Transient Watch", href: "/transients", icon: Zap, description: "Detect anomalies" },
  { title: "Discovery Mode", href: "/discovery", icon: Compass, description: "AI-powered insights" },
  { title: "Research Assistant", href: "/research", icon: BookOpen, description: "AI-powered Q&A" },
  { title: "Survey Miner", href: "/survey", icon: Database, description: "Query survey datasets" },
];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, userEmail } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border transition-all duration-300 flex flex-col",
        "bg-sidebar/80 backdrop-blur-xl",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-nebula shadow-lg shadow-primary/20 flex-shrink-0">
          <Telescope className="h-5 w-5 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col animate-fade-in overflow-hidden">
            <span className="font-semibold text-sidebar-foreground text-sm">DeepSpace Analyst</span>
            <span className="text-[10px] text-muted-foreground tracking-wider uppercase">Astronomy Navigator</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <Tooltip key={item.href} delayDuration={0}>
            <TooltipTrigger asChild>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-primary/15 text-primary shadow-sm border border-primary/20"
                      : "text-sidebar-foreground hover:bg-muted/30"
                  )
                }
              >
                <item.icon className={cn("h-[18px] w-[18px] flex-shrink-0", isCollapsed && "mx-auto")} />
                {!isCollapsed && (
                  <span className="text-sm font-medium truncate">{item.title}</span>
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

      {/* Bottom: User + Collapse */}
      <div className="p-2 border-t border-sidebar-border space-y-1">
        {!isCollapsed && userEmail && (
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">{userEmail}</div>
        )}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
            >
              <LogOut className={cn("h-4 w-4", isCollapsed ? "mx-auto" : "mr-2")} />
              {!isCollapsed && <span>Logout</span>}
            </Button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right">Logout</TooltipContent>
          )}
        </Tooltip>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-center text-sidebar-foreground hover:bg-muted/30 rounded-xl"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : (
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
