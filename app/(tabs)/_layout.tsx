import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#006B3F',
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#111827' : '#FFFFFF',
          borderTopColor: isDark ? '#1F2937' : '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: isDark ? '#111827' : '#FFFFFF',
        },
        headerTintColor: isDark ? '#FFFFFF' : '#000000',
      }}
    >
      {/* 1. হোম (Home) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'হোম',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size - 1}
              color={color}
            />
          ),
        }}
      />

      {/* 2. ইপেপার (ePaper) */}
      <Tabs.Screen
        name="epaper"
        options={{
          title: 'ই-পেপার',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'newspaper' : 'newspaper-outline'}
              size={size - 1}
              color={color}
            />
          ),
        }}
      />

      {/* 3. ভিডিও (Video Hub) */}
      <Tabs.Screen
        name="video"
        options={{
          title: 'ভিডিও',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'play-circle' : 'play-circle-outline'}
              size={size - 1}
              color={color}
            />
          ),
        }}
      />

      {/* 4. সেভ (Saved & Offline) */}
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'সেভ',
          headerShown: true,
          headerTitle: 'সংরক্ষিত সংবাদ',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'bookmark' : 'bookmark-outline'}
              size={size - 1}
              color={color}
            />
          ),
        }}
      />

      {/* 5. মেনু (Menu & All Categories) */}
      <Tabs.Screen
        name="menu"
        options={{
          title: 'মেনু',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'menu' : 'menu-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Auxiliary screens kept accessible via routes without bottom bar icons */}
      <Tabs.Screen
        name="search"
        options={{
          href: null,
          title: 'অনুসন্ধান',
        }}
      />
      <Tabs.Screen
        name="foryou"
        options={{
          href: null,
          title: 'আপনার জন্য',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          title: 'প্রোফাইল',
        }}
      />
    </Tabs>
  );
}
