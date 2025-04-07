type FinanceStepListItem = {
  id: string;
  text: string;
};

export type FinanceStep = {
  id: number | string;
  title: string;
  description: string;
  description2?: string;
  list?: {
    listTitle: string;
    listItems: FinanceStepListItem[];
  };
};
