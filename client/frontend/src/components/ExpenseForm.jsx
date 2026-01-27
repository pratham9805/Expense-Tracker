import { useState } from "react";
import api from "../services/api";

export default function ExpenseForm({ onAdd }) {
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/expenses", {
      type,
      category,
      amount: Number(amount), // important
    });

    onAdd(res.data.expense); // ✅ FIX
    setCategory("");
    setAmount("");
  } catch (err) {
    console.error("Add expense failed", err);
  }
};


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 p-4 rounded-lg mb-6 space-y-3"
    >
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full bg-black/40 text-white p-2 rounded"
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        placeholder="Category (Food, Rent, etc.)"
        className="w-full bg-black/40 text-white p-2 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        className="w-full bg-black/40 text-white p-2 rounded"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button className="w-full bg-blue-600 py-2 rounded text-white">
        Add
      </button>
    </form>
  );
}
