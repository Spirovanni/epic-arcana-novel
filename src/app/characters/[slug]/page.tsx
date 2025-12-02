"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { UserIcon, MapPinIcon, CalendarIcon, TagIcon, ArrowLeftIcon, PencilIcon, CheckIcon, XMarkIcon, PhotoIcon, ClipboardIcon } from '@heroicons/react/24/outline';

const placeholderImg = '/icons/fallback/default-chapter.svg';
const heroShell =
  'rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-slate-100 supports-[backdrop-filter]:backdrop-blur-2xl shadow-[0_18px_50px_-24px_rgba(59,130,246,0.25)] dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0b1224] dark:via-[#090f1e] dark:to-[#070b14] dark:shadow-[0_30px_80px_-36px_rgba(0,0,0,0.88)]';
const sectionShell =
  'relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100 supports-[backdrop-filter]:backdrop-blur-xl shadow-[0_16px_45px_-28px_rgba(59,130,246,0.2)] dark:border-white/10 dark:bg-gradient-to-br dark:from-[#0d152b] dark:via-[#0a1020] dark:to-[#070c17] dark:shadow-[0_22px_60px_-34px_rgba(0,0,0,0.9)]';

type Character = {
  id?: string;
  slug?: string;
  name?: string;
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
  // Image Details for AI Generation
  aiPrompt?: string | null;
  // Character Image
  imageUrl?: string | null;
};

