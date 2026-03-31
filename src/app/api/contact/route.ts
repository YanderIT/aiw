import { NextResponse } from 'next/server';

// 飞书 Webhook URL - 请替换为您的实际 webhook URL
const FEISHU_WEBHOOK = process.env.FEISHU_WEBHOOK_URL || 'https://open.feishu.cn/open-apis/bot/v2/hook/YOUR_WEBHOOK_ID';

interface ContactForm {
  name: string;
  email: string; // 可以是邮箱或微信号
  feedbackType: string;
  documentType?: string;
  satisfaction: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const data: ContactForm = await request.json();
    
    // 获取满意度显示文本和颜色
    const satisfactionInfo = {
      very_satisfied: { text: '非常满意', color: 'green' },
      satisfied: { text: '满意', color: 'green' },
      neutral: { text: '一般', color: 'yellow' },
      dissatisfied: { text: '不满意', color: 'orange' },
      very_dissatisfied: { text: '非常不满意', color: 'red' }
    };

    const satisfaction = satisfactionInfo[data.satisfaction as keyof typeof satisfactionInfo] || 
                        { text: data.satisfaction, color: 'grey' };

    // 获取反馈类型显示文本
    const feedbackTypeText = {
      document_quality: '文书质量问题',
      feature_request: '功能建议',
      bug_report: '错误报告',
      ai_generation: 'AI生成问题',
      template_issue: '模板问题',
      account_payment: '账户/支付问题',
      other: '其他反馈'
    }[data.feedbackType] || data.feedbackType;

    // 获取文档类型显示文本
    const documentTypeText = data.documentType ? {
      recommendation_letter: '推荐信',
      cover_letter: '求职信',
      personal_statement: '个人陈述',
      sop: 'SOP',
      resume: '简历',
      study_abroad_consultation: '留学咨询',
      not_applicable: '不适用'
    }[data.documentType] || '未指定' : '未指定';
    
    // 构建飞书卡片消息
    const message = {
      msg_type: "interactive",
      card: {
        header: {
          title: {
            tag: "plain_text",
            content: "📝 新的产品反馈"
          },
          template: satisfaction.color // 根据满意度设置卡片颜色
        },
        elements: [
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**反馈类型**: ${feedbackTypeText}`
            }
          },
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**满意度**: ${satisfaction.text}`
            }
          },
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**相关文档**: ${documentTypeText}`
            }
          },
          {
            tag: "hr"
          },
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**客户信息**\n姓名: ${data.name}\n联系方式: ${data.email}`
            }
          },
          {
            tag: "hr"
          },
          {
            tag: "div",
            text: {
              tag: "lark_md",
              content: `**反馈内容**:\n${data.message}`
            }
          },
          {
            tag: "hr"
          },
          {
            tag: "note",
            elements: [
              {
                tag: "plain_text",
                content: `提交时间: ${new Date().toLocaleString('zh-CN', { 
                  timeZone: 'Asia/Shanghai',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}`
              }
            ]
          },
          {
            tag: "action",
            actions: [
              {
                tag: "button",
                text: {
                  tag: "plain_text",
                  content: "回复客户"
                },
                type: "primary",
                url: `mailto:${data.email}`
              }
            ]
          }
        ]
      }
    };

    // 发送到飞书
    const response = await fetch(FEISHU_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Feishu webhook error:', errorText);
      throw new Error('Failed to send message to Feishu');
    }

    const result = await response.json();
    
    // 检查飞书返回的状态
    if (result.code !== 0) {
      console.error('Feishu API error:', result);
      throw new Error(result.msg || 'Feishu API error');
    }

    return NextResponse.json({ 
      success: true,
      message: '反馈已成功提交'
    });
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '提交失败，请稍后重试' 
      },
      { status: 500 }
    );
  }
}