import React from 'react';
import { Github } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { pt } from '@/locales/pt';

export const Footer = () => {
  const t = pt.landing.footer;
  const tCommon = pt.common;

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-foreground mb-4">
              <Image
                src="/logo.svg"
                alt="World of Toilets Logo"
                width={24}
                height={30}
                className="pointer-events-none h-8 w-auto"
              />
              <span className="text-xl font-bold">
                {tCommon.worldOfToilets}
              </span>
            </div>
            <p className="max-w-xs mb-4 text-muted-foreground">
              {t.description}
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                <Github />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-bold mb-4">{t.project}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t.about}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-bold mb-4">{t.tech}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Kotlin & Jetpack Compose
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  NestJS & React
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Algoritmo A* (IA)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>{t.copyright}</p>
          <p className="mt-2 md:mt-0">{t.developedBy}</p>
        </div>
      </div>
    </footer>
  );
};
