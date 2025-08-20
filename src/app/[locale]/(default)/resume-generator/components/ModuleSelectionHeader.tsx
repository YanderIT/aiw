"use client";

import { CheckSquare, Square } from 'lucide-react';
import { useResume } from './ResumeContext';

interface ModuleSelectionHeaderProps {
  moduleId: 'header' | 'education' | 'workExperience' | 'research' | 'activities' | 'awards' | 'skillsLanguage';
  title: string;
  description: string;
}

export default function ModuleSelectionHeader({ moduleId, title, description }: ModuleSelectionHeaderProps) {
  const { isModuleSelected, toggleModuleSelection } = useResume();
  const isSelected = isModuleSelected(moduleId);

  return (
    <div className="flex items-center justify-between p-6 bg-green-50 rounded-xl border border-green-200">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
      <button
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
        onClick={() => toggleModuleSelection(moduleId)}
      >
        {isSelected ? (
          <CheckSquare className="w-5 h-5 text-green-600" />
        ) : (
          <Square className="w-5 h-5 text-gray-400" />
        )}
        <span className={`font-medium ${isSelected ? 'text-green-700' : 'text-gray-500'}`}>
          {isSelected ? '已选择包含在文书中' : '点击选择包含在文书中'}
        </span>
      </button>
    </div>
  );
} 