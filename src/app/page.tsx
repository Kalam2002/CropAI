import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, FileText, LifeBuoy } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 xl:py-48 deep-green-gradient text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Protect Your Crops with AI-Powered Disease Detection
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Upload your crop images and get instant disease detection results
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/predict">
                  <Button
                    size="lg"
                    className="bg-white text-green-700 hover:bg-gray-100"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4 text-center">
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Quick Detection</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                  Get instant results for crop disease detection using our advanced AI technology.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <FileText className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Detailed Reports</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                  Access comprehensive reports with treatment recommendations.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4 text-center">
                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <LifeBuoy className="h-8 w-8 text-primary" />
                 </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Expert Support</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                  Get guidance from agricultural experts for better crop management.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 KrishiMitra. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
