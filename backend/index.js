import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend API is running' });
});

// AI creative brief generation endpoint
app.post('/api/generate-brief', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const systemPrompt = `You are an expert creative strategist. Based on a project description, generate a complete, professional creative brief following standard industry conventions.

The brief should include these sections:

1. **Project Overview** - A compelling summary of the project (2-3 paragraphs)
2. **Target Audience** - Detailed description of who this is for (demographics, psychographics, behaviors)
3. **Key Message & Value Proposition** - The core message and unique value
4. **Objectives & Goals** - What this project aims to achieve (3-5 specific goals)
5. **Deliverables** - What will be created/delivered
6. **Tone & Style** - How the creative should feel and communicate
7. **Timeline & Milestones** - Key dates and phases
8. **Success Metrics** - How success will be measured (specific KPIs)

Return your response as a JSON object with this structure:
{
  "projectName": "A concise, compelling project name",
  "brief": {
    "overview": "2-3 paragraph overview with context, challenge, and opportunity",
    "audience": "Detailed audience description with demographics, psychographics, and behaviors",
    "keyMessage": "The core message and value proposition",
    "objectives": ["Objective 1", "Objective 2", "Objective 3", ...],
    "deliverables": "Description of what will be created",
    "toneAndStyle": "Description of tone, voice, and creative direction",
    "timeline": "Timeline description with key milestones",
    "successMetrics": ["Metric 1", "Metric 2", "Metric 3", ...]
  },
  "refinementQuestions": {
    "aud-1": "answer",
    "aud-2": "answer",
    "aud-3": "answer",
    "aud-4": "answer",
    "aud-5": "answer",
    "off-1": "answer",
    "off-2": "answer",
    "off-3": "answer",
    "off-4": "answer",
    "off-5": "answer",
    "time-1": "answer",
    "time-2": "answer",
    "time-3": "answer",
    "time-4": "answer",
    "succ-1": "answer",
    "succ-2": "answer",
    "succ-3": "answer",
    "succ-4": "answer",
    "succ-5": "answer"
  }
}

Make the brief professional, specific, and actionable. Use the project description to inform all sections.`;

    const userPrompt = `Project description: "${prompt}"

Generate a complete creative brief for this project.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content);

    // Validate the response structure
    if (!result.projectName || !result.brief) {
      throw new Error('Invalid response format from AI');
    }

    res.json(result);
  } catch (error) {
    console.error('Error in generate-brief endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to generate creative brief',
      message: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Backend API server running on port ${port}`);
});
