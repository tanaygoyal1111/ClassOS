import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export const useSpeechRecognition = (onResult: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        
        // 1. Enable Continuous Listening
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          // Since continuous is true, event.results accumulates all phrases.
          // We only want the latest phrase that was just spoken to avoid duplication.
          const lastResultIndex = event.results.length - 1;
          const transcript = event.results[lastResultIndex][0].transcript.trim();
          if (transcript) {
            onResult(transcript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          // 2. Graceful Error Handling
          if (event.error === 'aborted' || event.error === 'no-speech') {
            // These are benign during manual stops or silent pauses
            return;
          }
          
          if (event.error === 'not-allowed') {
            toast.error("Microphone access denied. Please check your browser permissions.");
          } else {
            toast.error(`Speech recognition error: ${event.error}`);
          }
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    // 3. Clean Cleanup logic to prevent memory leaks / floating indicators
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch(e) {}
      }
    };
  }, [onResult]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        toast.error("Could not start speech recognition.");
      }
    }
  }, [isListening]);

  return { isListening, toggleListening };
};
