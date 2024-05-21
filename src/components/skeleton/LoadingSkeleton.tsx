interface LoadingSkeletonProps {
  width: string;
  height: string;
  borderRadius: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = (props) => {
  return (
    <div
      className="skeleton"
      style={{
        width: props.width,
        height: props.height,
        borderRadius: props.borderRadius,
      }}
    ></div>
  );
};

export default LoadingSkeleton;
