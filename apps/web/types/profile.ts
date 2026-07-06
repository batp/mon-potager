export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  region: string | null;
  climate_zone: string | null;
  is_premium: boolean;
}
