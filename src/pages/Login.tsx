import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoading(false);
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8FBFE] to-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A7E1]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FBFE] to-white flex items-center">
      <div className="container max-w-md mx-auto px-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <img 
                src="/lovable-uploads/b1e1b9a8-4362-4605-a82c-a8e5dee97200.png" 
                alt="Agent ISA" 
                className="h-14 w-auto"
              />
            </div>
            <h2 className="text-2xl font-bold text-[#1A1F2C] mb-8 text-center tracking-tight">ISA/ONE</h2>
            <Auth 
              supabaseClient={supabase}
              view="sign_in"
              providers={[]}
              magicLink={false}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#00A7E1',
                      brandAccent: '#0095C8',
                      inputBackground: 'white',
                      inputText: '#1A1F2C',
                      inputBorder: '#E2E8F0',
                      inputBorderFocus: '#00A7E1',
                    },
                    borderWidths: {
                      buttonBorderWidth: '0px',
                      inputBorderWidth: '1px',
                    },
                    radii: {
                      borderRadiusButton: '0.75rem',
                      buttonBorderRadius: '0.75rem',
                      inputBorderRadius: '0.75rem',
                    },
                  },
                },
                className: {
                  container: 'w-full',
                  button: 'w-full px-4 py-3 rounded-xl font-medium shadow-sm transition-colors hover:opacity-90',
                  input: 'w-full px-4 py-3 rounded-xl border bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-[#00A7E1] focus:ring-opacity-50 transition-all duration-200 text-center placeholder:text-center',
                  label: 'sr-only',
                  anchor: 'text-[#00A7E1] hover:text-[#0095C8] transition-colors font-medium flex items-center justify-center gap-2 mt-4',
                  message: 'text-sm text-red-500 mt-1',
                },
              }}
              localization={{
                variables: {
                  sign_in: {
                    email_label: '',
                    password_label: '',
                    email_input_placeholder: 'Email',
                    password_input_placeholder: 'Password',
                    button_label: 'Sign in',
                    link_text: 'New user? Create an account',
                    forgotten_password_text: 'Forgot your password?',
                  },
                  sign_up: {
                    email_label: '',
                    password_label: '',
                    email_input_placeholder: 'Email',
                    password_input_placeholder: 'Password',
                    button_label: 'Sign up',
                    link_text: 'Already have an account? Sign in',
                  },
                  forgotten_password: {
                    email_label: '',
                    email_input_placeholder: 'Email',
                    button_label: 'Send reset instructions',
                    link_text: 'Back to sign in',
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;