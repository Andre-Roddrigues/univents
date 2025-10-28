import { FaStar, FaStarHalfAlt } from "react-icons/fa";

interface props {
  rating: number;
}
export function RatingStars({ rating }: props) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center space-x-1">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={`full-${index}`} className="text-yellow-400" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}
      {[...Array(emptyStars)].map((_, index) => (
        <FaStar key={`empty-${index}`} className="text-gray-300" />
      ))}
      <span className="ml-2 text-sm text-gray-500 ">({rating.toFixed(1)})</span>
    </div>
  );
}
