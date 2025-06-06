'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api';
import AppLayout from '@/components/AppLayout';

/**
 * Represents a single site card displaying detailed information.
 * Clickable to navigate to the detailed site view.
 */
function SiteCard({ site }: { site: Site }) {
  const router = useRouter();
  const formatScore = (score: number) => `${Math.round(score * 1)}%`;
  const formatSize = (size: number) => `${(size / 1024).toFixed(1)}KB`;

  return (
    <div
      onClick={() => router.push(`/sites/${site.siteId}`)}
      className="group bg-terminal-black border border-cyber-blue/30 rounded-lg p-6 cursor-pointer hover:border-cyber-blue/60 transition-all"
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <img
            src={site.developer?.avatar || 'https://avatars.githubusercontent.com/u/1?v=4'}
            alt={site.developer?.name || 'Developer'}
            className="w-10 h-10 rounded-full border-2 border-cyber-purple"
          />
          <div>
            <h3 className="text-xl font-bold text-cyber-blue group-hover:bg-gradient-to-r group-hover:from-cyber-blue group-hover:to-cyber-purple group-hover:text-transparent group-hover:bg-clip-text transition-all">
              {site.name || 'Untitled Site'}
            </h3>
            <p className="text-sm text-gray-400">
              by {site.developer?.name || 'Unknown Developer'} • {site.agentType === 'gamedev' ? 'Game Developer' : 'Web Developer'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-400">
            {site.createdAt ? new Date(site.createdAt).toLocaleString() : 'No date'}
          </p>
          <p className="text-sm text-gray-400">
            {site.description || 'No description available'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {site.agentType === 'gamedev' ? (
            <>
              <div className="space-y-1">
                <div className="text-gray-400">Fun Factor</div>
                <div className="font-bold text-cyber-blue">
                  {formatScore(site.contentAnalysis?.funFactor ?? 0)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-400">Replay Value</div>
                <div className="font-bold text-cyber-pink">
                  {formatScore(site.contentAnalysis?.replayValue ?? 0)}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <div className="text-gray-400">Complexity</div>
                <div className="font-bold text-cyber-blue">
                  {formatScore(site.technicalDetails?.performance?.htmlComplexity ?? 0)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-400">SEO</div>
                <div className="font-bold text-cyber-pink">
                  {formatScore(site.technicalDetails?.performance?.seoScore ?? 0)}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {(site.technicalDetails?.technologies || []).slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-cyber-blue/10 border border-cyber-blue/30 rounded-full text-cyber-blue text-xs"
            >
              {tech.name}
            </span>
          ))}
          {(site.technicalDetails?.technologies?.length ?? 0) > 3 && (
            <span className="px-2 py-1 bg-cyber-blue/10 border border-cyber-blue/30 rounded-full text-cyber-blue text-xs">
              +{(site.technicalDetails?.technologies?.length ?? 0) - 3} more
            </span>
          )}
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center text-cyber-blue group-hover:translate-x-1 transition-transform">
            {site.agentType === 'gamedev' ? 'Preview Game' : 'Preview Site'}
            <span className="ml-1">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Represents the site library page displaying all generated sites.
 * Allows for navigation to detailed views or creating new sites.
 */
export default function SiteLibrary() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [startAfter, setStartAfter] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const hasFetched = useRef(false);
  const [hasMinimumLoadingTimePassed, setHasMinimumLoadingTimePassed] = useState(false);

  useEffect(() => {
    if (!hasFetched.current) {
      loadSites();
      hasFetched.current = true;
      setTimeout(() => setHasMinimumLoadingTimePassed(true), 3000);
    }
  }, []);

  const loadSites = async () => {
    try {
      setIsLoading(true);
      const result = await apiService.getSites(startAfter);
      setSites((prev) => [...prev, ...result.sites]);
      setHasMore(result.hasMore);
      setStartAfter(result.nextStartAfter);
    } catch (err) {
      console.error(err);
      setError('Failed to load sites');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-pink text-transparent bg-clip-text">
              Agent Creations
            </h1>
            <p className="text-xl text-gray-400">
              Browse and interact with your generated websites
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sites.length > 0 ? (
              sites.map((site) => <SiteCard key={site.siteId} site={site} />)
            ) : !hasMinimumLoadingTimePassed || isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-terminal-black border border-cyber-blue/30 rounded-lg p-6 animate-pulse"
                >
                  <div className="h-6 bg-cyber-blue/10 rounded mb-4" />
                  <div className="h-4 bg-cyber-blue/10 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-cyber-blue/10 rounded w-1/2" />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🌐</div>
                <h3 className="text-xl font-bold text-cyber-purple mb-2">No Sites Yet</h3>
                <p className="text-gray-400 mb-6">
                  Start creating your first website
                </p>
                <button
                  onClick={() => router.push('/webappagent')}
                  className="bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Create Site
                </button>
              </div>
            )}
          </div>

          {hasMore && sites.length > 0 && (
            <div className="flex justify-center">
              <button
                onClick={loadSites}
                disabled={isLoading}
                className="bg-gradient-to-r from-cyber-blue to-cyber-purple text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Load More Sites'}
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
