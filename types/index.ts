// Shared types for LinkForge

export type BlockType = "link" | "header" | "social" | "about" | "embed";
export type EventType = "view" | "click";

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  user_id: string;
  title: string | null;
  bio: string | null;
  theme: ThemeConfig;
  seo_title: string | null;
  seo_description: string | null;
  favicon_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  blocks?: Block[];
  user?: User;
}

export interface Block {
  id: string;
  page_id: string;
  type: BlockType;
  title: string | null;
  url: string | null;
  icon: string | null;
  position: number;
  settings: Record<string, unknown>;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ThemeConfig {
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
  borderRadius?: string;
  fontFamily?: string;
  buttonStyle?: "fill" | "outline" | "shadow" | "glass" | "brutal";
  backgroundImage?: string;
  backgroundGradient?: string;
  cardBackground?: string;
  cardBorder?: string;
  spacing?: string;
}

export interface AnalyticsEvent {
  id: string;
  page_id: string;
  block_id: string | null;
  event_type: EventType;
  referrer: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface AnalyticsSummary {
  total_views: number;
  total_clicks: number;
  ctr: number;
  top_links: {
    block_id: string;
    title: string;
    clicks: number;
    ctr: number;
  }[];
}

export interface TimelineData {
  date: string;
  views: number;
  clicks: number;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// Theme presets
export const THEME_PRESETS: Record<string, ThemeConfig> = {
  "minimal-light": {
    backgroundColor: "#FFFFFF",
    textColor: "#09090B",
    buttonColor: "transparent",
    buttonTextColor: "#09090B",
    buttonHoverColor: "#F4F4F5",
    borderRadius: "12px",
    fontFamily: "Inter",
    buttonStyle: "outline",
    cardBackground: "transparent",
    cardBorder: "#E4E4E7",
    spacing: "12px",
  },
  "minimal-dark": {
    backgroundColor: "#0A0A0A",
    textColor: "#FAFAFA",
    buttonColor: "#FAFAFA",
    buttonTextColor: "#0A0A0A",
    buttonHoverColor: "#E4E4E7",
    borderRadius: "12px",
    fontFamily: "Inter",
    buttonStyle: "fill",
    cardBackground: "#18181B",
    cardBorder: "#27272A",
    spacing: "12px",
  },
  glassmorphism: {
    backgroundColor: "#0F0A1F",
    backgroundGradient: "linear-gradient(135deg, #1a0533 0%, #0a1628 50%, #0f0a1f 100%)",
    textColor: "#FAFAFA",
    buttonColor: "rgba(255, 255, 255, 0.1)",
    buttonTextColor: "#FAFAFA",
    buttonHoverColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "16px",
    fontFamily: "Inter",
    buttonStyle: "glass",
    cardBackground: "rgba(255, 255, 255, 0.05)",
    cardBorder: "rgba(255, 255, 255, 0.1)",
    spacing: "14px",
  },
  "gradient-neon": {
    backgroundColor: "#0A0A0A",
    textColor: "#FAFAFA",
    buttonColor: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
    buttonTextColor: "#FFFFFF",
    buttonHoverColor: "linear-gradient(135deg, #2563EB, #7C3AED)",
    borderRadius: "12px",
    fontFamily: "Inter",
    buttonStyle: "fill",
    cardBackground: "#18181B",
    cardBorder: "#27272A",
    spacing: "12px",
  },
  brutalist: {
    backgroundColor: "#F5F0E8",
    textColor: "#000000",
    buttonColor: "#FFFFFF",
    buttonTextColor: "#000000",
    buttonHoverColor: "#000000",
    borderRadius: "0px",
    fontFamily: "serif",
    buttonStyle: "brutal",
    cardBackground: "#FFFFFF",
    cardBorder: "#000000",
    spacing: "16px",
  },
};
