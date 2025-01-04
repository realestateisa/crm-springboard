import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/50 backdrop-blur-sm fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">ISA/ONE</h1>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost">Login</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Streamline Your ISA Operations
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              The all-in-one CRM solution designed specifically for Inside Sales Agents. 
              Manage leads, track performance, and grow your business efficiently.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg">Start Free Trial</Button>
              <Button variant="outline" size="lg">Learn More</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>Organize your ISA teams efficiently</CardDescription>
              </CardHeader>
              <CardContent>
                Create and manage pods, assign roles, and track team performance all in one place.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Tracking</CardTitle>
                <CardDescription>Monitor key metrics in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                Get insights into your team's performance with detailed analytics and reporting.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collaboration Tools</CardTitle>
                <CardDescription>Work together seamlessly</CardDescription>
              </CardHeader>
              <CardContent>
                Share information, communicate effectively, and stay aligned with your team.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">© 2024 ISA/ONE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;