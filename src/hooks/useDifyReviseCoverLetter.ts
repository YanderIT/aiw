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

export function useDifyReviseCoverLetter() {
  const [isRevising, setIsRevising] = useState(false);

  const runRevision = async (params: ReviseParams) => {
    setIsRevising(true);
    
    console.log('[Cover Letter Revision] Starting revision with params:', params);
    
    try {
      const response = await fetch('/api/dify/revise-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      console.log('[Cover Letter Revision] Response status:', response.status);
      console.log('[Cover Letter Revision] Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Cover Letter Revision] API error response:', errorText);
        throw new Error(`Cover Letter Revision API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('[Cover Letter Revision] Revision response data:', data);
      return data.content || "";
    } catch (error) {
      console.error('[Cover Letter Revision] Revision failed:', error);
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