import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, MessageSquare } from "lucide-react";

export const DocumentAnalyzer = () => {
  const { toast } = useToast();
  const [documentText, setDocumentText] = useState("");
  const [question, setQuestion] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setDocumentText(text);
      toast({
        title: "File uploaded",
        description: "Document text extracted successfully",
      });
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!documentText.trim()) {
      toast({
        title: "Document required",
        description: "Please upload a document first",
        variant: "destructive",
      });
      return;
    }

    if (!question.trim()) {
      toast({
        title: "Question required",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: { documentText, question }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setAnalysis(data.analysis);
      toast({
        title: "Success!",
        description: "Document analyzed successfully",
      });
    } catch (error: any) {
      console.error('Error analyzing document:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze document",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 backdrop-blur-sm">
          <MessageSquare className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            Document Analysis
          </h2>
          <p className="text-sm text-muted-foreground">Upload and ask questions about your documents</p>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-dashed border-2 border-accent/30 hover:border-accent/50 transition-colors">
          <label className="flex flex-col items-center gap-3 cursor-pointer">
            <Upload className="h-10 w-10 text-accent" />
            <span className="text-sm text-muted-foreground">
              Click to upload a text document (.txt)
            </span>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </Card>

        {documentText && (
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-accent/20">
            <p className="text-sm text-muted-foreground mb-2">Document Preview:</p>
            <div className="max-h-32 overflow-y-auto">
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {documentText.substring(0, 500)}...
              </p>
            </div>
          </Card>
        )}

        <Textarea
          placeholder="Ask a question about your document..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[100px] bg-card border-border focus:border-accent/50 transition-colors resize-none"
        />

        <Button
          onClick={handleAnalyze}
          disabled={loading || !documentText}
          className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-opacity"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Document'
          )}
        </Button>
      </div>

      {analysis && (
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-accent/20">
          <h3 className="font-semibold mb-3 text-accent">Analysis Result:</h3>
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-foreground">{analysis}</p>
          </div>
        </Card>
      )}
    </div>
  );
};
