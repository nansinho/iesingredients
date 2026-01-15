import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { Language, useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Headphones, ExternalLink, Play, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PodcastPageProps {
  lang: Language;
}

export const PodcastPage = ({ lang }: PodcastPageProps) => {
  const t = useTranslation(lang);

  const podcasts = [
    {
      id: 1,
      title: "Francis Kurkdjian : danse avec les parfums",
      source: "France Culture",
      description: lang === 'fr' 
        ? "Découvrez le parcours extraordinaire du célèbre parfumeur Francis Kurkdjian dans cette série de podcasts signée France Culture. Une immersion dans l'art de la création olfactive."
        : "Discover the extraordinary journey of the famous perfumer Francis Kurkdjian in this podcast series from France Culture. An immersion into the art of olfactory creation.",
      url: "https://www.radiofrance.fr/franceculture/podcasts/serie-francis-kurkdjian-danse-avec-les-parfums",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80",
      featured: true,
    }
  ];

  return (
    <Layout lang={lang}>
      <SEOHead
        lang={lang}
        title={lang === 'fr' ? "Podcast À Fleur De Nez | IES Ingredients" : "À Fleur De Nez Podcast | IES Ingredients"}
        description={lang === 'fr' 
          ? "Explorez l'univers de la parfumerie à travers des interviews et des histoires captivantes. Découvrez nos podcasts recommandés sur les parfums et ingrédients."
          : "Explore the world of perfumery through captivating interviews and stories. Discover our recommended podcasts on perfumes and ingredients."}
      />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-forest-950 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Animated circles */}
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full border border-gold-500/20"
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute w-[400px] h-[400px] rounded-full border border-gold-500/30"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.2, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Icon */}
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-500/20 border border-gold-500/30 mb-4"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Headphones className="w-10 h-10 text-gold-400" />
            </motion.div>

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight">
              {t.podcast?.title || "Podcast À Fleur De Nez"}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              {t.podcast?.subtitle || (lang === 'fr' 
                ? "Explorez l'univers de la parfumerie à travers des interviews et des histoires captivantes"
                : "Explore the world of perfumery through captivating interviews and stories")}
            </p>
          </motion.div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Podcasts Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 text-gold-600 text-xs font-medium uppercase tracking-widest mb-4">
              {t.podcast?.featured || (lang === 'fr' ? 'À la une' : 'Featured')}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">
              {lang === 'fr' ? 'Podcasts recommandés' : 'Recommended Podcasts'}
            </h2>
          </motion.div>

          {/* Podcast Cards */}
          <div className="space-y-8">
            {podcasts.map((podcast, index) => (
              <motion.div
                key={podcast.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-xl bg-card hover:shadow-2xl transition-all duration-500 group">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-5 gap-0">
                      {/* Image */}
                      <div className="md:col-span-2 relative overflow-hidden">
                        <div className="aspect-[4/3] md:aspect-auto md:h-full">
                          <img
                            src={podcast.image}
                            alt={podcast.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          
                          {/* Play button overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 cursor-pointer"
                            >
                              <Play className="w-7 h-7 text-white ml-1" fill="white" />
                            </motion.div>
                          </div>

                          {/* Source badge */}
                          <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                              <Radio className="w-3.5 h-3.5" />
                              {podcast.source}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
                        <div className="space-y-4">
                          <h3 className="font-serif text-2xl md:text-3xl text-foreground leading-tight group-hover:text-gold-600 transition-colors">
                            {podcast.title}
                          </h3>
                          
                          <p className="text-muted-foreground leading-relaxed">
                            {podcast.description}
                          </p>

                          <div className="pt-4">
                            <a 
                              href={podcast.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Button className="group/btn bg-forest-900 hover:bg-forest-800 text-white rounded-full px-6">
                                <Headphones className="w-4 h-4 mr-2" />
                                {t.podcast?.listenOn || (lang === 'fr' ? 'Écouter sur' : 'Listen on')} {podcast.source}
                                <ExternalLink className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                              </Button>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Coming Soon Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <div className="inline-flex flex-col items-center p-8 rounded-2xl bg-muted/50 border border-border">
              <Headphones className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-serif text-xl text-foreground mb-2">
                {lang === 'fr' ? 'Plus de podcasts à venir' : 'More podcasts coming soon'}
              </h3>
              <p className="text-muted-foreground text-sm max-w-md">
                {lang === 'fr' 
                  ? "Nous sélectionnons les meilleurs podcasts sur la parfumerie, les ingrédients naturels et l'univers olfactif."
                  : "We are curating the best podcasts about perfumery, natural ingredients and the olfactory world."}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default PodcastPage;
