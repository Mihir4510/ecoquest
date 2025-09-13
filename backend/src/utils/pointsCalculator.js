export const calculatePoints = (type) => {
  switch (type.toLowerCase()) {
    case "tree planting":
      return 20;
    case "cycling":
      return 10;
    case "recycling":
      return 15;
    default:
      return 5;
  }
};
