import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('should render main app structure', () => {
    render(<App />);
    
    // Check for main sections
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // Check for tab navigation
    expect(screen.getByText('参数设置')).toBeInTheDocument();
    expect(screen.getByText('结果分析')).toBeInTheDocument();
  });

  it('should start with input tab active', () => {
    render(<App />);
    
    const inputTab = screen.getByText('参数设置').closest('button');
    const resultsTab = screen.getByText('结果分析').closest('button');
    
    expect(inputTab).toHaveClass('border-primary-500', 'text-primary-600');
    expect(resultsTab).toHaveClass('border-transparent');
  });

  it('should switch tabs when clicked', () => {
    render(<App />);
    
    const resultsTab = screen.getByText('结果分析').closest('button');
    
    fireEvent.click(resultsTab!);
    
    // Should show back button when on results tab
    expect(screen.getByText('返回参数设置')).toBeInTheDocument();
  });

  it('should show back button only on results tab', () => {
    render(<App />);
    
    // Switch to results tab first
    const resultsTab = screen.getByText('结果分析').closest('button');
    fireEvent.click(resultsTab!);
    
    // Now back button should be visible
    expect(screen.getByText('返回参数设置')).toBeInTheDocument();
    
    // Switch back to input tab
    const inputTab = screen.getByText('参数设置').closest('button');
    fireEvent.click(inputTab!);
    
    // Back button should be hidden
    expect(screen.queryByText('返回参数设置')).not.toBeInTheDocument();
  });

  it('should navigate back to input tab via back button', () => {
    render(<App />);
    
    // Go to results tab
    const resultsTab = screen.getByText('结果分析').closest('button');
    fireEvent.click(resultsTab!);
    
    // Click back button
    const backButton = screen.getByText('返回参数设置');
    fireEvent.click(backButton);
    
    // Should be back on input tab
    const inputTab = screen.getByText('参数设置').closest('button');
    expect(inputTab).toHaveClass('border-primary-500', 'text-primary-600');
    
    // Back button should be hidden
    expect(screen.queryByText('返回参数设置')).not.toBeInTheDocument();
  });

  it('should have proper ARIA labels for accessibility', () => {
    render(<App />);
    
    const tabNavigation = screen.getByLabelText('Tabs');
    expect(tabNavigation).toBeInTheDocument();
  });

  it('should render with background pattern', () => {
    render(<App />);
    
    // Check that the app container has the expected classes
    const appContainer = screen.getByRole('main').parentElement;
    expect(appContainer).toHaveClass('min-h-screen', 'bg-neutral-50');
  });
});