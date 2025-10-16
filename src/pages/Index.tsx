import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextGenerator } from "@/components/TextGenerator";
import { ImageGenerator } from "@/components/ImageGenerator";
import { CodeGenerator } from "@/components/CodeGenerator";
import { DocumentAnalyzer } from "@/components/DocumentAnalyzer";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 animate-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm shadow-glow">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
            AI Studio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your all-in-one AI workspace for generating text, images, code, and analyzing documents
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-card/50 backdrop-blur-sm border border-border">
              <TabsTrigger 
                value="text"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
              >
                Text
              </TabsTrigger>
              <TabsTrigger 
                value="image"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-primary data-[state=active]:text-white"
              >
                Image
              </TabsTrigger>
              <TabsTrigger 
                value="code"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white"
              >
                Code
              </TabsTrigger>
              <TabsTrigger 
                value="document"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-primary data-[state=active]:text-white"
              >
                Document
              </TabsTrigger>
            </TabsList>

            <div className="bg-card/30 backdrop-blur-xl rounded-2xl p-8 border border-border shadow-card">
              <TabsContent value="text" className="mt-0">
                <TextGenerator />
              </TabsContent>

              <TabsContent value="image" className="mt-0">
                <ImageGenerator />
              </TabsContent>

              <TabsContent value="code" className="mt-0">
                <CodeGenerator />
              </TabsContent>

              <TabsContent value="document" className="mt-0">
                <DocumentAnalyzer />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
