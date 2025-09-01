export interface BoxItem {
  id?: string;
  title: string;
  description: string;
  image?: string;
  images?: string[];
}

export interface SlideshowProps {
  containerId?: string;
  images: string[];
  autoPlayInterval?: number;
}

export interface BoxListProps {
  data: BoxItem[];
  hasSlideshow: boolean;
}

export interface SectionHeaderProps {
  id?: string;
  title: string;
}

export interface NavbarState {
  isMenuOpen: boolean;
  isScrolled: boolean;
  openDropdown: string | null;
}
