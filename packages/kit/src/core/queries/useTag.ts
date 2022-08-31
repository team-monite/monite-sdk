import { useQuery } from 'react-query';
import { TagsResponse } from '@monite/js-sdk';
import { useComponentsContext } from '../context/ComponentsContext';
import tagList from './fixtures/tagList';

export const useTagList = (debug?: boolean) => {
  const { monite } = useComponentsContext();

  return useQuery<TagsResponse, Error>(['payable'], () => {
    if (debug)
      return {
        data: tagList,
      };

    return monite.api!.tag.getList();
  });
};
