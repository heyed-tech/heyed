# Ask Ed Dashboard & Support System

## Overview

This document outlines the implementation of two complementary features for the Ask Ed compliance chatbot:

1. **Analytics Dashboard** - Monitor chatbot usage, question patterns, and user engagement
2. **Tactful Email Capture System** - Value-first approach to capturing user emails for ongoing compliance support

Both features focus on providing genuine value to users while gathering insights to improve the Ask Ed service.

## Project Goals

### Analytics Dashboard
- Monitor chatbot performance and user engagement
- Identify knowledge gaps and popular compliance topics
- Track unique visitors and usage patterns
- Export data for content strategy planning

### Email Capture System
- Offer ongoing compliance support rather than sales
- Capture engaged users at optimal moment (after 3rd message)
- Maintain professional, helpful tone consistent with Ask Ed
- Build trust through value-first approach

## Technical Architecture

### Database Schema Additions

#### Support Requests Table
```sql
CREATE TABLE ask_ed_support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  setting_type TEXT, -- 'nursery' or 'club'
  session_id TEXT,
  questions_context TEXT[], -- topics they asked about before signup
  request_type TEXT DEFAULT 'compliance_updates',
  modal_shown_at TIMESTAMP WITH TIME ZONE,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  utm_source TEXT,
  user_questions_count INTEGER DEFAULT 0
);

CREATE INDEX idx_support_requests_email ON ask_ed_support_requests(email);
CREATE INDEX idx_support_requests_session ON ask_ed_support_requests(session_id);
CREATE INDEX idx_support_requests_created ON ask_ed_support_requests(requested_at);
```

#### Enhanced Analytics Tracking
```sql
-- Add columns to existing ask_ed_analytics table
ALTER TABLE ask_ed_analytics ADD COLUMN IF NOT EXISTS modal_event_type TEXT;
ALTER TABLE ask_ed_analytics ADD COLUMN IF NOT EXISTS user_message_count INTEGER;

-- Track modal events: 'modal_shown', 'modal_dismissed', 'email_captured'
```

### File Structure

```
/dashboard-and-support-system.md

/app/
├── dashboard/
│   ├── page.tsx                    # Main dashboard page
│   └── loading.tsx                 # Dashboard loading state
└── api/
    └── analytics/
        ├── stats/route.ts          # Overall statistics
        ├── questions/route.ts      # Question analysis
        ├── visitors/route.ts       # Visitor metrics
        ├── support/route.ts        # Email capture analytics
        └── trends/route.ts         # Time-based trends

/components/
├── ask-ed/
│   └── SupportModal.tsx           # Email capture modal
└── dashboard/
    ├── MetricsCards.tsx           # Key performance indicators
    ├── QuestionAnalytics.tsx      # Question categorization
    ├── VisitorMetrics.tsx         # User engagement metrics
    ├── SupportAnalytics.tsx       # Email capture performance
    └── TimeSeriesChart.tsx        # Usage over time

/lib/
├── analytics/
│   ├── queries.ts                 # Database query builders
│   ├── aggregators.ts             # Data aggregation functions
│   └── types.ts                   # TypeScript interfaces
└── support/
    ├── emailCapture.ts            # Email capture logic
    └── validation.ts              # Email validation schemas
```

## Implementation Details

### Phase 1: Backend API Endpoints

#### `/app/api/analytics/stats/route.ts`
```typescript
export async function GET(request: NextRequest) {
  // Return overall statistics:
  // - Total questions asked
  // - Unique visitors (by session_id)
  // - Average session length
  // - Email capture conversion rate
  // - Top question categories
}
```

#### `/app/api/analytics/support/route.ts`
```typescript
export async function GET(request: NextRequest) {
  // Return email capture analytics:
  // - Modal impression rate
  // - Email capture conversion rate
  // - Time-to-conversion metrics
  // - Setting type preferences
}

export async function POST(request: NextRequest) {
  // Handle email capture submission:
  // - Validate email format
  // - Store in ask_ed_support_requests
  // - Track conversion analytics
}
```

### Phase 2: Analytics Dashboard Components

#### `/components/dashboard/MetricsCards.tsx`
Key metrics displayed:
- Total questions this month
- Unique visitors
- Average questions per session
- Email capture rate
- Most popular compliance topics

#### `/components/dashboard/SupportAnalytics.tsx`
Email capture performance:
- Modal impression rate
- Conversion funnel analysis
- Time-to-conversion patterns
- Setting type preferences
- Question topics that drive signups

### Phase 3: Email Capture Modal Implementation

#### `/components/ask-ed/SupportModal.tsx`

**Design Principles:**
- Professional, helpful tone
- Clear value proposition
- Easy dismissal options
- Mobile-optimized design
- Smooth animations

**Timing Logic:**
- Show after user's 3rd message response
- Only show once per session
- Track impression in analytics
- Store dismissal state in localStorage

**Content Strategy:**

##### Modal Headlines (Setting-Specific)
```typescript
const headlines = {
  nursery: "Stay updated on EYFS & compliance changes",
  club: "Keep current with safety & compliance updates"
}
```

