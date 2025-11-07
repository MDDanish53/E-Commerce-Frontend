import { useRating } from "6pp";
import { FaRegStar, FaStar } from "react-icons/fa";

const RatingsComponent = ({value}:{value: number}) => {
  const { Ratings } = useRating({
    IconFilled: <FaStar />,
    IconOutline: <FaRegStar />,
    value,
    styles: {
      fontSize: "1.75rem",
      color: "coral",
      justifyContent: "flex-start",
      gap: "1px"
    }
  });

  return <Ratings />;
};

export default RatingsComponent;
