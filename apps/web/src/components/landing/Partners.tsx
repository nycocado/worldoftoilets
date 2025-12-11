'use client';

import React from 'react';
import {
  Store,
  Users,
  Award,
  MessageSquare,
  TrendingUp,
  Star,
  Building,
  Eye,
  Handshake,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const Partners = () => {
  return (
    <section
      id="partners"
      className="py-24 bg-muted/30 relative overflow-hidden"
    >
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.08]"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm font-bold border-accent/30 text-accent bg-accent/5"
            >
              <Building size={14} className="mr-2" /> Empresas Aliadas
            </Badge>

            <h2 className="text-4xl lg:text-5xl font-black text-foreground">
              Para <span className="text-accent">Casas de Banho</span> de{' '}
              <span className="text-accent">Qualidade</span>.
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed">
              Conecte-se com a missão World of Toilets e demonstre o compromisso
              da sua empresa com a higiene e o bem-estar público. Junte-se a
              empresas que valorizam a responsabilidade social e a qualidade dos
              serviços.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              {[
                {
                  icon: Eye,
                  title: 'Visibilidade de Marca',
                  desc: 'Tenha sua marca associada a uma iniciativa de impacto social positivo.',
                },
                {
                  icon: MessageSquare,
                  title: 'Feedback Qualificado',
                  desc: 'Receba insights diretos sobre a perceção dos utilizadores sobre seus sanitários.',
                },
                {
                  icon: Handshake,
                  title: 'Responsabilidade Social',
                  desc: 'Demonstre o seu compromisso com a comunidade e o bem-estar público.',
                },
                {
                  icon: TrendingUp,
                  title: 'Melhora Contínua',
                  desc: 'Utilize dados e feedback para aprimorar a qualidade dos seus serviços.',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-foreground font-bold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-full shadow-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-transform hover:-translate-y-1"
              >
                Aplicar para Parceria
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            {/* Mockup de Cartão de Parceiro */}
            <motion.div
              initial={{ rotate: 3 }}
              whileHover={{ rotate: 0 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <Card className="bg-card border-border shadow-2xl max-w-md mx-auto overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16 border-2 border-accent">
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          <Store size={32} />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold text-card-foreground">
                          Café Central
                        </h3>
                        <Badge
                          variant="outline"
                          className="mt-1 border-accent text-accent font-bold"
                        >
                          <Award size={12} className="mr-1" /> Parceiro
                          Verificado
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300 hover:bg-green-200"
                    >
                      Aberto
                    </Badge>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-xl">
                      <span className="text-muted-foreground text-sm">
                        Avaliação Geral
                      </span>
                      <div className="flex gap-1 text-accent">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} size={16} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-xl">
                      <span className="text-muted-foreground text-sm">
                        Visitas este mês
                      </span>
                      <span className="font-bold text-card-foreground">
                        1,245
                      </span>
                    </div>
                  </div>

                  <Button className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full">
                    Gerir Perfil
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
