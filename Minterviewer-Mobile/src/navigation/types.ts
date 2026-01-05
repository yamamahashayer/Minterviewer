export interface TabConfig {
  name: string;
  label: string;
  icon: string;
  component: React.ComponentType<any>;
  badge?: number;
}

export interface NavigatorProps {
  tabs: TabConfig[];
}
