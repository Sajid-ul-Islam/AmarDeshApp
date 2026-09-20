// Deep Link Service - Handle URL parameters for article/category navigation

export interface DeepLinkParams {
  article?: string;
  category?: string;
  tab?: string;
  shared?: string;
}

/**
 * Parse URL search parameters into a structured object
 */
export function parseDeepLink(): DeepLinkParams {
  const params = new URLSearchParams(window.location.search);
  
  return {
    article: params.get('article') || undefined,
    category: params.get('category') || undefined,
    tab: params.get('tab') || undefined,
    shared: params.get('shared') || undefined,
  };
}

/**
 * Check if there are any deep link parameters
 */
export function hasDeepLink(): boolean {
  const params = parseDeepLink();
  return !!(params.article || params.category || params.tab);
}

/**
 * Clear deep link parameters from URL (without page reload)
 */
export function clearDeepLink(): void {
  if (window.location.search) {
    const newUrl = window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }
}

/**
 * Generate a share URL for an article
 */
export function generateArticleShareUrl(articleId: string): string {
  const base = window.location.origin;
  return `${base}?article=${articleId}&shared=true`;
}

/**
 * Generate a share URL for a category
 */
export function generateCategoryShareUrl(category: string): string {
  const base = window.location.origin;
  return `${base}?category=${encodeURIComponent(category)}`;
}

/**
 * Validate deep link parameters
 */
export function validateDeepLink(params: DeepLinkParams): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check for conflicting parameters
  if (params.article && params.category) {
    errors.push('Cannot specify both article and category');
  }
  
  // Validate article ID format (if present)
  if (params.article && !/^amd\d+$/.test(params.article)) {
    errors.push('Invalid article ID format');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
