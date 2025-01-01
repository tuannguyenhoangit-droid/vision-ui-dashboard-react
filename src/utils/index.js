import { useEffect, useCallback } from "react";

export const timeDifference = (createdAt) => {
  const now = Date.now(); // Lấy thời gian hiện tại (milliseconds)
  const diff = now - createdAt; // Tính độ lệch thời gian (milliseconds)

  const absDiff = Math.abs(diff); // Giá trị tuyệt đối của độ lệch
  const minutes = Math.floor(absDiff / 60000); // Chuyển đổi sang phút
  const hours = Math.floor(absDiff / (60000 * 60)); // Chuyển đổi sang giờ
  const days = Math.floor(absDiff / (60000 * 60 * 24)); // Chuyển đổi sang ngày

  if (diff > 0) {
    if (days > 0) {
      return `${days} day(s) ago`; // Thời gian cách đây N ngày
    } else if (hours > 0) {
      return `${hours} hour(s) ago`; // Thời gian cách đây N giờ
    } else {
      return `${minutes} minute(s) ago`; // Thời gian cách đây N phút
    }
  } else {
    return "just now"; // Nếu thời gian khớp
  }
};

export default function useDebounce(effect, dependencies, delay) {
  const callback = useCallback(effect, dependencies);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}
