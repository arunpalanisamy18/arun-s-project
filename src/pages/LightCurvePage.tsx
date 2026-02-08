import { useState } from "react";
import { Activity, Upload, TrendingUp, AlertCircle, Download } from "lucide-react";
import { AppLayout, PageHeader, PageContent } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Plot from "react-plotly.js";
import { 
  sampleLightCurves, 
  smoothLightCurve, 
  detectPeriod, 
  detectOutliers, 
  calculateVariability,
  type LightCurveDataset 
} from "@/data/lightcurves";
import { toast } from "sonner";

interface AnalysisResult {
  period: number;
  periodPower: number;
  variability: number;
  outlierCount: number;
  outlierIndices: number[];
}

export default function LightCurvePage() {
  const [selectedDataset, setSelectedDataset] = useState<LightCurveDataset | null>(null);
  const [smoothingWindow, setSmoothingWindow] = useState(5);
  const [showSmoothed, setShowSmoothed] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDatasetSelect = (datasetId: string) => {
    const dataset = sampleLightCurves.find(d => d.id === datasetId);
    setSelectedDataset(dataset || null);
    setAnalysisResult(null);
    setShowSmoothed(false);
  };

  const handleAnalyze = async () => {
    if (!selectedDataset) return;
    
    setIsAnalyzing(true);
    toast.info("Running light curve analysis...");
    
    // Simulate async processing
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const periodResult = detectPeriod(selectedDataset.data);
    const outliers = detectOutliers(selectedDataset.data);
    const variability = calculateVariability(selectedDataset.data);
    
    setAnalysisResult({
      period: periodResult.period,
      periodPower: periodResult.power,
      variability,
      outlierCount: outliers.length,
      outlierIndices: outliers,
    });
    
    setIsAnalyzing(false);
    toast.success("Analysis complete!");
  };

  const smoothedData = selectedDataset ? smoothLightCurve(selectedDataset.data, smoothingWindow) : [];

  return (
    <AppLayout>
      <PageHeader
        title="Light Curve Lab"
        description="Analyze photometry data, detect periods, and classify variability"
        icon={<Activity className="h-6 w-6 text-white" />}
      />
      
      <PageContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="space-y-4">
            <Card className="card-nebula">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Select Dataset
                </CardTitle>
                <CardDescription>Choose a sample light curve</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select onValueChange={handleDatasetSelect}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select a dataset" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleLightCurves.map((dataset) => (
                      <SelectItem key={dataset.id} value={dataset.id}>
                        {dataset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedDataset && (
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Object:</span> {selectedDataset.objectName}</p>
                    <p><span className="text-muted-foreground">Type:</span> {selectedDataset.objectType}</p>
                    <p><span className="text-muted-foreground">Points:</span> {selectedDataset.points}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="card-nebula">
              <CardHeader>
                <CardTitle className="text-base">Smoothing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Window Size: {smoothingWindow}</Label>
                  <Slider
                    value={[smoothingWindow]}
                    onValueChange={(v) => setSmoothingWindow(v[0])}
                    min={3}
                    max={15}
                    step={2}
                    className="mt-2"
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={!selectedDataset}
                  onClick={() => setShowSmoothed(!showSmoothed)}
                >
                  {showSmoothed ? "Hide" : "Show"} Smoothed
                </Button>
              </CardContent>
            </Card>

            <Button 
              onClick={handleAnalyze} 
              className="w-full btn-cosmic"
              disabled={!selectedDataset || isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Run Analysis"}
            </Button>

            {analysisResult && (
              <Card className="card-nebula">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Detected Period</span>
                    <Badge variant="outline" className="font-mono">
                      {analysisResult.period.toFixed(3)} days
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Period Power</span>
                    <Badge variant="outline" className="font-mono">
                      {analysisResult.periodPower.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Variability Index</span>
                    <Badge 
                      variant="outline" 
                      className={`font-mono ${analysisResult.variability > 5 ? "text-supernova" : ""}`}
                    >
                      {analysisResult.variability.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Outliers</span>
                    <Badge 
                      variant="outline" 
                      className={`font-mono ${analysisResult.outlierCount > 0 ? "text-destructive" : ""}`}
                    >
                      {analysisResult.outlierCount}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-3 space-y-4">
            {selectedDataset ? (
              <>
                <Card className="card-nebula">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Light Curve</CardTitle>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Plot
                      data={[
                        // Raw data with error bars
                        {
                          x: selectedDataset.data.map(d => d.time),
                          y: selectedDataset.data.map(d => d.magnitude),
                          error_y: {
                            type: "data",
                            array: selectedDataset.data.map(d => d.error),
                            visible: true,
                            color: "hsla(210, 40%, 96%, 0.3)",
                          },
                          type: "scatter",
                          mode: "markers",
                          marker: { 
                            color: analysisResult 
                              ? selectedDataset.data.map((_, i) => 
                                  analysisResult.outlierIndices.includes(i) 
                                    ? "hsl(0, 84%, 60%)" 
                                    : "hsl(185, 100%, 50%)"
                                )
                              : "hsl(185, 100%, 50%)",
                            size: 6,
                          },
                          name: "Observations",
                        },
                        // Smoothed curve
                        ...(showSmoothed ? [{
                          x: smoothedData.map(d => d.time),
                          y: smoothedData.map(d => d.magnitude),
                          type: "scatter" as const,
                          mode: "lines" as const,
                          line: { color: "hsl(265, 89%, 65%)", width: 2 },
                          name: "Smoothed",
                        }] : []),
                      ]}
                      layout={{
                        paper_bgcolor: "transparent",
                        plot_bgcolor: "transparent",
                        font: { color: "hsl(210, 40%, 96%)" },
                        margin: { l: 60, r: 20, t: 20, b: 60 },
                        xaxis: {
                          title: { text: "Julian Date (offset)" },
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

                {analysisResult && analysisResult.outlierCount > 0 && (
                  <Card className="border-destructive/50 bg-destructive/5">
                    <CardContent className="py-4 flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <div>
                        <p className="font-medium">Outliers Detected</p>
                        <p className="text-sm text-muted-foreground">
                          {analysisResult.outlierCount} data points exceed 3σ from mean. 
                          These are highlighted in red in the chart.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Phase-folded view placeholder */}
                {analysisResult && (
                  <Card className="card-nebula">
                    <CardHeader>
                      <CardTitle className="text-base">Phase-Folded Light Curve</CardTitle>
                      <CardDescription>Folded at period = {analysisResult.period.toFixed(3)} days</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Plot
                        data={[
                          {
                            x: selectedDataset.data.map(d => (d.time % analysisResult.period) / analysisResult.period),
                            y: selectedDataset.data.map(d => d.magnitude),
                            type: "scatter",
                            mode: "markers",
                            marker: { color: "hsl(330, 85%, 65%)", size: 6 },
                            name: "Phase",
                          },
                        ]}
                        layout={{
                          paper_bgcolor: "transparent",
                          plot_bgcolor: "transparent",
                          font: { color: "hsl(210, 40%, 96%)" },
                        margin: { l: 60, r: 20, t: 20, b: 60 },
                        xaxis: {
                          title: { text: "Phase" },
                          gridcolor: "hsla(217, 33%, 20%, 0.5)",
                          range: [0, 1],
                        },
                        yaxis: {
                          title: { text: "Magnitude" },
                          gridcolor: "hsla(217, 33%, 20%, 0.5)",
                          autorange: "reversed",
                        },
                        showlegend: false,
                        autosize: true,
                      }}
                      config={{ displayModeBar: false }}
                        style={{ width: "100%", height: "300px" }}
                        useResizeHandler
                      />
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="card-nebula h-full min-h-[500px] flex items-center justify-center">
                <CardContent className="text-center">
                  <Activity className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No Dataset Selected</p>
                  <p className="text-muted-foreground">
                    Choose a sample light curve from the panel to begin analysis
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </PageContent>
    </AppLayout>
  );
}
