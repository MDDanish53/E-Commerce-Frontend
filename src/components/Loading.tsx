const Loading = () => {
  return (
    <section className="loader">
      <div></div>
    </section>
  );
};

export default Loading;

interface SkeletonProps {
  width?: string;
  length?: number;
}

export const SkeletonLoader = ({
  width = "unset",
  length = 3,
}: SkeletonProps) => {
  const skeletons = Array.from({ length }, (v, idx) => (
    <div key={idx} className="skeleton-shape"></div>
  ));

  return (
    <div className="skeleton-loader" style={{ width }}>
      {skeletons}
    </div>
  );
};
