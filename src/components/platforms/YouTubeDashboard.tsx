import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  ArrowUpRight,
  TrendingUp,
  LayoutDashboard,
  PlaySquare,
  BarChart2,
  MessageSquare,
  DollarSign,
  ChevronRight,
  Home,
  SlidersHorizontal,
  Camera,
  Check,
} from 'lucide-react';
import { TimePeriod } from '../../types';
import { PlatformHeaderLogo } from '../../config/platformLogos';

export const YouTubeDashboard: React.FC = () => {
  const {
    activePhase,
    setCurrentPlatform,
    appMode,
    setAppMode,
    openInlineEdit,
    openImagePicker,
    updateYouTube,
    setIsControlCenterOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'analytics'>('overview');
  const [chartMetric, setChartMetric] = useState<'views' | 'revenue'>('views');

  const yt = activePhase.youtube;
  const isEditing = appMode === 'edit';

  const handlePeriodChange = (p: TimePeriod) => {
    updateYouTube({ period: p });
  };

  const periodLabel =
    yt.period === 'today'
      ? 'Today'
      : yt.period === '7d'
      ? 'Last 7 days'
      : yt.period === '90d'
      ? 'Last 90 days'
      : 'Last 28 days';

  // Dynamic SVG Chart calculation: scales with views, revenue, and period in real time
  const periodMultiplier =
    yt.period === 'today' ? 0.05 : yt.period === '7d' ? 0.25 : yt.period === '90d' ? 3.2 : 1.0;

  const currentTotalViews = Math.round(yt.views * periodMultiplier);
  const currentTotalRevenue = Number((yt.estimatedRevenue * periodMultiplier).toFixed(2));

  const curveWeights = [0.08, 0.12, 0.16, 0.24, 0.19, 0.32, 0.40];
  const points = (yt.chartPoints && yt.chartPoints.length > 0)
    ? yt.chartPoints.map((p, idx) => {
        const weight = curveWeights[idx % curveWeights.length] || 0.2;
        return {
          label: p.label || (yt.period === 'today' ? `${idx * 4}:00` : `Day ${idx === 0 ? 1 : idx * 4 + 4}`),
          views: Math.max(1, Math.round(currentTotalViews * weight)),
          revenue: Math.max(0.1, Number((currentTotalRevenue * weight).toFixed(2))),
        };
      })
    : curveWeights.map((w, idx) => ({
        label: yt.period === 'today'
          ? `${idx * 4}:00`
          : yt.period === '7d'
          ? `Day ${idx + 1}`
          : yt.period === '90d'
          ? `Wk ${idx * 2 + 1}`
          : `Day ${idx === 0 ? 1 : idx * 4 + 4}`,
        views: Math.max(1, Math.round(currentTotalViews * w)),
        revenue: Math.max(0.1, Number((currentTotalRevenue * w).toFixed(2))),
      }));

  const maxVal = Math.max(...points.map((p) => (chartMetric === 'views' ? p.views : p.revenue)), 1);
  const width = 360;
  const height = 110;
  const pathD = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const v = chartMetric === 'views' ? p.views : p.revenue;
      const y = height - (v / maxVal) * (height - 24) - 12;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="flex flex-col min-h-full bg-black text-[#f1f1f1] select-none pb-24">
      {/* Edit Mode Top Banner (Only visible when Edit Mode is active) */}
      {isEditing && (
        <div className="bg-blue-600 px-4 py-1.5 flex items-center justify-between text-xs text-white">
          <span className="font-semibold">Edit Mode: Tap any stat or photo to customize</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsControlCenterOpen(true)}
              className="underline text-white font-medium hover:text-white/80"
            >
              Control Center
            </button>
            <button
              onClick={() => setAppMode('film')}
              className="bg-black/30 hover:bg-black/50 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              <span>Done</span>
            </button>
          </div>
        </div>
      )}

      {/* Studio Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-black/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPlatform('launcher')}
            className="p-1 -ml-1 text-white/70 hover:text-white rounded-full active:bg-white/10 transition"
            title="Return to Launcher"
          >
            <Home className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <PlatformHeaderLogo platform="youtube" />
            <span className="text-base font-bold tracking-tight text-white">Studio</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="p-1.5 text-white/70 hover:text-white rounded-full relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#ff0000]" />
          </button>

          {/* Profile Photo: Only editable in Edit Mode */}
          <div className="relative group">
            <button
              onClick={() => {
                if (!isEditing) return;
                openImagePicker({
                  title: 'Change Channel Profile Photo',
                  currentImage: yt.avatarUrl,
                  onSaveImage: (newUrl) => updateYouTube({ avatarUrl: newUrl }),
                });
              }}
              className={`w-8 h-8 rounded-full overflow-hidden border border-white/20 active:scale-95 transition relative flex items-center justify-center ${
                isEditing ? 'cursor-pointer ring-2 ring-blue-500' : 'cursor-default'
              }`}
            >
              <img
                src={yt.avatarUrl}
                alt={yt.channelName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-3 space-y-4 max-w-lg mx-auto w-full">
        {/* Channel Summary */}
        <div className="flex items-center justify-between py-1">
          <div>
            <h1
              onClick={() => {
                if (!isEditing) return;
                openInlineEdit({
                  label: 'Channel Name',
                  value: yt.channelName,
                  onSave: (val) => updateYouTube({ channelName: val }),
                });
              }}
              className={`text-lg font-bold text-white tracking-tight ${
                isEditing ? 'cursor-pointer hover:underline' : ''
              }`}
            >
              {yt.channelName}
            </h1>
            <p className="text-xs text-[#aaaaaa]">{yt.handle}</p>
          </div>

          <div
            onClick={() => {
              if (!isEditing) return;
              openInlineEdit({
                label: 'Subscribers Count',
                value: yt.subscribers,
                type: 'number',
                onSave: (val) => updateYouTube({ subscribers: val }, true),
              });
            }}
            className={`text-right ${isEditing ? 'cursor-pointer hover:underline' : ''}`}
          >
            <div className="text-lg font-bold text-white tabular-nums tracking-tight">
              {yt.subscribers.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#aaaaaa]">Total subscribers</div>
          </div>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {(['today', '7d', '28d', '90d'] as TimePeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition ${
                yt.period === p
                  ? 'bg-white text-black font-semibold'
                  : 'bg-white/[0.08] text-[#aaaaaa] hover:bg-white/[0.12] hover:text-white'
              }`}
            >
              {p === 'today' ? 'Today' : p === '7d' ? '7 days' : p === '28d' ? '28 days' : '90 days'}
            </button>
          ))}
        </div>

        {/* Analytics Card */}
        <div className="rounded-[20px] bg-[#141416] border border-white/[0.08] p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider">
                Analytics
              </span>
              <p className="text-xs text-white/50 mt-0.5">{periodLabel}</p>
            </div>
            <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded-lg border border-white/5 text-[11px]">
              <button
                onClick={() => setChartMetric('views')}
                className={`px-2.5 py-1 rounded-md transition ${
                  chartMetric === 'views' ? 'bg-white/20 text-white font-semibold' : 'text-[#888888]'
                }`}
              >
                Views
              </button>
              <button
                onClick={() => setChartMetric('revenue')}
                className={`px-2.5 py-1 rounded-md transition ${
                  chartMetric === 'revenue' ? 'bg-white/20 text-white font-semibold' : 'text-[#888888]'
                }`}
              >
                Revenue
              </button>
            </div>
          </div>

          {/* 4 Core Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Views */}
            <div
              onClick={() => {
                if (!isEditing) return;
                openInlineEdit({
                  label: 'Total Views',
                  value: yt.views,
                  type: 'number',
                  onSave: (val) => updateYouTube({ views: val }, true),
                });
              }}
              className={`p-3 rounded-xl bg-white/[0.03] border border-white/5 transition ${
                isEditing ? 'cursor-pointer hover:bg-white/[0.08] ring-1 ring-blue-500/50' : ''
              }`}
            >
              <span className="text-xs text-[#aaaaaa]">Views</span>
              <div className="text-xl font-bold text-white tabular-nums mt-0.5 tracking-tight">
                {yt.views >= 1000000
                  ? `${(yt.views / 1000000).toFixed(1)}M`
                  : yt.views >= 1000
                  ? `${(yt.views / 1000).toFixed(1)}K`
                  : yt.views}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#2ba640] font-medium mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{yt.viewsChange}% more than usual</span>
              </div>
            </div>

            {/* Watch Time */}
            <div
              onClick={() => {
                if (!isEditing) return;
                openInlineEdit({
                  label: 'Watch Time (Hours)',
                  value: yt.watchTimeHours,
                  type: 'number',
                  onSave: (val) => updateYouTube({ watchTimeHours: val }),
                });
              }}
              className={`p-3 rounded-xl bg-white/[0.03] border border-white/5 transition ${
                isEditing ? 'cursor-pointer hover:bg-white/[0.08] ring-1 ring-blue-500/50' : ''
              }`}
            >
              <span className="text-xs text-[#aaaaaa]">Watch time (hours)</span>
              <div className="text-xl font-bold text-white tabular-nums mt-0.5 tracking-tight">
                {yt.watchTimeHours >= 1000
                  ? `${(yt.watchTimeHours / 1000).toFixed(1)}K`
                  : yt.watchTimeHours}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#2ba640] font-medium mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+{yt.watchTimeChange}% vs prior</span>
              </div>
            </div>

            {/* Subscribers Growth */}
            <div
              onClick={() => {
                if (!isEditing) return;
                openInlineEdit({
                  label: 'Subscriber Growth (Period)',
                  value: yt.subscriberChange,
                  type: 'number',
                  onSave: (val) => updateYouTube({ subscriberChange: val }),
                });
              }}
              className={`p-3 rounded-xl bg-white/[0.03] border border-white/5 transition ${
                isEditing ? 'cursor-pointer hover:bg-white/[0.08] ring-1 ring-blue-500/50' : ''
              }`}
            >
              <span className="text-xs text-[#aaaaaa]">Subscribers</span>
              <div className="text-xl font-bold text-white tabular-nums mt-0.5 tracking-tight">
                +{yt.subscriberChange.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#2ba640] font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Above baseline</span>
              </div>
            </div>

            {/* Estimated Revenue */}
            <div
              onClick={() => {
                if (!isEditing) return;
                openInlineEdit({
                  label: 'Estimated Revenue',
                  value: yt.estimatedRevenue,
                  type: 'number',
                  prefix: yt.currency,
                  onSave: (val) => updateYouTube({ estimatedRevenue: val }),
                });
              }}
              className={`p-3 rounded-xl bg-white/[0.03] border border-white/5 transition ${
                isEditing ? 'cursor-pointer hover:bg-white/[0.08] ring-1 ring-blue-500/50' : ''
              }`}
            >
              <span className="text-xs text-[#aaaaaa]">Est. revenue</span>
              <div className="text-xl font-bold text-white tabular-nums mt-0.5 tracking-tight">
                {yt.currency}
                {yt.estimatedRevenue.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#2ba640] font-medium mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+{yt.revenueChange}%</span>
              </div>
            </div>
          </div>

          {/* Area Chart SVG */}
          <div className="relative pt-1">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
              <defs>
                <linearGradient id="ytViewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3ea6ff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3ea6ff" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="ytRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2ba640" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2ba640" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d={areaD}
                fill={chartMetric === 'views' ? 'url(#ytViewsGrad)' : 'url(#ytRevGrad)'}
              />
              <path
                d={pathD}
                fill="none"
                stroke={chartMetric === 'views' ? '#3ea6ff' : '#2ba640'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.map((p, i) => {
                const x = (i / (points.length - 1)) * width;
                const v = chartMetric === 'views' ? p.views : p.revenue;
                const y = height - (v / maxVal) * (height - 24) - 12;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="2.5"
                    fill={chartMetric === 'views' ? '#3ea6ff' : '#2ba640'}
                    stroke="#141416"
                    strokeWidth="1"
                  />
                );
              })}
            </svg>
            <div className="flex justify-between text-[10px] text-[#717171] mt-1 font-mono">
              <span>{points[0]?.label || 'Start'}</span>
              <span>{points[Math.floor(points.length / 2)]?.label || 'Mid'}</span>
              <span>{points[points.length - 1]?.label || 'Latest'}</span>
            </div>
          </div>
        </div>

        {/* Latest Video Performance Card */}
        {yt.topVideos[0] && (
          <div className="rounded-[20px] bg-[#141416] border border-white/[0.08] p-4 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider">
                Latest Video Performance
              </span>
              <span className="text-[11px] font-semibold text-[#2ba640] bg-[#2ba640]/10 px-2 py-0.5 rounded-full">
                Ranking 1 of 10
              </span>
            </div>

            <div className="flex gap-3 mt-2">
              {/* Thumbnail: Only editable in Edit Mode */}
              <div
                onClick={() => {
                  if (!isEditing) return;
                  openImagePicker({
                    title: 'Change Video Thumbnail',
                    currentImage: yt.topVideos[0].thumbnail,
                    onSaveImage: (newUrl) => {
                      const updated = [...yt.topVideos];
                      updated[0] = { ...updated[0], thumbnail: newUrl };
                      updateYouTube({ topVideos: updated });
                    },
                  });
                }}
                className={`relative w-32 aspect-video rounded-lg overflow-hidden bg-slate-900 shrink-0 ${
                  isEditing ? 'cursor-pointer ring-2 ring-blue-500' : 'cursor-default'
                }`}
              >
                <img
                  src={yt.topVideos[0].thumbnail}
                  alt={yt.topVideos[0].title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[10px] font-medium font-mono text-white">
                  {yt.topVideos[0].duration}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  onClick={() => {
                    if (!isEditing) return;
                    openInlineEdit({
                      label: 'Video Title',
                      value: yt.topVideos[0].title,
                      onSave: (val) => {
                        const updated = [...yt.topVideos];
                        updated[0] = { ...updated[0], title: val };
                        updateYouTube({ topVideos: updated });
                      },
                    });
                  }}
                  className={`text-xs font-semibold text-white line-clamp-2 leading-snug ${
                    isEditing ? 'cursor-pointer hover:underline' : ''
                  }`}
                >
                  {yt.topVideos[0].title}
                </h3>
                <p className="text-[11px] text-[#aaaaaa] mt-1">{yt.topVideos[0].dateAgo}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/[0.06] text-center">
              <div
                onClick={() => {
                  if (!isEditing) return;
                  openInlineEdit({
                    label: 'Video Views',
                    value: yt.topVideos[0].views,
                    type: 'number',
                    onSave: (val) => {
                      const updated = [...yt.topVideos];
                      updated[0] = { ...updated[0], views: val };
                      updateYouTube({ topVideos: updated });
                    },
                  });
                }}
                className={isEditing ? 'cursor-pointer hover:underline' : ''}
              >
                <div className="text-xs text-[#aaaaaa]">Views</div>
                <div className="text-sm font-bold text-white tabular-nums mt-0.5">
                  {yt.topVideos[0].views.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#aaaaaa]">Impressions CTR</div>
                <div className="text-sm font-bold text-[#2ba640] tabular-nums mt-0.5">
                  {yt.topVideos[0].ctr}%
                </div>
              </div>
              <div>
                <div className="text-xs text-[#aaaaaa]">Likes</div>
                <div className="text-sm font-bold text-white tabular-nums mt-0.5">
                  {yt.topVideos[0].likes.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Content List */}
        <div className="rounded-[20px] bg-[#141416] border border-white/[0.08] p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider">
              Top Content
            </span>
            <span className="text-xs text-[#3ea6ff] flex items-center gap-0.5">
              <span>See more</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-3">
            {(yt.topVideos.length > 1 ? yt.topVideos.slice(1) : yt.topVideos).map((video) => {
              const originalIdx = yt.topVideos.findIndex((v) => v.id === video.id);
              return (
                <div key={video.id} className="flex gap-3 items-center group">
                  <div
                    onClick={() => {
                      if (!isEditing) return;
                      openImagePicker({
                        title: `Change Thumbnail: ${video.title.slice(0, 20)}...`,
                        currentImage: video.thumbnail,
                        onSaveImage: (newUrl) => {
                          const updated = [...yt.topVideos];
                          if (originalIdx >= 0) {
                            updated[originalIdx] = { ...updated[originalIdx], thumbnail: newUrl };
                            updateYouTube({ topVideos: updated });
                          }
                        },
                      });
                    }}
                    className={`relative w-24 aspect-video rounded-lg overflow-hidden bg-slate-900 shrink-0 ${
                      isEditing ? 'cursor-pointer ring-2 ring-blue-500' : 'cursor-default'
                    }`}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Camera className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] font-mono text-white">
                      {video.duration}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      onClick={() => {
                        if (!isEditing) return;
                        openInlineEdit({
                          label: 'Video Title',
                          value: video.title,
                          onSave: (val) => {
                            const updated = [...yt.topVideos];
                            if (originalIdx >= 0) {
                              updated[originalIdx] = { ...updated[originalIdx], title: val };
                              updateYouTube({ topVideos: updated });
                            }
                          },
                        });
                      }}
                      className={`text-xs font-medium text-white line-clamp-2 leading-tight ${
                        isEditing ? 'cursor-pointer hover:underline' : ''
                      }`}
                    >
                      {video.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-[#aaaaaa] mt-1">
                      <span
                        onClick={() => {
                          if (!isEditing) return;
                          openInlineEdit({
                            label: 'Video Views',
                            value: video.views,
                            type: 'number',
                            onSave: (val) => {
                              const updated = [...yt.topVideos];
                              if (originalIdx >= 0) {
                                updated[originalIdx] = { ...updated[originalIdx], views: val };
                                updateYouTube({ topVideos: updated });
                              }
                            },
                          });
                        }}
                        className={`tabular-nums font-semibold text-slate-200 ${
                          isEditing ? 'cursor-pointer hover:underline' : ''
                        }`}
                      >
                        {video.views.toLocaleString()} views
                      </span>
                      <span>·</span>
                      <span>{video.dateAgo}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* YouTube Studio Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/[0.08] pb-safe">
        <div className="grid grid-cols-5 items-center h-14 max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'overview' ? 'text-white' : 'text-[#888888]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'content' ? 'text-white' : 'text-[#888888]'
            }`}
          >
            <PlaySquare className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Content</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'analytics' ? 'text-white' : 'text-[#888888]'
            }`}
          >
            <BarChart2 className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Analytics</span>
          </button>
          <button className="flex flex-col items-center justify-center py-1 text-[#888888]">
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Community</span>
          </button>
          <button className="flex flex-col items-center justify-center py-1 text-[#888888]">
            <DollarSign className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-medium">Earn</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
