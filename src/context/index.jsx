import { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: 0,
    description: "",
  });

  const [value, setValue] = useState("expense");
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    const storedTransactions =
      JSON.parse(localStorage.getItem("transactions")) || [];
    setAllTransactions(storedTransactions);
    const storedTotalExpense =
      JSON.parse(localStorage.getItem("totalExpense")) || 0;
    const storedTotalIncome =
      JSON.parse(localStorage.getItem("totalIncome")) || 0;
    setTotalExpense(storedTotalExpense);
    setTotalIncome(storedTotalIncome);
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(allTransactions));
    localStorage.setItem("totalExpense", JSON.stringify(totalExpense));
    localStorage.setItem("totalIncome", JSON.stringify(totalIncome));
  }, [allTransactions, totalExpense, totalIncome]);

  function handleFormSubmit(currentFormData) {
    if (!currentFormData.description || !currentFormData.amount) return;

    const newTransactions = [
      ...allTransactions,
      { ...currentFormData, id: Date.now() },
    ];

    setAllTransactions(newTransactions);

    const updatedTotalExpense = newTransactions
      .filter((item) => item.type === "expense")
      .reduce((total, item) => total + parseFloat(item.amount), 0);
    const updatedTotalIncome = newTransactions
      .filter((item) => item.type === "income")
      .reduce((total, item) => total + parseFloat(item.amount), 0);

    setTotalExpense(updatedTotalExpense);
    setTotalIncome(updatedTotalIncome);
  }

  return (
    <GlobalContext.Provider
      value={{
        formData,
        setFormData,
        totalExpense,
        setTotalExpense,
        totalIncome,
        setTotalIncome,
        value,
        setValue,
        allTransactions,
        setAllTransactions,
        handleFormSubmit,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
