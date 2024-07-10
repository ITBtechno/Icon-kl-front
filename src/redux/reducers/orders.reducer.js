export const ordersReducer = (state = [], action) => {
  switch (action.type) {
    case "INCREMENT_COUNT":
      return state.map((item) =>
        item._id === action.payload._id
          ? { ...item, count: item.count + 1 }
          : item
      );

    case "DECREMENT_COUNT":
      return state.map((item) =>
        item._id === action.payload._id && item.count > 1
          ? { ...item, count: item.count - 1 }
          : item
      );

    case "ADD_TO_ORDER":
      const foundProduct = state.find(
        (item) => item._id === action.payload._id
      );
      if (foundProduct) {
        return state.map((item) =>
          item._id === action.payload._id
            ? { ...item, count: item.count + 1 }
            : item
        );
      } else {
        return [...state, { ...action.payload, count: action.payload.count }];
      }

    case "REMOVE_FROM_ORDERS":
      return state.filter((item) => item._id !== action.payload);

    default:
      return state;
  }
};
