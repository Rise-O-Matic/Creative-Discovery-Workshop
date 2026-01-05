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

// AI autofill endpoint
app.post('/api/autofill', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const systemPrompt = `You are an expert creative strategist helping to fill out a creative discovery workshop. 
Based on a project description, you will generate thoughtful, specific answers to 19 questions across 4 categories:

**AUDIENCE (5 questions)**
- Who is your primary audience?
- Are there secondary audiences?
- What age range and profession?
- What do they value most?
- Where do they spend their time?

**OFFERING (5 questions)**
- What are you offering?
- What makes it different?
- What is the core benefit?
- What problem does it solve?
- How would you describe it in one sentence?

**TIMING (4 questions)**
- Why now? What is the urgency?
- Is there a specific deadline?
- What happens if you wait?
- Are there seasonal or cultural factors?

**SUCCESS (5 questions)**
- How will you measure success?
- What does short-term success look like?
- What about long-term success?
- What would failure look like?
- Who gets to declare this a success?

Return your response as a JSON object with this structure:
{
  "projectName": "A concise project name (3-6 words)",
  "projectDescription": "An enhanced version of the input description (2-3 sentences)",
  "granularAnswers": {
    "aud-1": "answer to audience question 1",
    "aud-2": "answer to audience question 2",
    "aud-3": "answer to audience question 3",
    "aud-4": "answer to audience question 4",
    "aud-5": "answer to audience question 5",
    "off-1": "answer to offering question 1",
    "off-2": "answer to offering question 2",
    "off-3": "answer to offering question 3",
    "off-4": "answer to offering question 4",
    "off-5": "answer to offering question 5",
    "time-1": "answer to timing question 1",
    "time-2": "answer to timing question 2",
    "time-3": "answer to timing question 3",
    "time-4": "answer to timing question 4",
    "succ-1": "answer to success question 1",
    "succ-2": "answer to success question 2",
    "succ-3": "answer to success question 3",
    "succ-4": "answer to success question 4",
    "succ-5": "answer to success question 5"
  }
}

Make answers specific, actionable, and tailored to the project. Each answer should be 1-2 sentences.`;

    const userPrompt = `Project description: "${prompt}"

Please generate all workshop answers based on this project description.`;

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
    if (!result.projectName || !result.projectDescription || !result.granularAnswers) {
      throw new Error('Invalid response format from AI');
    }

    res.json(result);
  } catch (error) {
    console.error('Error in autofill endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to generate workshop content',
      message: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Backend API server running on port ${port}`);
});
