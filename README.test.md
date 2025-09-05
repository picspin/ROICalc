# Testing Guide

This project includes comprehensive tests for the radiology equipment ROI comparison tool.

## Test Structure

```
src/
├── __tests__/
│   ├── App.test.tsx           # Main app component tests
│   └── integration.test.tsx   # End-to-end workflow tests
├── data/__tests__/
│   └── devices.test.ts        # Device data and utilities tests
├── store/__tests__/
│   └── useAppStore.test.ts    # Zustand store tests
├── utils/__tests__/
│   └── calculations.test.ts   # Business logic and calculations tests
└── test/
    ├── setup.ts              # Test environment setup
    └── utils.tsx             # Test utilities and helpers
```

## Running Tests

### All Tests
```bash
npm test                    # Run tests in watch mode
npm run test:run           # Run tests once
npm run test:coverage      # Run tests with coverage report
npm run test:ui            # Run tests with UI interface
```

### Specific Test Files
```bash
npx vitest calculations     # Run calculation tests
npx vitest App             # Run App component tests
npx vitest integration     # Run integration tests
```

## Test Categories

### 1. Unit Tests
- **Calculations** (`calculations.test.ts`): Tests all ROI calculation functions
- **Device Data** (`devices.test.ts`): Tests device data utilities and validation
- **Store** (`useAppStore.test.ts`): Tests Zustand state management

### 2. Component Tests
- **App Component** (`App.test.tsx`): Tests main app navigation and UI

### 3. Integration Tests
- **Full Workflow** (`integration.test.tsx`): Tests complete user workflows

## Key Test Scenarios

### Business Logic Tests
- ✅ Time efficiency calculations (ΔP)
- ✅ Cost savings calculations (ΔV)
- ✅ Contrast agent savings
- ✅ ROI calculations
- ✅ Radar chart data generation
- ✅ Number formatting functions

### Data Validation Tests
- ✅ Device specifications validation
- ✅ Device lookup functions
- ✅ Brand and model grouping
- ✅ Base device identification

### State Management Tests
- ✅ Store initialization
- ✅ State updates
- ✅ Calculation triggers
- ✅ Tab navigation
- ✅ Loading states

### UI/UX Tests
- ✅ Tab navigation
- ✅ Form interactions
- ✅ Results display
- ✅ Back button behavior
- ✅ Accessibility features

### Integration Tests
- ✅ Complete ROI calculation workflow
- ✅ Device selection changes
- ✅ Volume type switching
- ✅ Results visualization
- ✅ Parameter comparison

## Test Data

Tests use mock device data that mirrors the production device specifications:
- Mock base device (Ulrich CTMotion)
- Mock target device (Bayer Centargo)
- Realistic medical device parameters
- Valid cost and time values

## Coverage Goals

- **Functions**: 90%+ coverage
- **Statements**: 85%+ coverage
- **Branches**: 80%+ coverage
- **Lines**: 85%+ coverage

## Testing Best Practices

1. **Isolated Tests**: Each test is independent and doesn't rely on others
2. **Realistic Data**: Use realistic medical device specifications
3. **Edge Cases**: Test boundary conditions and error scenarios
4. **User Workflows**: Integration tests cover real user interactions
5. **Accessibility**: Tests include ARIA labels and keyboard navigation

## Debugging Tests

### Common Issues
- **State Persistence**: Store state may persist between tests
- **Async Operations**: Use `waitFor` for async state updates
- **Mock Data**: Ensure mock data matches production structure

### Debug Commands
```bash
npx vitest --reporter=verbose    # Detailed test output
npx vitest --run --reporter=json # JSON output for CI/CD
```