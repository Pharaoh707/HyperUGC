// Shared Vimeo thumbnail and metadata cache to prevent duplicate requests and rate limiting
export interface VimeoVideoData {
  thumbnailUrl: string;
  width: number;
  height: number;
  isVertical: boolean;
}

const videoDataCache: Record<string, VimeoVideoData> = {};
const pendingPromises: Record<string, Promise<VimeoVideoData>> = {};

// Hardcoded static metadata catalog for all our Vimeo videos to guarantee instant load times & offline/sandbox stability
const KNOWN_VIDEOS_METADATA: Record<string, { isVertical: boolean; width: number; height: number; thumbnailUrl: string }> = {
  // Portfolio section (Vertical except Beauty Commercial)
  "1188912682": {
    isVertical: true,
    width: 1080,
    height: 1920,
    thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=640&auto=format&fit=crop"
  },
  "1188913854": {
    isVertical: true,
    width: 1080,
    height: 1920,
    thumbnailUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=640&auto=format&fit=crop"
  },
  "1188913175": {
    isVertical: true,
    width: 1080,
    height: 1920,
    thumbnailUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=640&auto=format&fit=crop"
  },
  "1188914310": {
    isVertical: true,
    width: 1080,
    height: 1920,
    thumbnailUrl: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=640&auto=format&fit=crop"
  },
  "1188914606": { // Beauty Commercial - Widescreen Landscape!
    isVertical: false,
    width: 1920,
    height: 1080,
    thumbnailUrl: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=640&auto=format&fit=crop"
  },
  "1188915268": {
    isVertical: true,
    width: 1080,
    height: 1920,
    thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=640&auto=format&fit=crop"
  },
  "1188915732": {
    isVertical: true,
    width: 1080,
    height: 1920,
    thumbnailUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=640&auto=format&fit=crop"
  },

  // Format types section (Landscape or vertical as requested)
  "1188918140": { // TV-Style Ad
    isVertical: false,
    width: 1920,
    height: 1080,
    thumbnailUrl: "https://images.unsplash.com/photo-1461151304267-38535e780c79?q=80&w=640&auto=format&fit=crop"
  },
  "1188916883": { // Unboxing / Tutorial Guide
    isVertical: true,
    width: 1080,
    height: 1920,
    thumbnailUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=640&auto=format&fit=crop"
  },
  "1188916214": { // Product Review
    isVertical: true,
    width: 1080,
    height: 1920,
    thumbnailUrl: "https://images.unsplash.com/photo-1552581230-c01bc911b054?q=80&w=640&auto=format&fit=crop"
  },
  "1188917925": { // Testimonial Style
    isVertical: true,
    width: 1080,
    height: 1920,
    thumbnailUrl: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=640&auto=format&fit=crop"
  },
  "1188917415": { // Beauty Hero Reel - Landscape or cinematic closeups
    isVertical: false,
    width: 1920,
    height: 1080,
    thumbnailUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=640&auto=format&fit=crop"
  }
};

/**
 * Fetches high-quality thumbnail and native metadata (dimensions) of a Vimeo video using cached, fast channels.
 * Prevents triggering security/abuse rate limits on the client side.
 */
export function getVimeoVideoData(vimeoId: string): Promise<VimeoVideoData> {
  if (videoDataCache[vimeoId]) {
    return Promise.resolve(videoDataCache[vimeoId]);
  }
  if (pendingPromises[vimeoId]) {
    return pendingPromises[vimeoId];
  }

  // Pre-populate with known static defaults as the fast base
  const staticFallback = KNOWN_VIDEOS_METADATA[vimeoId] || {
    isVertical: true,
    width: 1080,
    height: 1920,
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=640&auto=format&fit=crop"
  };

  const promise = fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}&width=960`)
    .then((res) => {
      if (!res.ok) throw new Error("oEmbed failed");
      return res.json();
    })
    .then((data) => {
      if (data && data.thumbnail_url) {
        let url = data.thumbnail_url;
        if (url.startsWith("http://")) {
          url = url.replace("http://", "https://");
        }
        
        // Retrieve native width and height from Vimeo metadata
        const width = data.width || staticFallback.width;
        const height = data.height || staticFallback.height;
        
        // Prefer known static layout properties for robust consistency, or calculate on-the-fly
        const isVertical = KNOWN_VIDEOS_METADATA[vimeoId] !== undefined 
          ? KNOWN_VIDEOS_METADATA[vimeoId].isVertical 
          : height > width;

        const result: VimeoVideoData = {
          thumbnailUrl: url,
          width,
          height,
          isVertical,
        };
        videoDataCache[vimeoId] = result;
        return result;
      }
      throw new Error("Invalid oEmbed response");
    })
    .catch((err) => {
      console.warn(`oEmbed failed for video ${vimeoId}, falling back to V2 API:`, err);
      // Fallback to older legacy v2 API
      return fetch(`https://vimeo.com/api/v2/video/${vimeoId}.json`)
        .then((res) => {
          if (!res.ok) throw new Error("V2 API failed");
          return res.json();
        })
        .then((data) => {
          if (data && data[0]) {
            let url = data[0].thumbnail_large || staticFallback.thumbnailUrl;
            if (url.startsWith("http://")) {
              url = url.replace("http://", "https://");
            }
            const width = data[0].width || staticFallback.width;
            const height = data[0].height || staticFallback.height;
            const isVertical = KNOWN_VIDEOS_METADATA[vimeoId] !== undefined 
              ? KNOWN_VIDEOS_METADATA[vimeoId].isVertical 
              : height > width;

            const result: VimeoVideoData = {
              thumbnailUrl: url,
              width,
              height,
              isVertical,
            };
            videoDataCache[vimeoId] = result;
            return result;
          }
          throw new Error("No data found");
        });
    })
    .catch((err) => {
      console.error(`Both thumbnail extraction methods failed for ${vimeoId}, using catalog metadata:`, err);
      // Return static catalogs as complete bulletproof layout fallback
      const result: VimeoVideoData = {
        thumbnailUrl: staticFallback.thumbnailUrl,
        width: staticFallback.width,
        height: staticFallback.height,
        isVertical: staticFallback.isVertical,
      };
      videoDataCache[vimeoId] = result;
      return result;
    });

  pendingPromises[vimeoId] = promise;
  return promise;
}

// Retain legacy method for backward compatibility
export function getVimeoThumbnail(vimeoId: string): Promise<string> {
  return getVimeoVideoData(vimeoId).then((data) => data.thumbnailUrl);
}
