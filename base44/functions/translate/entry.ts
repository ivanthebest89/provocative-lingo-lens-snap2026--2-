import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const { mode, text, imageUrl, sourceLang, targetLang } = body;

    if (!targetLang) {
      return Response.json({ error: 'targetLang is required' }, { status: 400 });
    }

    const sourceInstruction = sourceLang === 'auto'
      ? 'Detect the language of the text automatically.'
      : `The source language is ${sourceLang}.`;

    let prompt;
    let file_urls;

    if (mode === 'image') {
      if (!imageUrl) return Response.json({ error: 'imageUrl is required for image mode' }, { status: 400 });
      file_urls = [imageUrl];
      prompt = `You are a medical expert, OCR specialist, and translation expert.

1. Extract ALL visible text from the image.
2. ${sourceInstruction}
3. Translate the extracted text into ${targetLang}.
4. Analyze the full text for any medical conditions, symptoms, diagnoses, medications, or health-related information.

Be thorough in your medical analysis - identify any diseases, symptoms, conditions, medications, dosages, procedures, or medical terminology present in the text.`;
    } else {
      if (!text) return Response.json({ error: 'text is required for text mode' }, { status: 400 });
      prompt = `You are a medical expert and translation expert.

Here is the text:
"""${text}"""

1. ${sourceInstruction}
2. Translate the text into ${targetLang}.
3. Analyze the text for any medical conditions, symptoms, diagnoses, medications, or health-related information.

Be thorough in your medical analysis - identify any diseases, symptoms, conditions, medications, dosages, procedures, or medical terminology present.`;
    }

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      ...(file_urls ? { file_urls } : {}),
      response_json_schema: {
        type: 'object',
        properties: {
          original_text: { type: 'string', description: 'The original extracted or input text' },
          translated_text: { type: 'string', description: 'The translated text' },
          detected_language: { type: 'string', description: 'The detected source language' },
          severity: { type: 'string', enum: ['low', 'moderate', 'high', 'critical'], description: 'Severity level of content' },
          severity_reason: { type: 'string', description: 'Brief explanation of severity level' },
          word_translations: {
            type: 'array',
            description: 'Word-by-word breakdown of key words',
            items: {
              type: 'object',
              properties: {
                word: { type: 'string' },
                translation: { type: 'string' },
                type: { type: 'string' }
              }
            }
          },
          medical_analysis: {
            type: 'object',
            description: 'Medical analysis of the text content',
            properties: {
              has_medical_content: { type: 'boolean', description: 'Whether any medical content was detected' },
              conditions: {
                type: 'array',
                description: 'Identified medical conditions or diagnoses',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', description: 'Name of the condition' },
                    description: { type: 'string', description: 'Brief description of the condition' },
                    urgency: { type: 'string', enum: ['routine', 'urgent', 'emergency'], description: 'Medical urgency level' }
                  }
                }
              },
              medications: {
                type: 'array',
                description: 'Identified medications or drugs',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    purpose: { type: 'string', description: 'What this medication treats' },
                    notes: { type: 'string', description: 'Dosage or important notes if mentioned' }
                  }
                }
              },
              symptoms: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of symptoms mentioned'
              },
              recommendations: { type: 'string', description: 'General medical recommendations or next steps' },
              disclaimer: { type: 'string', description: 'Medical disclaimer for the analysis' }
            }
          }
        }
      }
    });

    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});