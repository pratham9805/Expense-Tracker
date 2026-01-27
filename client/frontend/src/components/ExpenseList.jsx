import { useState } from "react";
import { deleteExpense } from "../services/expense.service";
import EditExpenseModal from "./EditExpenseModal";

export default function ExpenseList({ expenses, fetchExpenses }) {
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await deleteExpense(id);
      fetchExpenses();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <>
      <div className="space-y-2">
        {expenses.map((e) => (
          <div
            key={e._id}
            className="flex justify-between items-center bg-black/40 p-3 rounded"
          >
            {/* Left */}
            <div>
              <p className="font-semibold">{e.category}</p>
              <p className="text-sm text-gray-400">{e.type}</p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              <p
                className={
                  e.type === "expense"
                    ? "text-red-400"
                    : "text-green-400"
                }
              >
                ₹{e.amount}
              </p>

              <button
                onClick={() => setSelectedExpense(e)}
                className="text-blue-400 text-sm hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(e._id)}
                className="text-red-400 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {selectedExpense && (
        <EditExpenseModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onUpdated={fetchExpenses}
        />
      )}
    </>
  );
}
