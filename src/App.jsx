
import { useState } from "react";

export default function App() {
  const [display, setDisplay] = useState("0");
  const [previous, setPrevious] = useState(null);
  const [operator, setOperator] = useState(null);
  const [newNumber, setNewNumber] = useState(false);
  const [history, setHistory] = useState([]);

  const handleNumber = (num) => {
    if (newNumber) {
      setDisplay(num === "." ? "0." : num);
      setNewNumber(false);
      return;
    }

    if (num === "." && display.includes(".")) return;

    setDisplay(
      display === "0" && num !== "."
        ? num
        : display + num
    );
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? "Error" : a / b;
      default: return b;
    }
  };

  const handleOperator = (op) => {
    const value = Number(display);

    if (previous !== null && operator && !newNumber) {
      const result = calculate(previous, value, operator);
      if (result === "Error") {
        setDisplay("Error");
        setPrevious(null);
        setOperator(null);
        setNewNumber(true);
        return;
      }
      setDisplay(String(Number(result.toPrecision(12))));
      setPrevious(result);
    } else {
      setPrevious(value);
    }

    setOperator(op);
    setNewNumber(true);
  };

  const handleEqual = () => {
    if (previous === null || !operator || newNumber) return;

    const a = previous;
    const b = Number(display);
    const result = calculate(a, b, operator);

    if (result === "Error") {
      setDisplay("Error");
    } else {
      const formatted = String(Number(result.toPrecision(12)));
      setDisplay(formatted);
      setHistory((old) => [
        `${a} ${operator} ${b} = ${formatted}`,
        ...old,
      ].slice(0, 5));
    }

    setPrevious(null);
    setOperator(null);
    setNewNumber(true);
  };

  const clear = () => {
    setDisplay("0");
    setPrevious(null);
    setOperator(null);
    setNewNumber(false);
  };

  const handleDelete = () => {
    if (newNumber || display === "Error") {
      setDisplay("0");
      setNewNumber(false);
      return;
    }
    setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
  };

  const percentage = () => {
    setDisplay(String(Number(display) / 100));
    setNewNumber(true);
  };

  const toggleSign = () => {
    if (display !== "0" && display !== "Error") {
      setDisplay(String(-Number(display)));
    }
  };

  const buttons = [
    { label: "AC", action: clear, type: "special" },
    { label: "DEL", action: handleDelete, type: "special" },
    { label: "%", action: percentage, type: "special" },
    { label: "÷", action: () => handleOperator("÷"), type: "operator" },

    { label: "7", action: () => handleNumber("7") },
    { label: "8", action: () => handleNumber("8") },
    { label: "9", action: () => handleNumber("9") },
    { label: "×", action: () => handleOperator("×"), type: "operator" },

    { label: "4", action: () => handleNumber("4") },
    { label: "5", action: () => handleNumber("5") },
    { label: "6", action: () => handleNumber("6") },
    { label: "-", action: () => handleOperator("-"), type: "operator" },

    { label: "1", action: () => handleNumber("1") },
    { label: "2", action: () => handleNumber("2") },
    { label: "3", action: () => handleNumber("3") },
    { label: "+", action: () => handleOperator("+"), type: "operator" },

    { label: "+/-", action: toggleSign, type: "special" },
    { label: "0", action: () => handleNumber("0") },
    { label: ".", action: () => handleNumber(".") },
    { label: "=", action: handleEqual, type: "equal" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          CALCULATOR
        </h1>
        <p className="text-slate-400 text-center mb-8">
          Smart • Simple • Powerful
        </p>

        <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-5 shadow-2xl">

          <div className="bg-slate-950 rounded-2xl p-6 mb-5 min-h-32 flex flex-col items-end justify-end overflow-hidden">

            <p className="text-indigo-400 text-sm mb-2">
              {previous !== null ? `${previous} ${operator || ""}` : "Your calculation"}
            </p>

            <p className="text-white text-4xl font-semibold break-all">
              {display}
            </p>

          </div>

          <div className="grid grid-cols-4 gap-3">

            {buttons.map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                className={`h-16 rounded-2xl text-xl font-semibold transition-all active:scale-95 ${
                  btn.type === "operator"
                    ? "bg-indigo-600 text-white hover:bg-indigo-500"
                    : btn.type === "equal"
                    ? "bg-emerald-500 text-white hover:bg-emerald-400"
                    : btn.type === "special"
                    ? "bg-slate-700 text-indigo-300 hover:bg-slate-600"
                    : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
              >
                {btn.label}
              </button>
            ))}

          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <h2 className="text-white font-semibold mb-3">
              Recent History
            </h2>

            {history.length === 0 ? (
              <p className="text-slate-500 text-sm">
                No calculations yet
              </p>
            ) : (
              history.map((item, index) => (
                <p key={index} className="text-slate-300 text-sm py-1">
                  {item}
                </p>
              ))
            )}
          </div>

        </div>

        <p className="text-slate-500 text-center text-xs mt-6">
          Built with React + Tailwind CSS
        </p>

      </div>
    </div>
  );
}
