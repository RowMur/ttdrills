# AI-Powered Drill Recommendations Setup

## 🧠 **New AI Features**

The drill recommendations system now uses OpenRouter (with access to multiple AI models) to provide personalized, intelligent recommendations based on your training history.

### **✨ What's New**

1. **Session Note Analysis**: AI analyzes your session notes to understand:

   - Skills you practiced
   - Your mood and energy level
   - Areas you focused on
   - Challenges you faced
   - Improvements you noticed
   - **Specific weaknesses** (especially from practice matches)

2. **Personalized Recommendations**: AI generates recommendations based on:

   - Your recent training patterns
   - Performance trends
   - Skill gaps and strengths
   - Difficulty progression needs
   - **Practice match insights** (from sessions without drills)

3. **Smart Explanations**: Each recommendation includes:
   - Personalized reasoning
   - Priority level (high/medium/low)
   - Expected outcomes
   - Specific advice for you

### **🔧 Setup Required**

To enable AI-powered recommendations, you need to add your OpenRouter API key:

1. **Get an OpenRouter API Key**:

   - Visit [OpenRouter](https://openrouter.ai/keys)
   - Create a new API key
   - Copy the key

2. **Add to Environment Variables**:

   ```bash
   # Add to your .env file
   OPENROUTER_API_KEY=your_openrouter_api_key_here

   # Optional: Specify a different model (defaults to gpt-4o-mini)
   OPENROUTER_MODEL=anthropic/claude-3-haiku
   # or
   OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
   # or
   OPENROUTER_MODEL=google/gemini-flash-1.5

   # Optional: Your site URL for OpenRouter analytics
   SITE_URL=https://yourdomain.com
   ```

3. **Restart the Application**:
   ```bash
   pnpm dev
   ```

### **💰 Cost Considerations**

- **Multiple Model Options**: Choose from various providers
  - OpenAI GPT-4o-mini: ~$0.15/1M input tokens
  - Anthropic Claude 3 Haiku: ~$0.25/1M input tokens
  - Meta Llama 3.1 8B: **FREE** (with rate limits)
  - Google Gemini Flash 1.5: ~$0.075/1M input tokens
- Only analyzes recent sessions (last 5 sessions)
- Generates recommendations on-demand
- **Smart Caching**: Results cached to minimize API calls
  - Session analysis: 24 hours
  - Recommendations: 6 hours
  - Explanations: 12 hours
- Estimated cost: ~$0.005-0.02 per user per month (with caching)
- **Pro tip**: Use free models like Llama for development!

### **🔄 Fallback Behavior**

If AI is unavailable or API key is missing:

- System falls back to basic recommendations
- All existing functionality continues to work
- No disruption to user experience

### **🎯 Model Recommendations**

**For Development**:

- `meta-llama/llama-3.1-8b-instruct:free` - Completely free!

**For Production**:

- `google/gemini-flash-1.5` - Best value (fast + cheap)
- `anthropic/claude-3-haiku` - High quality, good speed
- `openai/gpt-4o-mini` - OpenAI's most affordable

### **📊 Cache Management**

Monitor and manage the AI cache:

- **View cache stats**: `GET /api/ai/cache`
- **Clear cache**: `DELETE /api/ai/cache`
- Cache automatically cleans up old entries
- Memory usage is monitored and limited

### **🎯 Benefits**

- **More Relevant**: Recommendations based on actual session content
- **Personalized**: Tailored to your specific needs and challenges
- **Motivating**: Encouraging explanations that keep you engaged
- **Progressive**: Helps you advance at the right pace

The AI system enhances your training experience by providing coach-like insights and recommendations!

### **🔧 Technical Notes**

- **OpenRouter Integration**: Uses OpenRouter API for access to multiple AI models
- **Smart Caching**: In-memory cache with TTL-based expiration
- **Response Cleaning**: Handles markdown formatting in AI responses to prevent JSON parsing errors
- **Practice Session Analysis**: Enhanced to analyze notes from practice matches and general training
- **Fallback Handling**: Graceful degradation if AI services are unavailable
- **Type Safety**: Full TypeScript support with proper error handling
