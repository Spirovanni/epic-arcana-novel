'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface TaskGroup {
  id: string;
  title: string;
  description: string;
  type: string;
  parentTaskGroupId: string | null;
  children?: TaskGroup[];
}

const TaskGroupNode = ({ node }: { node: TaskGroup }) => {
  return (
    <div className="ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold">{node.title}</h3>
      <p className="text-sm text-gray-500">{node.type}</p>
      <p className="mt-1">{node.description}</p>
      {node.children && node.children.length > 0 && (
        <div className="mt-2">
          {node.children.map((child) => (
            <TaskGroupNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function OutlinePage() {
  const params = useParams();
  const bookId = params.bookId as string;
  const [outline, setOutline] = useState<TaskGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;

    async function fetchOutline() {
      try {
        const response = await fetch(`/api/outline/${bookId}`);

        if (response.ok) {
          const taskGroups: TaskGroup[] = await response.json();
          
          const taskGroupMap = new Map(taskGroups.map(tg => [tg.id, { ...tg, children: [] }]));
          const hierarchy: TaskGroup[] = [];

          for(const tg of taskGroups) {
              if(tg.parentTaskGroupId && taskGroupMap.has(tg.parentTaskGroupId)) {
                  const parent = taskGroupMap.get(tg.parentTaskGroupId);
                  parent.children.push(taskGroupMap.get(tg.id));
              } else if (!tg.parentTaskGroupId) {
                  hierarchy.push(taskGroupMap.get(tg.id));
              }
          }
          
          setOutline(hierarchy);
        }
      } catch (error) {
        console.error('Failed to fetch outline:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOutline();
  }, [bookId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Story Outline</h1>
      <div className="space-y-4">
        {outline.map((node) => (
          <TaskGroupNode key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}