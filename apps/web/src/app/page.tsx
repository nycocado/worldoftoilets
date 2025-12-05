import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">World of Toilets</h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-black mb-4">
            Bem-vindo ao{" "}
            <span className="text-primary">World of Toilets</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Projeto configurado com shadcn/ui e Tailwind CSS v4
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg">Primary Button</Button>
            <Button size="lg" variant="secondary">
              Secondary
            </Button>
            <Button size="lg" variant="outline">
              Outline
            </Button>
            <Button size="lg" variant="destructive">
              Destructive
            </Button>
          </div>
        </div>
      </section>

      {/* Components Demo */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold mb-8 text-center">
          Componentes shadcn/ui
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card Example 1 */}
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the content of the card component from shadcn/ui.</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Action</Button>
            </CardFooter>
          </Card>

          {/* Card Example 2 - Primary Colors */}
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-primary">Electric Blue</CardTitle>
              <CardDescription>
                Primary color from Design System
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                This card uses the primary color (#00A3FF) from the Design
                System.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Primary Action</Button>
            </CardFooter>
          </Card>

          {/* Card Example 3 - Secondary Colors */}
          <Card className="border-secondary">
            <CardHeader>
              <CardTitle className="text-secondary">Fresh Green</CardTitle>
              <CardDescription>
                Secondary color from Design System
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                This card uses the secondary color (#00D084) from the Design
                System.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full">
                Secondary Action
              </Button>
            </CardFooter>
          </Card>

          {/* Card with Form */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Form Example</CardTitle>
              <CardDescription>
                Input components from shadcn/ui
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Submit</Button>
            </CardFooter>
          </Card>

          {/* Color Palette Card */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Design System - Color Palette</CardTitle>
              <CardDescription>
                Colors from DESIGN_SYSTEM.md integrated with shadcn/ui
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-20 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    Primary
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Electric Blue
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-md bg-secondary flex items-center justify-center text-secondary-foreground font-semibold">
                    Secondary
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Fresh Green
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-md bg-accent flex items-center justify-center text-accent-foreground font-semibold">
                    Accent
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Golden Sun
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-md bg-destructive flex items-center justify-center text-destructive-foreground font-semibold">
                    Destructive
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Alert Red
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="font-bold text-lg">World of Toilets</p>
          <p className="text-muted-foreground">
            shadcn/ui + Tailwind CSS v4 + Next.js 16
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Pronto para desenvolvimento
          </p>
        </div>
      </footer>
    </div>
  );
}
