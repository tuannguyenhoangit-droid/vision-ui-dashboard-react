export const timeDifference = (createdAt) => {
  const now = Date.now(); // Lấy thời gian hiện tại (milliseconds)
  const diff = now - createdAt; // Tính độ lệch thời gian (milliseconds)
  console.log("diff", diff);

  const minutes = Math.floor(Math.abs(diff) / 60000); // Chuyển đổi sang phút

  if (diff > 0) {
    return `${minutes} phút trước`; // Nếu thời gian đã qua
  } else if (diff < 0) {
    return `${minutes} phút sau`; // Nếu thời gian ở tương lai
  } else {
    return "Ngay bây giờ"; // Nếu thời gian khớp
  }
};
