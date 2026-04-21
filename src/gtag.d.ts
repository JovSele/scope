// TypeScript declaration for Google Analytics gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (
      command: 'event' | 'config' | 'js',
      targetId: string | Date,
      config?: {
        event_category?: string;
        event_label?: string;
        [key: string]: any;
      }
    ) => void;
  }
}

export {};
