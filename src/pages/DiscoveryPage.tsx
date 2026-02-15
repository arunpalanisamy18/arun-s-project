import { useState } from "react";
import { Compass, Sparkles, TrendingUp, AlertTriangle, Eye, Activity, Waves, Zap, Database, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppLayout, PageHeader, PageContent } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


interface Insight {
  id: string;
  title: string;
  source: string;
  sourceIcon: typeof Activity;
  confidence: number;
  type: "discovery" | "anomaly" | "trend" | "recommendation";
  summary: string;
  details: string;
  followUp: string[];
}

const mockInsights: Insight[] = [
  {
    id: "ins-1",
    title: "Periodic Variable Star Candidate Detected",
    source: "Light Curve Lab",
    sourceIcon: Activity,
    confidence: 87,
    type: "discovery",
    summary: "A strong 4.2-day periodicity was found in the sample light curve with variability index 0.78, consistent with an eclipsing binary system.",
    details: "Lomb-Scargle analysis reveals a dominant peak at P=4.2d with FAP<0.01. The folded light curve shows a primary eclipse depth of ~0.3 mag.",
    followUp: ["Schedule photometric follow-up observation", "Run spectroscopy to confirm binary nature", "Check observation window in Planner"],
  },
  {
    id: "ins-2",
    title: "Unusual Spectral Feature at 5200Å",
    source: "Spectroscopy Studio",
    sourceIcon: Waves,
    confidence: 72,
    type: "anomaly",
    summary: "An unidentified emission line was detected near 5200Å that does not match common stellar or nebular templates.",
    details: "Peak detected at 5198.3Å with FWHM 12.4Å and S/N=8.2. Nearest known line is [NI] 5199Å but the profile is inconsistent.",
    followUp: ["Obtain higher-resolution spectrum", "Cross-reference with NIST atomic database", "Check for instrumental artifacts"],
  },
  {
    id: "ins-3",
    title: "3 High-Confidence Transient Candidates",
    source: "Transient Watch",
    sourceIcon: Zap,
    confidence: 91,
    type: "anomaly",
    summary: "Three data points show brightness increases >3σ above baseline, with anomaly scores exceeding 0.85.",
    details: "Events at t=23.4d, t=67.1d, and t=89.5d. The brightest event shows Δmag=-1.2 with a rise time <2 days, consistent with a nova or CV outburst.",
    followUp: ["Cross-match with known transient catalogs", "Request rapid spectroscopic follow-up", "Alert transient broker networks"],
  },
  {
    id: "ins-4",
    title: "Galaxy Overdensity in COSMOS Field",
    source: "Survey Miner",
    sourceIcon: Database,
    confidence: 68,
    type: "trend",
    summary: "The COSMOS field shows a 2.3x overdensity of galaxies at z≈0.7 compared to the average across all fields.",
    details: "142 galaxies found in z=[0.65,0.75] within COSMOS vs ~62 expected. This may indicate a galaxy cluster or large-scale structure filament.",
    followUp: ["Run detailed photometric redshift analysis", "Check for X-ray counterpart in archival data", "Estimate cluster mass from richness"],
  },
  {
    id: "ins-5",
    title: "Recommended: Multi-band Follow-up of Variable",
    source: "Cross-analysis",
    sourceIcon: Eye,
    confidence: 95,
    type: "recommendation",
    summary: "Combining light curve periodicity and spectral features, a multi-band photometric campaign is strongly recommended.",
    details: "The detected period and spectral anomaly may be related. Simultaneous u/g/r/i monitoring over 2 full periods (~8.4 days) would clarify the physical mechanism.",
    followUp: ["Plan observation in Observation Planner", "Allocate telescope time for 10-day run", "Prepare data reduction pipeline"],
  },
];

const typeConfig = {
  discovery: { label: "Discovery", color: "bg-primary/20 text-primary border-primary/30" },
  anomaly: { label: "Anomaly", color: "bg-destructive/20 text-destructive border-destructive/30" },
  trend: { label: "Trend", color: "bg-secondary/20 text-secondary border-secondary/30" },
  recommendation: { label: "Action", color: "bg-star/20 text-star border-star/30" },
};

function ConfidenceMeter({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full transition-all rounded-full",
            value >= 80 ? "bg-accent" : value >= 60 ? "bg-star" : "bg-supernova"
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-mono font-medium tabular-nums w-10 text-right">{value}%</span>
    </div>
  );
}

export default function DiscoveryPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <AppLayout>
      <PageHeader
        title="Discovery Mode"
        description="AI-synthesized insights from all analysis modules"
        icon={<Compass className="h-6 w-6 text-primary-foreground" />}
        actions={
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 gap-1.5">
            <Sparkles className="h-3 w-3" />
            {mockInsights.length} Insights Generated
          </Badge>
        }
      />
      <PageContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Discoveries", count: mockInsights.filter(i => i.type === "discovery").length, icon: TrendingUp, color: "text-primary" },
            { label: "Anomalies", count: mockInsights.filter(i => i.type === "anomaly").length, icon: AlertTriangle, color: "text-destructive" },
            { label: "Trends", count: mockInsights.filter(i => i.type === "trend").length, icon: Activity, color: "text-secondary" },
            { label: "Actions", count: mockInsights.filter(i => i.type === "recommendation").length, icon: Eye, color: "text-star" },
          ].map((s) => (
            <Card key={s.label} className="glass-card">
              <CardContent className="pt-5 flex items-center gap-3">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <div>
                  <p className="text-2xl font-bold">{s.count}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insight Cards */}
        <div className="space-y-4">
          {mockInsights.map((insight) => {
            const expanded = expandedId === insight.id;
            const cfg = typeConfig[insight.type];
            return (
              <Card
                key={insight.id}
                className="glass-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
                onClick={() => setExpandedId(expanded ? null : insight.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-muted/50 mt-0.5">
                        <insight.sourceIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={`text-xs ${cfg.color}`}>{cfg.label}</Badge>
                          <span className="text-xs text-muted-foreground">from {insight.source}</span>
                        </div>
                        <CardTitle className="text-base leading-snug">{insight.title}</CardTitle>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Confidence</p>
                    <ConfidenceMeter value={insight.confidence} />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{insight.summary}</p>

                  {expanded && (
                    <div className="space-y-4 pt-2 border-t border-border/50 animate-fade-in">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Technical Details</p>
                        <p className="text-sm leading-relaxed">{insight.details}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Recommended Follow-up</p>
                        <div className="space-y-2">
                          {insight.followUp.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <div className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </PageContent>
    </AppLayout>
  );
}
