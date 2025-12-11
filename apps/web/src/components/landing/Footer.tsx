import React from 'react';
import { MapPin, Github } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image'; // Import Image

export const Footer = () => {
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
                className="pointer-events-none"
              />
              <span className="text-xl font-bold">World of Toilets</span>
            </div>
            <p className="max-w-xs mb-4 text-muted-foreground">
              Uma iniciativa dedicada a resolver problemas de higiene e
              acessibilidade urbana, conectando pessoas a sanitários de
              qualidade.
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                <Github />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-bold mb-4">Projeto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Sobre Nós
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-bold mb-4">Tecnologia</h4>
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
          <p>&copy; 2025 World of Toilets.</p>
          <p className="mt-2 md:mt-0">
            Desenvolvido com ❤️ por Nycolas, Luan, Lohanne e Kira.
          </p>
        </div>
      </div>
    </footer>
  );
};
