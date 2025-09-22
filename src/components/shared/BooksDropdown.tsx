'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ChevronDown, Book } from 'lucide-react';
import { getBooksDropdownItems, type BookDropdownItem } from './BooksDropdownData';

interface BooksDropdownProps {
  className?: string;
}

export function BooksDropdown({ className }: BooksDropdownProps) {
  const pathname = usePathname();
  const dropdownItems = getBooksDropdownItems();

  const isActivePath = (href: string) => {
    if (href.startsWith('#')) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const isDropdownActive = () => {
    return dropdownItems.some(item => isActivePath(item.href));
  };

  // Group items by category
  const overviewItems = dropdownItems.filter(item => item.category === 'overview');
  const personalItems = dropdownItems.filter(item => item.category === 'personal');
  const bookItems = dropdownItems.filter(item => item.category === 'book');

  const renderDropdownSection = (
    items: BookDropdownItem[], 
    title?: string, 
    showDivider = true
  ) => (
    <>
      {title && (
        <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-t border-white/10 first:border-t-0">
          {title}
        </div>
      )}
      {items.map((item, index) => (
        <DropdownMenuPrimitive.Item key={item.href} asChild>
          <Link
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer group/item ${
              isActivePath(item.href) ? 'text-white bg-white/10 shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            <div className="flex-shrink-0 text-indigo-400 group-hover/item:text-indigo-300">
              {item.icon}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-medium text-sm truncate">
                {item.bookNumber ? `Book ${item.bookNumber}: ${item.label}` : item.label}
              </span>
              <span className="text-xs text-slate-400 group-hover/item:text-slate-300 line-clamp-2">
                {item.description}
              </span>
            </div>
          </Link>
        </DropdownMenuPrimitive.Item>
      ))}
      {showDivider && <div className="h-px bg-white/10 mx-2 my-2" />}
    </>
  );

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger 
        className={`px-4 py-2 rounded-lg hover:bg-white/5 hover:text-white transition-all duration-200 tracking-wide flex items-center gap-2 group ${
          isDropdownActive() ? 'text-white bg-white/5' : ''
        } ${className}`}
      >
        <Book className="w-4 h-4" />
        Books
        <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180 group-data-[state=open]:rotate-180" />
      </DropdownMenuPrimitive.Trigger>
      
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content 
          align="start" 
          className="w-80 bg-[#1a1a2e]/95 backdrop-blur border border-white/10 rounded-xl shadow-xl shadow-black/30 p-2 animate-in fade-in-0 zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto"
          sideOffset={8}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Book className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white">Epic Arcana Books</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              9-book series for personal and professional growth
            </p>
          </div>

          {/* Overview Section */}
          {renderDropdownSection(overviewItems, 'Overview')}

          {/* Personal Dashboard Section */}
          {renderDropdownSection(personalItems, 'My Reading')}

          {/* Books Section */}
          <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-t border-white/10">
            Book Series
          </div>
          
          {/* First Trilogy */}
          <div className="px-4 py-1">
            <div className="text-xs text-slate-500 font-medium">Foundation Trilogy</div>
          </div>
          {renderDropdownSection(bookItems.slice(0, 3), undefined, false)}
          
          <div className="h-px bg-white/10 mx-2 my-2" />
          
          {/* Second Trilogy */}
          <div className="px-4 py-1">
            <div className="text-xs text-slate-500 font-medium">Mastery Trilogy</div>
          </div>
          {renderDropdownSection(bookItems.slice(3, 6), undefined, false)}
          
          <div className="h-px bg-white/10 mx-2 my-2" />
          
          {/* Third Trilogy */}
          <div className="px-4 py-1">
            <div className="text-xs text-slate-500 font-medium">Triumph Trilogy</div>
          </div>
          {renderDropdownSection(bookItems.slice(6, 9), undefined, false)}

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/10 mt-2">
            <div className="text-xs text-slate-400">
              Complete your journey through all 9 books of personal transformation
            </div>
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}