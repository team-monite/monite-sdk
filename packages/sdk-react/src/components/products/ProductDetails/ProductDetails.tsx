import { ExistingProductDetails } from './ExistingProductDetails';
import { CreateProduct } from './ProductCreate';
import { ExistingProductDetailsProps, ProductDetailsCreateProps } from './ProductDetails.types';

export type ProductDetailsProps =
  | ExistingProductDetailsProps
  | ProductDetailsCreateProps;

export const ProductDetails = (props: ProductDetailsProps) => {
  if (typeof props.id === 'string') {
    return <ExistingProductDetails {...props} />;
  }

  return <CreateProduct {...props} />;
};
