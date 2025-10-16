import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Code2 } from "lucide-react";

export const CodeGenerator = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [action, setAction] = useState("write");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-code', {
        body: { prompt, language, action }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setResult(data.code);
      toast({
        title: "Success!",
        description: "Code generated successfully",
      });
    } catch (error: any) {
      console.error('Error generating code:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm">
          <Code2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Code Generation
          </h2>
          <p className="text-sm text-muted-foreground">Write, debug, and explain code</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="bg-card border-border hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
            </SelectContent>
          </Select>

          <Select value={action} onValueChange={setAction}>
            <SelectTrigger className="bg-card border-border hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="write">Write Code</SelectItem>
              <SelectItem value="debug">Debug Code</SelectItem>
              <SelectItem value="explain">Explain Code</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Textarea
          placeholder="Enter your code request... (e.g., 'Create a function to sort an array')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px] bg-card border-border focus:border-primary/50 transition-colors resize-none font-mono"
        />

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Generate Code'
          )}
        </Button>
      </div>

      {result && (
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
          <h3 className="font-semibold mb-3 text-primary">Generated Code:</h3>
          <pre className="p-4 bg-background rounded-lg overflow-x-auto">
            <code className="text-sm text-foreground">{result}</code>
          </pre>
        </Card>
      )}
    </div>
  );
};
