'use client';

import React, { useState } from 'react';
import { MapPin, Menu, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import Image from 'next/image'; // Import Image

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50);
  });

  const navLinks = [
    { href: '#features', label: 'Funcionalidades' },
    { href: '#partners', label: 'Parceiros' },
    { href: '#community', label: 'Comunidade' },
  ];

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-300 border-b border-transparent`}
      animate={{
        backgroundColor: scrolled ? 'var(--background)' : 'transparent',
        borderColor: scrolled ? 'var(--border)' : 'transparent',
        paddingTop: scrolled ? '0.75rem' : '1.25rem',
        paddingBottom: scrolled ? '0.75rem' : '1.25rem',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
      }}
      style={{
        // @ts-ignore - Framer motion types for css variables can be tricky
        '--background': 'hsl(var(--background) / 0.8)',
        '--border': 'hsl(var(--border))',
      }}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="World of Toilets Logo"
            width={32}
            height={39}
            className="pointer-events-none"
          />
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            World of Toilets
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-foreground/80">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <ThemeToggle />

          <Link href="/auth/login">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full font-bold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <LogIn size={18} className="mr-2" />
              Login
            </Button>
          </Link>
        </div>

        {/* Mobile Menu (ShadCN Sheet) */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Image
                    src="/logo.svg"
                    alt="World of Toilets Logo"
                    width={24}
                    height={30}
                    className="pointer-events-none"
                  />
                  World of Toilets
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/auth/login">
                  <Button className="w-full rounded-full font-bold mt-4">
                    <LogIn size={18} className="mr-2" /> Login
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
};
