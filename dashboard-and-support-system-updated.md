# AskEd. Dashboard & Email Capture System - Updated Plan

## Overview
Create a balanced system that provides value to users while capturing emails and controlling costs through smart usage limits.

## Key Principles
1. **Value First** - Users get genuine help before any email capture
2. **Cost Control** - Smart limits prevent abuse while allowing genuine use
3. **Progressive Engagement** - Email capture at optimal moments
4. **Data-Driven** - Dashboard provides insights to optimize the system

## User Journey & Cost Control Strategy

### Free Tier (No Email Required)
- **5 questions per session** 
- **1 session per IP per hour** (prevents spam/abuse)
- Full access to all compliance information
- No registration required

### Extended Access (Email Required)
- **After 5th question**: Show email capture modal
- **Email captured**: Unlock unlimited questions for 7 days
- **Email benefits**: Weekly compliance updates, new guidance alerts
- **Return users**: Recognized by email, no limits

### Premium Hints (For HeyEd. Conversion)
- **After 3rd interaction**: Subtle "See how HeyEd. helps with this" mention
- **Non-intrusive**: Link to specific HeyEd. features relevant to their questions

## Dashboard Features

### Real-Time Metrics
- **Usage Stats**: Questions/hour, sessions/day, popular topics
- **Cost Monitoring**: API usage, OpenAI costs, cost per question
- **Email Capture**: Conversion rates, successful captures
- **User Behavior**: Return rate, question patterns, drop-off points

### Content Insights
- **Question Analytics**: Most asked topics, knowledge gaps
- **Performance Metrics**: Response confidence, user satisfaction
- **Feature Usage**: Which documents are accessed most

## Technical Implementation

### Phase 1: Usage Tracking & Limits (Week 1)

#### Enhanced Analytics Tracking
```sql
-- Add to existing ask_ed_analytics table
ALTER TABLE ask_ed_analytics ADD COLUMN IF NOT EXISTS session_question_count INTEGER DEFAULT 1;
ALTER TABLE ask_ed_analytics ADD COLUMN IF NOT EXISTS user_ip TEXT;
ALTER TABLE ask_ed_analytics ADD COLUMN IF NOT EXISTS has_email BOOLEAN DEFAULT FALSE;
ALTER TABLE ask_ed_analytics ADD COLUMN IF NOT EXISTS cost_estimate DECIMAL(10,4);

-- Index for rate limiting
CREATE INDEX IF NOT EXISTS idx_analytics_ip_time ON ask_ed_analytics(user_ip, created_at);
```

#### Rate Limiting Logic
```typescript
// /lib/ask-ed/usageLimits.ts
interface UsageLimits {
  freeQuestionsPerSession: 5;
  sessionsPerIpPerHour: 1;
  emailRequiredAfter: 5;
  unlimitedDaysAfterEmail: 7;
}

export async function checkUsageLimits(
  sessionId: string, 
  userIp: string, 
  userEmail?: string
): Promise<{
  allowed: boolean;
  remaining: number;
  requiresEmail: boolean;
  message?: string;
}>
```

### Phase 2: Email Capture Modal (Week 1)

#### Smart Email Capture Component
```typescript
// /components/ask-ed/EmailCaptureModal.tsx
interface EmailCaptureModalProps {
  isOpen: boolean;
  questionsAsked: number;
  topicsDiscussed: string[];
  onEmailSubmit: (email: string, interests: string[]) => void;
  onSkip: () => void; // Allow 1-2 more questions before requiring
}
```

#### Email Capture Strategy
- **Trigger**: After 5th question in session
- **Value Proposition**: "Get weekly compliance updates and unlimited access"
- **Topics**: Pre-select based on their questions (EYFS, KCSiE, Ofsted)
- **Graceful**: Allow 1-2 more questions if they dismiss, then require email

### Phase 3: Dashboard Implementation (Week 2)

#### Simple Dashboard Route
```typescript
// /app/dashboard/page.tsx
// Protected route with simple auth (env variable check)

const DashboardPage = () => {
  return (
    <div className="dashboard">
      <MetricsOverview />
      <UsageCharts />
      <EmailCaptureStats />
      <RecentQuestions />
      <CostMonitoring />
    </div>
  );
};
```

