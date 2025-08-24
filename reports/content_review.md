# Content Review Report
Date: 24 August 2025
Reviewer: HeyEd Content & Copy Reviewer

## Executive Summary
This comprehensive review examined all user-facing content across the HeyEd marketing website, including the main landing page, contact forms, help centre, comparison pages, legal documents, and error pages. The review focused on grammar, brand consistency, accessibility, readability, and inclusive language usage for the UK childcare sector.

**Overall Assessment**: The content demonstrates strong brand awareness and sector knowledge but requires improvements in clarity, consistency, and accessibility. Several areas need attention to better serve non-native English speakers and ensure optimal user experience.

## Strengths
- **Strong Brand Identity**: Consistent use of "HeyEd" throughout most content areas
- **Sector-Specific Expertise**: Appropriate use of UK education terminology (Ofsted, KCSiE, EYFS, etc.)
- **Professional Tone**: Maintains a calm, supportive voice appropriate for the childcare sector
- **Comprehensive Legal Documentation**: Thorough privacy policy, terms of service, and DPA
- **User-Focused Features**: Practical help centre with video tutorials and FAQs

## Issues Found

### High Priority

**Issue:** Inconsistent product naming in footer navigation
**Current:** "AskEd." (with period)
**Suggested:** "AskEd" (without period)
**Rationale:** Brand guidelines specify "AskEd" without punctuation for consistency

**Issue:** Overly complex sentence structure in hero copy
**Current:** "Purpose-built for nurseries, schools and clubs to meet Ofsted requirements and maintain inspection-ready compliance."
**Suggested:** "Purpose-built for nurseries, schools, and clubs. Meet Ofsted requirements and maintain inspection-ready compliance."
**Rationale:** Breaking into two sentences improves readability and adds missing Oxford comma

**Issue:** Jargon-heavy testimonials section
**Current:** "HeyEd. has streamlined our compliance processes significantly. The automated alerts and document tracking have saved us countless hours."
**Suggested:** "HeyEd has made our compliance much simpler. The automatic reminders and document tracking save us time every day."
**Rationale:** Simplifies language for broader accessibility while maintaining meaning

**Issue:** Inconsistent spacing in company name styling
**Current:** Multiple instances of inconsistent formatting in landing page
**Suggested:** Standardise all references to use consistent spacing and colour coding
**Rationale:** Brand consistency is critical for professional appearance

**Issue:** Contact form missing accessibility labels
**Current:** Form lacks proper ARIA labels and descriptions
**Suggested:** Add comprehensive ARIA labels and help text for screen readers
**Rationale:** WCAG 2.1 AA compliance requirement

### Medium Priority

**Issue:** Help centre uses "Help Centre" vs "Help Center"
**Current:** "Help Centre" (British spelling)
**Suggested:** Maintain "Help Centre" but ensure consistency across all pages
**Rationale:** Correct UK English spelling, but needs consistency verification

**Issue:** Legal documents contain dense paragraphs
**Current:** Privacy policy sections with 150+ word paragraphs
**Suggested:** Break long paragraphs into shorter, more digestible chunks with bullet points where appropriate
**Rationale:** Improves readability and comprehension

**Issue:** FAQ section could be more conversational
**Current:** "HeyEd provides a simple import tool that allows you to bulk upload your existing staff records."
**Suggested:** "Yes! HeyEd makes it easy to bring in your existing staff records. You can upload them all at once using our simple import tool."
**Rationale:** More conversational tone aligns better with FAQ format expectations

**Issue:** Download page form labels inconsistent
**Current:** Mix of required/optional field indicators
**Suggested:** Clear, consistent labelling with asterisks (*) for required fields and "(optional)" for others
**Rationale:** Improved user experience and form completion rates

**Issue:** Error messages lack specific guidance
**Current:** Generic "Something went wrong" messaging
**Suggested:** More specific error messages with actionable next steps
**Rationale:** Better user experience and reduced support burden

### Low Priority

**Issue:** Pricing section could emphasise value more clearly
**Current:** "Choose the perfect plan for your team size. All features included, no hidden fees."
**Suggested:** "Choose the plan that fits your team. Every plan includes all features with no hidden costs or setup fees."
**Rationale:** Clearer value proposition with emphasis on transparency

**Issue:** Video descriptions in help centre are too brief
**Current:** "Learn how to create and configure different staff types in your HeyEd system."
**Suggested:** "Learn how to create and configure different staff types in your HeyEd system. This tutorial covers setting up roles, permissions, and custom staff categories."
**Rationale:** More detailed descriptions help users find relevant content

**Issue:** Cookie policy table formatting could improve
**Current:** Technical presentation of cookie information
**Suggested:** Add explanatory text before tables and use more user-friendly language
**Rationale:** Better user understanding of data practices

## Recommendations

1. **Immediate Actions Required**:
   - Fix "AskEd." to "AskEd" in footer navigation
   - Add missing Oxford commas throughout content
   - Standardise all brand name formatting and styling
   - Add proper ARIA labels to all forms

2. **Content Simplification Priority**:
   - Review all sentences over 25 words for potential breaks
   - Replace jargon with simpler alternatives where possible
   - Add explanatory text for technical terms when first mentioned
   - Create a glossary for sector-specific terms

3. **Accessibility Improvements**:
   - Audit all forms for WCAG 2.1 AA compliance
   - Ensure proper heading hierarchy on all pages
   - Add alt text descriptions for decorative elements
   - Test with screen readers and keyboard navigation

4. **User Experience Enhancements**:
   - Improve error messaging with specific, actionable guidance
   - Enhance FAQ responses with more conversational tone
   - Add progress indicators to multi-step forms
   - Consider adding breadcrumb navigation for complex user flows

5. **Legal Content Updates**:
   - Review data retention periods for consistency across documents
   - Simplify privacy policy language while maintaining legal accuracy
   - Add plain English summaries for key legal points
   - Ensure all contact information is current and consistent

## Brand Consistency Check
- [ ] HeyEd naming correct (mostly correct, needs footer fix)
- [✓] AskEd naming correct (needs period removal in footer)
- [✓] Tone appropriate
- [✓] Sector terminology accurate

## Technical Content Areas Reviewed
- **Main Landing Page** (/app/landing-page-client.tsx) - Hero, features, testimonials, pricing, FAQs
- **Contact Page** (/app/contact/page.tsx) - Contact form and messaging
- **Help Centre** (/app/help/page.tsx) - Video tutorials and guidance
- **Comparison Page** (/app/comparison/page.tsx) - Feature comparisons with uCheck
- **Privacy Policy** (/app/privacy/page.tsx) - Legal compliance documentation
- **Terms of Service** (/app/terms/page.tsx) - Service terms and conditions
- **Cookies Policy** (/app/cookies/page.tsx) - Cookie usage and consent
- **Data Processing Agreement** (/app/dpa/page.tsx) - GDPR compliance documentation
- **AskEd Interface** (/app/ask-ed/page.tsx) - AI assistant interface and disclaimers
- **Download Page** (/app/download/page.tsx) - Lead generation form
- **Error Pages** (/app/error.tsx, /app/global-error.tsx) - Error messaging
- **Footer Component** (/components/footer.tsx) - Site navigation and links
- **Onboarding Page** (/app/onboarding/page.tsx) - User registration flow

## Next Steps
1. Address high-priority brand consistency issues immediately
2. Conduct accessibility audit with automated tools
3. User test forms with non-native English speakers
4. Review all legal content with compliance team
5. Implement content style guide for future updates

This review provides a foundation for improving content quality while maintaining the professional, supportive tone that HeyEd's customers in the UK childcare sector expect and trust.