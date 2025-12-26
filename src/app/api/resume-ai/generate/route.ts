import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { customAuth } from '@/lib/auth';
import { resumeAIService, ResumeFieldType, ResumeAIService } from '@/services/resume-ai';
import { respJson, respErr } from '@/lib/resp';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await customAuth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return respErr('Unauthorized', 401);
    }

    // Parse request body
    const body = await request.json();
    const { context, type } = body;

    // Validate required fields
    if (!context || type === undefined) {
      return respErr('Missing required fields: context and type', 400);
    }

    // Validate type is within valid range (0-5)
    if (typeof type !== 'number' || type < 0 || type > 5) {
      return respErr('Invalid type. Must be a number between 0 and 5', 400);
    }

    // Use user's email or ID as the user identifier for Dify
    const userId = session.user.email || session.user.id || 'default-user';

    console.log('[Resume AI API] Generating content:', {
      userId,
      type,
      contextKeys: Object.keys(context)
    });

    // Call the resume AI service
    const result = await resumeAIService.generateContent(
      context,
      type as ResumeFieldType,
      userId
    );

    // Format the content for display
    const formattedContent = ResumeAIService.formatContentForDisplay(
      result,
      type as ResumeFieldType
    );

    console.log('[Resume AI API] Formatted content:', formattedContent);
    console.log('[Resume AI API] Sending response:', {
      code: 0,
      message: 'Content generated successfully',
      data: {
        content: formattedContent,
        raw: result
      }
    });

    return respJson(0, 'Content generated successfully', {
      content: formattedContent,
      raw: result
    });
  } catch (error) {
    console.error('[Resume AI API] Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
    
    return respErr(errorMessage, 500);
  }
}