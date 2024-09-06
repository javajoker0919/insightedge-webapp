interface PlusIconProps {
  color?: string;
  size?: number;
}

const PlusIcon: React.FC<PlusIconProps> = ({ color = "blue", size = 4 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-${size} w-${size}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke={color}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  );
};

export default PlusIcon;
