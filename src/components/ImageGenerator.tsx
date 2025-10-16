import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Image as ImageIcon } from "lucide-react";

export const ImageGenerator = () => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
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
    setImageUrl("");
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setImageUrl(data.imageUrl);
      toast({
        title: "Success!",
        description: "Image generated successfully",
      });
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate image",
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
          <ImageIcon className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            Image Generation
          </h2>
          <p className="text-sm text-muted-foreground">Create stunning visuals from text descriptions</p>
        </div>
      </div>

      <div className="space-y-4">
        <Textarea
          placeholder="Describe the image you want to create... (e.g., 'A futuristic city at sunset with flying cars')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px] bg-card border-border focus:border-accent/50 transition-colors resize-none"
        />

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-opacity"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Image...
            </>
          ) : (
            'Generate Image'
          )}
        </Button>
      </div>

      {imageUrl && (
        <Card className="overflow-hidden border-accent/20 bg-card/50 backdrop-blur-sm">
          <img 
            src={imageUrl} 
            alt="Generated" 
            className="w-full h-auto rounded-lg"
          />
        </Card>
      )}
    </div>
  );
};
