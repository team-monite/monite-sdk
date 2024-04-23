import { render, fireEvent, screen } from '@testing-library/react';

import { useMenu } from './useMenu';

describe('useMenu hook', () => {
  it('should open menu on button click', () => {
    render(<MenuComponent />);
    const openButton = screen.getByTestId('menu-button');
    fireEvent.click(openButton);
    expect(screen.getByTestId('menu')).toBeInTheDocument();
  });

  it('should close menu when close button is clicked', () => {
    render(<MenuComponent />);
    const openButton = screen.getByTestId('menu-button');
    fireEvent.click(openButton); // Open the menu first
    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);
    expect(screen.queryByTestId('menu')).toBeNull();
  });

  it('should not show menu initially', () => {
    render(<MenuComponent />);
    const menu = screen.queryByTestId('menu');
    expect(menu).toBeNull();
  });
});

const MenuComponent = () => {
  const { handleOpen, handleClose, open } = useMenu();
  return (
    <>
      <button data-testid="menu-button" onClick={handleOpen}>
        Open Menu
      </button>
      {open && (
        <div data-testid="menu">
          Menu is open
          <button data-testid="close-button" onClick={handleClose}>
            Close
          </button>
        </div>
      )}
    </>
  );
};
