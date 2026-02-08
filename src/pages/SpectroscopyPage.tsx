import { useState } from "react";
import { Waves, Upload, Crosshair, Zap } from "lucide-react";
import { AppLayout, PageHeader, PageContent } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Plot from "react-plotly.js";
import { 
  sampleSpectra, 
  normalizeSpectrum, 
  detectPeaks, 
  identifyLine,
  spectralLines,
  type SpectrumDataset 
} from "@/data/spectra";
import { toast } from "sonner";

export default function SpectroscopyPage() {
  const [selectedSpectrum, setSelectedSpectrum] = useState<SpectrumDataset | null>(null);
  const [normalize, setNormalize] = useState(false);
  const [showLineMarkers, setShowLineMarkers] = useState(true);
  const [detectedPeaks, setDetectedPeaks] = useState<{ wavelength: number; flux: number; line?: string }[]>([]);

  const handleSpectrumSelect = (spectrumId: string) => {
    const spectrum = sampleSpectra.find(s => s.id === spectrumId);
    setSelectedSpectrum(spectrum || null);
    setDetectedPeaks([]);
  };

  const handleDetectPeaks = () => {
    if (!selectedSpectrum) return;
    
    const peaks = detectPeaks(selectedSpectrum.data, 0.25);
    const identifiedPeaks = peaks.map(peak => ({
      ...peak,
      line: identifyLine(peak.wavelength, 15) || undefined,
    }));
    
    setDetectedPeaks(identifiedPeaks);
    toast.success(`Detected ${identifiedPeaks.length} spectral features`);
  };

  const displayData = selectedSpectrum 
    ? (normalize ? normalizeSpectrum(selectedSpectrum.data) : selectedSpectrum.data)
    : [];

  // Common spectral line markers
  const lineMarkers = showLineMarkers && selectedSpectrum ? [
    { name: "Hα", wavelength: spectralLines.hydrogen["H-alpha"], color: "hsl(0, 80%, 60%)" },
    { name: "Hβ", wavelength: spectralLines.hydrogen["H-beta"], color: "hsl(200, 80%, 60%)" },
    { name: "Hγ", wavelength: spectralLines.hydrogen["H-gamma"], color: "hsl(260, 80%, 60%)" },
    { name: "[O III]", wavelength: spectralLines.oxygen["[O III] 5007"], color: "hsl(120, 80%, 60%)" },
    { name: "Na D", wavelength: spectralLines.sodium["Na D1"], color: "hsl(40, 80%, 60%)" },
    { name: "Ca K", wavelength: spectralLines.calcium["Ca II K"], color: "hsl(280, 80%, 60%)" },
  ] : [];

  return (
    <AppLayout>
      <PageHeader
        title="Spectroscopy Studio"
        description="Analyze spectra, detect lines, and estimate redshifts"
        icon={<Waves className="h-6 w-6 text-white" />}
      />
      
      <PageContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="space-y-4">
            <Card className="card-nebula">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Select Spectrum
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select onValueChange={handleSpectrumSelect}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Choose a spectrum" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleSpectra.map((spectrum) => (
                      <SelectItem key={spectrum.id} value={spectrum.id}>
                        {spectrum.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedSpectrum && (
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Object:</span> {selectedSpectrum.objectName}</p>
                    <p><span className="text-muted-foreground">Type:</span> {selectedSpectrum.objectType}</p>
                    <p><span className="text-muted-foreground">Range:</span> {selectedSpectrum.wavelengthRange}</p>
                    <p><span className="text-muted-foreground">Resolution:</span> {selectedSpectrum.resolution}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="card-nebula">
              <CardHeader>
                <CardTitle className="text-base">Display Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="normalize">Normalize Flux</Label>
                  <Switch
                    id="normalize"
                    checked={normalize}
                    onCheckedChange={setNormalize}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="markers">Line Markers</Label>
                  <Switch
                    id="markers"
                    checked={showLineMarkers}
                    onCheckedChange={setShowLineMarkers}
                  />
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleDetectPeaks} 
              className="w-full btn-cosmic"
              disabled={!selectedSpectrum}
            >
              <Crosshair className="h-4 w-4 mr-2" />
              Detect Peaks
            </Button>

            {detectedPeaks.length > 0 && (
              <Card className="card-nebula">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Detected Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {detectedPeaks.slice(0, 10).map((peak, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="font-mono">{peak.wavelength.toFixed(1)} Å</span>
                        {peak.line ? (
                          <Badge variant="outline" className="text-quasar border-quasar/30">
                            {peak.line}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            Unknown
                          </Badge>
                        )}
                      </div>
                    ))}
                    {detectedPeaks.length > 10 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{detectedPeaks.length - 10} more features
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Spectrum Chart */}
          <div className="lg:col-span-3">
            {selectedSpectrum ? (
              <Card className="card-nebula">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedSpectrum.objectName}</CardTitle>
                      <CardDescription>{selectedSpectrum.objectType}</CardDescription>
                    </div>
                    <Badge variant="outline">
                      {selectedSpectrum.data.length} points
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Plot
                    data={[
                      // Main spectrum
                      {
                        x: displayData.map(d => d.wavelength),
                        y: displayData.map(d => d.flux),
                        type: "scatter",
                        mode: "lines",
                        line: { color: "hsl(185, 100%, 50%)", width: 1 },
                        name: "Spectrum",
                        fill: "tozeroy",
                        fillcolor: "hsla(185, 100%, 50%, 0.1)",
                      },
                      // Detected peaks
                      ...(detectedPeaks.length > 0 ? [{
                        x: detectedPeaks.map(p => p.wavelength),
                        y: detectedPeaks.map(p => {
                          const idx = displayData.findIndex(d => Math.abs(d.wavelength - p.wavelength) < 2);
                          return idx >= 0 ? displayData[idx].flux : 0;
                        }),
                        type: "scatter" as const,
                        mode: "markers" as const,
                        marker: { 
                          color: detectedPeaks.map(p => p.line ? "hsl(330, 85%, 65%)" : "hsl(45, 100%, 70%)"),
                          size: 10,
                          symbol: "diamond",
                        },
                        name: "Peaks",
                        text: detectedPeaks.map(p => p.line || `${p.wavelength.toFixed(1)} Å`),
                        hovertemplate: "%{text}<br>λ = %{x:.1f} Å<extra></extra>",
                      }] : []),
                    ]}
                    layout={{
                      paper_bgcolor: "transparent",
                      plot_bgcolor: "transparent",
                      font: { color: "hsl(210, 40%, 96%)" },
                        margin: { l: 60, r: 40, t: 20, b: 60 },
                        xaxis: {
                          title: { text: "Wavelength (Å)" },
                          gridcolor: "hsla(217, 33%, 20%, 0.5)",
                        },
                        yaxis: {
                          title: { text: normalize ? "Normalized Flux" : "Flux" },
                          gridcolor: "hsla(217, 33%, 20%, 0.5)",
                        },
                        shapes: lineMarkers.map(marker => ({
                          type: "line" as const,
                          x0: marker.wavelength,
                          x1: marker.wavelength,
                          y0: 0,
                        y1: 1,
                        yref: "paper" as const,
                        line: { color: marker.color, width: 1, dash: "dot" as const },
                      })),
                      annotations: lineMarkers
                        .filter(m => displayData.some(d => Math.abs(d.wavelength - m.wavelength) < 50))
                        .map(marker => ({
                          x: marker.wavelength,
                          y: 1,
                          yref: "paper" as const,
                          text: marker.name,
                          showarrow: false,
                          font: { size: 10, color: marker.color },
                          yanchor: "bottom" as const,
                        })),
                      showlegend: false,
                      autosize: true,
                      hovermode: "x unified" as const,
                    }}
                    config={{ displayModeBar: true, displaylogo: false }}
                    style={{ width: "100%", height: "500px" }}
                    useResizeHandler
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="card-nebula h-full min-h-[500px] flex items-center justify-center">
                <CardContent className="text-center">
                  <Waves className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No Spectrum Selected</p>
                  <p className="text-muted-foreground">
                    Choose a sample spectrum from the panel to begin analysis
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
