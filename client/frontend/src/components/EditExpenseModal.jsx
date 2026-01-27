import { useState, useEffect } from "react";
import { updateExpense } from "../services/expense.service";

const EditExpenseModal = ({ expense, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    category: "",
    date: "",
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        type: expense.type,
        amount: expense.amount,
        category: expense.category,
        date: expense.date.split("T")[0], // for input[type=date]
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateExpense(expense._id, formData);
      onUpdated(); // refetch expenses
      onClose();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>Edit Expense</h2>

        <form onSubmit={handleSubmit}>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <div style={{ marginTop: "10px" }}>
            <button type="submit">Update</button>
            <button type="button" onClick={onClose} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;

/* Inline styles (since Tailwind has issues) */
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(10px)",
  padding: "20px",
  borderRadius: "16px",
  width: "300px",
};
