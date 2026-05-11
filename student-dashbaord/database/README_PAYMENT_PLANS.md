# Payment Plan Implementation Guide

This guide explains how to implement and use the payment plan functionality in your Supabase database.

## Files Created

1. **`database/payment_plan_operations.sql`** - Database functions for payment plan operations
2. **`src/utils/paymentPlanService.ts`** - TypeScript service for frontend integration
3. **`src/components/form/PaymentPlanForm.tsx`** - React form component

## Payment Plan Options

- `"Select a plan"` - Default placeholder
- `"Fully Paid"` - Complete payment made
- `"1st installment"` - First installment payment plan
- `"2nd installment"` - Second installment payment plan

## Setup Instructions

### 1. Execute SQL Script

Run the SQL script in your Supabase database:

```sql
-- Execute this in Supabase SQL Editor
-- File: database/payment_plan_operations.sql
```

### 2. Grant Permissions (Optional)

Uncomment and modify the permission grants at the bottom of the SQL script:

```sql
GRANT EXECUTE ON FUNCTION validate_payment_plan TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_student_payment_plan TO authenticated;
GRANT EXECUTE ON FUNCTION update_student_payment_plan TO authenticated;
GRANT EXECUTE ON FUNCTION get_payment_plan_stats TO authenticated;
```

## Usage Examples

### Frontend Usage

```typescript
import { PaymentPlanService, StudentData } from '@/utils/paymentPlanService';

// Save or update a student
const studentData: StudentData = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  course: "Web Development",
  reg_date: "2024-01-15",
  payment_plan: "Fully Paid",
  timestamp: new Date().toISOString(),
  gender: "Male",
  state_of_residence: "California",
  learning_track: "Full Stack",
  how_did_you_hear: "Social Media",
  has_laptop_and_internet: "Yes",
  current_employment_status: "Employed",
  wants_scholarship: "No",
  why_learn_this_skill: "Career change"
};

const result = await PaymentPlanService.upsertStudentPaymentPlan(studentData);
if (result.success) {
  console.log('Student saved successfully:', result.data);
} else {
  console.error('Error:', result.error);
}

// Update only payment plan
const updateResult = await PaymentPlanService.updateStudentPaymentPlan(
  'student-uuid-here', 
  '1st installment'
);

// Get payment plan statistics
const stats = await PaymentPlanService.getPaymentPlanStats();
```

### React Component Usage

```tsx
import { PaymentPlanForm } from '@/components/form/PaymentPlanForm';

function MyComponent() {
  const handleSuccess = (studentId: string) => {
    console.log('Payment plan saved:', studentId);
  };

  const handleError = (error: string) => {
    console.error('Form error:', error);
  };

  return (
    <PaymentPlanForm 
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
```

## Database Functions

### `validate_payment_plan(plan TEXT)`
Validates if the payment plan value is one of the allowed options.

### `upsert_student_payment_plan(...)`
Inserts a new student or updates an existing one with payment plan information.
Returns the student UUID.

### `update_student_payment_plan(student_id UUID, payment_plan TEXT)`
Updates only the payment plan for an existing student.

### `get_payment_plan_stats()`
Returns payment plan statistics including counts and percentages.

## Database Schema

The payment plan is stored in the `students` table:

```sql
payment_plan TEXT NOT NULL  -- Stores one of the payment plan options
```

## Error Handling

The service includes comprehensive error handling:
- Payment plan validation
- Database connection errors
- Data validation errors
- Unexpected error scenarios

## Features

- **Validation**: Ensures only valid payment plan options are saved
- **Upsert**: Handles both new records and updates
- **Audit Trail**: Automatic timestamp updates
- **Statistics**: Built-in payment plan analytics
- **Type Safety**: Full TypeScript support
- **React Integration**: Ready-to-use form component

## Testing

To test the implementation:

1. Execute the SQL script in Supabase
2. Use the PaymentPlanService in your frontend
3. Test the PaymentPlanForm component
4. Verify data in the `students` table

## Troubleshooting

### Common Issues

1. **Permission Denied**: Make sure to grant execute permissions on the functions
2. **Invalid Payment Plan**: Ensure the payment plan value matches exactly
3. **Missing UUID**: For updates, provide the correct student UUID
4. **TypeScript Errors**: The service uses `as any` for Supabase RPC calls to avoid type issues

### Debug Tips

- Check Supabase logs for SQL errors
- Verify the function parameters match exactly
- Test with the Supabase SQL Editor first
- Check network connectivity in the browser
