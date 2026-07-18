import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState([]);

  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current.focus();
    fetch("https://6a5b9b6a64f700df5bd73b0b.mockapi.io/expenses")
    .then((response) => response.json())
    .then((data) => {
      setExpenses(data);
    })
    .catch((error) => console.log(error));
  }, []);

  const addExpense = useCallback(() => {
    if (title === "" || amount === "" || date === "") {
     alert("Please fill all fields");
    return;
  }

  const newExpense = {
    title,
    amount: Number(amount),
    category,
    date,
  };

  fetch("https://6a5b9b6a64f700df5bd73b0b.mockapi.io/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newExpense),
  })
    .then((response) => response.json())
    .then((data) => {
      setExpenses((prev) => [...prev, data]);
    });

  setTitle("");
  setAmount("");
  setCategory("Food");
  setDate("");

  titleRef.current.focus();
}, [title, amount, category, date]);


  const total = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const deleteExpense = (id) => {
  setExpenses(expenses.filter((expense) => expense.id !== id));
};

  return (
    <div className="container">
      <h1>Expense Tracker</h1>

      <input
        ref={titleRef}
        type="text"
        placeholder="Expense Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br /><br />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>Food</option>
        <option>Travel</option>
        <option>Shopping</option>
        <option>Bills</option>
      </select>

      <br /><br />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <br /><br />

      <button onClick={addExpense}>Add Expense</button>

      <hr />

      <h2>Expense List</h2>

      {expenses.length === 0 ? (
        <p>No expenses added.</p>
      ) : (
        expenses.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{item.title}</h3>
            <p>Amount: ₹{item.amount}</p>
            <p>Category: {item.category}</p>
            <p>Date: {item.date}</p>
          
            <button
              className="delete-btn"
              onClick={() => deleteExpense(item.id)}
            >
              Delete
            </button>
          </div>
        ))
      )}

      <h2>Total Expense: ₹{total}</h2>
    </div>
  );
}

export default App;