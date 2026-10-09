import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import BookmarksScreen from './bookmarks';

export default function ForYouScreen() {
  const router = useRouter();

  useEffect(() => {
    // Seamlessly navigate to For You sub-tab under the Save (Bookmarks) tab
    router.replace('/bookmarks?tab=foryou' as any);
  }, [router]);

  return <BookmarksScreen />;
}
