export interface BoutiqueProduct {
  id: string;
  title?: string;
  price?: number;
  fileUrl: string;
  category: string; // 'bridal_sarees' | 'designer_lehengas' | 'kurtis' | 'festive'
  fileSize?: number;
  fileName?: string;
  createdAt?: string;
}

export interface BoutiquePlan {
  id: string;
  name: string;
  priceInrMonthly: number;
  priceInrYearly: number;
  maxImages: number;
  maxStorageBytes: number;
  allowWhatsappOrdering?: boolean;
  allowCustomDomain?: boolean;
  allowEcommerce?: boolean;
}

export interface BoutiqueSubscriptionStatus {
  clientId: string;
  businessName?: string;
  status: string;
  planId?: string;
  planName?: string;
  priceInrMonthly?: number;
  priceInrYearly?: number;
  maxImages?: number;
  maxStorageBytes?: number;
  currentImagesCount?: number;
  currentStorageBytes?: number;
  currentPeriodEnd?: string;
  gracePeriodEndsAt?: string;
  isManualOverride?: boolean;
  allowWhatsappOrdering?: boolean;
  ownerPhone?: string;
}

export interface BoutiqueSDKInstance {
  config: {
    clientId: string;
    publicKey: string;
    secretKey?: string;
    apiUrl?: string;
    whatsappNumber?: string;
    debug?: boolean;
  };
  storage: {
    fetchMedia: () => Promise<BoutiqueProduct[]>;
    upload: (
      file: File,
      options?: {
        title?: string;
        price?: number;
        category?: string;
        onProgress?: (pct: number) => void;
      }
    ) => Promise<BoutiqueProduct>;
    delete: (photoId: string) => Promise<{ success: boolean; id: string }>;
  };
  whatsapp: {
    openChat: (product: BoutiqueProduct, customPhone?: string) => void;
    generateOrderLink: (product: BoutiqueProduct, customPhone?: string) => string;
  };
  gatekeeper: {
    checkStatus: (forceRefresh?: boolean) => Promise<BoutiqueSubscriptionStatus>;
    fetchPlans?: () => Promise<BoutiquePlan[]>;
  };
  billing: {
    openRenewalModal: (options?: { planId?: string; billingCycle?: string }) => void;
  };
  admin?: {
    mount: (element: HTMLElement) => void;
  };
}

export interface BoutiqueSDKConstructor {
  new (config: {
    clientId: string;
    publicKey: string;
    secretKey?: string;
    apiUrl?: string;
    whatsappNumber?: string;
    debug?: boolean;
  }): BoutiqueSDKInstance;
}

declare global {
  interface Window {
    boutique?: BoutiqueSDKInstance;
    BoutiqueSDK?: BoutiqueSDKConstructor;
  }
}
