import { useState } from "react";
import { BookOpen, Search, MessageSquare, Send, Sparkles, FileText } from "lucide-react";
import { AppLayout, PageHeader, PageContent } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal: string;
  abstract: string;
  arxivId?: string;
  citations: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  papers?: Paper[];
}

// Mock astronomy papers
const mockPapers: Paper[] = [
  {
    id: "1",
    title: "The First Image of a Black Hole: Event Horizon Telescope Observations of M87*",
    authors: ["Event Horizon Telescope Collaboration"],
    year: 2019,
    journal: "The Astrophysical Journal Letters",
    abstract: "We present the first direct visual evidence of a supermassive black hole and its shadow. The image reveals a bright ring-like structure with a dark central region, consistent with the expected appearance of a Kerr black hole.",
    arxivId: "1906.11238",
    citations: 1250,
  },
  {
    id: "2",
    title: "LIGO Detection of Gravitational Waves from a Binary Black Hole Merger",
    authors: ["LIGO Scientific Collaboration", "Virgo Collaboration"],
    year: 2016,
    journal: "Physical Review Letters",
    abstract: "On September 14, 2015 at 09:50:45 UTC the two detectors of LIGO simultaneously observed a transient gravitational-wave signal. The signal matches the waveform predicted by general relativity for the inspiral and merger of two black holes.",
    arxivId: "1602.03837",
    citations: 3500,
  },
  {
    id: "3",
    title: "A Fast Radio Burst Localized to a Massive Galaxy",
    authors: ["Bannister, K.W.", "Deller, A.T.", "Phillips, C."],
    year: 2019,
    journal: "Science",
    abstract: "We present the interferometric localization of the single-pulse fast radio burst FRB 180924 to a position 4 kiloparsecs from the center of a luminous galaxy at redshift 0.32.",
    arxivId: "1906.11476",
    citations: 450,
  },
  {
    id: "4",
    title: "Observation of Interstellar Object 1I/2017 U1 'Oumuamua",
    authors: ["Meech, K.J.", "Weryk, R.", "Micheli, M."],
    year: 2017,
    journal: "Nature",
    abstract: "We report observations of the first known interstellar object passing through the Solar System. The object showed non-gravitational acceleration and an extreme aspect ratio unlike any asteroid or comet observed in our Solar System.",
    arxivId: "1711.05687",
    citations: 800,
  },
  {
    id: "5",
    title: "Discovery of a Potentially Habitable Exoplanet Orbiting Proxima Centauri",
    authors: ["Anglada-Escudé, G.", "Amado, P.J.", "Barnes, J."],
    year: 2016,
    journal: "Nature",
    abstract: "We report the detection of a planet orbiting Proxima Centauri at a distance of 0.05 AU with an orbital period of 11.2 days. The planet has a minimum mass of 1.27 Earth masses and lies within the habitable zone.",
    arxivId: "1609.03449",
    citations: 1100,
  },
];

function searchPapers(query: string): Paper[] {
  const lowerQuery = query.toLowerCase();
  return mockPapers.filter(
    paper =>
      paper.title.toLowerCase().includes(lowerQuery) ||
      paper.abstract.toLowerCase().includes(lowerQuery) ||
      paper.authors.some(a => a.toLowerCase().includes(lowerQuery))
  );
}

