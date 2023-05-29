import { Skeleton } from '@chakra-ui/react';
import { he } from 'date-fns/locale';

interface SkeletonProps {
  count: number;
  height: string;
  width?: string;
  mb?: string;
}
const SkeletonLoader: React.FC<SkeletonProps> = ({
  count,
  height,
  width,
  mb,
}) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Skeleton
          mb={mb ? mb : '4'}
          borderRadius='4'
          key={i}
          width={width}
          height={height}
          startColor='blackAlpha.400'
          endColor='whiteAlpha.300'
        />
      ))}
    </>
  );
};

export default SkeletonLoader;
