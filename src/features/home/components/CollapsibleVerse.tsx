import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface Verse {
  text: string;
  reference: string;
  date: string;
}

interface CollapsibleVerseProps {
  verse: Verse;
}

export const CollapsibleVerse: React.FC<CollapsibleVerseProps> = ({ verse }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
          <BookOpen className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Versículo do Dia</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Inspiração diária
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 h-auto bg-white/50 hover:bg-white/70 rounded-xl transition-all duration-300"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <blockquote
              className={`text-gray-800 dark:text-white transition-all duration-300 leading-relaxed ${
                isExpanded ? 'line-clamp-none' : 'line-clamp-3'
              }`}
            >
              <span className="text-2xl text-blue-600 dark:text-blue-400 font-serif">"</span>
              {verse.text}
              <span className="text-2xl text-blue-600 dark:text-blue-400 font-serif">"</span>
            </blockquote>

            {isExpanded && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-base text-blue-600 dark:text-blue-400 font-bold">
                  {verse.reference}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{verse.date}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
