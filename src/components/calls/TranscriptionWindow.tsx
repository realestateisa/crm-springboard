import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RealtimeClient } from '@speechmatics/real-time-client';

interface TranscriptionWindowProps {
  audioStream: MediaStream | null;
  isVisible: boolean;
}

export function TranscriptionWindow({ audioStream, isVisible }: TranscriptionWindowProps) {
  const [transcription, setTranscription] = useState<string>('');
  const [partialTranscription, setPartialTranscription] = useState<string>('');
  const [client, setClient] = useState<RealtimeClient | null>(null);

  useEffect(() => {
    if (!audioStream || !isVisible) return;

    const setupTranscription = async () => {
      try {
        // Initialize client
        const newClient = new RealtimeClient();
        setClient(newClient);

        // Fetch JWT token
        const response = await fetch('https://mp.speechmatics.com/v1/api_keys?type=rt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.SPEECHMATICS_API_KEY}`,
          },
          body: JSON.stringify({ ttl: 3600 }),
        });

        if (!response.ok) {
          throw new Error('Failed to get Speechmatics JWT');
        }

        const { key_value: jwt } = await response.json();

        // Set up event listeners
        newClient.addEventListener('receiveMessage', ({ data }) => {
          if (data.message === 'AddPartialTranscript') {
            const partialText = data.results
              .map((r: any) => r.alternatives?.[0].content)
              .join(' ');
            setPartialTranscription(partialText);
          } else if (data.message === 'AddTranscript') {
            const text = data.results
              .map((r: any) => r.alternatives?.[0].content)
              .join(' ');
            setTranscription(prev => prev + ' ' + text);
            setPartialTranscription('');
          }
        });

        // Start transcription
        await newClient.start(jwt, {
          transcription_config: {
            language: 'en',
            enable_partials: true,
          },
        });

        // Send audio data
        const mediaRecorder = new MediaRecorder(audioStream);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            newClient.sendAudio(event.data);
          }
        };
        mediaRecorder.start(100);
      } catch (error) {
        console.error('Transcription error:', error);
      }
    };

    setupTranscription();

    return () => {
      if (client) {
        client.stopRecognition();
      }
    };
  }, [audioStream, isVisible]);

  if (!isVisible) return null;

  return (
    <Card className="fixed right-4 bottom-24 w-96 h-96 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ScrollArea className="h-full">
        <div className="space-y-2">
          <div className="text-sm">{transcription}</div>
          {partialTranscription && (
            <div className="text-sm text-muted-foreground italic">
              {partialTranscription}
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}