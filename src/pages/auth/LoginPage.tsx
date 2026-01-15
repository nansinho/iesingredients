import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, ArrowLeft, Leaf } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/fr';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast.error('Erreur de connexion', {
        description: error.message === 'Invalid login credentials'
          ? 'Email ou mot de passe incorrect'
          : error.message,
      });
      setIsLoading(false);
      return;
    }

    toast.success('Connexion réussie', {
      description: 'Bienvenue !',
    });

    // Small delay to let auth state update
    setTimeout(() => {
      navigate(from, { replace: true });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-forest-950 flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 to-forest-950" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center p-12">
          <Link to="/fr" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center">
              <Leaf className="h-6 w-6 text-forest-950" />
            </div>
            <span className="text-2xl font-serif text-white">IES Ingredients</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Bienvenue
          </h1>
          <p className="text-lg text-cream-300 max-w-md">
            Connectez-vous pour accéder à votre espace personnel et gérer vos demandes d'échantillons.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link to="/fr" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold-500 rounded-xl flex items-center justify-center">
                <Leaf className="h-5 w-5 text-forest-950" />
              </div>
              <span className="text-xl font-serif text-white">IES Ingredients</span>
            </Link>
          </div>

          <Link
            to="/fr"
            className="inline-flex items-center gap-2 text-cream-400 hover:text-gold-400 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au site
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-serif text-white mb-2">Connexion</h2>
            <p className="text-cream-400 mb-8">
              Entrez vos identifiants pour vous connecter
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cream-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-forest-900/50 border-forest-800 text-white placeholder:text-cream-500 focus:border-gold-500 focus:ring-gold-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-cream-200">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 bg-forest-900/50 border-forest-800 text-white placeholder:text-cream-500 focus:border-gold-500 focus:ring-gold-500/20 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-500 hover:text-cream-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gold-500 hover:bg-gold-400 text-forest-950 font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-cream-400">
                Pas encore de compte ?{' '}
                <Link
                  to="/register"
                  className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
