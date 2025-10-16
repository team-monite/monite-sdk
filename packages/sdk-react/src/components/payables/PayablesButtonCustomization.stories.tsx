import { Payables } from './Payables';
import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { ThemeConfig } from '@/core/theme/types';
import { css } from '@emotion/react';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@/ui/components/button';
import { Button as MuiButton } from '@mui/material';

const meta: Meta<typeof Payables> = {
  title: 'Payables/Button Customization',
  component: Payables,
};

export default meta;

type Story = StoryObj<typeof Payables>;

const actions = {
  onSaved: action('onSaved'),
  onCanceled: action('onCanceled'),
  onSubmitted: action('onSubmitted'),
  onRejected: action('onRejected'),
  onApproved: action('onApproved'),
  onPay: action('onPay'),
};

const ButtonShowcase = () => (
  <div
    css={css`
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;
    `}
  >
    <h2
      css={css`
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 16px 0;
        color: #111827;
      `}
    >
      Button Customization Showcase
    </h2>
    <p
      css={css`
        font-size: 14px;
        color: #6b7280;
        margin: 0 0 24px 0;
      `}
    >
      All button variants can be customized through the theme configuration.
      Scroll down to see them in action within the Payables component.
    </p>

    <div css={css`margin-bottom: 32px;`}>
      <h3
        css={css`
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: #374151;
        `}
      >
        MUI Buttons (used in PayableDetails, Table actions)
      </h3>
      <div
        css={css`
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        `}
      >
        <div>
          <p css={css`font-size: 12px; color: #6b7280; margin-bottom: 8px;`}>
            Primary
          </p>
          <MuiButton
            variant="contained"
            className="Monite-Payables-PrimaryButton"
          >
            Save Changes
          </MuiButton>
        </div>
        <div>
          <p css={css`font-size: 12px; color: #6b7280; margin-bottom: 8px;`}>
            Secondary
          </p>
          <MuiButton
            variant="outlined"
            className="Monite-Payables-SecondaryButton"
          >
            Cancel
          </MuiButton>
        </div>
        <div>
          <p css={css`font-size: 12px; color: #6b7280; margin-bottom: 8px;`}>
            Tertiary
          </p>
          <MuiButton variant="text" className="Monite-Payables-TertiaryButton">
            Reopen
          </MuiButton>
        </div>
        <div>
          <p css={css`font-size: 12px; color: #6b7280; margin-bottom: 8px;`}>
            Destructive
          </p>
          <MuiButton
            variant="text"
            color="error"
            className="Monite-Payables-DestructiveButton"
          >
            Delete
          </MuiButton>
        </div>
      </div>
    </div>

    <div>
      <h3
        css={css`
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: #374151;
        `}
      >
        Tailwind Buttons (used in CreatePayableMenu, Dialogs)
      </h3>
      <div
        css={css`
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        `}
      >
        <div>
          <p css={css`font-size: 12px; color: #6b7280; margin-bottom: 8px;`}>
            Primary (default)
          </p>
          <Button variant="default">Submit Invoice</Button>
        </div>
        <div>
          <p css={css`font-size: 12px; color: #6b7280; margin-bottom: 8px;`}>
            Secondary (outline)
          </p>
          <Button variant="outline">Edit Details</Button>
        </div>
        <div>
          <p css={css`font-size: 12px; color: #6b7280; margin-bottom: 8px;`}>
            Tertiary (ghost)
          </p>
          <Button variant="ghost">More Options</Button>
        </div>
        <div>
          <p css={css`font-size: 12px; color: #6b7280; margin-bottom: 8px;`}>
            Destructive
          </p>
          <Button variant="destructive">Reject</Button>
        </div>
      </div>
    </div>
  </div>
);

const renderWithRouter: Story['render'] = (args) => (
  <div
    css={css`
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      height: 100vh;
      padding: 20px;
      background: #f9fafb;
    `}
  >
    <div className="Monite-Payables">
      <ButtonShowcase />
    </div>
    <MemoryRouter>
      <Payables {...args} />
    </MemoryRouter>
  </div>
);

