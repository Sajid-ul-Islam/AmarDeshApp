import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useLayoutStore } from '../../store/useLayoutStore';

interface SectionBlockProps {
  id: string;
  children: React.ReactNode;
}

export const SectionBlock: React.FC<SectionBlockProps> = ({ id, children }) => {
  const { isDarkMode } = useAppStore();
  const { isEditMode } = useLayoutStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  if (!isEditMode) {
    return <div>{children}</div>;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-xl border-2 transition-all ${
        isDragging
          ? 'border-green-500 shadow-lg scale-105'
          : isDarkMode
          ? 'border-gray-700 hover:border-gray-600'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className={`absolute top-2 right-2 z-10 p-2 rounded-lg cursor-grab active:cursor-grabbing ${
          isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
        } shadow-md`}
        aria-label="সেকশন সরাতে টানুন"
      >
        <GripVertical size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
      </div>

      {/* Edit Mode Overlay Label */}
      <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
        সরাতে টানুন
      </div>

      {/* Content */}
      <div className="pointer-events-none">{children}</div>
    </div>
  );
};
