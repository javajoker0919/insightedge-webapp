const Loading = ({
  size = 10,
  color = "primary",
}: {
  size?: number;
  color?: "white" | "primary" | "gray";
}) => {
  const colorClasses = {
    white: "border-white",
    primary: "border-primary-500",
    gray: "border-gray-500",
  };

  return (
    <span
      className={`inline-block animate-spin rounded-full h-${size} w-${size} border-t-2 border-b-2 ${colorClasses[color]}`}
    />
  );
};

export default Loading;