export default function CharacterProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [related, setRelated] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Character | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [promptCopied, setPromptCopied] = useState(false);

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

  const handleEdit = () => {
    setEditData({ ...character });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(null);
  };

  const handleSave = async () => {
    if (!editData) return;
    
    setSaving(true);
    try {
      console.log('Saving character with data:', editData);
      const response = await fetch(`/api/characters/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const updatedCharacter = await response.json();
        setCharacter(updatedCharacter);
        setIsEditing(false);
        setEditData(null);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Save failed:', response.status, errorData);
        setError(`Failed to save character: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setError('Failed to save character changes');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field: keyof Character, value: string | number | string[] | null) => {
    if (!editData) return;
    setEditData({ ...editData, [field]: value });
  };

  const handleCopyPrompt = async () => {
    const promptText = isEditing ? (editData?.aiPrompt || '') : (character?.aiPrompt || '');
    if (!promptText) return;

    try {
      await navigator.clipboard.writeText(promptText);
      setPromptCopied(true);
      setTimeout(() => setPromptCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`/api/characters/${slug}/image`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // Update both current character and edit data
        setCharacter(prev => prev ? { ...prev, imageUrl: result.imageUrl } : null);
        if (editData) {
          setEditData(prev => prev ? { ...prev, imageUrl: result.imageUrl } : null);
        }
      } else {
        setUploadError(result.error || 'Failed to upload image');
      }
    } catch (error) {
      setUploadError('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageRemove = async () => {
    setUploading(true);
    setUploadError(null);

    try {
      const response = await fetch(`/api/characters/${slug}/image`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update both current character and edit data
        setCharacter(prev => prev ? { ...prev, imageUrl: null } : null);
        if (editData) {
          setEditData(prev => prev ? { ...prev, imageUrl: null } : null);
        }
      } else {
        const result = await response.json();
        setUploadError(result.error || 'Failed to remove image');
      }
    } catch (error) {
      setUploadError('Failed to remove image');
      console.error('Remove error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Breadcrumbs 
        items={[
          { label: 'Characters', href: '/characters' },
          { label: character?.name || 'Loading...', current: true }
        ]}
        variant="dark"
        sticky={false}
      />
      <main className="relative min-h-screen overflow-hidden bg-background text-foreground dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900">
        <div className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-primary/15 blur-3xl dark:bg-primary/25" />
        <div className="pointer-events-none absolute right-[-140px] bottom-6 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-700/25" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(59,130,246,0.08),transparent_25%),radial-gradient(circle_at_80%_10%,rgba(236,72,153,0.08),transparent_28%),radial-gradient(circle_at_50%_70%,rgba(56,189,248,0.06),transparent_30%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6">
            <Link 
              href="/characters" 
              className="inline-flex items-center text-sm font-medium text-primary/80 dark:text-primary/60 hover:text-primary transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to all characters
            </Link>
          </div>

          {loading ? (
            <div className={`${heroShell} p-8 max-w-4xl mx-auto animate-pulse`}>
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
            <div className={`${heroShell} p-8 max-w-4xl mx-auto text-center`}>
              <div className="text-red-600 dark:text-red-400 text-lg font-medium">
                {error}
              </div>
            </div>
          ) : character && (
            <div className={`${heroShell} overflow-hidden max-w-6xl mx-auto`}>
              {/* Header Section */}
              <div className="relative px-6 sm:px-8 py-10 sm:py-12 bg-gradient-to-br from-card via-card/95 to-muted/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.14),transparent_38%),radial-gradient(circle_at_80%_30%,rgba(236,72,153,0.12),transparent_32%),radial-gradient(circle_at_50%_90%,rgba(56,189,248,0.08),transparent_30%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.12),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(56,189,248,0.1),transparent_35%)]" />
                <div className="relative flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-10">
                  <div className="relative group">
                    <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-gradient-to-br from-primary/15 via-indigo-500/10 to-sky-400/10 dark:from-primary/30 dark:via-indigo-600/25 dark:to-sky-500/25 flex items-center justify-center overflow-hidden border border-white/60 dark:border-slate-600/40 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)] dark:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.3)] transition-transform duration-300 group-hover:scale-[1.02]">
                      <Image 
                        src={character.imageUrl || placeholderImg} 
                        alt={character.name || 'Character'} 
                        width={224} 
                        height={224} 
                        className="w-full h-full object-cover rounded-xl" 
                      />
                    </div>
                    
                    {/* Upload Controls - Disabled on Production */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="relative group/upload">
                          <div className="bg-primary/90 text-white font-medium py-2 px-4 rounded-lg text-sm text-center cursor-help shadow-lg shadow-primary/30">
                            Manage Images
                            {/* Admin Panel Link Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover/upload:opacity-100 transition-opacity duration-200 pointer-events-auto z-10">
                              <div className="bg-slate-900 text-white text-xs rounded-lg p-4 shadow-xl min-w-[280px] border border-slate-700/80">
                                <div className="font-semibold mb-2">Image Management</div>
                                <p className="text-slate-100 mb-3">To assign character images, please use the admin panel:</p>
                                <a
                                  href="/admin/characters/images"
                                  className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-2 px-3 rounded transition-colors text-sm mb-2"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Go to Image Admin →
                                </a>
                                <p className="text-slate-300 text-xs">
                                  The admin panel allows you to select from existing images in our library.
                                </p>
                                {/* Arrow pointing down */}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {character.imageUrl && (
                          <button
                            onClick={handleImageRemove}
                            disabled={uploading}
                            className="bg-red-500/90 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-lg transition-colors text-xs shadow-md"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    {character.lastSeenChapter !== null && (
                      <div className="absolute -bottom-3 -right-3 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-amber-300/70">
                        Chapter {character.lastSeenChapter}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData?.name || ''}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 bg-white/70 dark:bg-white/5 backdrop-blur border border-slate-200/70 dark:border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 w-full max-w-2xl shadow-sm"
                        placeholder="Character name"
                      />
                    ) : (
                      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{character.name}</h1>
                    )}
                    
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData?.aka || ''}
                        onChange={(e) => handleFieldChange('aka', e.target.value)}
                        className="text-lg text-slate-700 dark:text-slate-100 mb-4 bg-white/70 dark:bg-white/5 backdrop-blur border border-slate-200/70 dark:border-white/10 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary/40 w-full max-w-lg shadow-sm"
                        placeholder="Also known as..."
                      />
                    ) : character.aka ? (
                      <div className="text-lg text-slate-600 dark:text-slate-200 mb-4 italic">aka {character.aka}</div>
                    ) : null}
                    
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                        <input
                          type="text"
                          value={editData?.pronouns || ''}
                          onChange={(e) => handleFieldChange('pronouns', e.target.value)}
                          className="px-3 py-2 bg-white/70 dark:bg-white/5 backdrop-blur border border-slate-200/70 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-primary/40 shadow-sm"
                          placeholder="Pronouns"
                        />
                        <input
                          type="text"
                          value={editData?.role || ''}
                          onChange={(e) => handleFieldChange('role', e.target.value)}
                          className="px-3 py-2 bg-white/70 dark:bg-white/5 backdrop-blur border border-slate-200/70 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-primary/40 shadow-sm"
                          placeholder="Role"
                        />
                        <input
                          type="text"
                          value={editData?.relation || ''}
                          onChange={(e) => handleFieldChange('relation', e.target.value)}
                          className="px-3 py-2 bg-white/70 dark:bg-white/5 backdrop-blur border border-slate-200/70 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-primary/40 shadow-sm"
                          placeholder="Relation"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                        {character.pronouns && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-foreground/80 border border-border/60 shadow-sm">
                            <UserIcon className="w-4 h-4 mr-1" />
                            {character.pronouns}
                          </span>
                        )}
                        {character.role && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 dark:bg-primary/20 text-primary-700 dark:text-primary-100 border border-primary/20 dark:border-primary/30 shadow-sm">
                            <TagIcon className="w-4 h-4 mr-1" />
                            {character.role}
                          </span>
                        )}
                        {character.relation && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-foreground/80 border border-border/60 shadow-sm">
                            {character.relation}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {isEditing ? (
                      <textarea
                        value={editData?.description || ''}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        rows={3}
                        className="w-full max-w-2xl px-3 py-2 bg-white/70 dark:bg-white/5 backdrop-blur border border-slate-200/70 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-primary/40 shadow-sm"
                        placeholder="Character description..."
                      />
                    ) : character.description ? (
                      <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{character.description}</p>
                    ) : null}

                    {/* Image Management Info */}
                    <div className="mt-4 max-w-2xl">
                      <div className="rounded-xl border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 p-4 shadow-sm">
                        <p className="text-primary-800 dark:text-primary-100 text-sm">
                          <strong>Image Management:</strong> To add or change character images, visit the{' '}
                          <a href="/admin/characters/images" className="underline hover:text-primary">
                            Admin Character Images page
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Edit Controls */}
                  <div className="flex flex-col space-y-3">
                    {!isEditing ? (
                      <button
                        onClick={handleEdit}
                        className="inline-flex items-center px-4 py-2 bg-slate-900/80 dark:bg-white/10 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors duration-200 backdrop-blur shadow-md"
                      >
                        <PencilIcon className="w-4 h-4 mr-2" />
                        Edit Character
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="inline-flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-medium rounded-lg transition-colors duration-200 shadow-md"
                        >
                          <CheckIcon className="w-4 h-4 mr-2" />
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={saving}
                          className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors duration-200 shadow-md"
                        >
                          <XMarkIcon className="w-4 h-4 mr-2" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="relative p-6 sm:p-8 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900 dark:border-t dark:border-white/5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Character Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Personality Section */}
                    <div className={`${sectionShell} p-6`}>
                      <h3 className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground mb-3">
                        <span className="h-1.5 w-7 rounded-full bg-primary/80 shadow-[0_0_14px_-4px_rgba(59,130,246,0.9)]" />
                        Personality
                      </h3>
                      {isEditing ? (
                        <textarea
                          value={editData?.personality || ''}
                          onChange={(e) => handleFieldChange('personality', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white/80 dark:bg-slate-900 text-slate-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/40"
                          placeholder="Describe the character's personality..."
                        />
                      ) : (
                        <p className="text-muted-foreground leading-relaxed">
                          {character.personality || 'No personality description yet.'}
                        </p>
                      )}
                    </div>

                    {/* Background Section */}
                    <div className={`${sectionShell} p-6`}>
                      <h3 className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground mb-3">
                        <span className="h-1.5 w-7 rounded-full bg-primary/80 shadow-[0_0_14px_-4px_rgba(59,130,246,0.9)]" />
                        Background
                      </h3>
                      {isEditing ? (
                        <textarea
                          value={editData?.background || ''}
                          onChange={(e) => handleFieldChange('background', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white/80 dark:bg-slate-900 text-slate-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/40"
                          placeholder="Describe the character's background..."
                        />
                      ) : (
                        <p className="text-muted-foreground leading-relaxed">
                          {character.background || 'No background information yet.'}
                        </p>
                      )}
                    </div>

                    {/* Physical Description Section */}
                    <div className={`${sectionShell} p-6`}>
                      <h3 className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground mb-3">
                        <span className="h-1.5 w-7 rounded-full bg-primary/80 shadow-[0_0_14px_-4px_rgba(59,130,246,0.9)]" />
                        Physical Description
                      </h3>
                      {isEditing ? (
                        <textarea
                          value={editData?.physicalDescription || ''}
                          onChange={(e) => handleFieldChange('physicalDescription', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white/80 dark:bg-slate-900 text-slate-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/40"
                          placeholder="Describe the character's physical appearance..."
                        />
                      ) : (
                        <p className="text-muted-foreground leading-relaxed">
                          {character.physicalDescription || 'No physical description yet.'}
                        </p>
                      )}
                    </div>

                    {/* Dialogue Style Section */}
                    <div className={`${sectionShell} p-6`}>
                      <h3 className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground mb-3">
                        <span className="h-1.5 w-7 rounded-full bg-primary/80 shadow-[0_0_14px_-4px_rgba(59,130,246,0.9)]" />
                        Dialogue Style
                      </h3>
                      {isEditing ? (
                        <textarea
                          value={editData?.dialogueStyle || ''}
                          onChange={(e) => handleFieldChange('dialogueStyle', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white/80 dark:bg-slate-900 text-slate-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/40"
                          placeholder="Describe the character's way of speaking..."
                        />
                      ) : (
                        <p className="text-muted-foreground leading-relaxed">
                          {character.dialogueStyle || 'No dialogue style information yet.'}
                        </p>
                      )}
                    </div>

                    {/* Image Details Section */}
                    <div className="relative overflow-hidden rounded-2xl border border-purple-200/70 bg-gradient-to-br from-indigo-50 via-white to-purple-50 shadow-[0_20px_60px_-32px_rgba(59,130,246,0.25)] dark:border-purple-500/45 dark:bg-gradient-to-br dark:from-[#0b1020] dark:via-[#0c1224] dark:to-[#090f1d] dark:shadow-[0_24px_70px_-32px_rgba(124,58,237,0.55)]">
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(147,197,253,0.08),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(168,85,247,0.12),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(99,102,241,0.12),transparent_45%)] dark:bg-[radial-gradient(circle_at_20%_10%,rgba(147,197,253,0.08),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(168,85,247,0.12),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(99,102,241,0.12),transparent_45%)]" />
                      <div className="relative p-6 space-y-4">
                        <h3 className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-foreground/90">
                          <span className="h-1.5 w-8 rounded-full bg-purple-500/90 shadow-[0_0_16px_-4px_rgba(168,85,247,0.9)]" />
                          <span className="inline-flex items-center gap-2">
                            <PhotoIcon className="w-5 h-5 text-purple-500 dark:text-purple-300" />
                            Image Details for AI Generation
                          </span>
                        </h3>
                        <div className="flex flex-wrap justify-between items-center gap-2">
                          <label className="text-xs font-medium text-foreground/80 uppercase tracking-[0.16em]">
                            AI Prompt
                          </label>
                          <button
                            onClick={handleCopyPrompt}
                            disabled={!character?.aiPrompt && !editData?.aiPrompt}
                            className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-purple-900 hover:border-purple-400/70 hover:bg-purple-100 transition disabled:opacity-50 disabled:cursor-not-allowed dark:bg-purple-500/10 dark:text-purple-100 dark:hover:bg-purple-500/20"
                          >
                            <ClipboardIcon className="w-4 h-4" />
                            {promptCopied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        {isEditing ? (
                          <textarea
                            value={editData?.aiPrompt || ''}
                            onChange={(e) => handleFieldChange('aiPrompt', e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 border border-purple-200 rounded-xl bg-white/90 text-slate-900 focus:ring-2 focus:ring-purple-300 font-mono text-sm shadow-inner shadow-purple-900/10 placeholder:text-slate-500 dark:border-purple-500/40 dark:bg-slate-950/75 dark:text-slate-100 dark:focus:ring-purple-400/70 dark:shadow-black/50"
                            placeholder="Enter AI prompt for generating this character's image..."
                          />
                        ) : (
                          <div className="text-slate-800 leading-relaxed bg-white/90 rounded-xl p-4 border border-purple-200/70 max-h-96 overflow-y-auto whitespace-pre-wrap font-mono text-sm shadow-inner shadow-purple-900/10 dark:text-slate-100 dark:bg-slate-950/70 dark:border-purple-500/35 dark:shadow-black/50">
                            {character.aiPrompt || 'No AI prompt defined yet.'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Info */}
                  <div className="space-y-6">
                    {/* Life Details */}
                    <div className={`${sectionShell} p-6`}>
                      <h3 className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground mb-4">
                        <span className="h-1.5 w-7 rounded-full bg-primary/80 shadow-[0_0_14px_-4px_rgba(59,130,246,0.9)]" />
                        Life Details
                      </h3>
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Birth Year</label>
                            <input
                              type="text"
                              value={editData?.birthYear || ''}
                              onChange={(e) => handleFieldChange('birthYear', e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white/80 dark:bg-slate-900 text-slate-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/40"
                              placeholder="e.g., 1265 CE"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Death Year</label>
                            <input
                              type="text"
                              value={editData?.died || ''}
                              onChange={(e) => handleFieldChange('died', e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white/80 dark:bg-slate-900 text-slate-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/40"
                              placeholder="e.g., 1321 CE"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Birth Place</label>
                            <input
                              type="text"
                              value={editData?.birthPlace || ''}
                              onChange={(e) => handleFieldChange('birthPlace', e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white/80 dark:bg-slate-900 text-slate-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/40"
                              placeholder="e.g., Florence, Italy"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Death Place</label>
                            <input
                              type="text"
                              value={editData?.deathPlace || ''}
                              onChange={(e) => handleFieldChange('deathPlace', e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white/80 dark:bg-slate-900 text-slate-900 dark:text-gray-100 focus:ring-2 focus:ring-primary/40"
                              placeholder="e.g., Ravenna, Italy"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {(character.birthYear || character.died || character.birthPlace || character.deathPlace) ? (
                            <>
                              {character.birthYear && (
                                <div className="flex items-center">
                                  <CalendarIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3" />
                                  <div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">Born</div>
                                    <div className="text-sm text-muted-foreground">{character.birthYear}</div>
                                  </div>
                                </div>
                              )}
                              {character.died && (
                                <div className="flex items-center">
                                  <CalendarIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3" />
                                  <div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">Died</div>
                                    <div className="text-sm text-muted-foreground">{character.died}</div>
                                  </div>
                                </div>
                              )}
                              {character.birthPlace && (
                                <div className="flex items-start">
                                  <MapPinIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3 mt-0.5" />
                                  <div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">Birthplace</div>
                                    <div className="text-sm text-muted-foreground">{character.birthPlace}</div>
                                  </div>
                                </div>
                              )}
                              {character.deathPlace && (
                                <div className="flex items-start">
                                  <MapPinIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3 mt-0.5" />
                                  <div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">Deathplace</div>
                                    <div className="text-sm text-muted-foreground">{character.deathPlace}</div>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400 italic">No life details recorded yet.</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Groups */}
                    {character.groups && Array.isArray(character.groups) && character.groups.length > 0 && (
                      <div className={`${sectionShell} p-6`}>
                        <h3 className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground mb-4">
                          <span className="h-1.5 w-7 rounded-full bg-primary/80 shadow-[0_0_14px_-4px_rgba(59,130,246,0.9)]" />
                          Groups & Affiliations
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {character.groups.map((group, index) => (
                            <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 dark:bg-primary/25 text-primary-800 dark:text-primary-100 border border-primary/20 dark:border-primary/30 shadow-sm">
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
              <div className={`${sectionShell} p-8 dark:border-white/10`}>
                <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-6">
                  <span className="h-2 w-10 rounded-full bg-primary/80 shadow-[0_0_18px_-6px_rgba(59,130,246,0.9)]" />
                  Related Characters
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {related.filter((c) => c.slug).map((c) => (
                    <Link
                      key={c.slug}
                      href={`/characters/${c.slug}`}
                      className="group rounded-xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 backdrop-blur hover:border-primary/50 hover:shadow-[0_18px_50px_-30px_rgba(59,130,246,0.4)] transition-all duration-200 p-4 dark:border-slate-800/60 dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-950/90 dark:to-slate-900/85"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/50 via-indigo-500/40 to-sky-400/50 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 border border-white/50 dark:border-white/10 shadow-sm">
                          <Image src={c.imageUrl || placeholderImg} alt={c.name || 'Character'} width={48} height={48} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-200 truncate">
                            {c.name || 'Unknown Character'}
                          </p>
                          {c.role && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
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
