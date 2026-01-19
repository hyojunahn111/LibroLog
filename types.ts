
export interface Book {
  id: string;
  title: string;
  imageUrl: string;
  rating: number | null; // Can be null if not rated yet
  logDate: string; // The specific day to show on calendar
  startDate: string;
  endDate: string | null;
  review?: string;
  quotes?: string[]; // New: List of memorable quotes
  description?: string;
  category?: string;
}

export type ViewType = 'calendar' | 'list';
export type ListFilter = 'all' | 'finished' | 'reading';
