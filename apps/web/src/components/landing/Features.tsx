'use client';

import React from 'react';
import { Navigation, Star, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { pt } from '@/locales/pt';

export const Features = () => {
  const t = pt.landing.features;
  const cards = t.cards;

  const features = [
    {
      icon: Navigation,
      color: 'text-primary',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      title: cards.navigation.title,
      desc: cards.navigation.desc,
    },
    {
      icon: Star,
      color: 'text-accent',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      title: cards.reviews.title,
      desc: cards.reviews.desc,
    },
    {
      icon: ShieldAlert,
      color: 'text-destructive',
      bg: 'bg-red-50 dark:bg-red-900/20',
      title: cards.report.title,
      desc: cards.report.desc,
    },
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-4">
            {t.title}
          </h2>
          <p className="text-muted-foreground text-lg">{t.subtitle}</p>
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
