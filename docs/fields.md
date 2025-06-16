# MediPal Form Fields Documentation

## Authentication Forms

### Registration Form
- `username` (string, required, max_length=40)
- `email` (string, required, valid email format)
- `password` (string, required)
- `phone` (string, required, max_length=15)

### Login Form
- `username` (string, required)
- `password` (string, required)

## Health Profile Form
- `age` (integer, required)
- `gender` (string, required, choices=['male', 'female'])
- `location` (string, required, max_length=255)
- `existing_conditions` (array of condition IDs, optional)

## Health Goal Form
- `title` (string, required, max_length=40)
- `description` (text, required)
- `monthly_target` (integer, required)
- `risk_level` (float, required)
- `duration` (date, required)

## Wallet Form
- `goal` (integer, optional, ID of HealthGoal)
- `balance` (decimal, default=0, max_digits=10, decimal_places=2)
- `is_locked` (boolean, default=False)
- `unlock_reason` (text, optional)

## Transaction Form
- `amount` (decimal, required, max_digits=10, decimal_places=2)
- `type` (string, required, choices=['deposit', 'emergency'])
- `status` (string, required, choices=['success', 'pending', 'failed'])

## Provider Service Form
- `name` (string, required, max_length=50)

## Provider Form
- `name` (string, required, max_length=255)
- `category` (string, required, choices=['pharmacy', 'hospital', 'lab'])
- `location` (text, required)
- `approved` (boolean, default=False)
- `contact` (string, required, max_length=15)
- `services` (array of service IDs, optional)

## Community Circle Form
- `name` (string, required, max_length=50)
- `members` (array of user IDs, optional)
- `wallets` (array of wallet IDs, optional)
- `join_code` (string, required, max_length=10, unique)
- `admin_user` (integer, required, ID of CustomUser)

## Nudge Form
- `message` (text, required)
- `suggested_amount` (integer, default=0)
- `is_read` (boolean, default=False)

## AI Recommendation Form
- `input_data` (JSON, required)
- `predicted_risks` (JSON, required)
- `suggested_goals` (JSON, required)

## Condition Form
- `name` (string, required, max_length=50)

## Notes for Frontend/Mobile Development
1. All decimal fields should be handled as strings in forms and converted to decimal in the backend
2. Date fields should be formatted according to ISO 8601 standard
3. Boolean fields should be handled as checkboxes or toggles
4. Choice fields should be implemented as dropdowns or radio buttons
5. Array fields should be implemented as multi-select or tag inputs
6. All required fields should be clearly marked in the UI
7. Form validation should match the backend constraints (max_length, required fields, etc.)
8. Error messages should be displayed for invalid inputs
9. Loading states should be shown during API calls
10. Success messages should be shown after successful form submissions 