import { useState } from "react";
import { Database, Filter, Download, Table, BarChart3 } from "lucide-react";
import { AppLayout, PageHeader, PageContent } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Plot from "react-plotly.js";
import { querySurvey, exportToCSV, type SurveyObject, type SurveyFilters } from "@/data/survey";
import { toast } from "sonner";

const objectTypes: SurveyObject["objType"][] = ["STAR", "GALAXY", "QSO", "UNKNOWN"];
const fields = ["COSMOS", "GOODS-N", "GOODS-S", "AEGIS", "UDS", "STRIPE82"];

export default function SurveyPage() {
  const [filters, setFilters] = useState<SurveyFilters>({});
  const [results, setResults] = useState<SurveyObject[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<SurveyObject["objType"][]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [minRedshift, setMinRedshift] = useState("");
  const [maxRedshift, setMaxRedshift] = useState("");
  const [minMag, setMinMag] = useState("");
  const [maxMag, setMaxMag] = useState("");

  const handleQuery = () => {
    const queryFilters: SurveyFilters = {};
    
    if (selectedTypes.length > 0) queryFilters.objTypes = selectedTypes;
    if (selectedFields.length > 0) queryFilters.fields = selectedFields;
    if (minRedshift) queryFilters.minRedshift = parseFloat(minRedshift);
    if (maxRedshift) queryFilters.maxRedshift = parseFloat(maxRedshift);
    if (minMag) queryFilters.minMagnitude = parseFloat(minMag);
    if (maxMag) queryFilters.maxMagnitude = parseFloat(maxMag);
    
    setFilters(queryFilters);
    const data = querySurvey(queryFilters);
    setResults(data);
    toast.success(`Query returned ${data.length} objects`);
  };

  const handleExport = () => {
    if (results.length === 0) {
      toast.error("No data to export");
      return;
    }
    
    const csv = exportToCSV(results);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "survey_query_results.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully");
  };

  const toggleType = (type: SurveyObject["objType"]) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleField = (field: string) => {
    setSelectedFields(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  // Stats for results
  const stats = results.length > 0 ? {
    galaxies: results.filter(r => r.objType === "GALAXY").length,
    stars: results.filter(r => r.objType === "STAR").length,
    qsos: results.filter(r => r.objType === "QSO").length,
    avgRedshift: results.filter(r => r.redshift).reduce((sum, r) => sum + (r.redshift || 0), 0) / 
                 results.filter(r => r.redshift).length || 0,
  } : null;

  return (
    <AppLayout>
      <PageHeader
        title="Survey Miner"
        description="Query and analyze astronomical survey datasets"
        icon={<Database className="h-6 w-6 text-white" />}
      />
      
      <PageContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Panel */}
          <div className="space-y-4">
            <Card className="card-nebula">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Query Filters
                </CardTitle>
                <CardDescription>Filter the survey catalog</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Object Types */}
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Object Types
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {objectTypes.map(type => (
                      <label
                        key={type}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => toggleType(type)}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Redshift Range */}
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Redshift Range
                  </Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                      placeholder="Min"
                      value={minRedshift}
                      onChange={(e) => setMinRedshift(e.target.value)}
                      className="bg-background"
                    />
                    <Input
                      placeholder="Max"
                      value={maxRedshift}
                      onChange={(e) => setMaxRedshift(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>

                {/* Magnitude Range */}
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    r-band Magnitude
                  </Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                      placeholder="Min"
                      value={minMag}
                      onChange={(e) => setMinMag(e.target.value)}
                      className="bg-background"
                    />
                    <Input
                      placeholder="Max"
                      value={maxMag}
                      onChange={(e) => setMaxMag(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>

                {/* Fields */}
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Survey Fields
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {fields.map(field => (
                      <Button
                        key={field}
                        variant={selectedFields.includes(field) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleField(field)}
                        className="text-xs"
                      >
                        {field}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleQuery} className="w-full btn-cosmic">
              Run Query
            </Button>

            {stats && (
              <Card className="card-nebula">
                <CardHeader>
                  <CardTitle className="text-base">Query Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total objects</span>
                    <span className="font-mono">{results.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Galaxies</span>
                    <span className="font-mono">{stats.galaxies}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Stars</span>
                    <span className="font-mono">{stats.stars}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">QSOs</span>
                    <span className="font-mono">{stats.qsos}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Redshift</span>
                    <span className="font-mono">{stats.avgRedshift.toFixed(3)}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button 
              onClick={handleExport} 
              variant="outline" 
              className="w-full"
              disabled={results.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {results.length > 0 ? (
              <Tabs defaultValue="table" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-muted">
                  <TabsTrigger value="table" className="flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    Table
                  </TabsTrigger>
                  <TabsTrigger value="sky" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Sky Plot
                  </TabsTrigger>
                  <TabsTrigger value="color" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Color-Mag
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="table" className="mt-4">
                  <Card className="card-nebula">
                    <CardContent className="p-0">
                      <div className="max-h-[600px] overflow-auto">
                        <UITable>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>RA</TableHead>
                              <TableHead>Dec</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>r mag</TableHead>
                              <TableHead>Redshift</TableHead>
                              <TableHead>Field</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {results.slice(0, 100).map((obj) => (
                              <TableRow key={obj.id}>
                                <TableCell className="font-mono text-xs">{obj.id}</TableCell>
                                <TableCell className="font-mono text-xs">{obj.ra.toFixed(4)}</TableCell>
                                <TableCell className="font-mono text-xs">{obj.dec.toFixed(4)}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-xs">
                                    {obj.objType}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-mono text-xs">{obj.magnitude_r.toFixed(2)}</TableCell>
                                <TableCell className="font-mono text-xs">
                                  {obj.redshift?.toFixed(4) ?? "—"}
                                </TableCell>
                                <TableCell className="text-xs">{obj.field}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </UITable>
                      </div>
                      {results.length > 100 && (
                        <p className="text-center text-sm text-muted-foreground py-2">
                          Showing 100 of {results.length} results
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sky" className="mt-4">
                  <Card className="card-nebula">
                    <CardHeader>
                      <CardTitle className="text-base">Sky Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Plot
                        data={[
                          {
                            x: results.map(r => r.ra),
                            y: results.map(r => r.dec),
                            mode: "markers",
                            type: "scatter",
                            marker: {
                              color: results.map(r => {
                                if (r.objType === "GALAXY") return "hsl(220, 90%, 55%)";
                                if (r.objType === "STAR") return "hsl(45, 100%, 70%)";
                                if (r.objType === "QSO") return "hsl(185, 100%, 50%)";
                                return "hsl(0, 0%, 60%)";
                              }),
                              size: 5,
                            },
                            text: results.map(r => `${r.id}<br>${r.objType}<br>z=${r.redshift?.toFixed(3) ?? "N/A"}`),
                            hovertemplate: "%{text}<extra></extra>",
                          },
                        ]}
                        layout={{
                          paper_bgcolor: "transparent",
                          plot_bgcolor: "transparent",
                          font: { color: "hsl(210, 40%, 96%)" },
                          margin: { l: 60, r: 20, t: 20, b: 60 },
                          xaxis: {
                            title: { text: "RA (degrees)" },
                            gridcolor: "hsla(217, 33%, 20%, 0.5)",
                          },
                          yaxis: {
                            title: { text: "Dec (degrees)" },
                            gridcolor: "hsla(217, 33%, 20%, 0.5)",
                          },
                          autosize: true,
                        }}
                        config={{ displayModeBar: true, displaylogo: false }}
                        style={{ width: "100%", height: "500px" }}
                        useResizeHandler
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="color" className="mt-4">
                  <Card className="card-nebula">
                    <CardHeader>
                      <CardTitle className="text-base">Color-Magnitude Diagram</CardTitle>
                      <CardDescription>g-r color vs r-band magnitude</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Plot
                        data={[
                          {
                            x: results.map(r => r.magnitude_g - r.magnitude_r),
                            y: results.map(r => r.magnitude_r),
                            mode: "markers",
                            type: "scatter",
                            marker: {
                              color: results.map(r => {
                                if (r.objType === "GALAXY") return "hsl(220, 90%, 55%)";
                                if (r.objType === "STAR") return "hsl(45, 100%, 70%)";
                                if (r.objType === "QSO") return "hsl(185, 100%, 50%)";
                                return "hsl(0, 0%, 60%)";
                              }),
                              size: 6,
                            },
                            text: results.map(r => `${r.id}<br>${r.objType}`),
                            hovertemplate: "%{text}<br>g-r: %{x:.2f}<br>r: %{y:.2f}<extra></extra>",
                          },
                        ]}
                        layout={{
                          paper_bgcolor: "transparent",
                          plot_bgcolor: "transparent",
                          font: { color: "hsl(210, 40%, 96%)" },
                          margin: { l: 60, r: 20, t: 20, b: 60 },
                          xaxis: {
                            title: { text: "g - r (color)" },
                            gridcolor: "hsla(217, 33%, 20%, 0.5)",
                          },
                          yaxis: {
                            title: { text: "r (magnitude)" },
                            gridcolor: "hsla(217, 33%, 20%, 0.5)",
                            autorange: "reversed",
                          },
                          autosize: true,
                        }}
                        config={{ displayModeBar: true, displaylogo: false }}
                        style={{ width: "100%", height: "500px" }}
                        useResizeHandler
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="card-nebula h-full min-h-[500px] flex items-center justify-center">
                <CardContent className="text-center">
                  <Database className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Run a Query</p>
                  <p className="text-muted-foreground max-w-md">
                    Apply filters and run a query to explore the survey dataset. 
                    The sample includes 500 simulated objects with SDSS-like properties.
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
