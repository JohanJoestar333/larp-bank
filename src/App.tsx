/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { IPhoneFrame } from './components/device/IPhoneFrame';
import { PlatformLauncher } from './components/launcher/PlatformLauncher';
import { YouTubeDashboard } from './components/platforms/YouTubeDashboard';
import { ShopifyDashboard } from './components/platforms/ShopifyDashboard';
import { LedgerDashboard } from './components/platforms/LedgerDashboard';
import { BankDashboard } from './components/platforms/BankDashboard';
import { IOSNotificationBanner } from './components/notifications/IOSNotificationBanner';
import { IOSLockScreenOverlay } from './components/notifications/IOSLockScreenOverlay';
import { QuickInlineEditor } from './components/editor/QuickInlineEditor';
import { ControlCenterDrawer } from './components/editor/ControlCenterDrawer';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

const AppContent: React.FC = () => {
  const { currentPlatform } = useApp();

  const renderActivePlatform = () => {
    switch (currentPlatform) {
      case 'youtube':
        return <YouTubeDashboard />;
      case 'shopify':
        return <ShopifyDashboard />;
      case 'crypto':
        return <LedgerDashboard />;
      case 'bank':
        return <BankDashboard />;
      case 'launcher':
      default:
        return <PlatformLauncher />;
    }
  };

  return (
    <IPhoneFrame>
      {/* Active Platform View */}
      <div className="flex-1 w-full overflow-y-auto no-scrollbar relative flex flex-col">
        {renderActivePlatform()}
      </div>

      {/* Global Overlays & Modals */}
      <IOSNotificationBanner />
      <IOSLockScreenOverlay />
      <QuickInlineEditor />
      <ControlCenterDrawer />
      <OfflineIndicator />
    </IPhoneFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
