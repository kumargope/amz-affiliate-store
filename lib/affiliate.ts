/**
 * Formats an Amazon product URL by ensuring it includes the configured Associate Tag.
 *
 * @param url Raw Amazon or Affiliate URL
 * @param customTag Optional Associate Tag override
 * @returns Clean affiliate URL with Amazon Associate tag appended
 */
export function buildAffiliateUrl(url: string, customTag?: string): string {
  if (!url) return '#'
  
  const defaultTag = process.env.AMAZON_ASSOCIATE_TAG || 'amzfinds-20'
  const tagToUse = customTag || defaultTag

  try {
    const parsed = new URL(url)
    
    // Check if it's an amazon domain or amzn.to shortlink
    if (parsed.hostname.includes('amazon.') || parsed.hostname.includes('amzn.to')) {
      parsed.searchParams.set('tag', tagToUse)
      return parsed.toString()
    }
    
    return url
  } catch {
    // If URL parsing fails, return as-is
    return url
  }
}

/**
 * Validates if a string is a standard HTTP/HTTPS URL
 */
export function isValidUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}