export const DefaultStyles: Story = {
  args: actions,
  render: renderWithRouter,
};

export const CustomAllButtons: Story = {
  args: actions,
  decorators: [
    withGlobalStorybookDecorator(() => {
      const theme: ThemeConfig = {
        components: { styles: {
          payables: {
            button: {
              primary: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                borderRadius: 12,
                fontWeight: 600,
                boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
                transitionDuration: '200ms',
                transitionTimingFunction: 'ease-in-out',
                hover: {
                  background: 'linear-gradient(135deg, #5568d3 0%, #65408b 100%)',
                  boxShadow: '0 6px 12px rgba(102, 126, 234, 0.4)',
                },
                active: {
                  boxShadow: '0 2px 4px rgba(102, 126, 234, 0.3)',
                },
              },
              secondary: {
                background: 'transparent',
                color: '#667eea',
                border: '2px solid #667eea',
                borderRadius: 12,
                fontWeight: 500,
                transitionDuration: '150ms',
                hover: {
                  background: '#f3f4f6',
                  border: '2px solid #5568d3',
                  color: '#5568d3',
                },
              },
              tertiary: {
                background: 'transparent',
                color: '#6b7280',
                borderRadius: 8,
                transitionDuration: '150ms',
                hover: {
                  background: '#f9fafb',
                  color: '#374151',
                },
              },
              destructive: {
                background: '#DC2626',
                color: '#ffffff',
                borderRadius: 8,
                fontWeight: 600,
                boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)',
                transitionDuration: '150ms',
                hover: {
                  background: '#B91C1C',
                  boxShadow: '0 4px 8px rgba(220, 38, 38, 0.4)',
                },
              },
            },
          },
        } },
      };

      return { theme };
    }),
  ],
  render: renderWithRouter,
};

