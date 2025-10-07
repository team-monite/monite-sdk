export type PaginationLayout = 'default' | 'reversed' | 'centered' | 'custom';
export type PaginationPosition = 'left' | 'right' | 'center';

type FlexDirection = 'row' | 'row-reverse';
type JustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around';

export interface LayoutStylesParams {
  layout: PaginationLayout;
  navigationPosition: PaginationPosition;
  pageSizePosition: PaginationPosition;
  hasPageSizeSelect: boolean;
}

export interface LayoutStyles {
  justifyContent: JustifyContent;
  flexDirection: FlexDirection;
  gap: number | undefined;
}
