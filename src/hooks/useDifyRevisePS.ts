import { useState } from 'react';

interface ReviseParams {
  revise_type: string; // "0"代表保持原本，"1"代表扩写，"2"代表缩写
  style: string; // 风格要求
  original_word_count: string; // 原字数
  word_count: string; // 字数要求
  detail: string; // 补充修改方向
  original_context: string; // 原文
  whole: string; // "0"代表整篇，"1"代表段落
  language: string; // 语言设置
}

export function useDifyRevisePS() {
  const [isRevising, setIsRevising] = useState(false);

  const runRevision = async (params: ReviseParams) => {
    setIsRevising(true);
    
    console.log('[PS Revision] Starting revision with params:', params);
    
    try {
      const response = await fetch('/api/dify/revise-personal-statement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      console.log('[PS Revision] Response status:', response.status);
      console.log('[PS Revision] Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[PS Revision] API error response:', errorText);
        throw new Error(`PS Revision API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('[PS Revision] Revision response data:', data);
      return data.content || "";
    } catch (error) {
      console.error('[PS Revision] Revision failed:', error);
      throw error;
    } finally {
      setIsRevising(false);
    }
  };

  return {
    runRevision,
    isRevising
  };
}