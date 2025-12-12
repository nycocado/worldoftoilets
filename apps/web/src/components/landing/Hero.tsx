'use client';

import React from 'react';
import { Star, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MobileMockup, MapScreen } from './MobileMockup';
import { motion } from 'framer-motion';
import { pt } from '@/locales/pt';

export const Hero = () => {
  const t = pt.landing.hero;

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 lg:pt-0 lg:pb-0 overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8 max-w-2xl"
        >
          <Badge
            variant="outline"
            className="px-4 py-2 text-sm font-bold border-primary/30 text-primary bg-primary/5"
          >
            <Star size={14} fill="currentColor" className="mr-2" />{' '}
            {t.newVersion}
          </Badge>

          <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-foreground">
            {t.title}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              {t.titleHighlight}
            </span>{' '}
            {t.titleSuffix}
          </h1>

          <p
            className="text-lg text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t.description }}
          />

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href="https://github.com/nycocado/worldoftoilets"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-full shadow-lg transition-transform hover:-translate-y-1"
              >
                <Github size={24} className="mr-2" />
                {t.github}
              </Button>
            </a>
          </div>

          <div className="flex items-center gap-4 pt-8 text-sm text-muted-foreground">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <Avatar
                  key={i}
                  className="border-2 border-background w-10 h-10"
                >
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                  />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <p>{t.joinCommunity}</p>
          </div>
        </motion.div>

        <div className="relative hidden lg:flex justify-center lg:justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-primary to-secondary rounded-full blur-[80px] opacity-40"></div>

          <motion.div
            initial={{ y: 0, rotate: 0 }}
            animate={{ y: [-20, 0, -20] }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: 'easeInOut',
            }}
            whileHover={{ rotate: 0 }}
          >
            <MobileMockup screen={<MapScreen />} className="" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
