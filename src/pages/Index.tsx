import { Telescope, ArrowRight, Activity, Waves, Zap, Search, Calendar, Database, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Catalog Explorer",
    description: "Search SIMBAD, NED, and SDSS catalogs for astronomical objects",
    icon: Search,
    href: "/catalog",
    color: "text-quasar",
  },
  {
    title: "Observation Planner",
    description: "Calculate rise/set times and optimal observation windows",
    icon: Calendar,
    href: "/planner",
    color: "text-star",
  },
  {
    title: "Light Curve Lab",
    description: "Analyze photometry data, detect periods, and classify variability",
    icon: Activity,
    href: "/lightcurve",
    color: "text-nebula",
  },
  {
    title: "Spectroscopy Studio",
    description: "Spectral analysis, line detection, and redshift estimation",
    icon: Waves,
    href: "/spectroscopy",
    color: "text-galaxy",
  },
  {
    title: "Transient Watch",
    description: "Detect anomalies and transient events in time-series data",
    icon: Zap,
    href: "/transients",
    color: "text-supernova",
  },
  {
    title: "Research Assistant",
    description: "AI-powered Q&A and astronomy paper discovery",
    icon: BookOpen,
    href: "/research",
    color: "text-primary",
  },
  {
    title: "Survey Miner",
    description: "Query and analyze large astronomical survey datasets",
    icon: Database,
    href: "/survey",
    color: "text-accent",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background bg-starfield">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-cosmos" />
        <div className="relative z-10 container mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-nebula shadow-2xl shadow-primary/30 animate-float">
                <Telescope className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-stellar">Astronomy</span>
              <br />
              <span className="text-foreground">Data Navigator</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              An AI-powered research platform for astronomers. Search catalogs, analyze light curves, 
              study spectra, detect transients, and explore the universe with intelligent tools.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/catalog">
                <Button size="lg" className="btn-cosmic text-lg px-8">
                  Start Exploring
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/research">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Ask AI Assistant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Tools for <span className="text-stellar">Astronomical Research</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link key={feature.href} to={feature.href}>
              <Card className="card-nebula h-full transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-muted ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="bg-muted/50 border-0">
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold text-stellar">8+</p>
              <p className="text-muted-foreground">Analysis Tools</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/50 border-0">
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold text-stellar">3</p>
              <p className="text-muted-foreground">Catalog Sources</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/50 border-0">
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold text-stellar">500+</p>
              <p className="text-muted-foreground">Survey Objects</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/50 border-0">
            <CardContent className="pt-6 text-center">
              <p className="text-4xl font-bold text-stellar">AI</p>
              <p className="text-muted-foreground">Powered Research</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-nebula">
                <Telescope className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">Astronomy Data Navigator</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with ♥ for astronomers. Explore the cosmos.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
