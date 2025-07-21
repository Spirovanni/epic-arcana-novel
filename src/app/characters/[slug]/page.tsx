"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { UserIcon, MapPinIcon, CalendarIcon, TagIcon, ArrowLeftIcon, PencilIcon, CheckIcon, XMarkIcon, PhotoIcon, ClipboardIcon } from '@heroicons/react/24/outline';

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
  // Image Details for AI Generation
  imagePrompt?: string | null;
  openArtLink?: string | null;
  customSetting?: string | null;
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
      const response = await fetch(`/api/characters/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const updatedCharacter = await response.json();
        setCharacter(updatedCharacter);
        setIsEditing(false);
        setEditData(null);
      } else {
        setError('Failed to save character changes');
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
    const promptText = isEditing ? (editData?.imagePrompt || '') : (character?.imagePrompt || '');
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
                  <div className="relative group">
                    <div className="w-48 h-48 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-4 border-white/30 transition-transform duration-300 hover:scale-200 hover:z-10">
                      <Image 
                        src={character.imageUrl || placeholderImg} 
                        alt={character.name} 
                        width={192} 
                        height={192} 
                        className="w-full h-full object-cover rounded-xl" 
                      />
                    </div>
                    
                    {/* Upload Controls */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="relative group/upload">
                          <label className="cursor-pointer bg-white/90 hover:bg-white text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                            {uploading ? 'Uploading...' : 'Upload Image'}
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={handleImageUpload}
                              disabled={uploading}
                              className="hidden"
                            />
                          </label>
                          
                          {/* Image Upload Guidelines Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover/upload:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                            <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg min-w-[250px]">
                              <div className="font-semibold mb-2">Image Upload Guidelines</div>
                              <ul className="space-y-1 text-xs">
                                <li>• Formats: JPG, PNG, WebP</li>
                                <li>• Max size: 5MB</li>
                                <li>• Max dimensions: 1500x1500px</li>
                                <li>• Square images work best</li>
                              </ul>
                              {/* Arrow pointing down */}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                        
                        {character.imageUrl && (
                          <button
                            onClick={handleImageRemove}
                            disabled={uploading}
                            className="bg-red-500/90 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-lg transition-colors text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    {character.lastSeenChapter !== null && (
                      <div className="absolute -bottom-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
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
                        className="text-4xl md:text-5xl font-bold text-white mb-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-white/50 w-full max-w-2xl"
                        placeholder="Character name"
                      />
                    ) : (
                      <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{character.name}</h1>
                    )}
                    
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData?.aka || ''}
                        onChange={(e) => handleFieldChange('aka', e.target.value)}
                        className="text-xl text-white/90 mb-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-1 focus:ring-2 focus:ring-white/50 w-full max-w-lg"
                        placeholder="Also known as..."
                      />
                    ) : character.aka ? (
                      <div className="text-xl text-white/90 mb-4">aka {character.aka}</div>
                    ) : null}
                    
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                        <input
                          type="text"
                          value={editData?.pronouns || ''}
                          onChange={(e) => handleFieldChange('pronouns', e.target.value)}
                          className="px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50"
                          placeholder="Pronouns"
                        />
                        <input
                          type="text"
                          value={editData?.role || ''}
                          onChange={(e) => handleFieldChange('role', e.target.value)}
                          className="px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50"
                          placeholder="Role"
                        />
                        <input
                          type="text"
                          value={editData?.relation || ''}
                          onChange={(e) => handleFieldChange('relation', e.target.value)}
                          className="px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50"
                          placeholder="Relation"
                        />
                      </div>
                    ) : (
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
                    )}
                    
                    {isEditing ? (
                      <textarea
                        value={editData?.description || ''}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        rows={3}
                        className="w-full max-w-2xl px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50"
                        placeholder="Character description..."
                      />
                    ) : character.description ? (
                      <p className="text-lg text-white/90 leading-relaxed max-w-2xl">{character.description}</p>
                    ) : null}

                    {/* Upload Error Display */}
                    {uploadError && (
                      <div className="mt-4 max-w-2xl">
                        <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3">
                          <p className="text-red-200 text-sm">{uploadError}</p>
                        </div>
                      </div>
                    )}

                    {/* Image Upload Guidelines */}
                    {/* <div className="mt-6 max-w-2xl">
                      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2 flex items-center">
                          <PhotoIcon className="w-4 h-4 mr-2" />
                          Image Upload Guidelines
                        </h4>
                        <ul className="text-white/80 text-sm space-y-1">
                          <li>• <strong>Recommended:</strong> Up to 1,500x1,500 pixels (square)</li>
                          <li>• <strong>File types:</strong> JPG, PNG, WebP</li>
                          <li>• <strong>Max size:</strong> 5MB</li>
                          <li>• <strong>Best quality:</strong> High-resolution portrait images</li>
                        </ul>
                      </div>
                    </div> */}
                  </div>
                  
                  {/* Edit Controls */}
                  <div className="flex flex-col space-y-3">
                    {!isEditing ? (
                      <button
                        onClick={handleEdit}
                        className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-colors duration-200 backdrop-blur-sm"
                      >
                        <PencilIcon className="w-4 h-4 mr-2" />
                        Edit Character
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                          <CheckIcon className="w-4 h-4 mr-2" />
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={saving}
                          className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors duration-200"
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
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Character Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Personality Section */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Personality</h3>
                      {isEditing ? (
                        <textarea
                          value={editData?.personality || ''}
                          onChange={(e) => handleFieldChange('personality', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                          placeholder="Describe the character's personality..."
                        />
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {character.personality || 'No personality description yet.'}
                        </p>
                      )}
                    </div>

                    {/* Background Section */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Background</h3>
                      {isEditing ? (
                        <textarea
                          value={editData?.background || ''}
                          onChange={(e) => handleFieldChange('background', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                          placeholder="Describe the character's background..."
                        />
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {character.background || 'No background information yet.'}
                        </p>
                      )}
                    </div>

                    {/* Physical Description Section */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Physical Description</h3>
                      {isEditing ? (
                        <textarea
                          value={editData?.physicalDescription || ''}
                          onChange={(e) => handleFieldChange('physicalDescription', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                          placeholder="Describe the character's physical appearance..."
                        />
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {character.physicalDescription || 'No physical description yet.'}
                        </p>
                      )}
                    </div>

                    {/* Dialogue Style Section */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Dialogue Style</h3>
                      {isEditing ? (
                        <textarea
                          value={editData?.dialogueStyle || ''}
                          onChange={(e) => handleFieldChange('dialogueStyle', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                          placeholder="Describe the character's way of speaking..."
                        />
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {character.dialogueStyle || 'No dialogue style information yet.'}
                        </p>
                      )}
                    </div>

                    {/* Image Details Section */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <PhotoIcon className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                        Image Details for AI Generation
                      </h3>
                      <div className="space-y-4">
                        {/* Image Prompt */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              AI Prompt
                            </label>
                            <button
                              onClick={handleCopyPrompt}
                              disabled={!character?.imagePrompt && !editData?.imagePrompt}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50"
                            >
                              <ClipboardIcon className="w-4 h-4 mr-1" />
                              {promptCopied ? 'Copied!' : 'Copy Prompt'}
                            </button>
                          </div>
                          {isEditing ? (
                            <textarea
                              value={editData?.imagePrompt || ''}
                              onChange={(e) => handleFieldChange('imagePrompt', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
                              placeholder="Enter AI prompt for generating this character's image..."
                            />
                          ) : (
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-600">
                              {character.imagePrompt || 'No AI prompt defined yet.'}
                            </p>
                          )}
                        </div>

                        {/* OpenArt Link */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            OpenArt Link
                          </label>
                          {isEditing ? (
                            <input
                              type="url"
                              value={editData?.openArtLink || ''}
                              onChange={(e) => handleFieldChange('openArtLink', e.target.value)}
                              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
                              placeholder="https://openart.ai/..."
                            />
                          ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-600">
                              {character.openArtLink ? (
                                <a
                                  href={character.openArtLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline"
                                >
                                  {character.openArtLink}
                                </a>
                              ) : (
                                <span className="text-gray-500 dark:text-gray-400">No OpenArt link provided.</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Custom Setting */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Custom Setting
                          </label>
                          {isEditing ? (
                            <textarea
                              value={editData?.customSetting || ''}
                              onChange={(e) => handleFieldChange('customSetting', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
                              placeholder="Any custom settings or notes for image generation..."
                            />
                          ) : (
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-600">
                              {character.customSetting || 'No custom settings defined.'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Info */}
                  <div className="space-y-6">
                    {/* Life Details */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Life Details</h3>
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Birth Year</label>
                            <input
                              type="text"
                              value={editData?.birthYear || ''}
                              onChange={(e) => handleFieldChange('birthYear', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                              placeholder="e.g., 1265 CE"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Death Year</label>
                            <input
                              type="text"
                              value={editData?.died || ''}
                              onChange={(e) => handleFieldChange('died', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                              placeholder="e.g., 1321 CE"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Birth Place</label>
                            <input
                              type="text"
                              value={editData?.birthPlace || ''}
                              onChange={(e) => handleFieldChange('birthPlace', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
                              placeholder="e.g., Florence, Italy"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Death Place</label>
                            <input
                              type="text"
                              value={editData?.deathPlace || ''}
                              onChange={(e) => handleFieldChange('deathPlace', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
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
                            </>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No life details recorded yet.</p>
                          )}
                        </div>
                      )}
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
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-200 hover:z-10">
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