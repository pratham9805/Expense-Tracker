import api from "./api";

// Add expense / income
export const addExpense = (data) => {
  return api.post("/expenses", data);
};

// Get all expenses
export const getExpenses = () => {
  return api.get("/expenses");
};

// Update expense
export const updateExpense = (id, data) => {
  return api.put(`/expenses/${id}`, data);
};

// Delete expense
export const deleteExpense = (id) => {
  return api.delete(`/expenses/${id}`);
};
