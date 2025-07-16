"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { UsersIcon } from '@heroicons/react/24/outline';

const placeholderImg = '/icons/fallback/default-chapter.png';

type Character = {
  id?: string;
  slug: string;
  name: string;
  aka?: string | null;
  pronouns?: string | null;
  relation?: string | null;
  role?: string | null;
  description?: string | null;
  lastSeenChapter?: number | null;
  personality?: string | null;
  background?: string | null;
  physicalDescription?: string | null;
  dialogueStyle?: string | null;
  groups?: string[] | null;
  birthYear?: string | null;
  died?: string | null;
  birthPlace?: string | null;
  deathPlace?: string | null;
  imageUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

function CharacterCard({ character }: { character: Character }) {
  return (
    <Link href={`/characters/${character.slug}`}
      className="block group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl h-full">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 dark:border-gray-700 cursor-pointer h-full">
        {/* Avatar Section - Fixed Height */}
        <div className="relative mb-4 flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center overflow-hidden shadow-lg transition-transform duration-300 hover:scale-200 hover:z-10">
            <Image 
              src={character.imageUrl || placeholderImg} 
              alt={character.name} 
              width={64} 
              height={64} 
              className="w-16 h-16 object-cover rounded-full" 
            />
          </div>
          {character.lastSeenChapter && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full flex items-center justify-center shadow-md">
              {character.lastSeenChapter}
            </div>
          )}
        </div>
        
        {/* Name Section - Fixed Height */}
        <div className="h-14 flex items-center mb-2 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white text-center group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            {character.name}
          </h2>
        </div>
        
        {/* Role Section - Fixed Height */}
        <div className="h-6 mb-2 flex-shrink-0">
          {character.role && (
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center font-medium">
              {character.role}
            </div>
          )}
        </div>
        
        {/* Description Section - Flexible but constrained */}
        <div className="flex-1 flex items-start mb-4 min-h-[60px]">
          {character.description && (
            <p className="text-xs text-gray-600 dark:text-gray-300 text-center line-clamp-4 leading-relaxed">
              {character.description}
            </p>
          )}
        </div>
        
        {/* Groups Section - Fixed Height at bottom */}
        <div className="h-8 flex flex-wrap gap-1 justify-center items-center flex-shrink-0">
          {character.groups?.slice(0, 2).map((group, index) => (
            <span key={index} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-medium rounded-full">
              {group}
            </span>
          ))}
          {character.groups && character.groups.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
              +{character.groups.length - 2}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/characters')
      .then(res => res.json())
      .then(data => {
        // Check if the response is an error object or an array
        if (data.error) {
          setError(data.error);
          setCharacters([]);
        } else if (Array.isArray(data)) {
          // Sort characters: those with profile pictures first (by oldest upload date), then those without
          const sortedCharacters = data.sort((a, b) => {
            // First, prioritize characters with profile pictures
            const aHasImage = Boolean(a.imageUrl);
            const bHasImage = Boolean(b.imageUrl);
            
            if (aHasImage && !bHasImage) return -1;
            if (!aHasImage && bHasImage) return 1;
            
            // If both have images or both don't have images, sort by updatedAt (ascending - oldest first)
            const aDate = new Date(a.updatedAt || a.createdAt || '0');
            const bDate = new Date(b.updatedAt || b.createdAt || '0');
            
            return aDate.getTime() - bDate.getTime();
          });
          
          setCharacters(sortedCharacters);
          setError(null);
        } else {
          // If data is not an array, set empty array
          setCharacters([]);
          setError('Invalid response format');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch characters:', err);
        setError('Failed to fetch characters');
        setCharacters([]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <Breadcrumbs 
        items={[
          { label: 'Characters', current: true }
        ]} 
      />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <UsersIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Novel Characters
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the rich cast of characters that bring the Epic Arcana universe to life
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse h-[400px] flex flex-col">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex-shrink-0" />
                  <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded mb-2 flex-shrink-0" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 flex-shrink-0" />
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Failed to Load Characters</h3>
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : characters.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Characters Found</h3>
                <p className="text-gray-600 dark:text-gray-400">No characters have been created yet.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-fr">
              {characters.map((character) => (
                <CharacterCard key={character.id || character.name} character={character} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
} 