export const MaterialDesignStyle: Story = {
  args: actions,
  decorators: [
    withGlobalStorybookDecorator(() => {
      const theme: ThemeConfig = {
        components: { styles: {
          payables: {
            button: {
              primary: {
                background: '#1976d2',
                color: '#ffffff',
                borderRadius: 4,
                fontWeight: 500,
                boxShadow:
                  '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
                transitionDuration: '250ms',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                hover: {
                  background: '#1565c0',
                  boxShadow:
                    '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                },
                active: {
                  boxShadow:
                    '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
                },
              },
              secondary: {
                background: 'transparent',
                color: '#1976d2',
                border: '1px solid rgba(25, 118, 210, 0.5)',
                borderRadius: 4,
                fontWeight: 500,
                transitionDuration: '250ms',
                hover: {
                  background: 'rgba(25, 118, 210, 0.04)',
                  border: '1px solid #1976d2',
                },
              },
              destructive: {
                background: '#d32f2f',
                color: '#ffffff',
                borderRadius: 4,
                fontWeight: 500,
                boxShadow:
                  '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
                transitionDuration: '250ms',
                hover: {
                  background: '#c62828',
                  boxShadow:
                    '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                },
              },
            },
          },
        } },
      };

      return { theme };
    }),
  ],
  render: renderWithRouter,
};

export const MinimalistFlatDesign: Story = {
  args: actions,
  decorators: [
    withGlobalStorybookDecorator(() => {
      const theme: ThemeConfig = {
        components: { styles: {
          payables: {
            button: {
              primary: {
                background: '#000000',
                color: '#ffffff',
                borderRadius: 0,
                fontWeight: 500,
                boxShadow: 'none',
                transitionDuration: '100ms',
                hover: {
                  background: '#1a1a1a',
                },
              },
              secondary: {
                background: '#ffffff',
                color: '#000000',
                border: '1px solid #000000',
                borderRadius: 0,
                fontWeight: 500,
                boxShadow: 'none',
                transitionDuration: '100ms',
                hover: {
                  background: '#f5f5f5',
                },
              },
              tertiary: {
                background: 'transparent',
                color: '#666666',
                borderRadius: 0,
                fontWeight: 400,
                transitionDuration: '100ms',
                hover: {
                  background: '#f5f5f5',
                  color: '#000000',
                },
              },
              destructive: {
                background: '#ff0000',
                color: '#ffffff',
                borderRadius: 0,
                fontWeight: 500,
                boxShadow: 'none',
                transitionDuration: '100ms',
                hover: {
                  background: '#cc0000',
                },
              },
            },
          },
        } },
      };

      return { theme };
    }),
  ],
  render: renderWithRouter,
};

export const SoftUIDesign: Story = {
  args: actions,
  decorators: [
    withGlobalStorybookDecorator(() => {
      const theme: ThemeConfig = {
        components: { styles: {
          payables: {
            button: {
              primary: {
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: '#ffffff',
                borderRadius: 20,
                fontWeight: 600,
                boxShadow:
                  '0 10px 25px rgba(240, 147, 251, 0.3), inset 0 -3px 0 rgba(0, 0, 0, 0.1)',
                transitionDuration: '300ms',
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                hover: {
                  background: 'linear-gradient(135deg, #e082ea 0%, #e4465b 100%)',
                  boxShadow:
                    '0 15px 35px rgba(240, 147, 251, 0.4), inset 0 -3px 0 rgba(0, 0, 0, 0.1)',
                },
              },
              secondary: {
                background: '#ffffff',
                color: '#f093fb',
                border: '2px solid #f093fb',
                borderRadius: 20,
                fontWeight: 600,
                boxShadow: '0 8px 20px rgba(240, 147, 251, 0.2)',
                transitionDuration: '300ms',
                hover: {
                  background: '#fef3ff',
                  boxShadow: '0 12px 28px rgba(240, 147, 251, 0.3)',
                },
              },
            },
          },
        } },
      };

      return { theme };
    }),
  ],
  render: renderWithRouter,
};

export const NeuomorphismStyle: Story = {
  args: actions,
  decorators: [
    withGlobalStorybookDecorator(() => {
      const theme: ThemeConfig = {
        components: { styles: {
          payables: {
            button: {
              primary: {
                background: '#e0e5ec',
                color: '#667eea',
                borderRadius: 16,
                fontWeight: 600,
                boxShadow: '9px 9px 16px #a3a7b0, -9px -9px 16px #ffffff',
                transitionDuration: '200ms',
                hover: {
                  boxShadow:
                    'inset 5px 5px 10px #a3a7b0, inset -5px -5px 10px #ffffff',
                },
                active: {
                  boxShadow:
                    'inset 7px 7px 14px #a3a7b0, inset -7px -7px 14px #ffffff',
                },
              },
              secondary: {
                background: '#e0e5ec',
                color: '#667eea',
                border: 'none',
                borderRadius: 16,
                fontWeight: 500,
                boxShadow: '5px 5px 10px #a3a7b0, -5px -5px 10px #ffffff',
                transitionDuration: '200ms',
                hover: {
                  boxShadow:
                    'inset 3px 3px 6px #a3a7b0, inset -3px -3px 6px #ffffff',
                },
              },
            },
          },
        } },
      };

      return { theme };
    }),
  ],
  render: renderWithRouter,
};

export const GlassmorphismStyle: Story = {
  args: actions,
  decorators: [
    withGlobalStorybookDecorator(() => {
      const theme: ThemeConfig = {
        components: { styles: {
          payables: {
            button: {
              primary: {
                background: 'rgba(255, 255, 255, 0.25)',
                color: '#667eea',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 12,
                fontWeight: 600,
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                transitionDuration: '200ms',
                hover: {
                  background: 'rgba(255, 255, 255, 0.35)',
                  boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.25)',
                },
              },
              secondary: {
                background: 'rgba(102, 126, 234, 0.1)',
                color: '#667eea',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: 12,
                fontWeight: 500,
                boxShadow: '0 4px 16px 0 rgba(102, 126, 234, 0.1)',
                transitionDuration: '200ms',
                hover: {
                  background: 'rgba(102, 126, 234, 0.2)',
                  border: '1px solid rgba(102, 126, 234, 0.5)',
                },
              },
            },
          },
        } },
      };

      return { theme };
    }),
  ],
  render: renderWithRouter,
};
