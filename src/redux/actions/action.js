export const removeFromOrders = (itemId) => ({
  type: " REMOVE_FROM_ORDERS",
  payload: itemId,
});

export const incrementCount = (itemId) => ({
  type: "INCREMENT_COUNT",
  payload: itemId,
});

export const decrementCount = (itemId) => ({
  type: "DECREMENT_COUNT",
  payload: itemId,
});

export const addToOrder = (item) => ({
  type: "ADD_TO_ORDER",
  payload: item,
});
