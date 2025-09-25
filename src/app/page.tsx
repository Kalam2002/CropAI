import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Leaf, Sprout, FlaskConical, MapPin } from 'lucide-react';
import DiseasePrediction from '@/components/disease-prediction';
import YieldPrediction from '@/components/yield-prediction';
import FeasibilityAnalysis from '@/components/feasibility-analysis';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="ml-2 text-xl font-bold font-headline">AgriPredict</span>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <Tabs defaultValue="disease" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto">
              <TabsTrigger value="disease" className="py-2">
                <FlaskConical className="mr-2 h-4 w-4" />
                Disease Prediction
              </TabsTrigger>
              <TabsTrigger value="yield" className="py-2">
                <Sprout className="mr-2 h-4 w-4" />
                Yield Prediction
              </TabsTrigger>
              <TabsTrigger value="feasibility" className="py-2">
                <MapPin className="mr-2 h-4 w-4" />
                Feasibility Analysis
              </TabsTrigger>
            </TabsList>
            <TabsContent value="disease" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Crop Disease Prediction</CardTitle>
                  <CardDescription>Upload an image of a crop to detect potential diseases.</CardDescription>
                </CardHeader>
                <DiseasePrediction />
              </Card>
            </TabsContent>
            <TabsContent value="yield" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Crop Yield Prediction</CardTitle>
                  <CardDescription>Estimate crop yield based on type, region, and historical data.</CardDescription>
                </CardHeader>
                <YieldPrediction />
              </Card>
            </TabsContent>
            <TabsContent value="feasibility" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Crop Feasibility Analysis</CardTitle>
                  <CardDescription>Determine if a crop is feasible to grow in a specific area.</CardDescription>
                </CardHeader>
                <FeasibilityAnalysis />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
