// Simulated Instagram API integration
// In a real production environment, this would call a 3rd party API like RapidAPI (e.g. Instagram Data API)

export interface IGProfile {
  username: string;
  fullName: string;
  followers: number;
  following: number;
  engagementRate: number;
  biography: string;
}

export const fetchInstagramProfile = async (handle: string): Promise<IGProfile> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const cleanHandle = handle.replace('@', '').toLowerCase().trim();
  
  if (!cleanHandle) {
    throw new Error('Please provide a valid Instagram handle.');
  }

  // Consistent mock data generation based on string length and char codes
  const seed = cleanHandle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const followers = Math.floor(10000 + (seed * 1234) % 900000);
  const engagementRate = Number((1.5 + (seed % 7)).toFixed(2));
  
  return {
    username: cleanHandle,
    fullName: cleanHandle.charAt(0).toUpperCase() + cleanHandle.slice(1),
    followers,
    following: Math.floor(followers * 0.01),
    engagementRate,
    biography: `Official account of ${cleanHandle}. ✨ Content creator & lifestyle. 📩 Collabs: collab@${cleanHandle}.com`
  };
};
