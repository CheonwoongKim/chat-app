export interface AgentConfig {
  id: string;
  name: string;
  icon: 'search' | 'user';
  title: string;
  description: string;
  webhookUrl: string;
}

export const AGENTS: Record<string, AgentConfig> = {
  agent1: {
    id: 'agent1',
    name: '업무매뉴얼',
    icon: 'search',
    title: '업무매뉴얼 AI',
    description: '업무 절차, 프로세스 그리고 관련 정보를 문의하시면\n사내 규정, 지침, 업무매뉴얼을 기반으로 정확한 정보를 안내해드립니다',
    webhookUrl: 'https://n8n.ywstorage.synology.me/webhook/aa1f87b0-7c1e-434d-878d-8f4f92c735d2',
  },
  agent2: {
    id: 'agent2',
    name: '상담지원',
    icon: 'user',
    title: '상담지원 AI',
    description: '고객 응대 및 상담 관련 업무를 도와드립니다.\n고객 문의 처리 방법과 응대 가이드를 제공합니다.',
    webhookUrl: 'https://n8n.ywstorage.synology.me/webhook/a52e0c6f-e844-4e17-b00b-752a9d271fd1',
  },
} as const;

export const AGENT_LIST: AgentConfig[] = Object.values(AGENTS);

export const DEFAULT_AGENT = 'agent1';

export const getAgent = (agentId: string): AgentConfig => {
  return AGENTS[agentId] || AGENTS[DEFAULT_AGENT];
};
