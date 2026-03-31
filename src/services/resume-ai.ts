import { DifyService } from './dify';

export type ResumeFieldType = 0 | 1 | 2 | 3 | 4 | 5;

export interface ResumeAIGenerateRequest {
  context: Record<string, any>;
  type: ResumeFieldType;
  user?: string;
}

export interface ResumeAIGenerateResponse {
  structured_output?: {
    courseList?: string[];
    skillsList?: string[];
    responsibilities?: string[];
    description?: string[];
    background?: string;
    contributions?: string[];
    [key: string]: any;
  };
  answer?: string;
  [key: string]: any;
}

export class ResumeAIService {
  private difyService: DifyService;

  constructor() {
    this.difyService = new DifyService();
  }

  /**
   * Generate AI content for resume fields
   * @param context - The current module's data as JSON
   * @param type - The field type (0-5)
   * @param user - Optional user identifier
   */
  async generateContent(
    context: Record<string, any>,
    type: ResumeFieldType,
    user: string = 'default-user'
  ): Promise<ResumeAIGenerateResponse> {
    try {
      // Convert context to JSON string
      const contextString = JSON.stringify(context);
      
      // Prepare the request payload for Dify
      const payload = {
        inputs: {
          context: contextString,
          type: type.toString()
        },
        response_mode: 'blocking' as const,
        user
      };

      console.log('[ResumeAIService] Generating content with:', {
        type,
        contextString: contextString.substring(0, 200) + '...', // Log first 200 chars
        contextKeys: Object.keys(context),
        user
      });

      // Call Dify API with resume-generator function type
      const response = await this.difyService.runWorkflow(
        payload,
        'resume-generator'
      );

      console.log('[ResumeAIService] Dify response:', JSON.stringify(response, null, 2));

      // Extract the structured output from the nested structure
      const outputs = response.data?.outputs || {};
      const structuredOutput = outputs.structured_output || {};
      
      console.log('[ResumeAIService] Structured output:', JSON.stringify(structuredOutput, null, 2));
      
      return this.parseResponseByType(structuredOutput, type);
    } catch (error) {
      console.error('[ResumeAIService] Error generating content:', error);
      throw error;
    }
  }

  /**
   * Parse Dify response based on field type
   */
  private parseResponseByType(
    structuredOutput: any,
    type: ResumeFieldType
  ): ResumeAIGenerateResponse {
    // The structuredOutput is already extracted in generateContent
    
    switch (type) {
      case 0: // Education - Relevant Courses
        return {
          structured_output: {
            courseList: structuredOutput.courseList || []
          }
        };

      case 1: // Skills Language - Skills
        return {
          structured_output: {
            skillsList: structuredOutput.skillsList || []
          }
        };

      case 2: // Work Experience - Responsibilities
        return {
          structured_output: {
            responsibilities: structuredOutput.responsibilities || []
          }
        };

      case 3: // Activities - Description
        return {
          structured_output: {
            description: structuredOutput.description || []
          }
        };

      case 4: // Research - Project Background
        return {
          structured_output: {
            background: structuredOutput.background || ''
          }
        };

      case 5: // Research - Your Contributions
        return {
          structured_output: {
            contributions: structuredOutput.contributions || []
          }
        };

      default:
        return { structured_output: structuredOutput };
    }
  }

  /**
   * Format the generated content for display in textarea
   */
  static formatContentForDisplay(
    response: ResumeAIGenerateResponse,
    type: ResumeFieldType
  ): string {
    const output = response.structured_output;
    if (!output) return '';

    switch (type) {
      case 0: // Education - Relevant Courses
        return output.courseList?.join(', ') || '';

      case 1: // Skills Language - Skills
        return output.skillsList?.join(', ') || '';

      case 2: // Work Experience - Responsibilities
        return output.responsibilities?.map(r => `• ${r}`).join('\n') || '';

      case 3: // Activities - Description
        return output.description?.map(d => `• ${d}`).join('\n') || '';

      case 4: // Research - Project Background
        return output.background || '';

      case 5: // Research - Your Contributions
        return output.contributions?.map(c => `• ${c}`).join('\n') || '';

      default:
        return '';
    }
  }
}

// Export singleton instance
export const resumeAIService = new ResumeAIService();