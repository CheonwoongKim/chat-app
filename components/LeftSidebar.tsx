'use client';

import { useState } from 'react';
import { AGENT_LIST, DEFAULT_AGENT } from '@/config/agents';
import { KBLogo } from '@/components/KBLogo';
import { SearchIcon, UserIcon } from '@/components/icons';

interface LeftSidebarProps {
  onAgentSelect: (agentId: string) => void;
}

export default function LeftSidebar({ onAgentSelect }: LeftSidebarProps) {
  const [selectedAgent, setSelectedAgent] = useState<string>(DEFAULT_AGENT);

  const handleAgentClick = (agentId: string) => {
    setSelectedAgent(agentId);
    onAgentSelect(agentId);
  };

  return (
    <div
      className="w-20 flex flex-col items-center"
      style={{
        backgroundColor: 'var(--color-background)',
        borderRight: '1px solid var(--color-border)',
        paddingTop: '24px',
        paddingBottom: '24px'
      }}
    >
      {/* KB 로고 */}
      <div style={{ marginBottom: '32px' }}>
        <KBLogo size={40} priority />
      </div>

      {/* 에이전트 메뉴 */}
      <div className="flex flex-col" style={{ gap: '24px' }}>
        {AGENT_LIST.map((agent) => (
          <div key={agent.id} className="flex flex-col items-center">
            <button
              onClick={() => handleAgentClick(agent.id)}
              className="w-12 h-12 flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                transform: selectedAgent === agent.id ? 'scale(1.1)' : 'scale(1)'
              }}
              title={agent.name}
            >
              {agent.icon === 'search' ? (
                <SearchIcon
                  color={selectedAgent === agent.id ? 'var(--color-text-primary)' : '#CCCCCC'}
                />
              ) : (
                <UserIcon
                  color={selectedAgent === agent.id ? 'var(--color-text-primary)' : '#CCCCCC'}
                />
              )}
            </button>
            <span
              className="text-xs text-center"
              style={{
                color: selectedAgent === agent.id ? 'var(--color-text-primary)' : '#CCCCCC',
                fontSize: '10px',
                lineHeight: '1.2',
                maxWidth: '60px',
                wordBreak: 'keep-all'
              }}
            >
              {agent.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
