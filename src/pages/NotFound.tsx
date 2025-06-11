import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Track 404 errors for analytics if needed
    // Could be replaced with proper error tracking service
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center min-h-screen pt-20"
      >
        <div className="text-center max-w-md mx-auto px-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-6xl font-bold mb-4 text-white">404</h1>
            <h2 className="text-2xl font-semibold mb-4 text-gray-300">Page Not Found</h2>
            <p className="text-lg text-gray-400 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Return to Home
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default NotFound;
