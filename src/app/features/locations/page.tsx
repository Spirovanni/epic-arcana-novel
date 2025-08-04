"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  BookOpenIcon,
  SparklesIcon,
  BuildingLibraryIcon,
  GlobeAltIcon,
  TagIcon,
  EyeIcon,
  InformationCircleIcon,
  StarIcon,
  ClipboardDocumentIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export interface Location {
  id: string;
  name: string;
  other_names?: string[];
  sensory_description?: string;
  location?: string;
  type: string;
  description: string;
  notable_features: string;
  lore: string;
  affiliation: string;
  linked_arcana: string;
  ai_image_prompt: string;
  image_url?: string;
}

// Location data is now loaded dynamically from the database via API
// Each location includes comprehensive details: names, descriptions, lore, AI image prompts, etc.

export default function LocationsPage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedArcana, setSelectedArcana] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null); // locationId being uploaded
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/locations');
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        const data = await response.json();
        if (data.success) {
          console.log('Locations data:', data.locations);
          console.log('First location:', data.locations[0]);
          setLocations(data.locations);
        } else {
          throw new Error(data.error || 'Failed to fetch locations');
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch locations');
        // Fallback to empty array - all data should come from database
        setLocations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Get unique types and arcana for filters
  const locationTypes = useMemo(() => {
    const types = Array.from(new Set(locations.map(loc => loc.type || '').filter(Boolean)));
    return types.sort();
  }, [locations]);

  const arcanaCards = useMemo(() => {
    const arcana = Array.from(new Set(locations.map(loc => loc.linked_arcana || '').filter(Boolean)));
    return arcana.sort();
  }, [locations]);

  // Filter locations based on search and filters
  const filteredLocations = useMemo(() => {
    return locations.filter(location => {
      const matchesSearch = searchQuery === '' || 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (location.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (location.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (location.affiliation || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (location.other_names && location.other_names.some((name: string) => 
          name.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      
      const matchesType = selectedType === 'all' || location.type === selectedType;
      const matchesArcana = selectedArcana === 'all' || location.linked_arcana === selectedArcana;
      
      return matchesSearch && matchesType && matchesArcana;
    });
  }, [locations, searchQuery, selectedType, selectedArcana]);

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, locationId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(locationId);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      console.log('Uploading for location ID:', locationId);
      const response = await fetch(`/api/locations/${locationId}/image`, {
        method: 'POST',
        body: formData,
      });

      let result;
      try {
        const text = await response.text();
        console.log('Raw API response:', text);
        result = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response status:', response.status);
        console.error('Response headers:', response.headers);
        setUploadError(`Invalid response from server: ${response.status}`);
        return;
      }

      if (response.ok) {
        // Update locations state with new image URL
        setLocations(prev => prev.map(loc => 
          loc.id === locationId 
            ? { ...loc, image_url: result.imageUrl }
            : loc
        ));
        
        // Update selected location if it's the one being updated
        if (selectedLocation?.id === locationId) {
          setSelectedLocation(prev => prev ? { ...prev, image_url: result.imageUrl } : null);
        }
      } else {
        setUploadError(result.error || 'Failed to upload image');
      }
    } catch (error) {
      setUploadError('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setUploading(null);
    }
  };

  // Handle image removal
  const handleImageRemove = async (locationId: string) => {
    setUploading(locationId);
    setUploadError(null);

    try {
      const response = await fetch(`/api/locations/${locationId}/image`, {
        method: 'DELETE',
      });

      let result;
      try {
        const text = await response.text();
        console.log('Raw API response:', text);
        result = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response status:', response.status);
        console.error('Response headers:', response.headers);
        setUploadError(`Invalid response from server: ${response.status}`);
        return;
      }

      if (response.ok) {
        // Update locations state to remove image URL
        setLocations(prev => prev.map(loc => 
          loc.id === locationId 
            ? { ...loc, image_url: null }
            : loc
        ));
        
        // Update selected location if it's the one being updated
        if (selectedLocation?.id === locationId) {
          setSelectedLocation(prev => prev ? { ...prev, image_url: null } : null);
        }
      } else {
        setUploadError(result.error || 'Failed to remove image');
      }
    } catch (error) {
      setUploadError('Failed to remove image');
      console.error('Remove error:', error);
    } finally {
      setUploading(null);
    }
  };

  // Copy AI prompt to clipboard
  const copyPromptToClipboard = async (prompt: string, locationName: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompt(locationName);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = prompt;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedPrompt(locationName);
      setTimeout(() => setCopiedPrompt(null), 2000);
    }
  };

  const getLocationIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Cyclopean Library-City': <BuildingLibraryIcon className="w-5 h-5" />,
      'Fortress-Observatory': <GlobeAltIcon className="w-5 h-5" />,
      'Mountain Range': <MapPinIcon className="w-5 h-5" />,
      'Moon-Temple & Portal': <SparklesIcon className="w-5 h-5" />,
      'Natural/Arcane Monolith': <StarIcon className="w-5 h-5" />,
      'Floating Market-City': <GlobeAltIcon className="w-5 h-5" />,
      'Temporal Chasm': <MapPinIcon className="w-5 h-5" />,
      'Clockwork City': <BuildingLibraryIcon className="w-5 h-5" />,
      'Petrified Inland Sea': <GlobeAltIcon className="w-5 h-5" />,
      'Sacred Grove': <SparklesIcon className="w-5 h-5" />
    };
    return iconMap[type] || <MapPinIcon className="w-5 h-5" />;
  };

  const getArcanaColor = (arcana: string) => {
    const colorMap: Record<string, string> = {
      'The Hermit': 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300',
      'The Tower': 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300',
      'Strength': 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300',
      'The High Priestess': 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300',
      'Judgement': 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300',
      'The Wheel of Fortune': 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300',
      'Temperance': 'text-teal-600 bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300',
      'The Magician': 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300',
      'The Hanged Man': 'text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-300',
      'Death': 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300'
    };
    return colorMap[arcana] || 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-300';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading the mystical locations of Laurasia...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
              Locations & World Building
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Explore the rich, interconnected world of Laurasia. Discover mysterious places where time itself bends, 
              ancient magic still flows, and every location tells a story woven into the fabric of destiny.
            </p>
            {error && (
              <div className="mt-4 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-lg inline-block">
                ⚠️ Using cached data due to connection issue: {error}
              </div>
            )}
            {uploadError && (
              <div className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg inline-block">
                ❌ Upload error: {uploadError}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search locations, descriptions, affiliations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                {locationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={selectedArcana}
                onChange={(e) => setSelectedArcana(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Arcana</option>
                {arcanaCards.map(arcana => (
                  <option key={arcana} value={arcana}>{arcana}</option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-800 text-purple-600 shadow' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-gray-800 text-purple-600 shadow' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredLocations.length} of {locations.length} locations
          </div>
        </motion.div>

        {/* Locations Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }
        >
          {filteredLocations.map((location, index) => (
            <motion.div
              key={location.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group ${
                viewMode === 'list' ? 'flex' : ''
              }`}
              onClick={() => setSelectedLocation(location)}
            >
              {viewMode === 'grid' ? (
                <div>
                  {/* Location Image with Title Overlay - 3:2 Aspect Ratio */}
                  <div className="relative w-full aspect-[3/2] mb-4 rounded-t-xl overflow-hidden group/image">
                    <img
                      src={location.image_url || '/images/locations/placeholder.svg'}
                      alt={location.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/locations/placeholder.svg';
                      }}
                    />
                    {/* Gradient Overlay for Title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Upload Controls Overlay */}
                    <div 
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className="relative group/upload">
                          <label className="cursor-pointer bg-white/90 hover:bg-white text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                            {uploading === location.id ? 'Uploading...' : 'Upload Image'}
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={(e) => handleImageUpload(e, location.id)}
                              disabled={uploading === location.id}
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
                                <li>• Recommended: 1200x800px (3:2 ratio)</li>
                                <li>• Images will be resized to fit</li>
                              </ul>
                              {/* Arrow pointing down */}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                        
                        {location.image_url && location.image_url !== '/images/locations/placeholder.svg' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageRemove(location.id);
                            }}
                            disabled={uploading === location.id}
                            className="bg-red-500/90 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-lg transition-colors text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                        {location.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-white/20 backdrop-blur-sm rounded text-white">
                          {getLocationIcon(location.type)}
                        </div>
                        <p className="text-sm text-white/90">{location.type}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 pt-0">
                    {location.other_names && location.other_names.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Also known as:</p>
                        <div className="flex flex-wrap gap-1">
                          {location.other_names.map((name, i) => (
                            <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {location.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getArcanaColor(location.linked_arcana)}`}>
                        {location.linked_arcana}
                      </span>
                      <EyeIcon className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center p-4 gap-4 w-full">
                  {/* List view image */}
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={location.image_url || '/images/locations/placeholder.svg'}
                      alt={location.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/locations/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {location.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{location.type}</p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                          {location.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getArcanaColor(location.linked_arcana)}`}>
                          {location.linked_arcana}
                        </span>
                        <EyeIcon className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {filteredLocations.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MapPinIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No locations found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or filters.
            </p>
          </motion.div>
        )}
      </div>

      {/* Location Detail Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedLocation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                {/* Location Image */}
                <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden mb-8 group/modal-image">
                  <img
                    src={selectedLocation.image_url || '/images/locations/placeholder.svg'}
                    alt={selectedLocation.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/locations/placeholder.svg';
                    }}
                  />
                  {/* Gradient Overlay for Title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  {/* Upload Controls Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/modal-image:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative group/modal-upload">
                        <label className="cursor-pointer bg-white/90 hover:bg-white text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors">
                          {uploading === selectedLocation.id ? 'Uploading...' : 'Upload New Image'}
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={(e) => handleImageUpload(e, selectedLocation.id)}
                            disabled={uploading === selectedLocation.id}
                            className="hidden"
                          />
                        </label>
                        
                        {/* Image Upload Guidelines Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover/modal-upload:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          <div className="bg-gray-900 text-white text-sm rounded-lg p-4 shadow-lg min-w-[280px]">
                            <div className="font-semibold mb-2">Image Upload Guidelines</div>
                            <ul className="space-y-1">
                              <li>• Formats: JPG, PNG, WebP</li>
                              <li>• Max size: 5MB</li>
                              <li>• Recommended: 1200x800px (3:2 ratio)</li>
                              <li>• Images will be resized to fit</li>
                            </ul>
                            {/* Arrow pointing down */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                      
                      {selectedLocation.image_url && selectedLocation.image_url !== '/images/locations/placeholder.svg' && (
                        <button
                          onClick={() => handleImageRemove(selectedLocation.id)}
                          disabled={uploading === selectedLocation.id}
                          className="bg-red-500/90 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full shadow-lg z-20"
                  >
                    ✕
                  </button>
                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-4xl font-bold text-white mb-3">
                      {selectedLocation.name}
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white">
                          {getLocationIcon(selectedLocation.type)}
                        </div>
                        <span className="text-xl text-white">{selectedLocation.type}</span>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getArcanaColor(selectedLocation.linked_arcana)} backdrop-blur-sm`}>
                        {selectedLocation.linked_arcana}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Other Names */}
                {selectedLocation.other_names && selectedLocation.other_names.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <TagIcon className="w-4 h-4" />
                      Also Known As
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocation.other_names.map((name, i) => (
                        <span key={i} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-lg text-sm">
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <InformationCircleIcon className="w-5 h-5" />
                        Description
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {selectedLocation.description}
                      </p>
                    </div>

                    {/* Sensory Description */}
                    {selectedLocation.sensory_description && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <EyeIcon className="w-5 h-5" />
                          Sensory Experience
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                          {selectedLocation.sensory_description}
                        </p>
                      </div>
                    )}

                    {/* Location */}
                    {selectedLocation.location && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <MapPinIcon className="w-5 h-5" />
                          Geographic Location
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {selectedLocation.location}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Notable Features */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <StarIcon className="w-5 h-5" />
                        Notable Features
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {selectedLocation.notable_features}
                      </p>
                    </div>

                    {/* Lore */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <BookOpenIcon className="w-5 h-5" />
                        Lore & History
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {selectedLocation.lore}
                      </p>
                    </div>

                    {/* Affiliation */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <GlobeAltIcon className="w-5 h-5" />
                        Affiliation
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {selectedLocation.affiliation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Image Prompt Section */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <SparklesIcon className="w-5 h-5" />
                      AI Image Generation Prompt
                    </h3>
                    <button
                      onClick={() => copyPromptToClipboard(selectedLocation.ai_image_prompt, selectedLocation.name)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        copiedPrompt === selectedLocation.name
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                      }`}
                    >
                      {copiedPrompt === selectedLocation.name ? (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="w-4 h-4" />
                          Copy Prompt
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm font-mono">
                      {selectedLocation.ai_image_prompt}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Copy this prompt and paste it into your preferred AI image generator (DALL-E, Midjourney, Stable Diffusion, etc.)
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}