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
    <Card className="p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
          <BookOpen className="w-5 h-5 text-primary-600" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Versículo do Dia
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 h-auto"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="space-y-2">
            <p className={`text-gray-900 dark:text-white transition-all duration-200 ${
              isExpanded ? 'line-clamp-none' : 'line-clamp-2'
            }`}>
              "{verse.text}"
            </p>
            
            {isExpanded && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {verse.reference}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {verse.date}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
