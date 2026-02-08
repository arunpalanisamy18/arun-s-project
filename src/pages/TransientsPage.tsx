import { useState } from "react";
import { Zap, AlertTriangle, TrendingUp, RefreshCw } from "lucide-react";
import { AppLayout, PageHeader, PageContent } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import Plot from "react-plotly.js";
import { toast } from "sonner";

interface TransientCandidate {
  id: string;
  time: number;
  magnitude: number;
  baselineMag: number;
  deltaMag: number;
  anomalyScore: number;
  classification: "nova" | "flare" | "eclipse" | "unknown";
}

// Generate mock transient detection data
function generateTransientData() {
  const points: { time: number; magnitude: number; baseline: number }[] = [];
  const baseTime = 2460000;
  const baseline = 15.5;
  
  for (let i = 0; i < 200; i++) {
    const time = baseTime + i * 0.5;
    let mag = baseline + (Math.random() - 0.5) * 0.2;
    
    // Add some transient events
    if (i === 45) mag = baseline - 2.5; // Bright transient
    if (i === 46) mag = baseline - 1.8;
    if (i === 47) mag = baseline - 0.9;
    if (i === 100) mag = baseline + 1.2; // Eclipse
    if (i === 101) mag = baseline + 1.5;
    if (i === 102) mag = baseline + 1.2;
    if (i === 150) mag = baseline - 1.0; // Flare
    
    points.push({ time, magnitude: mag, baseline });
  }
  
  return points;
}

function detectTransients(
  data: { time: number; magnitude: number; baseline: number }[],
  threshold: number
): TransientCandidate[] {
  const candidates: TransientCandidate[] = [];
  const stdDev = 0.2; // Approximate baseline scatter
  
  data.forEach((point, i) => {
    const deltaMag = Math.abs(point.magnitude - point.baseline);
    if (deltaMag > threshold * stdDev) {
      const anomalyScore = deltaMag / stdDev;
      let classification: TransientCandidate["classification"] = "unknown";
      
      if (point.magnitude < point.baseline - 1.5) {
        classification = "nova";
      } else if (point.magnitude < point.baseline - 0.5) {
        classification = "flare";
      } else if (point.magnitude > point.baseline + 0.8) {
        classification = "eclipse";
      }
      
      candidates.push({
        id: `TR-${String(i).padStart(4, "0")}`,
        time: point.time,
        magnitude: point.magnitude,
        baselineMag: point.baseline,
        deltaMag,
        anomalyScore,
        classification,
      });
    }
  });
  
  return candidates.sort((a, b) => b.anomalyScore - a.anomalyScore);
}

const classificationColors: Record<TransientCandidate["classification"], string> = {
  nova: "bg-supernova/20 text-supernova border-supernova/30",
  flare: "bg-star/20 text-star border-star/30",
  eclipse: "bg-galaxy/20 text-galaxy border-galaxy/30",
  unknown: "bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30",
};

