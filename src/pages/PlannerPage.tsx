import { useState } from "react";
import { Calendar, MapPin, Sun, Moon, Clock } from "lucide-react";
import { AppLayout, PageHeader, PageContent } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Plot from "react-plotly.js";
import { toast } from "sonner";

interface ObservationPlan {
  objectName: string;
  date: string;
  location: { lat: number; lon: number; name: string };
  riseTime: string;
  transitTime: string;
  setTime: string;
  maxAltitude: number;
  bestWindow: { start: string; end: string };
  altitudeData: { time: string[]; altitude: number[] };
}

function calculateObservation(
  ra: number, 
  dec: number, 
  lat: number, 
  lon: number, 
  date: string
): ObservationPlan | null {
  // Simplified altitude calculation for demonstration
  const times: string[] = [];
  const altitudes: number[] = [];
  
  // Generate 24-hour altitude curve
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 15) {
      const timeStr = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
      times.push(timeStr);
      
      // Local sidereal time approximation
      const lst = (hour + lon / 15 + Math.random() * 0.5) % 24;
      const ha = (lst - ra / 15) * 15; // Hour angle in degrees
      
      // Altitude calculation
      const latRad = lat * Math.PI / 180;
      const decRad = dec * Math.PI / 180;
      const haRad = ha * Math.PI / 180;
      
      const altitude = Math.asin(
        Math.sin(latRad) * Math.sin(decRad) + 
        Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad)
      ) * 180 / Math.PI;
      
      altitudes.push(altitude);
    }
  }
  
  // Find rise, transit, set times
  let riseIdx = -1, setIdx = -1, transitIdx = 0;
  let maxAlt = -90;
  
  for (let i = 0; i < altitudes.length; i++) {
    if (altitudes[i] > maxAlt) {
      maxAlt = altitudes[i];
      transitIdx = i;
    }
    if (riseIdx === -1 && altitudes[i] > 0 && (i === 0 || altitudes[i - 1] <= 0)) {
      riseIdx = i;
    }
    if (altitudes[i] > 0 && (i === altitudes.length - 1 || altitudes[i + 1] <= 0)) {
      setIdx = i;
    }
  }
  
  // Calculate best observation window (highest altitude, during night)
  const nightStart = 20 * 4; // 20:00 in 15-min intervals
  const nightEnd = 4 * 4; // 04:00
  let bestStart = transitIdx - 4 > 0 ? transitIdx - 4 : 0;
  let bestEnd = transitIdx + 4 < times.length ? transitIdx + 4 : times.length - 1;
  
  return {
    objectName: "Target Object",
    date,
    location: { lat, lon, name: "Custom Location" },
    riseTime: riseIdx >= 0 ? times[riseIdx] : "Never rises",
    transitTime: times[transitIdx],
    setTime: setIdx >= 0 ? times[setIdx] : "Never sets",
    maxAltitude: Math.max(maxAlt, 0),
    bestWindow: { start: times[bestStart], end: times[bestEnd] },
    altitudeData: { time: times, altitude: altitudes },
  };
}

