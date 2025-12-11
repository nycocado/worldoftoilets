'use client';

import React from 'react';
import { Navigation, Star, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Features = () => {
  const features = [
    {
      icon: Navigation,
      color: 'text-primary',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      title: 'Navegação Inteligente',
      desc: 'Algoritmo A* integrado para calcular a rota mais rápida a pé até ao WC mais próximo.',
    },
    {
      icon: Star,
      color: 'text-accent',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      title: 'Avaliações Reais',
      desc: 'Saiba se há papel, se está limpo e se é acessível antes de ir, com base em feedback da comunidade.',
    },
    {
      icon: ShieldAlert,
      color: 'text-destructive',
      bg: 'bg-red-50 dark:bg-red-900/20',
      title: 'Reporte Instantâneo',
      desc: 'Encontrou um problema? Denuncie locais sujos ou perigosos e ajude outros utilizadores.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-4">
            Tudo o que precisa para a sua emergência
          </h2>
          <p className="text-muted-foreground text-lg">
            Não é apenas um mapa. É um ecossistema completo para garantir que
            encontra as melhores instalações.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full border-muted bg-card hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div
                    className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
                  >
                    <feature.icon size={28} />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