// Simple AI response generation (mock)
function generateResponse(question: string, papers: Paper[]): string {
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes("black hole")) {
    return `Based on the research literature, black holes are regions of spacetime where gravity is so strong that nothing can escape. The Event Horizon Telescope collaboration made history in 2019 by capturing the first direct image of a supermassive black hole at the center of galaxy M87. The image showed a bright ring of hot gas surrounding a dark "shadow" - the event horizon.\n\nKey findings include:\n• The black hole has a mass of about 6.5 billion solar masses\n• The observed ring diameter matches predictions from general relativity\n• This provides the strongest evidence yet for the existence of black holes`;
  }
  
  if (lowerQ.includes("gravitational wave") || lowerQ.includes("ligo")) {
    return `Gravitational waves are ripples in spacetime caused by accelerating massive objects. LIGO made the first direct detection on September 14, 2015, observing the merger of two black holes about 1.3 billion light-years away.\n\nThis discovery:\n• Confirmed a major prediction of Einstein's general relativity\n• Opened a new window for observing the universe\n• Won the 2017 Nobel Prize in Physics\n\nThe detected waves showed the characteristic "chirp" signal as the black holes spiraled together and merged.`;
  }
  
  if (lowerQ.includes("exoplanet") || lowerQ.includes("proxima")) {
    return `The search for exoplanets has revealed thousands of worlds beyond our solar system. One of the most exciting discoveries is Proxima Centauri b, a potentially habitable planet orbiting our nearest stellar neighbor.\n\nKey characteristics:\n• Orbital period: 11.2 days\n• Minimum mass: 1.27 Earth masses\n• Located in the habitable zone where liquid water could exist\n• Distance from Earth: 4.2 light-years\n\nWhile the planet receives similar amounts of energy as Earth, it likely experiences significant stellar activity from its host star.`;
  }
  
  if (papers.length > 0) {
    return `I found ${papers.length} relevant paper${papers.length > 1 ? "s" : ""} on this topic. Based on the literature:\n\n${papers.slice(0, 2).map(p => `• "${p.title}" (${p.year}) - ${p.abstract.slice(0, 150)}...`).join("\n\n")}\n\nWould you like me to elaborate on any specific aspect of these findings?`;
  }
  
  return "I'd be happy to help you explore astronomy topics. You can ask me about black holes, gravitational waves, exoplanets, fast radio bursts, or search for specific research papers. What would you like to know?";
}

export default function ResearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI research assistant for astronomy. I can help you find papers, explain concepts, and answer questions about astrophysics. What would you like to explore today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handlePaperSearch = () => {
    if (!searchQuery.trim()) return;
    const results = searchPapers(searchQuery);
    setPapers(results);
    toast.success(`Found ${results.length} papers`);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage: ChatMessage = { role: "user", content: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const relevantPapers = searchPapers(chatInput);
    const response = generateResponse(chatInput, relevantPapers);
    
    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: response,
      papers: relevantPapers.length > 0 ? relevantPapers.slice(0, 3) : undefined,
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  return (
    <AppLayout>
      <PageHeader
        title="Research Assistant"
        description="AI-powered astronomy Q&A and paper discovery"
        icon={<BookOpen className="h-6 w-6 text-white" />}
      />
      
      <PageContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Paper Search Panel */}
          <div className="space-y-4">
            <Card className="card-nebula">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Paper Search
                </CardTitle>
                <CardDescription>Search astronomy literature</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search papers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handlePaperSearch()}
                    className="bg-background"
                  />
                  <Button onClick={handlePaperSearch} size="icon" variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {["black hole", "exoplanet", "gravitational waves"].map(term => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(term);
                        const results = searchPapers(term);
                        setPapers(results);
                      }}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <ScrollArea className="h-[calc(100%-180px)]">
              <div className="space-y-3">
                {papers.map(paper => (
                  <Card key={paper.id} className="bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer">
                    <CardContent className="p-4 space-y-2">
                      <h4 className="font-medium text-sm leading-tight">{paper.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {paper.authors.slice(0, 2).join(", ")}
                        {paper.authors.length > 2 && " et al."}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {paper.year}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-quasar border-quasar/30">
                          {paper.citations} citations
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {papers.length === 0 && searchQuery && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No papers found for "{searchQuery}"
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2 flex flex-col">
            <Card className="card-nebula flex-1 flex flex-col">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Ask Research Questions
                </CardTitle>
              </CardHeader>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message, i) => (
                    <div
                      key={i}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-xs font-medium text-primary">AI Assistant</span>
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        
                        {message.papers && message.papers.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border space-y-2">
                            <p className="text-xs font-medium flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              Related Papers
                            </p>
                            {message.papers.map(paper => (
                              <div key={paper.id} className="text-xs bg-background/50 rounded p-2">
                                <p className="font-medium">{paper.title}</p>
                                <p className="text-muted-foreground">{paper.year} • {paper.journal}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                          <span className="text-sm text-muted-foreground">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask about astronomy, astrophysics, or specific research topics..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="min-h-[60px] bg-background resize-none"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    className="btn-cosmic self-end"
                    disabled={!chatInput.trim() || isTyping}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </Card>
          </div>
        </div>
      </PageContent>
    </AppLayout>
  );
}
