import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PlatformType,
  Phase,
  YouTubeData,
  ShopifyData,
  CryptoData,
  BankData,
  NotificationItem,
} from '../types';
import {
  DEFAULT_PHASES,
  recalculateShopify,
  recalculateYouTube,
  recalculateCrypto,
  recalculateBank,
} from '../data/defaultScenarios';
import { ImageUploadModal } from '../components/common/ImageUploadModal';

const STORAGE_KEY_PHASES = 'propstudio_phases_v5';
const STORAGE_KEY_ACTIVE_PHASE = 'propstudio_active_phase_v5';

export function getPlatformFromPath(path: string): PlatformType {
  const clean = path.toLowerCase().replace(/^\/+|\/+$/g, '');
  if (clean.includes('youtube')) return 'youtube';
  if (clean.includes('shopify')) return 'shopify';
  if (clean.includes('ledger') || clean.includes('crypto')) return 'crypto';
  if (clean.includes('bank')) return 'bank';
  return 'launcher';
}

export function getPathForPlatform(platform: PlatformType): string {
  switch (platform) {
    case 'youtube':
      return '/youtube-studio';
    case 'shopify':
      return '/shopify';
    case 'crypto':
      return '/ledger';
    case 'bank':
      return '/bank';
    case 'launcher':
    default:
      return '/';
  }
}

export interface InlineEditTarget {
  label: string;
  value: string | number;
  type?: 'number' | 'text';
  step?: string;
  prefix?: string;
  suffix?: string;
  onSave: (newValue: any) => void;
}

export interface ImagePickerTarget {
  title: string;
  currentImage: string;
  onSaveImage: (newUrl: string) => void;
}

