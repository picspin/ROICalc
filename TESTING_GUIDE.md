# Complete Testing Guide for ROI Comparison Tool

## 🎯 Testing Overview

Your radiology equipment ROI comparison tool now has a comprehensive test suite with **49 passing tests** covering all critical functionality.

## 📊 Test Coverage Breakdown

### Business Logic Tests (16 tests)
**File**: `src/utils/__tests__/calculations.test.ts`

- **Time Efficiency (ΔP)**: Tests calculation of time savings from faster procedures
- **Cost Savings (ΔV)**: Tests consumable cost differences and contrast agent savings  
- **ROI Calculations**: Tests complete return on investment analysis
- **Formatting Functions**: Tests currency, percentage, and number formatting
- **Edge Cases**: Tests zero differences, negative costs, and boundary conditions

### Data Management Tests (14 tests)
**File**: `src/data/__tests__/devices.test.ts`

- **Device Data Integrity**: Validates all device specifications
- **Lookup Functions**: Tests device retrieval by ID and brand
- **Data Structure**: Ensures consistent device property structure
- **Validation Rules**: Tests numeric ranges and enum values

### State Management Tests (12 tests)
**File**: `src/store/__tests__/useAppStore.test.ts`

- **Store Initialization**: Tests default state values
- **State Updates**: Tests all setter functions
- **Calculation Workflow**: Tests complete ROI calculation process
- **Tab Navigation**: Tests UI state management

### Component Tests (7 tests)
**File**: `src/__tests__/App.test.tsx`

- **UI Navigation**: Tests tab switching and back button
- **Component Rendering**: Tests main app structure
- **Accessibility**: Tests ARIA labels and keyboard navigation

## 🚀 Running Tests

### Basic Commands
```bash
# Run all tests once
npm run test:run

# Run tests in watch mode (auto-rerun on changes)
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests with interactive UI
npm run test:ui
```

### Specific Test Categories
```bash
# Run only calculation tests
npx vitest calculations

# Run only component tests  
npx vitest App

# Run only data tests
npx vitest devices

# Run only store tests
npx vitest useAppStore
```

## 🧪 Manual Testing Checklist

### 1. Parameter Input Testing
- [ ] Enter different patient volumes (1-1000)
- [ ] Switch between daily/monthly volume types
- [ ] Select different target devices
- [ ] Select different base devices
- [ ] Adjust CT device count

### 2. Calculation Testing
- [ ] Click "计算ROI" button
- [ ] Verify automatic tab switch to results
- [ ] Check time efficiency (ΔP) values
- [ ] Check cost savings (ΔV) values
- [ ] Verify ROI percentage calculation

### 3. Results Visualization Testing
- [ ] Verify radar chart displays correctly
- [ ] Check parameter comparison table
- [ ] Test different device combinations
- [ ] Verify formatting of currency and percentages

### 4. Navigation Testing
- [ ] Test tab switching between input/results
- [ ] Test back button functionality
- [ ] Verify state persistence across tabs

## 📈 Test Data Scenarios

### Realistic Test Cases
1. **High Volume Hospital**: 100 daily patients, premium devices
2. **Medium Clinic**: 50 daily patients, mid-range devices  
3. **Small Practice**: 20 daily patients, basic devices
4. **Monthly Planning**: 1000 monthly patients, various devices

### Edge Cases to Test
- Minimum values (1 patient, cheapest device)
- Maximum values (1000+ patients, most expensive device)
- Same device comparison (should show zero differences)
- Devices with higher consumable costs

## 🔍 Debugging Test Failures

### Common Issues
1. **Calculation Errors**: Check mock device data matches production specs
2. **Component Rendering**: Ensure all required props are provided
3. **State Management**: Verify store initialization and updates
4. **Async Operations**: Use `waitFor` for state changes

### Debug Commands
```bash
# Verbose test output
npx vitest --reporter=verbose

# Run single test file with debugging
npx vitest calculations --reporter=verbose

# Generate coverage report
npx vitest --coverage
```

## 🎨 Adding New Tests

### For New Calculations
```typescript
// Add to src/utils/__tests__/calculations.test.ts
it('should calculate new metric correctly', () => {
  const result = calculateNewMetric(mockData);
  expect(result).toBe(expectedValue);
});
```

### For New Components
```typescript
// Create new test file: src/components/__tests__/NewComponent.test.tsx
import { render, screen } from '@testing-library/react';
import NewComponent from '../NewComponent';

describe('NewComponent', () => {
  it('should render correctly', () => {
    render(<NewComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### For New Store Features
```typescript
// Add to src/store/__tests__/useAppStore.test.ts
it('should handle new action', () => {
  const { result } = renderHook(() => useAppStore());
  
  act(() => {
    result.current.newAction(testValue);
  });
  
  expect(result.current.newState).toBe(expectedValue);
});
```

## 📋 Quality Gates

### Before Deployment
- [ ] All tests passing (49/49)
- [ ] No console errors in browser
- [ ] Manual testing checklist completed
- [ ] Performance acceptable (< 2s load time)
- [ ] Accessibility validated

### Continuous Integration
```bash
# Add to CI/CD pipeline
npm run test:run
npm run build
npm run lint
```

## 🔧 Test Configuration

### Key Files
- `vitest.config.ts`: Test runner configuration
- `src/test/setup.ts`: Global test setup
- `src/test/utils.tsx`: Test utilities and helpers

### Mock Data
- Device specifications mirror production data
- Realistic medical equipment parameters
- Valid cost and time ranges

## 📚 Best Practices

1. **Test Isolation**: Each test is independent
2. **Realistic Data**: Use actual medical device specs
3. **Edge Cases**: Test boundary conditions
4. **User Workflows**: Test complete user journeys
5. **Accessibility**: Include ARIA and keyboard tests

## 🎯 Next Steps

1. **Add Integration Tests**: Test complete user workflows
2. **Performance Tests**: Test with large datasets
3. **Visual Regression**: Test UI consistency
4. **E2E Tests**: Test in real browser environment
5. **API Tests**: If backend integration is added

Your test suite provides a solid foundation for confident development and deployment of the radiology equipment ROI comparison tool!