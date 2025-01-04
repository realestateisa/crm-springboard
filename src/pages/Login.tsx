import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check current auth status
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F0FB]">
      <div className="w-full max-w-md px-4">
        <Card className="p-8 shadow-lg border-[#E5DEFF]">
          <div className="mb-8 text-center">
            <img
              src="/lovable-uploads/b1e1b9a8-4362-4605-a82c-a8e5dee97200.png"
              alt="Logo"
              className="mx-auto h-16 mb-6"
            />
            <h1 className="text-2xl font-bold text-[#1A1F2C] mb-2">Welcome Back</h1>
            <p className="text-[#8E9196]">Sign in to your account</p>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9b87f5',
                    brandAccent: '#7E69AB',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#F1F0FB',
                    defaultButtonBackgroundHover: '#E5DEFF',
                    inputBackground: 'white',
                    inputBorder: '#E5DEFF',
                    inputBorderHover: '#9b87f5',
                    inputBorderFocus: '#7E69AB',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '8px',
                    buttonBorderRadius: '8px',
                    inputBorderRadius: '8px',
                  },
                },
              },
              style: {
                button: {
                  height: '44px',
                  fontWeight: '500',
                },
                input: {
                  height: '44px',
                },
                label: {
                  color: '#403E43',
                  fontSize: '14px',
                  marginBottom: '4px',
                },
              },
            }}
            providers={[]}
          />
        </Card>
      </div>
    </div>
  );
}