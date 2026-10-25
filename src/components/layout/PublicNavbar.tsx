"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Briefcase,
  Bot,
  Layers,
  ShieldCheck,
  CreditCard,
  Menu,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-navy-900 flex items-center justify-center text-white shadow-md shadow-navy-900/10">
              <Sparkles className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                Business Manager
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  AI OS
                </span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                MAGIC QUANT TRADING Corp
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <Link href="/features" className="hover:text-slate-900 transition-colors">
              Features
            </Link>
            <Link href="/agents" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <Bot className="w-4 h-4 text-brand-600" />
              AI Agents
            </Link>
            <Link href="/integrations" className="hover:text-slate-900 transition-colors">
              Integrations
            </Link>
            <Link href="/sars-assistance" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              SARS Assistance
            </Link>
            <Link href="/pricing" className="hover:text-slate-900 transition-colors">
              Pricing
            </Link>
            <Link href="/security" className="hover:text-slate-900 transition-colors">
              Security & POPIA
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/checkout?plan=starter_month"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-navy-900 hover:bg-slate-800 transition-colors shadow-sm"
            >
              <span>Get Started</span>
              <span className="text-xs font-normal text-slate-300">R499/mo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-brand-600"
          >
            Features & Modules
          </Link>
          <Link
            href="/agents"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-brand-600"
          >
            AI Agents Suite
          </Link>
          <Link
            href="/integrations"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-brand-600"
          >
            Connected Integrations
          </Link>
          <Link
            href="/sars-assistance"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-brand-600"
          >
            SARS eFiling Assistance
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-brand-600"
          >
            Pricing & Plans
          </Link>
          <Link
            href="/security"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-brand-600"
          >
            Security & POPIA
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-slate-700 border border-slate-300"
            >
              Sign In
            </Link>
            <Link
              href="/checkout?plan=starter_month"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-white bg-navy-900"
            >
              Get Starter Access — R499
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
