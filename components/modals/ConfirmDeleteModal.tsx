'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title: string;
}

export default function ConfirmDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading, 
  title
}: ConfirmDeleteModalProps) {

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="pixel-card p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🗑️</div>
              <h3 className="text-2xl font-retro text-retro-yellow mb-3">
                删除提案
              </h3>
              <p className="text-gray-400 font-pixel text-sm leading-relaxed">
                确定要删除这个提案吗？此操作不可撤销，所有相关数据都将被永久删除。
              </p>
            </div>

            {/* 提案信息 */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-400 font-pixel mb-2">提案标题:</div>
              <div className="text-white font-pixel">{title}</div>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 px-6 py-3 rounded-lg font-pixel transition-colors"
                onClick={onClose}
                disabled={loading}
              >
                取消
              </motion.button>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="flex-1 neon-button border-red-500 text-red-500 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onConfirm}
              >
                {loading ? '删除中...' : '确认删除'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 