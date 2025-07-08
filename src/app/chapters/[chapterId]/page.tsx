'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

interface ChapterPage {
  id: string;
  pageNumber: number;
  content: string;
}

const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

export default function ChapterDisplayPage() {
  const params = useParams();
  const chapterId = params.chapterId as string;
  const { user } = useUser();
  const [pages, setPages] = useState<ChapterPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editorContent, setEditorContent] = useState('');

  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    if (!chapterId) return;
    async function fetchPages() {
      try {
        const response = await fetch(`/api/chapters/${chapterId}/pages`);
        if (response.ok) {
          const data = await response.json();
          setPages(data);
          if (data.length > 0) {
            setEditorContent(data[0].content);
          }
        }
      } catch (error) {
        console.error('Failed to fetch pages:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, [chapterId]);

  const handleContentChange = (content: string) => {
    setEditorContent(content);
  };

  const handleSave = async () => {
    try {
      await fetch(`/api/chapters/${chapterId}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageNumber: currentPage + 1, content: editorContent }),
      });
      const newPages = [...pages];
      newPages[currentPage].content = editorContent;
      setPages(newPages);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save content:', error);
    }
  };

  const currentLeftPage = useMemo(() => pages[currentPage], [pages, currentPage]);
  const currentRightPage = useMemo(() => pages[currentPage + 1], [pages, currentPage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-8 w-full max-w-6xl bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          {/* Left Page */}
          <div className="p-4 bg-white dark:bg-gray-700 rounded shadow">
            {isEditing ? (
              <QuillEditor value={editorContent} onChange={handleContentChange} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: currentLeftPage?.content || '' }} />
            )}
          </div>
          {/* Right Page */}
          <div className="p-4 bg-white dark:bg-gray-700 rounded shadow">
            <div dangerouslySetInnerHTML={{ __html: currentRightPage?.content || '' }} />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 max-w-6xl mx-auto">
        <button
          onClick={() => setCurrentPage(p => Math.max(0, p - 2))}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <div>
          {isAdmin && !isEditing && <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-500 text-white rounded mr-2">Edit</button>}
          {isEditing && <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded mr-2">Save</button>}
          {isEditing && <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-red-500 text-white rounded">Cancel</button>}
        </div>
        <button
          onClick={() => setCurrentPage(p => Math.min(pages.length - 2, p + 2))}
          disabled={currentPage >= pages.length - 2}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