interface AppContextType {
  currentPlatform: PlatformType;
  setCurrentPlatform: (platform: PlatformType) => void;
  phases: Phase[];
  // alias for backward compatibility
  scenarios: Phase[];
  activePhaseId: string;
  activePhase: Phase;
  // alias
  activeScenarioId: string;
  activeScenario: Phase;
  appMode: 'film' | 'edit';
  setAppMode: (mode: 'film' | 'edit') => void;
  toggleAppMode: () => void;
  isControlCenterOpen: boolean;
  setIsControlCenterOpen: (open: boolean) => void;
  activeNotification: NotificationItem | null;
  setActiveNotification: (item: NotificationItem | null) => void;
  isLockScreenVisible: boolean;
  setIsLockScreenVisible: (visible: boolean) => void;
  inlineEditTarget: InlineEditTarget | null;
  openInlineEdit: (target: InlineEditTarget) => void;
  closeInlineEdit: () => void;
  openImagePicker: (target: ImagePickerTarget) => void;
  triggerNotification: (item: NotificationItem, delayMs?: number) => void;
  switchPhase: (id: string) => void;
  switchScenario: (id: string) => void;
  saveNewPhase: (name: string, description: string) => void;
  saveNewScenario: (name: string, description: string) => void;
  duplicatePhase: (id: string) => void;
  duplicateScenario: (id: string) => void;
  deletePhase: (id: string) => void;
  deleteScenario: (id: string) => void;
  resetCurrentPhase: () => void;
  resetCurrentScenario: () => void;
  exportPhasesJson: () => string;
  exportScenariosJson: () => string;
  importPhasesJson: (json: string) => boolean;
  importScenariosJson: (json: string) => boolean;
  updateYouTube: (patch: Partial<YouTubeData>, autoCalc?: boolean) => void;
  updateShopify: (patch: Partial<ShopifyData>, autoCalc?: boolean) => void;
  updateCrypto: (patch: Partial<CryptoData>, autoCalc?: boolean) => void;
  updateBank: (patch: Partial<BankData>, autoCalc?: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize platform based on browser URL pathname
  const [currentPlatform, setCurrentPlatformState] = useState<PlatformType>(() => {
    if (typeof window !== 'undefined') {
      return getPlatformFromPath(window.location.pathname);
    }
    return 'launcher';
  });

  const [appMode, setAppMode] = useState<'film' | 'edit'>('film');
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<NotificationItem | null>(null);
  const [isLockScreenVisible, setIsLockScreenVisible] = useState(false);
  const [inlineEditTarget, setInlineEditTarget] = useState<InlineEditTarget | null>(null);
  const [imagePickerTarget, setImagePickerTarget] = useState<ImagePickerTarget | null>(null);

  // Synchronize browser history and path whenever setCurrentPlatform is called
  const setCurrentPlatform = (platform: PlatformType) => {
    setCurrentPlatformState(platform);
    if (typeof window !== 'undefined') {
      const targetPath = getPathForPlatform(platform);
      if (window.location.pathname.toLowerCase() !== targetPath) {
        window.history.pushState({ platform }, '', targetPath);
      }
    }
  };

  // Listen to browser Back and Forward navigation buttons
  useEffect(() => {
    const handlePopState = () => {
      const plat = getPlatformFromPath(window.location.pathname);
      setCurrentPlatformState(plat);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Phases state with LocalStorage persistence
  const [phases, setPhases] = useState<Phase[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PHASES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading phases from storage', e);
    }
    return DEFAULT_PHASES;
  });

  const [activePhaseId, setActivePhaseId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ACTIVE_PHASE);
      if (stored) return stored;
    } catch {}
    return DEFAULT_PHASES[0].id;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PHASES, JSON.stringify(phases));
    } catch (e) {
      console.warn('Failed saving phases', e);
    }
  }, [phases]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_PHASE, activePhaseId);
    } catch {}
  }, [activePhaseId]);

  const activePhase = phases.find((s) => s.id === activePhaseId) || phases[0];

  const toggleAppMode = () => {
    setAppMode((prev) => (prev === 'film' ? 'edit' : 'film'));
  };

  const openInlineEdit = (target: InlineEditTarget) => {
    setInlineEditTarget(target);
  };

  const closeInlineEdit = () => {
    setInlineEditTarget(null);
  };

  const openImagePicker = (target: ImagePickerTarget) => {
    setImagePickerTarget(target);
  };

  const triggerNotification = (item: NotificationItem, delayMs = 0) => {
    if (delayMs <= 0) {
      setActiveNotification(item);
      setTimeout(() => {
        setActiveNotification((curr) => (curr?.id === item.id ? null : curr));
      }, 5500);
    } else {
      setTimeout(() => {
        setActiveNotification(item);
        setTimeout(() => {
          setActiveNotification((curr) => (curr?.id === item.id ? null : curr));
        }, 5500);
      }, delayMs);
    }
  };

  const switchPhase = (id: string) => {
    if (phases.some((s) => s.id === id)) {
      setActivePhaseId(id);
    }
  };

  const saveNewPhase = (name: string, description: string) => {
    const newId = `phase-custom-${Date.now()}`;
    const newPhase: Phase = {
      ...activePhase,
      id: newId,
      name,
      description: description || 'Custom film phase',
      createdAt: new Date().toISOString(),
    };
    setPhases((prev) => [...prev, newPhase]);
    setActivePhaseId(newId);
  };

  const duplicatePhase = (id: string) => {
    const target = phases.find((s) => s.id === id);
    if (!target) return;
    const newId = `phase-dup-${Date.now()}`;
    const copy: Phase = {
      ...JSON.parse(JSON.stringify(target)),
      id: newId,
      name: `${target.name} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    setPhases((prev) => [...prev, copy]);
    setActivePhaseId(newId);
  };

  const deletePhase = (id: string) => {
    if (phases.length <= 1) return;
    const filtered = phases.filter((s) => s.id !== id);
    setPhases(filtered);
    if (activePhaseId === id) {
      setActivePhaseId(filtered[0].id);
    }
  };

  const resetCurrentPhase = () => {
    const defaultMatch = DEFAULT_PHASES.find((s) => s.id === activePhaseId);
    if (defaultMatch) {
      setPhases((prev) =>
        prev.map((s) => (s.id === activePhaseId ? JSON.parse(JSON.stringify(defaultMatch)) : s))
      );
    } else {
      setActivePhaseId(DEFAULT_PHASES[0].id);
    }
  };

  const exportPhasesJson = () => {
    return JSON.stringify(phases, null, 2);
  };

  const importPhasesJson = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].youtube && parsed[0].shopify) {
        setPhases(parsed);
        setActivePhaseId(parsed[0].id);
        return true;
      }
    } catch (e) {
      console.error('Import failed', e);
    }
    return false;
  };

  const updateYouTube = (patch: Partial<YouTubeData>, autoCalc = false) => {
    setPhases((prev) =>
      prev.map((s) => {
        if (s.id !== activePhaseId) return s;
        const merged = { ...s.youtube, ...patch };
        const shouldRecalc = autoCalc || patch.views !== undefined || patch.estimatedRevenue !== undefined || patch.rpm !== undefined;
        const updated = shouldRecalc ? recalculateYouTube(merged) : merged;
        return { ...s, youtube: updated };
      })
    );
  };

  const updateShopify = (patch: Partial<ShopifyData>, autoCalc = false) => {
    setPhases((prev) =>
      prev.map((s) => {
        if (s.id !== activePhaseId) return s;
        const merged = { ...s.shopify, ...patch };
        const manualTotalOnly = !autoCalc && patch.totalSales !== undefined && patch.ordersCount === undefined && patch.sessions === undefined && patch.aov === undefined;
        const shouldRecalc = !manualTotalOnly && (autoCalc || patch.totalSales !== undefined || patch.ordersCount !== undefined || patch.sessions !== undefined || patch.aov !== undefined);
        const updated = shouldRecalc ? recalculateShopify(merged) : merged;
        return { ...s, shopify: updated };
      })
    );
  };

  const updateCrypto = (patch: Partial<CryptoData>, autoCalc = false) => {
    setPhases((prev) =>
      prev.map((s) => {
        if (s.id !== activePhaseId) return s;
        const merged = { ...s.crypto, ...patch };
        const updated = autoCalc ? recalculateCrypto(merged) : merged;
        return { ...s, crypto: updated };
      })
    );
  };

  const updateBank = (patch: Partial<BankData>, autoCalc = false) => {
    setPhases((prev) =>
      prev.map((s) => {
        if (s.id !== activePhaseId) return s;
        const merged = { ...s.bank, ...patch };
        const updated = autoCalc ? recalculateBank(merged) : merged;
        return { ...s, bank: updated };
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentPlatform,
        setCurrentPlatform,
        phases,
        scenarios: phases,
        activePhaseId,
        activePhase,
        activeScenarioId: activePhaseId,
        activeScenario: activePhase,
        appMode,
        setAppMode,
        toggleAppMode,
        isControlCenterOpen,
        setIsControlCenterOpen,
        activeNotification,
        setActiveNotification,
        isLockScreenVisible,
        setIsLockScreenVisible,
        inlineEditTarget,
        openInlineEdit,
        closeInlineEdit,
        openImagePicker,
        triggerNotification,
        switchPhase,
        switchScenario: switchPhase,
        saveNewPhase,
        saveNewScenario: saveNewPhase,
        duplicatePhase,
        duplicateScenario: duplicatePhase,
        deletePhase,
        deleteScenario: deletePhase,
        resetCurrentPhase,
        resetCurrentScenario: resetCurrentPhase,
        exportPhasesJson,
        exportScenariosJson: exportPhasesJson,
        importPhasesJson,
        importScenariosJson: importPhasesJson,
        updateYouTube,
        updateShopify,
        updateCrypto,
        updateBank,
      }}
    >
      {children}

      {imagePickerTarget && (
        <ImageUploadModal
          isOpen={!!imagePickerTarget}
          onClose={() => setImagePickerTarget(null)}
          title={imagePickerTarget.title}
          currentImage={imagePickerTarget.currentImage}
          onSaveImage={imagePickerTarget.onSaveImage}
        />
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
