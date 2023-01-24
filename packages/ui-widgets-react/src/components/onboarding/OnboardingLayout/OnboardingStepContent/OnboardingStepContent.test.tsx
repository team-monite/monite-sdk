import { screen } from '@testing-library/react';

import { renderWithClient } from 'utils/test-utils';

import OnboardingStepContent from './OnboardingStepContent';
import { ReactNode } from 'react';

export const renderContent = (children: ReactNode) =>
  renderWithClient(
    <OnboardingStepContent>{children}</OnboardingStepContent>,
    true
  );

describe('OnboardingStepContent', () => {
  test('should render children', () => {
    const children = 'children';
    renderContent(children);
    expect(screen.getByText(children)).toBeInTheDocument();
  });
});