##### Value Propositions
```typescript
const valueProps = {
  nursery: "Get notified about EYFS updates, Ofsted changes, and new compliance guidance that affects your nursery.",
  club: "Receive updates on safety regulations, activity guidelines, and compliance changes relevant to your club."
}
```

##### Call-to-Action Options
- Primary: "Yes, keep me informed"
- Secondary: "Maybe later"
- Tertiary: "No thanks" (small, unobtrusive)

#### Tactful Messaging Examples

**Professional & Value-First:**
```
"Getting helpful compliance guidance from Ask Ed?"

"As regulations evolve, we can send you relevant updates for your [nursery/club] - just helpful information about compliance changes that might affect you."

[Email input field]

"Yes, keep me informed about compliance changes"
"Maybe later"
```

**Alternative Approach:**
```
"Working on compliance questions?"

"Would you like us to notify you when there are important EYFS or safety regulation updates? We'll only send helpful compliance information - no sales content."
```

### Phase 4: User Experience Flow

#### Email Capture Journey
1. User visits Ask Ed and starts asking questions
2. After 3rd message response, system checks if modal should show
3. If eligible, modal appears with tactful messaging
4. User can:
   - Enter email and subscribe to updates
   - Choose "Maybe later" (modal won't show again this session)
   - Dismiss modal (may see it again in future sessions)
5. All interactions tracked for analytics

#### Analytics Dashboard Access
1. Admin authentication required
2. Real-time data refresh capabilities
3. Date range filtering for all metrics
4. Export functionality for reporting
5. Mobile-responsive design

## Key Metrics to Track

### User Engagement Analytics
- **Daily Active Users**: Unique sessions per day
- **Questions per Session**: Average engagement depth
- **Return Visitors**: Sessions with repeat session IDs
- **Session Duration**: Time from first to last message
- **Popular Topics**: Most queried compliance areas

### Email Capture Performance
- **Modal Impression Rate**: % of 3+ message users who see modal
- **Conversion Rate**: % of modal viewers who provide email
- **Time to Conversion**: Questions asked before email capture
- **Topic Correlation**: Which question types drive most signups
- **Setting Type Performance**: Nursery vs Club conversion rates

### Content Strategy Insights
- **Knowledge Gaps**: Questions with low confidence scores
- **Failed Searches**: Queries that don't match documents
- **Trending Topics**: Emerging compliance concerns
- **Seasonal Patterns**: Time-based usage variations

## Implementation Timeline

### Week 1: Foundation
- [ ] Create database schema updates
- [ ] Build basic analytics API endpoints
- [ ] Implement email capture modal component
- [ ] Set up basic dashboard page structure

### Week 2: Core Features
- [ ] Complete all analytics endpoints
- [ ] Build dashboard visualisation components
- [ ] Integrate modal with Ask Ed chat flow
- [ ] Implement email validation and storage

### Week 3: Enhancement & Testing
- [ ] Add advanced analytics features
- [ ] Implement data export capabilities
- [ ] Comprehensive testing of modal timing
- [ ] Performance optimisation

### Week 4: Polish & Deploy
- [ ] Admin authentication for dashboard
- [ ] Mobile responsiveness testing
- [ ] Documentation completion
- [ ] Production deployment

## Technical Considerations

### Performance
- Cache frequently accessed analytics data
- Implement pagination for large datasets
- Use efficient database queries with proper indexing
- Lazy load dashboard components

### Privacy & Compliance
- GDPR-compliant email collection
- Clear privacy policy references
- Option to unsubscribe from updates
- Secure email storage and handling

### User Experience
- Non-intrusive modal timing
- Professional visual design
- Clear value proposition
- Respectful dismissal options
- Mobile-optimised interface

### Analytics Accuracy
- Unique visitor identification strategy
- Session boundary definition
- Bot traffic filtering
- Data validation and cleaning

## Success Metrics

### Quantitative Goals
- **Email Capture Rate**: 15-25% of users who see modal
- **Modal Impression Rate**: 60%+ of multi-question users
- **User Retention**: Captured emails continue using Ask Ed
- **Value Delivery**: High open rates for compliance updates

### Qualitative Goals
- **User Feedback**: Positive response to email capture approach
- **Brand Trust**: Maintains Ask Ed's helpful, professional image
- **Content Quality**: Analytics inform better compliance content
- **Professional Growth**: Users report improved compliance knowledge

## Maintenance & Updates

### Regular Tasks
- Weekly analytics review and reporting
- Monthly email list health checks
- Quarterly modal performance analysis
- Ongoing compliance content updates

### Future Enhancements
- Advanced user segmentation
- Personalised compliance recommendations
- Integration with HeyEd CRM system
- Automated compliance alert system

## Conclusion

This implementation balances user value with business objectives, maintaining Ask Ed's trusted position as a compliance helper while building a valuable email list for ongoing support communications. The focus remains on professional development and regulatory compliance rather than sales, ensuring user trust and engagement.