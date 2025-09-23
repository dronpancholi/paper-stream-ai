import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertTriangle, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">404</h1>
            <div className="space-y-2">
              <p className="text-xl text-foreground">Page not found</p>
              <p className="text-sm text-muted-foreground">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-4">
              <Button variant="outline" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </Button>
              <Button asChild>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
