'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { pt } from '@/locales/pt';

export const Testimonials = () => {
  const t = pt.landing.testimonials;
  const cards = t.cards;

  const testimonials = [
    {
      name: cards[0].name,
      role: cards[0].role,
      text: cards[0].text,
      initial: 'MH',
    },
    {
      name: cards[1].name,
      role: cards[1].role,
      text: cards[1].text,
      initial: 'MC',
    },
    {
      name: cards[2].name,
      role: cards[2].role,
      text: cards[2].text,
      initial: 'DB',
    },
  ];

  return (
    <section id="community" className="py-24 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-foreground">{t.title}</h2>
          <p className="text-muted-foreground mt-2">{t.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((persona, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-card border-border hover:shadow-lg transition-all cursor-pointer h-full">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${persona.initial}`}
                      />
                      <AvatarFallback>{persona.initial}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-foreground">
                        {persona.name}
                      </h4>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {persona.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4 text-accent">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    &quot;{persona.text}&quot;
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
