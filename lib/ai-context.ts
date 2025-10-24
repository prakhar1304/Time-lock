import type { UserProfile, AIMemory, ConversationMessage } from './ai-types'

export interface AIContext {
  userProfile: UserProfile
  aiMemory: AIMemory
  currentTasks: any[]
  recentMessages: ConversationMessage[]
}

export function buildSystemPrompt(context: AIContext): string {
  const { userProfile, aiMemory, currentTasks, recentMessages } = context
  
  const taskContext = currentTasks
    .slice(0, 10)
    .map((t: any) => `- ${t.title} (${t.category}, ${t.recurring}, ${t.completed ? 'completed' : 'pending'})`)
    .join('\n')

  const goalsContext = userProfile.userGoals.length > 0 
    ? `User Goals: ${userProfile.userGoals.join(', ')}`
    : 'No specific goals set yet'

  const conversationContext = recentMessages
    .slice(-6) // Last 6 messages for context
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n')

  const insightsContext = aiMemory.userInsights.commonChallenges.length > 0
    ? `Common Challenges: ${aiMemory.userInsights.commonChallenges.join(', ')}`
    : ''

  return `You are Time Lock AI, a realistic and honest task management assistant for ${userProfile.preferences.systemPersonality || 'helpful'} guidance.

CORE PRINCIPLES:
1. Be honest about limitations - never promise impossible outcomes
2. Provide realistic timelines and expectations  
3. Acknowledge when tasks are complex or challenging
4. Suggest breaking down large goals into manageable steps
5. Be encouraging but not overly optimistic
6. Reference previous conversations when relevant

USER CONTEXT:
- Current Tasks (${currentTasks.length} total):
${taskContext}

- ${goalsContext}
- Working Hours: ${userProfile.preferences.workingHours.start} - ${userProfile.preferences.workingHours.end}
- Timezone: ${userProfile.preferences.timezone}
- Preferred Categories: ${userProfile.preferences.taskCategories.join(', ')}

${insightsContext}

RECENT CONVERSATION:
${conversationContext}

RESPONSE GUIDELINES:
- If a request is unrealistic, explain why and suggest alternatives
- Provide specific, actionable advice based on user's actual tasks and goals
- Use data from user's task history for insights
- Suggest task breakdowns for complex goals
- Be honest about time estimates and difficulty levels
- Reference user's working hours and preferences
- Keep responses concise and to-the-point (aim for 2-3 paragraphs max)
- Use markdown formatting: **bold** for emphasis, bullet points with - or *, numbered lists
- Structure responses with clear headings and bullet points for easy reading
- Always use bullet points (-) for lists and **bold** for important terms
- Make responses actionable and specific, not generic advice

TASK FORMAT: [TASK] Title | Category | Recurring | Priority
PRIORITY: low, medium, high, urgent
CATEGORIES: ${userProfile.preferences.taskCategories.join(', ')}

Remember: Be helpful, realistic, and honest. Don't give false hope or unrealistic promises.`
}

export function extractTaskSuggestions(response: string): Array<{
  title: string
  category: string
  recurring: string
  priority: string
}> {
  const taskMatches = response.match(/\[TASK\](.*?)(?=\[TASK\]|$)/g)
  
  if (!taskMatches) return []
  
  return taskMatches.map(match => {
    const taskText = match.replace('[TASK]', '').trim()
    const [title, category, recurring, priority] = taskText.split('|').map(s => s.trim())
    
    return {
      title: title || '',
      category: category || 'Personal',
      recurring: recurring || 'once',
      priority: priority || 'medium'
    }
  }).filter(task => task.title)
}

export function generateContextSummary(
  tasks: any[], 
  userProfile: UserProfile, 
  recentMessages: ConversationMessage[]
): string {
  const completedTasks = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  const recentGoalMentions = recentMessages
    .slice(-10)
    .filter(msg => msg.content.toLowerCase().includes('goal'))
    .length

  return `User has ${totalTasks} tasks with ${completionRate}% completion rate. Recent conversation shows ${recentGoalMentions} goal-related discussions. Working hours: ${userProfile.preferences.workingHours.start}-${userProfile.preferences.workingHours.end}.`
}