#### Key Dashboard Components

**Metrics Cards**
- Total questions today/week/month
- Unique users (IP-based)
- Email capture rate
- Average questions per session
- Estimated costs

**Usage Charts**
- Questions over time (hourly/daily)
- Popular topics breakdown
- Success rate by question type
- Peak usage times

**Email Analytics**
- Capture conversion rate
- Most effective trigger points
- User retention after email capture
- Geographic distribution (if available)

**Cost Monitoring**
- OpenAI API usage
- Cost per question
- Daily/weekly spend
- Usage by user type (free vs email)

### Phase 4: Advanced Features (Week 3)

#### Smart Cost Controls
```typescript
// Automatic cost protection
interface CostControls {
  dailyBudgetLimit: number; // £50/day
  pauseAtLimit: boolean;
  alertThresholds: [£30, £40]; // Email alerts
  prioritizeEmailUsers: boolean; // When near limit
}
```

#### Enhanced Analytics
- **User Cohorts**: Free vs Email users behavior
- **Content Performance**: Which document sections are most valuable
- **Conversion Tracking**: Email → HeyEd. trial signup
- **A/B Testing**: Different email capture timing

## File Structure
```
/app/
├── dashboard/
│   ├── page.tsx                    # Main dashboard (auth protected)
│   └── loading.tsx                 # Loading states
└── api/
    ├── analytics/
    │   ├── overview/route.ts       # Key metrics
    │   ├── usage/route.ts          # Usage patterns
    │   ├── costs/route.ts          # Cost tracking
    │   └── emails/route.ts         # Email capture stats
    └── ask-ed/
        ├── check-limits/route.ts   # Usage limit checking
        └── capture-email/route.ts  # Email capture endpoint

/components/
├── ask-ed/
│   ├── EmailCaptureModal.tsx      # Smart email capture
│   └── UsageLimitNotice.tsx       # Gentle limit notices
└── dashboard/
    ├── MetricsOverview.tsx        # KPI cards
    ├── UsageCharts.tsx            # Usage visualizations
    ├── EmailStats.tsx             # Email capture analytics
    ├── CostMonitor.tsx            # Cost tracking
    └── RecentActivity.tsx         # Recent questions/activity

/lib/
├── ask-ed/
│   ├── usageLimits.ts            # Rate limiting logic
│   ├── emailCapture.ts           # Email capture logic
│   └── costTracking.ts           # Cost estimation
└── dashboard/
    ├── queries.ts                # Dashboard data queries
    └── analytics.ts              # Analytics aggregation
```

## Success Metrics

### User Experience
- **90%+ question success rate** maintained
- **<3 second response times** maintained
- **30%+ email capture rate** from engaged users
- **Low complaint rate** about limits

### Business Metrics
- **Email database growth**: 50+ new emails/week
- **Cost control**: <£200/month OpenAI costs
- **User retention**: 40%+ return within 7 days
- **HeyEd. conversion**: 5%+ trial signups from AskEd. users

## Implementation Timeline

### Week 1: Core Features
- [ ] Usage limiting system
- [ ] Email capture modal
- [ ] Basic cost tracking
- [ ] Enhanced analytics

### Week 2: Dashboard  
- [ ] Dashboard interface
- [ ] Metrics visualization
- [ ] Real-time monitoring
- [ ] Email management

### Week 3: Optimization
- [ ] A/B test email capture timing
- [ ] Advanced cost controls
- [ ] Performance optimization
- [ ] User feedback collection

## Cost Protection Mechanisms

1. **Smart Rate Limiting**: Prevents abuse while allowing genuine use
2. **Progressive Email Capture**: Users get value before giving email
3. **Daily Budget Controls**: Automatic pause at spending limits
4. **User Prioritization**: Email users get priority when near limits
5. **Efficient Caching**: Reduce redundant API calls
6. **Alert System**: Early warnings before hitting limits

This approach balances user value, cost control, and email capture while providing the insights you need through the dashboard.