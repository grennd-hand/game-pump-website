import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// 基础验证模式
export const WalletAddressSchema = z.string()
  .min(32, '钱包地址太短')
  .max(64, '钱包地址太长')
  .regex(/^[A-Za-z0-9]+$/, '钱包地址格式无效');

export const UsernameSchema = z.string()
  .min(3, '用户名至少3个字符')
  .max(32, '用户名最多32个字符')
  .regex(/^[a-zA-Z0-9_-]+$/, '用户名只能包含字母、数字、下划线和短横线');

export const ProposalTitleSchema = z.string()
  .min(1, '标题不能为空')
  .max(200, '标题不能超过200个字符')
  .transform(str => str.trim());

export const ProposalDescriptionSchema = z.string()
  .min(1, '描述不能为空')
  .max(2000, '描述不能超过2000个字符')
  .transform(str => str.trim());

export const ProposalTypeSchema = z.enum(['game', 'governance', 'technical', 'funding']);

// 复合验证模式
export const CreateProposalSchema = z.object({
  title: ProposalTitleSchema,
  description: ProposalDescriptionSchema,
  type: ProposalTypeSchema,
  walletAddress: WalletAddressSchema,
  durationDays: z.number().min(1).max(30).optional().default(7)
});

export const VoteSchema = z.object({
  walletAddress: WalletAddressSchema,
  vote: z.enum(['for', 'against']),
  proposalId: z.string().min(1)
});

export const UpdateUsernameSchema = z.object({
  username: UsernameSchema,
  walletAddress: WalletAddressSchema
});

// 安全的HTML清理
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') {
    throw new Error('输入必须是字符串');
  }
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // 不允许任何HTML标签
    ALLOWED_ATTR: []
  });
}

// 清理用户输入
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return sanitizeHtml(input.trim());
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  if (typeof input === 'object' && input !== null) {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(input)) {
      cleaned[key] = sanitizeInput(value);
    }
    return cleaned;
  }
  return input;
}

// 验证和清理提案内容
export function validateProposal(data: any) {
  // 先清理输入
  const cleaned = sanitizeInput(data);
  
  // 然后验证
  const result = CreateProposalSchema.safeParse(cleaned);
  
  if (!result.success) {
    throw new Error(`验证失败: ${result.error.issues.map(i => i.message).join(', ')}`);
  }
  
  // 额外的安全检查
  const { title, description } = result.data;
  
  // 检查恶意内容
  const forbiddenPatterns = [
    /javascript:/i,
    /data:text\/html/i,
    /vbscript:/i,
    /<script/i,
    /on\w+=/i
  ];
  
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(title) || pattern.test(description)) {
      throw new Error('内容包含不安全的代码');
    }
  }
  
  // 检查敏感词汇
  const forbiddenWords = [
    '垃圾', '废物', '傻逼', '操你妈', '死', '杀', '骗', '诈', 
    'scam', 'hack', 'exploit', 'rug pull'
  ];
  
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  
  for (const word of forbiddenWords) {
    if (titleLower.includes(word.toLowerCase()) || descLower.includes(word.toLowerCase())) {
      throw new Error('内容包含不当词汇，请使用文明用语');
    }
  }
  
  return result.data;
}

// 验证钱包地址
export function validateWalletAddress(address: string): boolean {
  try {
    WalletAddressSchema.parse(address);
    return true;
  } catch {
    return false;
  }
}

// 验证用户名
export function validateUsername(username: string): boolean {
  try {
    UsernameSchema.parse(username);
    return true;
  } catch {
    return false;
  }
}

// SQL注入防护（虽然使用MongoDB，但仍需防护）
export function preventInjection(query: any): any {
  if (typeof query === 'string') {
    // 移除MongoDB操作符
    return query.replace(/\$[\w]+/g, '');
  }
  
  if (Array.isArray(query)) {
    return query.map(preventInjection);
  }
  
  if (typeof query === 'object' && query !== null) {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(query)) {
      // 防止操作符注入
      if (key.startsWith('$')) {
        continue;
      }
      cleaned[key] = preventInjection(value);
    }
    return cleaned;
  }
  
  return query;
} 