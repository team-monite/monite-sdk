import {
  PageHeader as AntPageHeader,
  PageHeaderProps as AntPageHeaderProps,
} from 'antd';

type PageHeaderProps = {
  title: string;
} & AntPageHeaderProps;
const PageHeader = ({ title, ...rest }: PageHeaderProps) => {
  return (
    <AntPageHeader
      onBack={() => null}
      title={title}
      subTitle="This is a subtitle"
      {...rest}
    />
  );
};

export default PageHeader;
