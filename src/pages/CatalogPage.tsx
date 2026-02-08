import { useState } from "react";
import { Search, Star, MapPin, ExternalLink, Bookmark } from "lucide-react";
import { AppLayout, PageHeader, PageContent } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchCatalog, mockCatalogObjects, type AstronomicalObject } from "@/data/catalog";
import { toast } from "sonner";

const typeColors: Record<AstronomicalObject["type"], string> = {
  star: "bg-star/20 text-star border-star/30",
  galaxy: "bg-galaxy/20 text-galaxy border-galaxy/30",
  nebula: "bg-nebula/20 text-nebula border-nebula/30",
  quasar: "bg-quasar/20 text-quasar border-quasar/30",
  cluster: "bg-primary/20 text-primary border-primary/30",
  planet: "bg-supernova/20 text-supernova border-supernova/30",
  asteroid: "bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30",
  comet: "bg-accent/20 text-accent border-accent/30",
};

function ObjectCard({ object, onSelect }: { object: AstronomicalObject; onSelect: (obj: AstronomicalObject) => void }) {
  return (
    <Card 
      className="card-nebula cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10"
      onClick={() => onSelect(object)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{object.name}</CardTitle>
            <CardDescription className="font-mono text-xs">
              {object.alternateNames.slice(0, 2).join(" • ")}
            </CardDescription>
          </div>
          <Badge variant="outline" className={typeColors[object.type]}>
            {object.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{object.constellation}</span>
          </div>
          {object.magnitude !== null && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="h-3 w-3" />
              <span>Mag {object.magnitude.toFixed(2)}</span>
            </div>
          )}
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          RA: {object.coordinates.ra} | Dec: {object.coordinates.dec}
        </div>
      </CardContent>
    </Card>
  );
}

function ObjectDetail({ object }: { object: AstronomicalObject }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stellar">{object.name}</h2>
          <p className="text-muted-foreground">{object.alternateNames.join(" • ")}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast.success("Object saved to your collection")}
          >
            <Bookmark className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(`https://simbad.u-strasbg.fr/simbad/sim-basic?Ident=${encodeURIComponent(object.name)}`, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            SIMBAD
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Type</p>
            <p className="font-medium capitalize">{object.type}</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Constellation</p>
            <p className="font-medium">{object.constellation}</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Magnitude</p>
            <p className="font-medium">{object.magnitude?.toFixed(2) ?? "N/A"}</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Distance</p>
            <p className="font-medium">{object.distance ?? "Unknown"}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="card-nebula">
        <CardHeader>
          <CardTitle className="text-base">Coordinates</CardTitle>
        </CardHeader>
        <CardContent className="font-mono text-sm space-y-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground">Right Ascension:</span>
              <span className="ml-2">{object.coordinates.ra}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Declination:</span>
              <span className="ml-2">{object.coordinates.dec}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>Decimal: {object.coordinates.raDecimal.toFixed(4)}°</div>
            <div>Decimal: {object.coordinates.decDecimal.toFixed(4)}°</div>
          </div>
        </CardContent>
      </Card>

      {(object.redshift !== null || object.spectralType) && (
        <Card className="card-nebula">
          <CardHeader>
            <CardTitle className="text-base">Physical Properties</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {object.redshift !== null && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Redshift</p>
                <p className="font-mono">{object.redshift.toFixed(6)}</p>
              </div>
            )}
            {object.spectralType && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Spectral Type</p>
                <p className="font-mono">{object.spectralType}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="card-nebula">
        <CardHeader>
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{object.description}</p>
          {object.discoveredBy && (
            <p className="mt-3 text-sm text-muted-foreground">
              Discovered by <span className="text-foreground">{object.discoveredBy}</span>
              {object.discoveryYear && <span> in {object.discoveryYear}</span>}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AstronomicalObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<AstronomicalObject | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }
    const results = searchCatalog(searchQuery);
    setSearchResults(results);
    setHasSearched(true);
    setSelectedObject(null);
    
    if (results.length === 0) {
      toast.info("No objects found. Try a different search term.");
    } else {
      toast.success(`Found ${results.length} object${results.length > 1 ? "s" : ""}`);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Catalog Explorer"
        description="Search astronomical objects from SIMBAD, NED, and SDSS catalogs"
        icon={<Search className="h-6 w-6 text-white" />}
      />
      
      <PageContent>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name (M31, NGC 1300, Sirius) or type..."
                className="pl-10 bg-card border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} className="btn-cosmic">
              Search
            </Button>
          </div>

          {/* Results or Initial View */}
          {selectedObject ? (
            <div>
              <Button 
                variant="ghost" 
                className="mb-4"
                onClick={() => setSelectedObject(null)}
              >
                ← Back to results
              </Button>
              <ObjectDetail object={selectedObject} />
            </div>
          ) : (
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="search">Search Results</TabsTrigger>
                <TabsTrigger value="featured">Featured Objects</TabsTrigger>
              </TabsList>
              
              <TabsContent value="search" className="mt-4">
                {hasSearched ? (
                  searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.map((obj) => (
                        <ObjectCard key={obj.id} object={obj} onSelect={setSelectedObject} />
                      ))}
                    </div>
                  ) : (
                    <Card className="card-nebula">
                      <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">No objects found matching "{searchQuery}"</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Try searching for M31, NGC 1300, Sirius, or browse featured objects
                        </p>
                      </CardContent>
                    </Card>
                  )
                ) : (
                  <Card className="card-nebula">
                    <CardContent className="py-12 text-center">
                      <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Enter a search query to find astronomical objects</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Search by object name, catalog ID, constellation, or type
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="featured" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockCatalogObjects.map((obj) => (
                    <ObjectCard key={obj.id} object={obj} onSelect={setSelectedObject} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </PageContent>
    </AppLayout>
  );
}
