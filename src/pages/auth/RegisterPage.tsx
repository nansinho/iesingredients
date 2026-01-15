import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, ArrowLeft, Leaf, Check } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const passwordRequirements = [
    { label: '8 caractères minimum', met: formData.password.length >= 8 },
    { label: 'Une majuscule', met: /[A-Z]/.test(formData.password) },
    { label: 'Un chiffre', met: /[0-9]/.test(formData.password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (!passwordRequirements.every((req) => req.met)) {
      toast.error('Le mot de passe ne respecte pas les critères');
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.fullName,
      formData.company
    );

    if (error) {
      toast.error('Erreur lors de l\'inscription', {
        description: error.message,
      });
      setIsLoading(false);
      return;
    }

    toast.success('Inscription réussie !', {
      description: 'Vérifiez votre email pour confirmer votre compte.',
    });

    navigate('/login');
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
            Rejoignez-nous
          </h1>
          <p className="text-lg text-cream-300 max-w-md mb-8">
            Créez votre compte pour demander des échantillons et suivre vos commandes.
          </p>
          <div className="space-y-4">
            {[
              'Accès à plus de 5000 ingrédients',
              'Demandes d\'échantillons simplifiées',
              'Suivi de vos commandes',
              'Documentation technique',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gold-500/20 rounded-full flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-gold-400" />
                </div>
                <span className="text-cream-200">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12 overflow-y-auto">
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
            <h2 className="text-3xl font-serif text-white mb-2">Créer un compte</h2>
            <p className="text-cream-400 mb-8">
              Remplissez le formulaire pour vous inscrire
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-cream-200">
                  Nom complet *
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Jean Dupont"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="h-12 bg-forest-900/50 border-forest-800 text-white placeholder:text-cream-500 focus:border-gold-500 focus:ring-gold-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-cream-200">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-12 bg-forest-900/50 border-forest-800 text-white placeholder:text-cream-500 focus:border-gold-500 focus:ring-gold-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-cream-200">
                  Entreprise <span className="text-cream-500">(optionnel)</span>
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Votre entreprise"
                  value={formData.company}
                  onChange={handleChange}
                  className="h-12 bg-forest-900/50 border-forest-800 text-white placeholder:text-cream-500 focus:border-gold-500 focus:ring-gold-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-cream-200">
                  Mot de passe *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
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
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-sm ${
                        req.met ? 'text-green-400' : 'text-cream-500'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          req.met ? 'bg-green-500/20' : 'bg-forest-800'
                        }`}
                      >
                        {req.met && <Check className="h-2.5 w-2.5" />}
                      </div>
                      {req.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-cream-200">
                  Confirmer le mot de passe *
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="h-12 bg-forest-900/50 border-forest-800 text-white placeholder:text-cream-500 focus:border-gold-500 focus:ring-gold-500/20"
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-red-400">Les mots de passe ne correspondent pas</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gold-500 hover:bg-gold-400 text-forest-950 font-medium mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Création du compte...
                  </>
                ) : (
                  'Créer mon compte'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-cream-400">
                Déjà un compte ?{' '}
                <Link
                  to="/login"
                  className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
