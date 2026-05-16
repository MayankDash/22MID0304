const VALID_TYPES = ["Placement", "Event", "Result"];
const VALID_PRIORITIES = ["HIGH", "MEDIUM", "LOW"];

function isValidType(value) {
  return VALID_TYPES.includes(value);
}

function isValidPriority(value) {
  return VALID_PRIORITIES.includes(value);
}

module.exports = {
  VALID_TYPES,
  VALID_PRIORITIES,
  isValidType,
  isValidPriority,
};
