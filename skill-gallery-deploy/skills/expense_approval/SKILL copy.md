---
name: expense-approval
description: This skill should be used when processing expense reimbursement requests, validating expense compliance against company standards, checking expense limits, applying travel policies, or generating approval summaries. Use this skill for any task related to expense management, reimbursement workflows, or policy verification.
---

# Expense Approval

## Overview

This skill enables systematic processing of expense reimbursement requests with validation against company standards and travel policies. It provides structured workflows for reviewing expenses, checking compliance with predefined limits, and generating approval recommendations.

## Quick Start

To process an expense reimbursement request:

1. Review the expense details (amount, category, date, receipts)
2. Check applicable limits using `standards/expense_limits.json`
3. Verify compliance with relevant policies from `policies/travel_policy.md`
4. Generate approval recommendation with justification

## Expense Limits

Access company expense limits through `standards/expense_limits.json`, which contains:

- Daily allowances for meals, transportation, and accommodation
- Category-specific spending limits
- Tiered approval thresholds based on amount
- City classification for accommodation standards

When validating expenses:
1. Load `standards/expense_limits.json` into context
2. Match expense category to relevant limit section
3. Compare submitted amount against defined limit
4. Document any exceedances or exceptions

## Travel Policies

Reference company travel policies from `policies/travel_policy.md`, covering:

- Booking requirements and advance notice periods
- Approved booking channels and platforms
- Transportation standards (flight classes, train seats)
- Accommodation guidelines (hotel tiers, city classifications)
- Meal allowance rules and documentation requirements
- Emergency expense handling procedures
- Required supporting documentation for reimbursement

When applying travel policies:
1. Load `policies/travel_policy.md` into context
2. Identify policy sections relevant to the expense type
3. Verify all policy requirements are met
4. Note any policy violations or missing documentation

## Approval Workflow

### Step 1: Initial Review

Examine the expense submission for completeness:
- Amount matches receipts
- Category classification is correct
- Date aligns with business purpose
- Required documentation is present

### Step 2: Limit Validation

Validate against applicable limits from `standards/expense_limits.json`:
- Check daily/transaction limits
- Verify cumulative totals if applicable
- Determine approval level based on amount

### Step 3: Policy Compliance

Verify compliance with relevant policies from `policies/travel_policy.md`:
- Booking advance requirements
- Preferred vendor usage
- Documentation completeness
- Policy exception justification

### Step 4: Decision

Generate approval recommendation:
- **Approve**: All limits and policies met
- **Approve with note**: Minor issues requiring clarification
- **Reject**: Policy violations or missing documentation
- **Escalate**: Exceeds approval authority

### Step 5: Documentation

Provide clear decision rationale:
- Cite specific limit or policy sections
- Explain any deviations or exceptions
- Note required follow-up actions

## Output Format

Generate approval summaries in the following structure:

```
Expense Approval Summary
========================

Submission Details:
- Employee: [Name]
- Submission Date: [Date]
- Total Amount: [Amount]
- Category: [Category]

Validation Results:
- Limit Compliance: [Compliant/Non-Compliant]
- Policy Compliance: [Compliant/Non-Compliant]
- Required Approvals: [Approval Levels]

Decision: [Approve/Reject/Escalate]

Justification:
[Detailed explanation citing specific limits and policies]

Follow-up Actions:
[If applicable]
```

## Common Scenarios

### Daily Expense Claims

For meal and transportation claims:
- Verify daily totals against cumulative limits in `expense_limits.json`
- Check receipt requirements from `travel_policy.md`
- Validate business purpose documentation

### Multi-Day Travel

For extended business trips:
- Calculate total across all days
- Verify per-day limits for each category
- Check accommodation standards by city classification
- Confirm adherence to booking advance policies

### Emergency Expenses

For exception claims:
- Reference emergency handling procedures in `travel_policy.md`
- Verify emergency justification documentation
- Check if pre-approval was obtained (if required)
- Document exception reasoning

## Resources

This skill includes structured reference documents:

### standards/expense_limits.json

Defines company expense limits and thresholds including:
- Meal allowances (breakfast, lunch, dinner, daily totals)
- Transportation limits (taxi, public transport, rental car)
- Accommodation standards by city tier
- Miscellaneous expense categories
- Approval level thresholds

**Appropriate for:** Real-time limit validation, amount verification, approval level determination

### policies/travel_policy.md

Contains comprehensive travel expense policies covering:
- Booking requirements and advance notice periods
- Approved booking channels and vendor lists
- Transportation class and seat standards
- Accommodation guidelines and hotel classifications
- Meal allowance rules and invoice requirements
- Emergency expense handling and exception processes
- Required documentation for reimbursement submission

**Appropriate for:** Policy compliance verification, exception handling, documentation requirements
