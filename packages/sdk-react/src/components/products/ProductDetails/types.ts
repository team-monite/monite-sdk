import { ProductFormValues } from './validation';
import { components } from '@/api';

/** View of the product details */
export enum ProductDetailsView {
  /** Read mode - the user is only viewing the product details */
  Read = 'read',

  /** Edit mode - the user is editing the product details */
  Edit = 'edit',
}

type ProductServiceResponse = components['schemas']['ProductServiceResponse'];

/** Props for the product details component when the product already exists */
export interface ExistingProductDetailsProps {
  /** Product ID */
  id: string;

  /**
   * Callback is fired when a product is updated and sync with server is successful
   *
   * @param product
   */
  onUpdated?: (product: ProductServiceResponse) => void;

  /**
   * Callback is fired when a product is deleted and sync with server is successful
   *
   * @param product
   */
  onDeleted?: (productId: ProductServiceResponse['id']) => void;

  /**
   * Initial view of the product details
   * It might be `read` - when the user is only viewing
   *  the product details
   *  (but the user can click on the edit button to switch to edit mode)
   *
   *  or `edit` - when the user is editing the product details
   *
   * @default ProductDetailsView.Read
   */
  initialView?: ProductDetailsView;
}

/**
 * Props for the product details component when the product does not exist yet
 *  (we are creating a new product)
 */
export interface ProductDetailsCreateProps {
  id?: never;

  /**
   * Callback is fired when a product is created and sync with server is successful
   *
   * @param product
   */
  onCreated?: (product: ProductServiceResponse) => void;

  /** Initial values for the product form */
  defaultValues?: Partial<ProductFormValues>;
}

export type ProductDetailsProps =
  | ExistingProductDetailsProps
  | ProductDetailsCreateProps;
