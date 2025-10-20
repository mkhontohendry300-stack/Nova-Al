import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          }
        }
        if (finalTranscript) {
          setTranscription(prev => prev + finalTranscript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Error",
          description: "Speech recognition error: " + event.error,
          variant: "destructive",
        });
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser. Please use Chrome or Edge.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const startRecording = () => {
    if (!recognition) {
      toast({
        title: "Not Available",
        description: "Speech recognition is not available",
        variant: "destructive",
      });
      return;
    }

    setTranscription("");
    recognition.start();
    setIsRecording(true);
    toast({
      title: "Recording Started",
      description: "Speak now...",
    });
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Transcription complete",
      });
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-card/80 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Recording
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={startRecording}
            disabled={isRecording}
            variant={isRecording ? "secondary" : "default"}
            className="flex-1"
          >
            {isRecording ? (
              <>
                <Mic className="mr-2 h-4 w-4 animate-pulse" />
                Recording...
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </>
            )}
          </Button>
          <Button
            onClick={stopRecording}
            disabled={!isRecording}
            variant="destructive"
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>

        {transcription && (
          <div className="p-4 rounded-lg bg-secondary/50 border border-primary/10">
            <p className="text-sm font-medium mb-2">Transcription:</p>
            <p className="text-sm">{transcription}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceRecorder;
