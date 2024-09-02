import Logo from "./Logo";

const HeaderImage = () => {
  return (
    <div className="flex items-center absolute top-4 left-4 z-20">
      <Logo withIcon />
    </div>
  );
};

export default HeaderImage;
