import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  RotateCcw,
  Copy,
  Upload,
  Layers,
  Youtube,
  ShoppingBag,
  Shield,
  Landmark,
  Bell,
  Settings,
  Plus,
  Trash2,
  Check,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import { TimePeriod } from '../../types';
import { PLATFORM_LOGOS, PlatformCardLogo, PlatformHeaderLogo } from '../../config/platformLogos';

export const ControlCenterDrawer: React.FC = () => {
  const {
    isControlCenterOpen,
    setIsControlCenterOpen,
    activePhase,
    phases,
    activePhaseId,
    switchPhase,
    saveNewPhase,
    duplicatePhase,
    deletePhase,
    resetCurrentPhase,
    exportPhasesJson,
    importPhasesJson,
    updateYouTube,
    updateShopify,
    updateCrypto,
    updateBank,
    triggerNotification,
    openImagePicker,
    appMode,
    setAppMode,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'phases' | 'media' | 'youtube' | 'shopify' | 'crypto' | 'bank' | 'notifications'
  >('phases');

  // Phase form state
  const [newPhaseName, setNewPhaseName] = useState('');
  const [newPhaseDesc, setNewPhaseDesc] = useState('');
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState(false);

  // Notification simulator state
  const [notifPlatform, setNotifPlatform] = useState<'shopify' | 'bank' | 'youtube' | 'crypto'>('shopify');
  const [notifTitle, setNotifTitle] = useState('New order received');
  const [notifMsg, setNotifMsg] = useState('Sarah Jenkins placed order #1842');
  const [notifAmount, setNotifAmount] = useState('+$149.00');
  const [notifDelay, setNotifDelay] = useState(0);

  if (!isControlCenterOpen) return null;

  const yt = activePhase.youtube;
  const shop = activePhase.shopify;
  const cry = activePhase.crypto;
  const bank = activePhase.bank;

  const handleCreatePhase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhaseName.trim()) return;
    saveNewPhase(newPhaseName.trim(), newPhaseDesc.trim());
    setNewPhaseName('');
    setNewPhaseDesc('');
  };

  const handleExport = () => {
    const json = exportPhasesJson();
    navigator.clipboard?.writeText(json);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const ok = importPhasesJson(importJsonText.trim());
    if (ok) {
      setImportStatus('Successfully imported phases!');
      setImportJsonText('');
      setTimeout(() => setImportStatus(null), 3000);
    } else {
      setImportStatus('Invalid JSON format. Please verify and try again.');
      setTimeout(() => setImportStatus(null), 4000);
    }
  };

  const handleTriggerCustomNotification = () => {
    triggerNotification(
      {
        id: `notif-${Date.now()}`,
        platform: notifPlatform,
        title: notifTitle,
        message: notifMsg,
        amount: notifAmount,
        timestamp: 'now',
      },
      notifDelay * 1000
    );
    setIsControlCenterOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg h-full bg-[#111113] border-l border-white/10 flex flex-col text-[#f5f5f7] shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#161618]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white shadow-sm">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Prop Studio Control Center
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-[#86868b]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Active: {activePhase.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              SIMULATED PROP
            </span>
            <button
              onClick={() => setIsControlCenterOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto px-4 py-2 border-b border-white/[0.06] bg-[#141416] text-xs font-semibold no-scrollbar">
          <button
            onClick={() => setActiveTab('phases')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition ${
              activeTab === 'phases' ? 'bg-white text-black font-bold shadow-sm' : 'text-[#86868b] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Phases</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition ${
              activeTab === 'media' ? 'bg-white text-black font-bold shadow-sm' : 'text-[#86868b] hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Images & Media</span>
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition ${
              activeTab === 'youtube' ? 'bg-white text-black font-bold shadow-sm' : 'text-[#86868b] hover:text-white'
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube</span>
          </button>
          <button
            onClick={() => setActiveTab('shopify')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition ${
              activeTab === 'shopify' ? 'bg-white text-black font-bold shadow-sm' : 'text-[#86868b] hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shopify</span>
          </button>
          <button
            onClick={() => setActiveTab('crypto')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition ${
              activeTab === 'crypto' ? 'bg-white text-black font-bold shadow-sm' : 'text-[#86868b] hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Crypto</span>
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition ${
              activeTab === 'bank' ? 'bg-white text-black font-bold shadow-sm' : 'text-[#86868b] hover:text-white'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Bank</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition ${
              activeTab === 'notifications' ? 'bg-white text-black font-bold shadow-sm' : 'text-[#86868b] hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notifications</span>
          </button>
        </div>

        {/* Tab Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB: PHASES */}
          {activeTab === 'phases' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-[#86868b] uppercase tracking-wider mb-2.5">
                  Select Active Episode Phase
                </h3>
                <div className="space-y-2">
                  {phases.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => switchPhase(s.id)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                        s.id === activePhaseId
                          ? 'bg-white/[0.08] border-white/30 text-white'
                          : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] text-[#86868b]'
                      }`}
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{s.name}</span>
                          {s.id === activePhaseId && (
                            <span className="text-[10px] font-bold bg-white text-black px-1.5 py-0.5 rounded">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#86868b] line-clamp-1 mt-0.5">{s.description}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => duplicatePhase(s.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                          title="Duplicate Phase"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {phases.length > 1 && (
                          <button
                            onClick={() => deletePhase(s.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                            title="Delete Phase"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset to Default */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div>
                  <h4 className="text-xs font-bold text-white">Reset Phase Data</h4>
                  <p className="text-[11px] text-[#86868b]">Restore factory baseline numbers for this phase</p>
                </div>
                <button
                  onClick={resetCurrentPhase}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Create New Phase */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <h4 className="text-xs font-bold text-white mb-2">Create New Custom Phase</h4>
                <form onSubmit={handleCreatePhase} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Phase Title (e.g. Phase 5: Series Climax)"
                    value={newPhaseName}
                    onChange={(e) => setNewPhaseName(e.target.value)}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/40"
                  />
                  <input
                    type="text"
                    placeholder="Description (e.g. Scaling physical brand across 12 countries)"
                    value={newPhaseDesc}
                    onChange={(e) => setNewPhaseDesc(e.target.value)}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/40"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create & Switch to Phase</span>
                  </button>
                </form>
              </div>

              {/* Export / Import JSON */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Export / Import Phases</h4>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    {copyStatus ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copyStatus ? 'Copied JSON!' : 'Copy Phases JSON'}</span>
                  </button>
                </div>

                <textarea
                  rows={3}
                  placeholder="Paste JSON phases here to import..."
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  className="w-full rounded-xl bg-black/60 border border-white/10 p-2.5 text-[11px] font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-white/40"
                />

                {importStatus && (
                  <p className="text-xs text-amber-300 font-medium">{importStatus}</p>
                )}

                <button
                  type="button"
                  onClick={handleImport}
                  className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/10 transition flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import Phases</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: IMAGES & MEDIA */}
          {activeTab === 'media' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="font-bold text-white uppercase tracking-wider mb-1">
                  Change Platform Images & Avatars
                </h3>
                <p className="text-[#86868b] text-[11px]">
                  Upload photos from your camera roll / computer or paste image links to personalize profiles and videos for filming.
                </p>
              </div>

              {/* App Logos & Icons Guide */}
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <span>App Logos & Brand Icons</span>
                  </span>
                  <span className="text-[10px] text-blue-300 font-mono">/src/config/platformLogos.tsx</span>
                </div>
                <p className="text-[11px] text-blue-200/80 leading-relaxed">
                  Logos for the <strong>Homepage cards</strong> and <strong>top header bars</strong> can be customized in <code className="bg-black/40 px-1 py-0.5 rounded text-white font-mono">/src/config/platformLogos.tsx</code>. You can also replace files in <code className="bg-black/40 px-1 py-0.5 rounded text-white font-mono">/public/logos/</code> without needing any environment variables!
                </p>

                {/* Visual Preview Grid of Logos */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {(['youtube', 'shopify', 'crypto', 'bank'] as const).map((pid) => (
                    <div key={pid} className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/5">
                      <PlatformCardLogo platform={pid} size="sm" />
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-white block truncate">{PLATFORM_LOGOS[pid].name}</span>
                        <span className="text-[9px] text-[#86868b] block truncate font-mono">
                          {PLATFORM_LOGOS[pid].logoUrl || 'Built-in SVG'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* YouTube Channel Avatar */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={yt.avatarUrl}
                    alt="Channel Avatar"
                    className="w-12 h-12 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <h4 className="font-bold text-white">YouTube Channel Avatar</h4>
                    <p className="text-[11px] text-[#86868b]">{yt.channelName}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    openImagePicker({
                      title: 'Change Channel Profile Photo',
                      currentImage: yt.avatarUrl,
                      onSaveImage: (newUrl) => updateYouTube({ avatarUrl: newUrl }),
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change</span>
                </button>
              </div>

              {/* YouTube Video Thumbnails */}
              <div className="space-y-2">
                <span className="font-bold text-white block">YouTube Video Thumbnails</span>
                {yt.topVideos.map((video, idx) => (
                  <div key={video.id} className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-16 aspect-video rounded-lg object-cover bg-slate-900 shrink-0"
                      />
                      <div className="min-w-0">
                        <h5 className="font-semibold text-white truncate text-xs">{video.title}</h5>
                        <p className="text-[10px] text-[#86868b]">{video.views.toLocaleString()} views</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        openImagePicker({
                          title: `Change Thumbnail: ${video.title.slice(0, 24)}...`,
                          currentImage: video.thumbnail,
                          onSaveImage: (newUrl) => {
                            const updated = [...yt.topVideos];
                            updated[idx] = { ...updated[idx], thumbnail: newUrl };
                            updateYouTube({ topVideos: updated });
                          },
                        });
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white shrink-0 transition"
                    >
                      Change
                    </button>
                  </div>
                ))}
              </div>

              {/* Shopify Products */}
              <div className="space-y-2">
                <span className="font-bold text-white block">Shopify Product Images</span>
                {shop.topProducts.map((prod, idx) => (
                  <div key={prod.id} className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-900 shrink-0 border border-white/10"
                      />
                      <div className="min-w-0">
                        <h5 className="font-semibold text-white truncate text-xs">{prod.name}</h5>
                        <p className="text-[10px] text-[#86868b]">{shop.currency}{prod.price}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        openImagePicker({
                          title: `Change Product Photo: ${prod.name}`,
                          currentImage: prod.image,
                          onSaveImage: (newUrl) => {
                            const updated = [...shop.topProducts];
                            updated[idx] = { ...updated[idx], image: newUrl };
                            updateShopify({ topProducts: updated });
                          },
                        });
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white shrink-0 transition"
                    >
                      Change
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: YOUTUBE STUDIO */}
          {activeTab === 'youtube' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#86868b] uppercase tracking-wider">
                  YouTube Studio Metrics
                </span>
                <span className="text-[11px] text-emerald-400">Auto-consistency active</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86868b] block mb-1">Channel Name</label>
                  <input
                    type="text"
                    value={yt.channelName}
                    onChange={(e) => updateYouTube({ channelName: e.target.value })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-[#86868b] block mb-1">Handle</label>
                  <input
                    type="text"
                    value={yt.handle}
                    onChange={(e) => updateYouTube({ handle: e.target.value })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86868b] block mb-1">Total Subscribers</label>
                  <input
                    type="number"
                    value={yt.subscribers}
                    onChange={(e) => updateYouTube({ subscribers: Number(e.target.value) })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[#86868b] block mb-1">Subscriber Gain (+)</label>
                  <input
                    type="number"
                    value={yt.subscriberChange}
                    onChange={(e) => updateYouTube({ subscriberChange: Number(e.target.value) })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86868b] block mb-1">Total Views</label>
                  <input
                    type="number"
                    value={yt.views}
                    onChange={(e) => updateYouTube({ views: Number(e.target.value) }, true)}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[#86868b] block mb-1">Watch Time (Hours)</label>
                  <input
                    type="number"
                    value={yt.watchTimeHours}
                    onChange={(e) => updateYouTube({ watchTimeHours: Number(e.target.value) })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#86868b] block mb-1">Est. Revenue ($)</label>
                  <input
                    type="number"
                    value={yt.estimatedRevenue}
                    onChange={(e) => updateYouTube({ estimatedRevenue: Number(e.target.value) })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-emerald-400 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[#86868b] block mb-1">RPM ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={yt.rpm}
                    onChange={(e) => updateYouTube({ rpm: Number(e.target.value) }, true)}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[#86868b] block mb-1">Growth %</label>
                  <input
                    type="number"
                    value={yt.viewsChange}
                    onChange={(e) => updateYouTube({ viewsChange: Number(e.target.value) })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: SHOPIFY */}
          {activeTab === 'shopify' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#86868b] uppercase tracking-wider">
                  Shopify Store Controls
                </span>
                <span className="text-[11px] text-emerald-400">Auto-calculation active</span>
              </div>

              <div>
                <label className="text-[#86868b] block mb-1">Store Name</label>
                <input
                  type="text"
                  value={shop.storeName}
                  onChange={(e) => updateShopify({ storeName: e.target.value })}
                  className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86868b] block mb-1">Total Net Sales ($)</label>
                  <input
                    type="number"
                    value={shop.totalSales}
                    onChange={(e) => updateShopify({ totalSales: Number(e.target.value), netSales: Number(e.target.value) })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-emerald-400 font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-[#86868b] block mb-1">Sales Growth %</label>
                  <input
                    type="number"
                    value={shop.salesChange}
                    onChange={(e) => updateShopify({ salesChange: Number(e.target.value) })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86868b] block mb-1">Orders Count</label>
                  <input
                    type="number"
                    value={shop.ordersCount}
                    onChange={(e) => updateShopify({ ordersCount: Number(e.target.value) }, true)}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[#86868b] block mb-1">Average Order Value (AOV)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={shop.aov}
                    onChange={(e) => updateShopify({ aov: Number(e.target.value) }, true)}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86868b] block mb-1">Total Sessions</label>
                  <input
                    type="number"
                    value={shop.sessions}
                    onChange={(e) => updateShopify({ sessions: Number(e.target.value) }, true)}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[#86868b] block mb-1">Conversion Rate %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={shop.conversionRate}
                    onChange={(e) => updateShopify({ conversionRate: Number(e.target.value) })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: CRYPTO */}
          {activeTab === 'crypto' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#86868b] uppercase tracking-wider">
                  Ledger Wallet Controls
                </span>
              </div>

              <div>
                <label className="text-[#86868b] block mb-1">Wallet Device Label</label>
                <input
                  type="text"
                  value={cry.walletName}
                  onChange={(e) => updateCrypto({ walletName: e.target.value })}
                  className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86868b] block mb-1">Total Portfolio ($)</label>
                  <input
                    type="number"
                    value={cry.totalValue}
                    onChange={(e) => updateCrypto({ totalValue: Number(e.target.value) })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-emerald-400 font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-[#86868b] block mb-1">24h Gain %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={cry.change24hPercent}
                    onChange={(e) => updateCrypto({ change24hPercent: Number(e.target.value) }, true)}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="font-bold text-white block">Assets Breakdown</span>
                {cry.assets.map((asset, idx) => (
                  <div key={asset.id} className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{asset.name} ({asset.symbol})</span>
                      <span className="font-mono text-emerald-400">${asset.valueUsd.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-[#86868b]">Quantity</span>
                        <input
                          type="number"
                          step="any"
                          value={asset.quantity}
                          onChange={(e) => {
                            const updated = [...cry.assets];
                            updated[idx] = { ...updated[idx], quantity: Number(e.target.value) };
                            updateCrypto({ assets: updated }, true);
                          }}
                          className="w-full rounded-lg bg-black/60 border border-white/10 px-2 py-1 text-white font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#86868b]">Price USD ($)</span>
                        <input
                          type="number"
                          value={asset.priceUsd}
                          onChange={(e) => {
                            const updated = [...cry.assets];
                            updated[idx] = { ...updated[idx], priceUsd: Number(e.target.value) };
                            updateCrypto({ assets: updated }, true);
                          }}
                          className="w-full rounded-lg bg-black/60 border border-white/10 px-2 py-1 text-white font-bold"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: BANK */}
          {activeTab === 'bank' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#86868b] uppercase tracking-wider">
                  Banking & Card Controls
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86868b] block mb-1">Institution Name</label>
                  <input
                    type="text"
                    value={bank.institutionName}
                    onChange={(e) => updateBank({ institutionName: e.target.value })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[#86868b] block mb-1">Account Holder</label>
                  <input
                    type="text"
                    value={bank.accountHolder}
                    onChange={(e) => updateBank({ accountHolder: e.target.value })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86868b] block mb-1">Checking Balance ($)</label>
                  <input
                    type="number"
                    value={bank.checkingBalance}
                    onChange={(e) => updateBank({ checkingBalance: Number(e.target.value) }, true)}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-emerald-400 font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-[#86868b] block mb-1">Savings Balance ($)</label>
                  <input
                    type="number"
                    value={bank.savingsBalance}
                    onChange={(e) => updateBank({ savingsBalance: Number(e.target.value) }, true)}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-bold text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86868b] block mb-1">Monthly Inflow ($)</label>
                  <input
                    type="number"
                    value={bank.monthlyIncome}
                    onChange={(e) => updateBank({ monthlyIncome: Number(e.target.value) })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-[#86868b] block mb-1">Monthly Spending ($)</label>
                  <input
                    type="number"
                    value={bank.monthlySpending}
                    onChange={(e) => updateBank({ monthlySpending: Number(e.target.value) })}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: NOTIFICATIONS SIMULATOR */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-white uppercase tracking-wider mb-1">
                  On-Screen Notification Trigger
                </h3>
                <p className="text-[#86868b] text-[11px]">
                  Simulate realistic notifications appearing during video recording.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86868b] block mb-1">Target Platform</label>
                  <select
                    value={notifPlatform}
                    onChange={(e) => setNotifPlatform(e.target.value as any)}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-medium focus:outline-none"
                  >
                    <option value="shopify">Shopify</option>
                    <option value="bank">Aura Bank</option>
                    <option value="youtube">YouTube Studio</option>
                    <option value="crypto">Ledger Live</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#86868b] block mb-1">Trigger Delay</label>
                  <select
                    value={notifDelay}
                    onChange={(e) => setNotifDelay(Number(e.target.value))}
                    className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-medium focus:outline-none"
                  >
                    <option value={0}>Immediate (0s)</option>
                    <option value={3}>After 3s</option>
                    <option value={5}>After 5s</option>
                    <option value={10}>After 10s</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#86868b] block mb-1">Notification Title</label>
                <input
                  type="text"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[#86868b] block mb-1">Notification Message</label>
                <input
                  type="text"
                  value={notifMsg}
                  onChange={(e) => setNotifMsg(e.target.value)}
                  className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-[#86868b] block mb-1">Highlighted Amount / Metric</label>
                <input
                  type="text"
                  placeholder="+$149.00 or +24k views"
                  value={notifAmount}
                  onChange={(e) => setNotifAmount(e.target.value)}
                  className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-emerald-400 font-bold"
                />
              </div>

              <button
                type="button"
                onClick={handleTriggerCustomNotification}
                className="w-full py-3 rounded-xl bg-white text-black hover:bg-slate-200 font-bold text-sm shadow-md transition flex items-center justify-center gap-2 mt-4"
              >
                <Bell className="w-4 h-4" />
                <span>Fire Notification {notifDelay > 0 ? `(in ${notifDelay}s)` : 'Now'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#161618] flex items-center justify-between">
          <span className="text-[11px] text-[#86868b]">All changes saved automatically</span>
          <button
            onClick={() => setIsControlCenterOpen(false)}
            className="px-5 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-slate-200 transition shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