export default function TransientsPage() {
  const [lightCurveData] = useState(generateTransientData);
  const [threshold, setThreshold] = useState(3);
  const [candidates, setCandidates] = useState<TransientCandidate[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setCandidates([]);
    
    // Simulate scanning progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setScanProgress(i);
    }
    
    const detected = detectTransients(lightCurveData, threshold);
    setCandidates(detected);
    setIsScanning(false);
    
    if (detected.length > 0) {
      toast.success(`Detected ${detected.length} transient candidates!`);
    } else {
      toast.info("No significant transients detected at this threshold.");
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Transient Watch"
        description="Detect anomalies, transients, and variable events in time-series data"
        icon={<Zap className="h-6 w-6 text-white" />}
      />
      
      <PageContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <Card className="card-nebula">
              <CardHeader>
                <CardTitle className="text-base">Detection Settings</CardTitle>
                <CardDescription>Configure anomaly detection parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Detection Threshold: {threshold}σ</Label>
                  <Slider
                    value={[threshold]}
                    onValueChange={(v) => setThreshold(v[0])}
                    min={2}
                    max={5}
                    step={0.5}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Lower = more sensitive, higher = fewer false positives
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleScan} 
              className="w-full btn-cosmic"
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Scan for Transients
                </>
              )}
            </Button>

            {isScanning && (
              <Card className="bg-muted/50">
                <CardContent className="py-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analyzing light curve...</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <Progress value={scanProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {candidates.length > 0 && (
              <Card className="card-nebula">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-supernova" />
                    Candidates ({candidates.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {candidates.map((candidate) => (
                      <div 
                        key={candidate.id}
                        className="p-3 rounded-lg bg-muted/50 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm">{candidate.id}</span>
                          <Badge variant="outline" className={classificationColors[candidate.classification]}>
                            {candidate.classification}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">JD: </span>
                            <span className="font-mono">{candidate.time.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Δmag: </span>
                            <span className="font-mono text-supernova">
                              {candidate.deltaMag > 0 ? "+" : ""}{candidate.deltaMag.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Score:</span>
                          <Progress 
                            value={Math.min(candidate.anomalyScore * 10, 100)} 
                            className="h-1.5 flex-1"
                          />
                          <span className="text-xs font-mono">{candidate.anomalyScore.toFixed(1)}σ</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="card-nebula">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Light Curve Monitor</CardTitle>
                    <CardDescription>Time-series photometry with anomaly detection</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-muted-foreground">
                      {lightCurveData.length} observations
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Plot
                  data={[
                    // Baseline reference
                    {
                      x: lightCurveData.map(d => d.time),
                      y: lightCurveData.map(d => d.baseline),
                      type: "scatter",
                      mode: "lines",
                      line: { color: "hsla(210, 40%, 60%, 0.5)", width: 1, dash: "dash" },
                      name: "Baseline",
                    },
                    // Light curve data
                    {
                      x: lightCurveData.map(d => d.time),
                      y: lightCurveData.map(d => d.magnitude),
                      type: "scatter",
                      mode: "markers",
                      marker: { 
                        color: lightCurveData.map(d => {
                          const delta = Math.abs(d.magnitude - d.baseline) / 0.2;
                          return delta > threshold ? "hsl(25, 95%, 55%)" : "hsl(185, 100%, 50%)";
                        }),
                        size: 6,
                      },
                      name: "Observations",
                    },
                    // Detected transients highlighted
                    ...(candidates.length > 0 ? [{
                      x: candidates.map(c => c.time),
                      y: candidates.map(c => c.magnitude),
                      type: "scatter" as const,
                      mode: "markers" as const,
                      marker: { 
                        color: "transparent",
                        size: 20,
                        line: { color: "hsl(0, 84%, 60%)", width: 3 },
                      },
                      name: "Transients",
                    }] : []),
                  ]}
                  layout={{
                    paper_bgcolor: "transparent",
                    plot_bgcolor: "transparent",
                    font: { color: "hsl(210, 40%, 96%)" },
                        margin: { l: 60, r: 20, t: 20, b: 60 },
                        xaxis: {
                          title: { text: "Julian Date" },
                          gridcolor: "hsla(217, 33%, 20%, 0.5)",
                        },
                        yaxis: {
                          title: { text: "Magnitude" },
                          gridcolor: "hsla(217, 33%, 20%, 0.5)",
                          autorange: "reversed",
                        },
                        legend: {
                          x: 1,
                          xanchor: "right",
                          y: 1,
                          bgcolor: "transparent",
                        },
                        autosize: true,
                  }}
                  config={{ displayModeBar: true, displaylogo: false }}
                  style={{ width: "100%", height: "400px" }}
                  useResizeHandler
                />
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-muted/50">
                <CardContent className="pt-4 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto text-quasar mb-2" />
                  <p className="text-xs text-muted-foreground">Total Points</p>
                  <p className="text-xl font-bold">{lightCurveData.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="pt-4 text-center">
                  <AlertTriangle className="h-5 w-5 mx-auto text-supernova mb-2" />
                  <p className="text-xs text-muted-foreground">Candidates</p>
                  <p className="text-xl font-bold">{candidates.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="pt-4 text-center">
                  <Zap className="h-5 w-5 mx-auto text-star mb-2" />
                  <p className="text-xs text-muted-foreground">Threshold</p>
                  <p className="text-xl font-bold">{threshold}σ</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="pt-4 text-center">
                  <div className="h-5 w-5 mx-auto text-nebula mb-2 font-bold">%</div>
                  <p className="text-xs text-muted-foreground">Flagged</p>
                  <p className="text-xl font-bold">
                    {((candidates.length / lightCurveData.length) * 100).toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageContent>
    </AppLayout>
  );
}
