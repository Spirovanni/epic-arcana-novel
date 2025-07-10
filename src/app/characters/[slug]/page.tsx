"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { UserIcon, MapPinIcon, CalendarIcon, TagIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

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
};

export default function CharacterProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [related, setRelated] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch(`/api/characters/${slug}`).then(res => res.ok ? res.json() : null),
      fetch('/api/characters').then(res => res.ok ? res.json() : [])
    ]).then(([char, all]) => {
      if (!char) {
        setError('Character not found.');
        setLoading(false);
        return;
      }
      setCharacter(char);
      // Find related by group
      if (char.groups && Array.isArray(char.groups)) {
        const relatedChars = all.filter((c: Character) =>
          c.slug !== char.slug &&
          c.groups && c.groups.some((g: string) => char.groups.includes(g))
        );
        setRelated(relatedChars);
      } else {
        setRelated([]);
      }
      setLoading(false);
    }).catch(() => {
      setError('Failed to load character.');
      setLoading(false);
    });
  }, [slug]);

  return (
    <>
      <Navbar />
      <Breadcrumbs 
        items={[
          { label: 'Characters', href: '/characters' },
          { label: character?.name || 'Loading...', current: true }
        ]} 
      />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link 
              href="/characters" 
              className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to all characters
            </Link>
          </div>

          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto animate-pulse">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="w-48 h-48 rounded-2xl bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-4">
                  <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto text-center">
              <div className="text-red-600 dark:text-red-400 text-lg font-medium">
                {error}
              </div>
            </div>
          ) : character && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-w-6xl mx-auto">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800 px-8 py-12">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-4 border-white/30">
                      <Image src={placeholderImg} alt={character.name} width={192} height={192} className="w-full h-full object-cover rounded-xl" />
                    </div>
                    {character.lastSeenChapter !== null && (
                      <div className="absolute -bottom-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Chapter {character.lastSeenChapter}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{character.name}</h1>
                    {character.aka && (
                      <div className="text-xl text-white/90 mb-4">aka {character.aka}</div>
                    )}
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                      {character.pronouns && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                          <UserIcon className="w-4 h-4 mr-1" />
                          {character.pronouns}
                        </span>
                      )}
                      {character.role && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                          <TagIcon className="w-4 h-4 mr-1" />
                          {character.role}
                        </span>
                      )}
                      {character.relation && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                          {character.relation}
                        </span>
                      )}
                    </div>
                    {character.description && (
                      <p className="text-lg text-white/90 leading-relaxed max-w-2xl">{character.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Character Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {character.personality && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Personality</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{character.personality}</p>
                      </div>
                    )}
                    {character.background && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Background</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{character.background}</p>
                      </div>
                    )}
                    {character.physicalDescription && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Physical Description</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{character.physicalDescription}</p>
                      </div>
                    )}
                    {character.dialogueStyle && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Dialogue Style</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{character.dialogueStyle}</p>
                      </div>
                    )}
                  </div>

                  {/* Sidebar Info */}
                  <div className="space-y-6">
                    {/* Life Details */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Life Details</h3>
                      <div className="space-y-3">
                        {character.birthYear && (
                          <div className="flex items-center">
                            <CalendarIcon className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">Born</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{character.birthYear}</div>
                            </div>
                          </div>
                        )}
                        {character.died && (
                          <div className="flex items-center">
                            <CalendarIcon className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">Died</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{character.died}</div>
                            </div>
                          </div>
                        )}
                        {character.birthPlace && (
                          <div className="flex items-start">
                            <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">Birthplace</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{character.birthPlace}</div>
                            </div>
                          </div>
                        )}
                        {character.deathPlace && (
                          <div className="flex items-start">
                            <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">Deathplace</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{character.deathPlace}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Groups */}
                    {character.groups && Array.isArray(character.groups) && character.groups.length > 0 && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Groups & Affiliations</h3>
                        <div className="space-y-2">
                          {character.groups.map((group, index) => (
                            <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 mr-2 mb-2">
                              {group}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-12 max-w-6xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Characters</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {related.map((c) => (
                    <Link 
                      key={c.slug} 
                      href={`/characters/${c.slug}`} 
                      className="group bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center overflow-hidden">
                          <Image src={placeholderImg} alt={c.name} width={48} height={48} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 truncate">
                            {c.name}
                          </p>
                          {c.role && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {c.role}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}