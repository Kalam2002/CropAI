"use client";

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { UploadCloud, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { predictCropDisease } from '@/ai/flows/predictions';
import type { PredictCropDiseaseOutput } from '@/ai/flows/predictions';

export default function DiseasePrediction() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [result, setResult] = useState<PredictCropDiseaseOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError("File is too large. Please upload an image under 4MB.");
        return;
      }
      setResult(null);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(URL.createObjectURL(file));
        setImageData(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imageData) {
      setError("Please upload an image first.");
      return;
    }

    startTransition(async () => {
      setError(null);
      setResult(null);

      try {
        const res = await predictCropDisease({ photoDataUri: imageData });
        setResult(res);
      } catch (e) {
        setError("An error occurred during analysis. Please try again.");
        console.error(e);
      }
    });
  };

  return (
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-4">
          <label htmlFor="crop-image" className="cursor-pointer">
            <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center hover:border-primary transition-colors h-64 flex flex-col justify-center items-center">
              {imagePreview ? (
                <Image src={imagePreview} alt="Crop preview" fill style={{ objectFit: 'contain' }} className="rounded-lg p-2" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <UploadCloud className="w-12 h-12" />
                  <span className="font-semibold">Click to upload or drag and drop</span>
                  <span className="text-sm">PNG, JPG, or WEBP (max. 4MB)</span>
                </div>
              )}
            </div>
          </label>
          <input id="crop-image" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
          <Button onClick={handleSubmit} disabled={isPending || !imageData} className="w-full">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Analyze Image
          </Button>
        </div>

        <div className="min-h-[20rem] flex items-center justify-center">
          {isPending && (
            <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
              <Loader2 className="w-16 h-16 animate-spin" />
              <p>Analyzing your crop...</p>
            </div>
          )}

          {error && (
             <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Card className="w-full animate-in fade-in-50">
              <CardHeader>
                <CardTitle className="text-2xl font-headline">{result.diseasePrediction}</CardTitle>
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-sm font-medium">Confidence:</span>
                  <Progress value={result.confidenceLevel * 100} className="w-full max-w-[200px]" />
                  <span className="text-sm font-bold">{(result.confidenceLevel * 100).toFixed(0)}%</span>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Suggested Actions:</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{result.suggestedActions}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </CardContent>
  );
}
