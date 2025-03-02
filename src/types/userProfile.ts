export interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  bio: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null;
  location: string | null;
  language: string | null;
  timezone: string | null;
  themePreference: string | null;
  lastLoginAt: string | null;
  isActive: boolean;
  role: string | null;
}

export interface UpdateProfileRequest {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  location?: string | null;
  language?: string | null;
  timezone?: string | null;
  themePreference?: string | null;
}