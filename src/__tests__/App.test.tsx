import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { I18nProvider } from '../contexts/I18nContext';
import App from '../App';

// Helper to render App with I18nProvider
const renderWithI18n = (ui: React.ReactElement) => {
  return render(
    <I18nProvider>
      {ui}
    </I18nProvider>
  );
};

describe('App Component', () => {
  it('should render main app structure', () => {
    renderWithI18n(<App />);
    
    // Check for main sections
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // Check for tab navigation (Chinese default)
    expect(screen.getByRole('button', { name: /参数设置/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /结果分析/ })).toBeInTheDocument();
  });

  it('should start with input tab active', () => {
    renderWithI18n(<App />);
    
    const inputTab = screen.getByRole('button', { name: /参数设置/ });
    const resultsTab = screen.getByRole('button', { name: /结果分析/ });
    
    expect(inputTab).toHaveClass('border-primary-500', 'text-primary-600');
    expect(resultsTab).toHaveClass('border-transparent');
  });

  it('should switch tabs when clicked', () => {
    renderWithI18n(<App />);
    
    const resultsTab = screen.getByRole('button', { name: /结果分析/ });
    
    fireEvent.click(resultsTab);
    
    // Should show back button when on results tab
    expect(screen.getByRole('button', { name: /返回参数设置/ })).toBeInTheDocument();
  });

  it('should show back button only on results tab', () => {
    renderWithI18n(<App />);
    
    // Switch to results tab first
    const resultsTab = screen.getByRole('button', { name: /结果分析/ });
    fireEvent.click(resultsTab);
    
    // Now back button should be visible
    expect(screen.getByRole('button', { name: /返回参数设置/ })).toBeInTheDocument();
    
    // Switch back to input tab using the tab navigation
    const tabNavigation = screen.getByLabelText('Tabs');
    const inputTab = within(tabNavigation).getByRole('button', { name: /参数设置/ });
    fireEvent.click(inputTab);
    
    // Back button should be hidden
    expect(screen.queryByRole('button', { name: /返回参数设置/ })).not.toBeInTheDocument();
  });

  it('should navigate back to input tab via back button', () => {
    renderWithI18n(<App />);
    
    // Go to results tab
    const resultsTab = screen.getByRole('button', { name: /结果分析/ });
    fireEvent.click(resultsTab);
    
    // Click back button
    const backButton = screen.getByRole('button', { name: /返回参数设置/ });
    fireEvent.click(backButton);
    
    // Should be back on input tab
    const inputTab = screen.getByRole('button', { name: /参数设置/ });
    expect(inputTab).toHaveClass('border-primary-500', 'text-primary-600');
    
    // Back button should be hidden
    expect(screen.queryByRole('button', { name: /返回参数设置/ })).not.toBeInTheDocument();
  });

  it('should have proper ARIA labels for accessibility', () => {
    renderWithI18n(<App />);
    
    const tabNavigation = screen.getByLabelText('Tabs');
    expect(tabNavigation).toBeInTheDocument();
  });

  it('should render with background pattern', () => {
    renderWithI18n(<App />);
    
    // Check that the app container has the expected classes
    const appContainer = screen.getByRole('main').parentElement;
    expect(appContainer).toHaveClass('min-h-screen', 'bg-neutral-50');
  });
});