import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeTokens } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { t } from '../../services/i18n';

export default function TabLayout() {
  const tokens = useThemeTokens();
  const language = useAppStore((state) => state.language);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tokens.brand.primary,
        tabBarInactiveTintColor: tokens.interactive.inactive,
        tabBarStyle: {
          backgroundColor: tokens.surface.base,
          borderTopColor: tokens.border.default,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
        headerStyle: {
          backgroundColor: tokens.surface.base,
          borderBottomColor: tokens.border.default,
          borderBottomWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: tokens.text.primary,
      }}
    >
      {/* 1. হোম (Home) */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('tab_home', language),
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
          title: t('tab_epaper', language),
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
          title: t('tab_video', language),
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

      {/* 4. সেভ (Saved & For You) */}
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: t('tab_saved', language),
          headerShown: false,
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
          title: t('tab_menu', language),
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
          title: 'Search',
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          href: null,
          title: 'Profile',
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="foryou"
        options={{
          href: null,
          title: 'For You',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
