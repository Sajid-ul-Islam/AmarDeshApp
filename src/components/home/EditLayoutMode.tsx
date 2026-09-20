import React from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { RotateCcw, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useLayoutStore } from '../../store/useLayoutStore';
import { SectionBlock } from './SectionBlock';

interface EditLayoutModeProps {
  children: React.ReactNode;
}

export const EditLayoutMode: React.FC<EditLayoutModeProps> = ({ children }) => {
  const { isDarkMode } = useAppStore();
  const { sectionOrder, isEditMode, setEditMode, reorderSections, resetToDefault } = useLayoutStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over.id as string);
      reorderSections(oldIndex, newIndex);
    }
  };

  const handleDone = () => {
    setEditMode(false);
  };

  const handleReset = () => {
    resetToDefault();
  };

  if (!isEditMode) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Edit Mode Toolbar */}
      <div className={`sticky top-14 z-40 px-4 py-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            লেআউট সম্পাদনা
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium ${
                isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label="ডিফল্টে রিসেট করুন"
            >
              <RotateCcw size={14} />
              রিসেট
            </button>
            <button
              onClick={handleDone}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium"
              aria-label="সম্পন্ন"
            >
              <Check size={14} />
              সম্পন্ন
            </button>
          </div>
        </div>
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          সেকশন সরাতে টানুন এবং ছেড়ে দিন
        </p>
      </div>

      {/* Draggable Sections */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
          <div className="px-4 py-4 space-y-4">
            {React.Children.map(children, (child, index) => {
              const sectionId = sectionOrder[index];
              if (!sectionId) return null;
              return <SectionBlock id={sectionId}>{child}</SectionBlock>;
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
