import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileText } from "lucide-react";

export const TextGenerator = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("essay");
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
      const { data, error } = await supabase.functions.invoke('generate-text', {
        body: { prompt, type }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setResult(data.text);
      toast({
        title: "Success!",
        description: "Text generated successfully",
      });
    } catch (error: any) {
      console.error('Error generating text:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate text",
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
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Text Generation
          </h2>
          <p className="text-sm text-muted-foreground">Create essays, stories, summaries, and more</p>
        </div>
      </div>

      <div className="space-y-4">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="bg-card border-border hover:border-primary/50 transition-colors">
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="essay">Essay</SelectItem>
            <SelectItem value="story">Story</SelectItem>
            <SelectItem value="lesson">Lesson Plan</SelectItem>
            <SelectItem value="research">Research Summary</SelectItem>
            <SelectItem value="marketing">Marketing Content</SelectItem>
          </SelectContent>
        </Select>

        <Textarea
          placeholder="Enter your prompt... (e.g., 'Write an essay about artificial intelligence')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px] bg-card border-border focus:border-primary/50 transition-colors resize-none"
        />

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Text'
          )}
        </Button>
      </div>

      {result && (
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
          <h3 className="font-semibold mb-3 text-primary">Generated Content:</h3>
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-foreground">{result}</p>
          </div>
        </Card>
      )}
    </div>
  );
};
