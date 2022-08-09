import React from 'react';
import { Button } from '@monite/ui';
import { Link, useLocation } from 'react-router-dom';

const SelectPaymentMethod = () => {
  const { search } = useLocation();

  return (
    <>
      <Link to={`card${search}`}>
        <Button variant="text">Credit card</Button>
      </Link>
      <Link to={`bank${search}`}>
        <Button variant="text">Bank transfer</Button>
      </Link>
    </>
  );
};

export default SelectPaymentMethod;
