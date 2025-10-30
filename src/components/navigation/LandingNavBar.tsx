 "use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { BlurFade } from '@/components/ui/blur-fade';
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react'; // Assuming lucide-react is available for icons
import { AnimatePresence, motion } from 'framer-motion'; // For animations

const navItems = [
  {
    name: 'Product',
    type: 'dropdown',
    items: [
      { name: 'Problem', href: '#problem' },
      { name: 'How it works', href: '#how-it-works' },
      { name: 'Features', href: '#features' },
      { name: 'Metrics', href: '#metrics' },
      { name: 'Technology', href: '#technology' },
    ],
  },
  { name: 'Pricing', href: '#pricing' },
  {
    name: 'Resources',
    type: 'dropdown',
    items: [
      { name: 'Testimonials/Stories', href: '/testimonials' },
      { name: 'Docs', href: '/docs' },
      { name: 'Blog', href: '/blog' },
    ],
  },
  {
    name: 'Company',
    type: 'dropdown',
    items: [
      { name: 'About', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
  },
];

export function LandingNavBar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false); 
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleDropdownToggle = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleLinkClick = (href: string, type?: string) => {
    if (href.startsWith('#')) {
      scrollToSection(href.substring(1));
    } else {

    }
    setActiveDropdown(null); 
  };

  const renderNavLink = (item: typeof navItems[0]) => {
    if (item.type === 'dropdown') {
      return (
        <Popover key={item.name} open={activeDropdown === item.name} onOpenChange={(open) => open ? setActiveDropdown(item.name) : setActiveDropdown(null)}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="relative h-11 px-4 text-base font-normal text-neutral-700 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2"
              onClick={() => handleDropdownToggle(item.name)}
              ref={(el) => { dropdownRefs.current[item.name] = el; }}
              aria-expanded={activeDropdown === item.name}
              aria-haspopup="true"
            >
              {item.name}
              <motion.span
                className="absolute bottom-2 left-1/2 h-[2px] bg-neon-green"
                initial={{ width: 0, x: '-50%' }}
                animate={{ width: activeDropdown === item.name ? 'calc(100% - 1rem)' : 0 }}
                transition={{ duration: 0.2 }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-56 p-2 bg-white/70 backdrop-blur-md border border-neutral-200/60 rounded-xl shadow-lg"
            align="start"
            sideOffset={10}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setActiveDropdown(null);
            }}
          >
            <div className="grid gap-1">
              {item.items?.map((subItem) => (
                <Link
                  key={subItem.name}
                  href={subItem.href}
                  onClick={() => handleLinkClick(subItem.href, item.name)}
                  className="flex items-center px-3 py-2 text-sm text-neutral-700 rounded-md hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2"
                >
                  {subItem.name}
                </Link>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      );
    }
    return (
      <Link key={item.name} href={item.href} passHref>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-11 px-4 text-base font-normal text-neutral-700 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2"
          onClick={() => handleLinkClick(item.href)}
        >
          {item.name}
          <motion.span
            className="absolute bottom-2 left-1/2 h-[2px] bg-neon-green"
            initial={{ width: 0, x: '-50%' }}
            whileHover={{ width: 'calc(100% - 1rem)' }}
            transition={{ duration: 0.2 }}
          />
        </Button>
      </Link>
    );
  };

  return (
    <BlurFade delay={0.0} inView>
      <nav className="sticky top-0 z-50 w-full border-b border-neutral-200/60 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 min-w-[44px] min-h-[44px]">
            <Image
              src="/logo.png"
              alt="DecentraCode Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navItems.map(renderNavLink)}
          </div>


          <div className="hidden md:flex items-center gap-4">
            <Button variant="default" size="lg" asChild className="bg-neon-green text-black hover:bg-neon-green/80 focus-visible:ring-neon-green h-11 px-6 text-base">
              <Link href="/signup">Get started</Link>
            </Button>
            <Button variant="ghost" size="lg" asChild className="h-11 px-4 text-base text-neutral-700 hover:text-black focus-visible:ring-neon-green">
              <Link href="/signin">Sign in</Link>
            </Button>
          </div>


          <div className="md:hidden flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-11 w-11">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle mobile menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white/90 backdrop-blur-lg border-l border-neutral-200/60 p-6">
                <div className="flex flex-col gap-4 pt-8">
                  {navItems.map((item) => (
                    <div key={item.name}>
                      {item.type === 'dropdown' ? (
                        <details className="group">
                          <summary className="flex items-center justify-between py-2 text-lg font-medium text-neutral-800 cursor-pointer hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2">
                            {item.name}
                            <span className="ml-2 transition-transform duration-200 group-open:rotate-90">
                              >
                            </span>
                          </summary>
                          <div className="pl-4 mt-2 flex flex-col gap-2">
                            {item.items?.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                onClick={() => handleLinkClick(subItem.href)}
                                className="block py-2 text-base text-neutral-700 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </details>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => handleLinkClick(item.href)}
                          className="block py-2 text-lg font-medium text-neutral-800 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2"
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                  <div className="flex flex-col gap-4 mt-4">
                    <Button variant="default" asChild className="bg-neon-green text-black hover:bg-neon-green/80 focus-visible:ring-neon-green h-11 text-base">
                      <Link href="/signup">Get started</Link>
                    </Button>
                    <Button variant="outline" asChild className="h-11 text-base text-neutral-700 hover:text-black focus-visible:ring-neon-green">
                      <Link href="/signin">Sign in</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </BlurFade>
  );
}
