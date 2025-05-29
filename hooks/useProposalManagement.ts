import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export function useProposalManagement() {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 删除提案
  const deleteProposal = async (proposalId: string) => {
    if (!publicKey) {
      throw new Error('请先连接钱包');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/proposals/${proposalId}?walletAddress=${publicKey.toString()}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '删除提案失败');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除提案失败';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteProposal,
    loading,
    error,
    hasWallet: !!publicKey
  };
} 