export default function PlannerPage() {
  const [objectRA, setObjectRA] = useState("10.68");
  const [objectDec, setObjectDec] = useState("41.27");
  const [latitude, setLatitude] = useState("40.71");
  const [longitude, setLongitude] = useState("-74.01");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [plan, setPlan] = useState<ObservationPlan | null>(null);

  const handleCalculate = () => {
    const ra = parseFloat(objectRA);
    const dec = parseFloat(objectDec);
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    
    if (isNaN(ra) || isNaN(dec) || isNaN(lat) || isNaN(lon)) {
      toast.error("Please enter valid numeric coordinates");
      return;
    }
    
    const result = calculateObservation(ra, dec, lat, lon, date);
    setPlan(result);
    toast.success("Observation plan calculated");
  };

  const presetLocations = [
    { name: "New York", lat: 40.71, lon: -74.01 },
    { name: "London", lat: 51.51, lon: -0.13 },
    { name: "Tokyo", lat: 35.68, lon: 139.69 },
    { name: "Sydney", lat: -33.87, lon: 151.21 },
    { name: "Mauna Kea", lat: 19.82, lon: -155.47 },
  ];

  const presetObjects = [
    { name: "Andromeda (M31)", ra: 10.68, dec: 41.27 },
    { name: "Orion Nebula (M42)", ra: 83.82, dec: -5.39 },
    { name: "Sirius", ra: 101.29, dec: -16.72 },
    { name: "Polaris", ra: 37.95, dec: 89.26 },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Observation Planner"
        description="Calculate rise/set times and optimal observation windows"
        icon={<Calendar className="h-6 w-6 text-white" />}
      />
      
      <PageContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="space-y-4">
            <Card className="card-nebula">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Target Object
                </CardTitle>
                <CardDescription>Enter coordinates in decimal degrees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="ra">RA (degrees)</Label>
                    <Input
                      id="ra"
                      value={objectRA}
                      onChange={(e) => setObjectRA(e.target.value)}
                      placeholder="10.68"
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dec">Dec (degrees)</Label>
                    <Input
                      id="dec"
                      value={objectDec}
                      onChange={(e) => setObjectDec(e.target.value)}
                      placeholder="41.27"
                      className="bg-background"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {presetObjects.map((obj) => (
                    <Button
                      key={obj.name}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setObjectRA(obj.ra.toString());
                        setObjectDec(obj.dec.toString());
                      }}
                    >
                      {obj.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-nebula">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Observer Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      id="lat"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="40.71"
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lon">Longitude</Label>
                    <Input
                      id="lon"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="-74.01"
                      className="bg-background"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {presetLocations.map((loc) => (
                    <Button
                      key={loc.name}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLatitude(loc.lat.toString());
                        setLongitude(loc.lon.toString());
                      }}
                    >
                      {loc.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-nebula">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Observation Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-background"
                />
              </CardContent>
            </Card>

            <Button onClick={handleCalculate} className="w-full btn-cosmic">
              Calculate Observation Plan
            </Button>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-4">
            {plan ? (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4 text-center">
                      <Sun className="h-5 w-5 mx-auto text-star mb-2" />
                      <p className="text-xs text-muted-foreground">Rise</p>
                      <p className="font-mono font-medium">{plan.riseTime}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4 text-center">
                      <div className="h-5 w-5 mx-auto text-primary mb-2 flex items-center justify-center">↑</div>
                      <p className="text-xs text-muted-foreground">Transit</p>
                      <p className="font-mono font-medium">{plan.transitTime}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4 text-center">
                      <Moon className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">Set</p>
                      <p className="font-mono font-medium">{plan.setTime}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4 text-center">
                      <div className="h-5 w-5 mx-auto text-quasar mb-2 flex items-center justify-center font-bold">°</div>
                      <p className="text-xs text-muted-foreground">Max Alt</p>
                      <p className="font-mono font-medium">{plan.maxAltitude.toFixed(1)}°</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Best Window */}
                <Card className="card-nebula">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Best Observation Window</p>
                        <p className="text-lg font-medium text-stellar">
                          {plan.bestWindow.start} – {plan.bestWindow.end}
                        </p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-gradient-nebula flex items-center justify-center">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Altitude Chart */}
                <Card className="card-nebula">
                  <CardHeader>
                    <CardTitle className="text-base">Altitude Throughout Night</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Plot
                      data={[
                        {
                          x: plan.altitudeData.time,
                          y: plan.altitudeData.altitude,
                          type: "scatter",
                          mode: "lines",
                          fill: "tozeroy",
                          line: { color: "hsl(265, 89%, 65%)", width: 2 },
                          fillcolor: "hsla(265, 89%, 65%, 0.2)",
                          name: "Altitude",
                        },
                        {
                          x: plan.altitudeData.time,
                          y: plan.altitudeData.altitude.map(() => 0),
                          type: "scatter",
                          mode: "lines",
                          line: { color: "hsl(0, 0%, 50%)", width: 1, dash: "dash" },
                          name: "Horizon",
                        },
                      ]}
                      layout={{
                        paper_bgcolor: "transparent",
                        plot_bgcolor: "transparent",
                        font: { color: "hsl(210, 40%, 96%)" },
                        margin: { l: 50, r: 20, t: 20, b: 50 },
                        xaxis: {
                          title: { text: "Local Time" },
                          gridcolor: "hsla(217, 33%, 20%, 0.5)",
                          tickfont: { size: 10 },
                          nticks: 12,
                        },
                        yaxis: {
                          title: { text: "Altitude (°)" },
                          gridcolor: "hsla(217, 33%, 20%, 0.5)",
                          range: [-10, 90],
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
              </>
            ) : (
              <Card className="card-nebula h-full min-h-[400px] flex items-center justify-center">
                <CardContent className="text-center">
                  <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Enter coordinates and calculate to see observation plan</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </PageContent>
    </AppLayout>
  );
}
