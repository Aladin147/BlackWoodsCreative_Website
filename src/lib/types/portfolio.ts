export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  category: 'Film' | 'Photography' | '3D Visualization' | 'Scene Creation';
  type: 'image' | 'video';
  image: string;
  video?: string;
  tags?: string[];
  client?: string;
  year?: number;
  featured?: boolean;
  duration?: string; // For videos
  dimensions?: string; // For images
  software?: string[]; // Tools used
}

export interface PortfolioCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}
