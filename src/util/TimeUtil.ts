function formatDate(date: Date): string {
  let now = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  if (now.getDay() == date.getDay() && now.getMonth() == date.getMonth() && now.getFullYear() == date.getFullYear()) {
    return `${hours}:${minutes}`;
  } else {
    return `${day}.${month}.${year}`;
  }
}

function isWithinLast7Days(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );

  // Make sure to clear the time part for accurate comparison
  const inputDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  return inputDate >= sevenDaysAgo && inputDate <= today;
}

function getDayOfWeek(date: Date): string {
  const dayOfWeekIndex = date.getDay();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return daysOfWeek[dayOfWeekIndex];
}

export { formatDate, isWithinLast7Days, getDayOfWeek };
