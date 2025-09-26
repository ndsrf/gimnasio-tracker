import React from 'react';
import { BottomNavigation } from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </header>

      <main className="px-4 py-6">
        {children}
      </main>

      <BottomNavigation />
    </div>
  );
}