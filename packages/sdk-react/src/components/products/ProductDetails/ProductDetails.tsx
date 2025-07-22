import {
  ProductDetailsProps,
  ExistingProductDetailsProps,
  ProductDetailsCreateProps,
  ProductDetailsView,
} from './types';
import { ExistingProductDetails } from '@/components/products/ProductDetails/ExistingProductDetails';
import { CreateProduct } from '@/components/products/ProductDetails/ProductCreate';

// Re-export types for backward compatibility
export type {
  ProductDetailsProps,
  ExistingProductDetailsProps,
  ProductDetailsCreateProps,
};
export { ProductDetailsView };

export const ProductDetails = (props: ProductDetailsProps) => {
  if (typeof props.id === 'string') {
    return <ExistingProductDetails {...props} />;
  }

  return <CreateProduct {...props} />;
};
