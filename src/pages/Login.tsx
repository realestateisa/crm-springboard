import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FBFE] to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <img src="/lovable-uploads/1b7809ec-d09a-4273-ac3e-2cf10171414f.png" alt="Agent ISA" className="h-16" />
        </div>
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-[#2D3748] mb-6 text-center">Welcome Back</h2>
            <Auth 
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#00A7E1',
                      brandAccent: '#0095C8',
                    },
                  },
                },
                className: {
                  container: 'w-full',
                  button: 'w-full px-4 py-2 rounded-md',
                  input: 'w-full px-3 py-2 border rounded-md',
                },
              }}
              providers={[]}
              theme="light"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;