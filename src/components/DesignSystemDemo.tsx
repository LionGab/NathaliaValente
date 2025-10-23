import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Heart, Star, Sparkles, Users, Shield, ArrowRight } from 'lucide-react';

export const DesignSystemDemo: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'colors' | 'typography' | 'components'>('colors');

  const ColorPalette = () => (
    <View className="space-y-6">
      {/* Primary Colors */}
      <View>
        <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
          Primary Colors
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
            <View key={shade} className="items-center">
              <View 
                className={`w-12 h-12 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-primary-${shade}`}
              />
              <Text className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                {shade}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Secondary Colors */}
      <View>
        <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
          Secondary Colors
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
            <View key={shade} className="items-center">
              <View 
                className={`w-12 h-12 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-secondary-${shade}`}
              />
              <Text className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                {shade}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Special Colors */}
      <View>
        <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
          Special Colors
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
            <View key={shade} className="items-center">
              <View 
                className={`w-12 h-12 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-spiritual-${shade}`}
              />
              <Text className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                {shade}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const TypographyDemo = () => (
    <View className="space-y-6">
      {/* Display Styles */}
      <View>
        <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
          Display Styles
        </Text>
        <View className="space-y-2">
          <Text className="text-4xl font-bold text-primary-600 dark:text-primary-400">
            Display 2XL
          </Text>
          <Text className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            Display XL
          </Text>
          <Text className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            Display Large
          </Text>
        </View>
      </View>

      {/* Heading Styles */}
      <View>
        <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
          Heading Styles
        </Text>
        <View className="space-y-2">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Heading 1
          </Text>
          <Text className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Heading 2
          </Text>
          <Text className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Heading 3
          </Text>
        </View>
      </View>

      {/* Body Styles */}
      <View>
        <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
          Body Styles
        </Text>
        <View className="space-y-2">
          <Text className="text-lg text-neutral-700 dark:text-neutral-300">
            Large body text for important content
          </Text>
          <Text className="text-base text-neutral-700 dark:text-neutral-300">
            Regular body text for standard content
          </Text>
          <Text className="text-sm text-neutral-600 dark:text-neutral-400">
            Small body text for secondary content
          </Text>
        </View>
      </View>
    </View>
  );

  const ComponentsDemo = () => (
    <View className="space-y-6">
      {/* Buttons */}
      <View>
        <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
          Buttons
        </Text>
        <View className="space-y-3">
          <TouchableOpacity className="bg-primary-500 px-6 py-3 rounded-xl shadow-medium">
            <Text className="text-white font-semibold text-center">
              Primary Button
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-secondary-500 px-6 py-3 rounded-xl shadow-medium">
            <Text className="text-white font-semibold text-center">
              Secondary Button
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="border-2 border-primary-500 px-6 py-3 rounded-xl">
            <Text className="text-primary-500 font-semibold text-center">
              Outline Button
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cards */}
      <View>
        <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
          Cards
        </Text>
        <View className="space-y-3">
          <View className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700">
            <Text className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Card Title
            </Text>
            <Text className="text-neutral-600 dark:text-neutral-400">
              This is a sample card with soft shadow and rounded corners.
            </Text>
          </View>
          
          <View className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 rounded-xl shadow-medium">
            <Text className="font-semibold text-white mb-2">
              Gradient Card
            </Text>
            <Text className="text-white/90">
              This card uses a gradient background with medium shadow.
            </Text>
          </View>
        </View>
      </View>

      {/* Icons */}
      <View>
        <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
          Icons
        </Text>
        <View className="flex-row flex-wrap gap-4">
          <View className="items-center">
            <View className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full items-center justify-center">
              <Heart className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </View>
            <Text className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Heart
            </Text>
          </View>
          
          <View className="items-center">
            <View className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-full items-center justify-center">
              <Star className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
            </View>
            <Text className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Star
            </Text>
          </View>
          
          <View className="items-center">
            <View className="w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-full items-center justify-center">
              <Sparkles className="w-6 h-6 text-accent-600 dark:text-accent-400" />
            </View>
            <Text className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
              Sparkles
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 dark:from-neutral-900 dark:via-primary-950 dark:to-secondary-950">
      {/* Header */}
      <View className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700 p-4">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 text-center">
          ClubNath Design System
        </Text>
        <Text className="text-sm text-neutral-600 dark:text-neutral-400 text-center mt-1">
          Acolhimento, Conexão e Pertencentimento
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700">
        {[
          { key: 'colors', label: 'Cores' },
          { key: 'typography', label: 'Tipografia' },
          { key: 'components', label: 'Componentes' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setSelectedTab(tab.key as any)}
            className={`flex-1 py-3 px-4 ${
              selectedTab === tab.key
                ? 'border-b-2 border-primary-500'
                : 'border-b-2 border-transparent'
            }`}
          >
            <Text
              className={`text-center font-medium ${
                selectedTab === tab.key
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4">
        {selectedTab === 'colors' && <ColorPalette />}
        {selectedTab === 'typography' && <TypographyDemo />}
        {selectedTab === 'components' && <ComponentsDemo />}
      </ScrollView>
    </View>
  );
};
