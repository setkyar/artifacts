import React, { useState } from "react";

const ComputerSimulator = () => {
  const [activeTab, setActiveTab] = useState("binary");

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">
        Interactive Computer Simulator
      </h1>

      {/* Navigation */}
      <div className="flex flex-wrap justify-center mb-6 bg-slate-700 p-2 rounded-lg">
        <NavButton
          active={activeTab === "binary"}
          onClick={() => setActiveTab("binary")}
        >
          Binary Numbers
        </NavButton>
        <NavButton
          active={activeTab === "logic"}
          onClick={() => setActiveTab("logic")}
        >
          Logic Gates
        </NavButton>
        <NavButton
          active={activeTab === "memory"}
          onClick={() => setActiveTab("memory")}
        >
          Memory
        </NavButton>
        <NavButton
          active={activeTab === "adder"}
          onClick={() => setActiveTab("adder")}
        >
          Adder
        </NavButton>
        <NavButton
          active={activeTab === "cpu"}
          onClick={() => setActiveTab("cpu")}
        >
          CPU
        </NavButton>
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === "binary" && <BinaryConverter />}
        {activeTab === "logic" && <LogicGates />}
        {activeTab === "memory" && <MemorySimulator />}
        {activeTab === "adder" && <AdderSimulator />}
        {activeTab === "cpu" && <CPUSimulator />}
      </div>
    </div>
  );
};

// Navigation Button Component
const NavButton = ({ children, active, onClick }) => (
  <button
    className={`px-4 py-2 mx-1 rounded-lg transition-colors ${
      active
        ? "bg-blue-600 text-white"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Binary Converter Component
const BinaryConverter = () => {
  const [binaryBits, setBinaryBits] = useState(Array(8).fill(false));
  const [decimalValue, setDecimalValue] = useState(0);
  const [decimalInput, setDecimalInput] = useState(0);
  const [binaryOutput, setBinaryOutput] = useState("00000000");

  const toggleBit = (index) => {
    const newBits = [...binaryBits];
    newBits[index] = !newBits[index];
    setBinaryBits(newBits);

    // Calculate decimal value
    let newDecimal = 0;
    newBits.forEach((bit, i) => {
      if (bit) newDecimal += Math.pow(2, 7 - i);
    });
    setDecimalValue(newDecimal);
  };

  const convertToBinary = () => {
    const decimal = parseInt(decimalInput);
    if (isNaN(decimal) || decimal < 0 || decimal > 255) {
      alert("Please enter a number between 0 and 255");
      return;
    }

    // Convert to binary
    const binary = decimal.toString(2).padStart(8, "0");
    setBinaryOutput(binary);

    // Update the binary display
    const newBits = Array(8).fill(false);
    for (let i = 0; i < 8; i++) {
      newBits[i] = binary[i] === "1";
    }
    setBinaryBits(newBits);
    setDecimalValue(decimal);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Binary Numbers</h2>
      <p className="mb-4">
        In computing, all data is represented as binary numbers (sequences of 0s
        and 1s).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {/* Binary to Decimal */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-medium mb-3">Binary to Decimal</h3>
          <p className="mb-3">
            Click on the bits to toggle them and see the decimal value.
          </p>

          <div className="flex justify-center mb-4">
            {binaryBits.map((bit, index) => (
              <div key={index} className="flex flex-col items-center mx-1">
                <button
                  className={`w-12 h-12 rounded-full ${
                    bit ? "bg-blue-500" : "bg-gray-300"
                  } text-white font-bold text-lg mb-2`}
                  onClick={() => toggleBit(index)}
                >
                  {bit ? "1" : "0"}
                </button>
                <span className="text-xs">{Math.pow(2, 7 - index)}</span>
              </div>
            ))}
          </div>

          <div className="text-center text-xl font-bold mt-4">
            Decimal: {decimalValue}
          </div>
        </div>

        {/* Decimal to Binary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-medium mb-3">Decimal to Binary</h3>
          <p className="mb-3">
            Enter a decimal number to see its binary representation.
          </p>

          <div className="flex items-center justify-center mb-4">
            <input
              type="number"
              min="0"
              max="255"
              value={decimalInput}
              onChange={(e) => setDecimalInput(e.target.value)}
              className="px-3 py-2 border rounded-lg w-24 text-center mr-2"
            />
            <button
              onClick={convertToBinary}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Convert
            </button>
          </div>

          <div className="text-center text-xl font-bold mt-4">
            Binary: {binaryOutput}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <h3 className="text-lg font-medium mb-2">How Binary Works</h3>
        <p className="mb-2">
          In the decimal system (base-10), we use 10 digits (0-9) and when we
          reach ten, we add a '1' in the tens place: 10.
        </p>
        <p className="mb-2">
          In binary (base-2), we only use 2 digits (0 and 1) and when we reach
          two, we add a '1' in the twos place: 10.
        </p>
        <p className="mb-2">
          Each position in a binary number represents a power of 2:
        </p>

        <div className="flex justify-center flex-wrap mb-2 text-sm">
          <span className="mx-2">
            2<sup>7</sup>=128
          </span>
          <span className="mx-2">
            2<sup>6</sup>=64
          </span>
          <span className="mx-2">
            2<sup>5</sup>=32
          </span>
          <span className="mx-2">
            2<sup>4</sup>=16
          </span>
          <span className="mx-2">
            2<sup>3</sup>=8
          </span>
          <span className="mx-2">
            2<sup>2</sup>=4
          </span>
          <span className="mx-2">
            2<sup>1</sup>=2
          </span>
          <span className="mx-2">
            2<sup>0</sup>=1
          </span>
        </div>

        <p>
          To convert binary to decimal, add the values of each position where
          there's a 1.
        </p>
      </div>
    </div>
  );
};

// Logic Gates Component
const LogicGates = () => {
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);

  // NAND gate: output is true unless both inputs are true
  const nandOutput = !(inputA && inputB);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Logic Gates</h2>
      <p className="mb-4">
        Logic gates are the fundamental building blocks of digital circuits.
        They perform logical operations on one or more binary inputs and produce
        a single binary output.
      </p>

      <h3 className="text-xl font-medium mb-3">NAND Gate</h3>
      <p className="mb-4">
        A NAND gate outputs 0 only when both inputs are 1. Otherwise, it outputs
        1.
      </p>

      <div className="flex justify-center items-center mb-6 bg-gray-50 p-6 rounded-lg">
        <div className="flex flex-col items-center mx-4">
          <p className="mb-2">Input A</p>
          <div
            className={`w-16 h-8 rounded-full relative cursor-pointer ${
              inputA ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setInputA(!inputA)}
          >
            <div
              className={`absolute w-6 h-6 rounded-full bg-white shadow transition-all ${
                inputA ? "right-1" : "left-1"
              } top-1`}
            />
          </div>
          <p className="mt-2 font-bold">{inputA ? "1" : "0"}</p>
        </div>

        <div className="flex flex-col items-center mx-4">
          <p className="mb-2">Input B</p>
          <div
            className={`w-16 h-8 rounded-full relative cursor-pointer ${
              inputB ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setInputB(!inputB)}
          >
            <div
              className={`absolute w-6 h-6 rounded-full bg-white shadow transition-all ${
                inputB ? "right-1" : "left-1"
              } top-1`}
            />
          </div>
          <p className="mt-2 font-bold">{inputB ? "1" : "0"}</p>
        </div>

        <div className="flex flex-col items-center mx-4">
          <p className="mb-2">Output</p>
          <div
            className={`w-16 h-16 rounded-full ${
              nandOutput ? "bg-red-500" : "bg-gray-400"
            } flex items-center justify-center`}
          >
            <span className="text-white font-bold text-xl">
              {nandOutput ? "1" : "0"}
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Input A</th>
              <th className="border px-4 py-2">Input B</th>
              <th className="border px-4 py-2">Output</th>
            </tr>
          </thead>
          <tbody>
            <tr className={!inputA && !inputB ? "bg-yellow-100" : ""}>
              <td className="border px-4 py-2 text-center">0</td>
              <td className="border px-4 py-2 text-center">0</td>
              <td className="border px-4 py-2 text-center">1</td>
            </tr>
            <tr className={!inputA && inputB ? "bg-yellow-100" : ""}>
              <td className="border px-4 py-2 text-center">0</td>
              <td className="border px-4 py-2 text-center">1</td>
              <td className="border px-4 py-2 text-center">1</td>
            </tr>
            <tr className={inputA && !inputB ? "bg-yellow-100" : ""}>
              <td className="border px-4 py-2 text-center">1</td>
              <td className="border px-4 py-2 text-center">0</td>
              <td className="border px-4 py-2 text-center">1</td>
            </tr>
            <tr className={inputA && inputB ? "bg-yellow-100" : ""}>
              <td className="border px-4 py-2 text-center">1</td>
              <td className="border px-4 py-2 text-center">1</td>
              <td className="border px-4 py-2 text-center">0</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <h3 className="text-lg font-medium mb-2">Why NAND Gates Matter</h3>
        <p className="mb-2">
          NAND gates are considered universal gates because they can be used to
          implement any other logical function.
        </p>
        <p className="mb-2">With enough NAND gates, we can build:</p>
        <ul className="list-disc pl-6 mb-2">
          <li>NOT gates (inverters)</li>
          <li>AND gates</li>
          <li>OR gates</li>
          <li>More complex functions like adders and memory</li>
        </ul>
        <p>
          Modern computers contain billions of these basic gates, combined to
          create all computing functions.
        </p>
      </div>
    </div>
  );
};

// Memory Simulator Component
const MemorySimulator = () => {
  const [dataInput, setDataInput] = useState(false);
  const [enable, setEnable] = useState(false);
  const [storedValue, setStoredValue] = useState(false);
  const [memoryBits, setMemoryBits] = useState(Array(8).fill(false));

  // Handle D-Latch behavior
  React.useEffect(() => {
    if (enable) {
      setStoredValue(dataInput);
    }
  }, [dataInput, enable]);

  // Toggle a bit in the 8-bit memory
  const toggleMemoryBit = (index) => {
    const newBits = [...memoryBits];
    newBits[index] = !newBits[index];
    setMemoryBits(newBits);
  };

  // Calculate decimal value of memory byte
  const memoryDecimal = memoryBits.reduce((acc, bit, index) => {
    return acc + (bit ? Math.pow(2, index) : 0);
  }, 0);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Computer Memory</h2>
      <p className="mb-4">
        Computers store data in memory using devices called D-Latches, which can
        store one bit (0 or 1) each.
      </p>

      <h3 className="text-xl font-medium mb-3">D-Latch Simulator</h3>
      <p className="mb-3">
        A D-Latch stores one bit of data. It copies the data input only when the
        enable line is active.
      </p>

      <div className="flex justify-center items-center mb-6 bg-gray-50 p-6 rounded-lg">
        <div className="flex flex-col items-center mx-4">
          <p className="mb-2">Data Input</p>
          <div
            className={`w-16 h-8 rounded-full relative cursor-pointer ${
              dataInput ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setDataInput(!dataInput)}
          >
            <div
              className={`absolute w-6 h-6 rounded-full bg-white shadow transition-all ${
                dataInput ? "right-1" : "left-1"
              } top-1`}
            />
          </div>
          <p className="mt-2 font-bold">{dataInput ? "1" : "0"}</p>
        </div>

        <div className="flex flex-col items-center mx-4">
          <p className="mb-2">Enable Storage</p>
          <div
            className={`w-16 h-8 rounded-full relative cursor-pointer ${
              enable ? "bg-green-500" : "bg-gray-300"
            }`}
            onClick={() => setEnable(!enable)}
          >
            <div
              className={`absolute w-6 h-6 rounded-full bg-white shadow transition-all ${
                enable ? "right-1" : "left-1"
              } top-1`}
            />
          </div>
          <p className="mt-2 font-bold">{enable ? "ON" : "OFF"}</p>
        </div>

        <div className="flex flex-col items-center mx-4">
          <p className="mb-2">Stored Value</p>
          <div
            className={`w-16 h-16 rounded-full ${
              storedValue ? "bg-red-500" : "bg-gray-400"
            } flex items-center justify-center`}
          >
            <span className="text-white font-bold text-xl">
              {storedValue ? "1" : "0"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-6">
        <h3 className="text-lg font-medium mb-2">How D-Latches Work</h3>
        <p className="mb-2">A D-Latch has two inputs:</p>
        <ul className="list-disc pl-6 mb-2">
          <li>
            <strong>Data</strong> - The value to be stored (0 or 1)
          </li>
          <li>
            <strong>Enable</strong> - When enabled, the latch copies the data
            input to its storage
          </li>
        </ul>
        <p className="mb-2">
          When the enable input is off, the latch maintains its current value
          regardless of changes to the data input.
        </p>
        <p>
          This is the fundamental mechanism for all computer memory storage.
        </p>
      </div>

      <h3 className="text-xl font-medium mb-3">Memory Byte (8 bits)</h3>
      <p className="mb-3">
        Eight D-Latches together form a byte, which can store values from 0 to
        255.
      </p>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex justify-center mb-4">
          {memoryBits.map((bit, index) => (
            <div key={index} className="flex flex-col items-center mx-1">
              <button
                className={`w-12 h-12 rounded-full ${
                  bit ? "bg-blue-500" : "bg-gray-300"
                } text-white font-bold text-lg mb-2`}
                onClick={() => toggleMemoryBit(index)}
              >
                {bit ? "1" : "0"}
              </button>
              <span className="text-xs">Bit {index}</span>
              <span className="text-xs text-gray-500">
                {Math.pow(2, index)}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center text-xl font-bold">
          Stored Value: {memoryDecimal}
        </div>
      </div>
    </div>
  );
};

// Adder Simulator Component
const AdderSimulator = () => {
  const [bitA, setBitA] = useState(false);
  const [bitB, setBitB] = useState(false);
  const [carryIn, setCarryIn] = useState(false);
  const [numberA, setNumberA] = useState(Array(8).fill(false));
  const [numberB, setNumberB] = useState(Array(8).fill(false));
  const [result, setResult] = useState({
    sum: Array(8).fill(false),
    carry: false,
  });

  // Calculate 1-bit adder results
  const sum = (bitA !== bitB) !== carryIn; // XOR of all three inputs
  const carryOut = (bitA && bitB) || (bitA && carryIn) || (bitB && carryIn);

  // Toggle a bit in the 8-bit adder
  const toggleAdderBit = (index, register) => {
    if (register === "a") {
      const newBits = [...numberA];
      newBits[index] = !newBits[index];
      setNumberA(newBits);
    } else {
      const newBits = [...numberB];
      newBits[index] = !newBits[index];
      setNumberB(newBits);
    }
  };

  // Calculate decimal values
  const decimalA = numberA.reduce(
    (acc, bit, index) => acc + (bit ? Math.pow(2, index) : 0),
    0
  );
  const decimalB = numberB.reduce(
    (acc, bit, index) => acc + (bit ? Math.pow(2, index) : 0),
    0
  );
  const decimalSum =
    result.sum.reduce(
      (acc, bit, index) => acc + (bit ? Math.pow(2, index) : 0),
      0
    ) + (result.carry ? Math.pow(2, 8) : 0);

  // Calculate 8-bit sum
  const calculate8BitSum = () => {
    let carry = false;
    const sum = Array(8).fill(false);

    for (let i = 0; i < 8; i++) {
      // Full adder logic for each bit position
      const a = numberA[i];
      const b = numberB[i];

      // Sum bit = a XOR b XOR carry
      sum[i] = (a !== b) !== carry;

      // New carry = (a AND b) OR (a AND carry) OR (b AND carry)
      carry = (a && b) || (a && carry) || (b && carry);
    }

    setResult({ sum, carry });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Binary Addition</h2>
      <p className="mb-4">
        Computers perform arithmetic using specialized circuits. The most basic
        arithmetic circuit is the adder.
      </p>

      <h3 className="text-xl font-medium mb-3">1-Bit Full Adder</h3>
      <p className="mb-3">
        A full adder adds two bits plus a carry-in bit, producing a sum and a
        carry-out bit.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex justify-center items-center mb-4">
          <div className="flex flex-col items-center mx-4">
            <p className="mb-2">Input A</p>
            <div
              className={`w-16 h-8 rounded-full relative cursor-pointer ${
                bitA ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => setBitA(!bitA)}
            >
              <div
                className={`absolute w-6 h-6 rounded-full bg-white shadow transition-all ${
                  bitA ? "right-1" : "left-1"
                } top-1`}
              />
            </div>
            <p className="mt-2 font-bold">{bitA ? "1" : "0"}</p>
          </div>

          <div className="flex flex-col items-center mx-4">
            <p className="mb-2">Input B</p>
            <div
              className={`w-16 h-8 rounded-full relative cursor-pointer ${
                bitB ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => setBitB(!bitB)}
            >
              <div
                className={`absolute w-6 h-6 rounded-full bg-white shadow transition-all ${
                  bitB ? "right-1" : "left-1"
                } top-1`}
              />
            </div>
            <p className="mt-2 font-bold">{bitB ? "1" : "0"}</p>
          </div>

          <div className="flex flex-col items-center mx-4">
            <p className="mb-2">Carry In</p>
            <div
              className={`w-16 h-8 rounded-full relative cursor-pointer ${
                carryIn ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => setCarryIn(!carryIn)}
            >
              <div
                className={`absolute w-6 h-6 rounded-full bg-white shadow transition-all ${
                  carryIn ? "right-1" : "left-1"
                } top-1`}
              />
            </div>
            <p className="mt-2 font-bold">{carryIn ? "1" : "0"}</p>
          </div>
        </div>

        <div className="h-px bg-gray-300 w-full my-4"></div>

        <div className="flex justify-center items-center">
          <div className="flex flex-col items-center mx-8">
            <p className="mb-2">Sum</p>
            <div
              className={`w-16 h-16 rounded-full ${
                sum ? "bg-green-500" : "bg-gray-400"
              } flex items-center justify-center`}
            >
              <span className="text-white font-bold text-xl">
                {sum ? "1" : "0"}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center mx-8">
            <p className="mb-2">Carry Out</p>
            <div
              className={`w-16 h-16 rounded-full ${
                carryOut ? "bg-red-500" : "bg-gray-400"
              } flex items-center justify-center`}
            >
              <span className="text-white font-bold text-xl">
                {carryOut ? "1" : "0"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-6">
        <h3 className="text-lg font-medium mb-2">How Binary Addition Works</h3>
        <p className="mb-2">Binary addition follows these rules:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          <div className="bg-white p-2 rounded text-center">0 + 0 = 0</div>
          <div className="bg-white p-2 rounded text-center">0 + 1 = 1</div>
          <div className="bg-white p-2 rounded text-center">1 + 0 = 1</div>
          <div className="bg-white p-2 rounded text-center">
            1 + 1 = 10 (carry 1)
          </div>
        </div>
        <p className="mb-2">
          When adding multi-bit numbers, we process one bit position at a time,
          starting from the least significant bit (rightmost). If a position
          generates a carry, it's added to the next position.
        </p>
        <p>
          This is why computers can perform complex arithmetic using only simple
          binary operations.
        </p>
      </div>

      <h3 className="text-xl font-medium mb-3">8-Bit Adder</h3>
      <p className="mb-3">Try adding two 8-bit numbers:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Number A</h4>
          <div className="flex justify-center mb-2">
            {numberA.map((bit, index) => (
              <div key={index} className="flex flex-col items-center mx-1">
                <button
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${
                    bit ? "bg-blue-500" : "bg-gray-300"
                  } text-white font-bold mb-1`}
                  onClick={() => toggleAdderBit(index, "a")}
                >
                  {bit ? "1" : "0"}
                </button>
                <span className="text-xs">{index}</span>
              </div>
            ))}
          </div>
          <div className="text-center">Decimal: {decimalA}</div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Number B</h4>
          <div className="flex justify-center mb-2">
            {numberB.map((bit, index) => (
              <div key={index} className="flex flex-col items-center mx-1">
                <button
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${
                    bit ? "bg-blue-500" : "bg-gray-300"
                  } text-white font-bold mb-1`}
                  onClick={() => toggleAdderBit(index, "b")}
                >
                  {bit ? "1" : "0"}
                </button>
                <span className="text-xs">{index}</span>
              </div>
            ))}
          </div>
          <div className="text-center">Decimal: {decimalB}</div>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={calculate8BitSum}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-medium"
        >
          Calculate Sum
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2 text-center">Result</h4>
        <div className="flex justify-center mb-2">
          <div className="flex flex-col items-center mr-4">
            <div
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${
                result.carry ? "bg-red-500" : "bg-gray-300"
              } text-white font-bold flex items-center justify-center mb-1`}
            >
              {result.carry ? "1" : "0"}
            </div>
            <span className="text-xs">Carry</span>
          </div>
          {result.sum
            .map((bit, index) => (
              <div key={index} className="flex flex-col items-center mx-1">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${
                    bit ? "bg-green-500" : "bg-gray-300"
                  } text-white font-bold flex items-center justify-center mb-1`}
                >
                  {bit ? "1" : "0"}
                </div>
                <span className="text-xs">{index}</span>
              </div>
            ))
            .reverse()}{" "}
          {/* Reverse to show MSB on left */}
        </div>
        <div className="text-center font-bold text-xl">
          Decimal Sum: {decimalSum}
        </div>
      </div>
    </div>
  );
};

// CPU Simulator Component
const CPUSimulator = () => {
  // CPU state
  const [memory, setMemory] = useState(
    Array(256)
      .fill()
      .map(() => Array(8).fill(false))
  );
  const [memoryOffset, setMemoryOffset] = useState(0);
  const [cpuPower, setCpuPower] = useState(false);
  const [clockSpeed, setClockSpeed] = useState(500);
  const [cpuStatus, setCpuStatus] = useState("Powered Off");
  const [intervalId, setIntervalId] = useState(null);

  // Get decimal value from binary array
  const binaryToDecimal = (binaryArray) => {
    return binaryArray.reduce(
      (acc, bit, index) => acc + (bit ? Math.pow(2, index) : 0),
      0
    );
  };

  // Convert decimal to binary array
  const decimalToBinary = (decimal) => {
    const binary = [];
    for (let i = 0; i < 8; i++) {
      binary[i] = ((decimal >> i) & 1) === 1;
    }
    return binary;
  };

  // Get instruction pointer value
  const getInstructionPointer = () => {
    return binaryToDecimal(memory[0]);
  };

  // Get current instruction
  const getCurrentInstruction = () => {
    const ip = getInstructionPointer();
    if (ip >= memory.length) return "Out of bounds";

    const opcode = binaryToDecimal(memory[ip]);
    switch (opcode) {
      case 1:
        return "ADD";
      case 2:
        return "SUB";
      case 3:
        return "MOV";
      default:
        return "Unknown";
    }
  };

  // Toggle a memory bit
  const toggleMemoryBit = (address, bitPosition) => {
    if (cpuPower) return; // Prevent memory modification while CPU is running

    const newMemory = [...memory];
    newMemory[address] = [...newMemory[address]];
    newMemory[address][bitPosition] = !newMemory[address][bitPosition];
    setMemory(newMemory);
  };

  // Scroll memory view
  const scrollMemory = (delta) => {
    setMemoryOffset(Math.max(0, Math.min(248, memoryOffset + delta)));
  };

  // Toggle CPU power
  const toggleCPU = () => {
    if (!cpuPower) {
      setCpuPower(true);
      setCpuStatus("Running");
      const id = setInterval(stepCPU, clockSpeed);
      setIntervalId(id);
    } else {
      setCpuPower(false);
      setCpuStatus("Powered Off");
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  // Update clock speed
  React.useEffect(() => {
    if (intervalId) {
      clearInterval(intervalId);
      const id = setInterval(stepCPU, clockSpeed);
      setIntervalId(id);
    }
  }, [clockSpeed]);

  // Single CPU step
  const stepCPU = () => {
    if (!cpuPower) return;

    const ip = getInstructionPointer();

    // Check if IP is valid
    if (ip >= memory.length - 2) {
      setCpuStatus("Error: Instruction pointer out of bounds");
      setCpuPower(false);
      clearInterval(intervalId);
      setIntervalId(null);
      return;
    }

    const opcode = binaryToDecimal(memory[ip]);
    const operand1Addr = binaryToDecimal(memory[ip + 1]);
    const operand2Addr = binaryToDecimal(memory[ip + 2]);

    // Check if operand addresses are valid
    if (operand1Addr >= memory.length || operand2Addr >= memory.length) {
      setCpuStatus("Error: Operand address out of bounds");
      setCpuPower(false);
      clearInterval(intervalId);
      setIntervalId(null);
      return;
    }

    const operand1Value = binaryToDecimal(memory[operand1Addr]);
    const operand2Value = binaryToDecimal(memory[operand2Addr]);

    const newMemory = [...memory];

    // Execute instruction
    switch (opcode) {
      case 1: // ADD
        const sum = (operand1Value + operand2Value) % 256;
        newMemory[operand1Addr] = decimalToBinary(sum);
        setCpuStatus(`ADD: ${operand1Value} + ${operand2Value} = ${sum}`);
        break;

      case 2: // SUB
        const diff = (operand1Value - operand2Value + 256) % 256;
        newMemory[operand1Addr] = decimalToBinary(diff);
        setCpuStatus(`SUB: ${operand1Value} - ${operand2Value} = ${diff}`);
        break;

      case 3: // MOV
        newMemory[operand2Addr] = [...memory[operand1Addr]];
        setCpuStatus(`MOV: ${operand1Value} to address ${operand2Addr}`);
        break;

      default:
        setCpuStatus(`Error: Unknown opcode ${opcode}`);
        setCpuPower(false);
        clearInterval(intervalId);
        setIntervalId(null);
        return;
    }

    // Increment instruction pointer by 3
    newMemory[0] = decimalToBinary((ip + 3) % 256);

    setMemory(newMemory);
  };

  // Reset CPU
  const resetCPU = () => {
    // Zero out memory
    setMemory(
      Array(256)
        .fill()
        .map(() => Array(8).fill(false))
    );

    // Reset UI
    setCpuPower(false);
    setCpuStatus("Powered Off");
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setMemoryOffset(0);
  };

  // Load example program
  const loadExampleProgram = () => {
    // Reset first
    resetCPU();

    const newMemory = Array(256)
      .fill()
      .map(() => Array(8).fill(false));

    // Instruction Pointer (points to address 3)
    newMemory[0] = decimalToBinary(3);

    // MOV instruction
    newMemory[3] = decimalToBinary(3); // MOV opcode
    newMemory[4] = decimalToBinary(9); // Source address
    newMemory[5] = decimalToBinary(11); // Destination address

    // MOV instruction
    newMemory[6] = decimalToBinary(3); // MOV opcode
    newMemory[7] = decimalToBinary(10); // Source address
    newMemory[8] = decimalToBinary(12); // Destination address

    // Numbers to add
    newMemory[9] = decimalToBinary(5); // First number
    newMemory[10] = decimalToBinary(7); // Second number

    // ADD instruction
    newMemory[13] = decimalToBinary(1); // ADD opcode
    newMemory[14] = decimalToBinary(11); // First operand address
    newMemory[15] = decimalToBinary(12); // Second operand address

    setMemory(newMemory);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">CPU Simulator</h2>
      <p className="mb-4">
        This simulates a simple CPU with a small instruction set, memory, and an
        instruction pointer.
      </p>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex items-center mb-2 md:mb-0">
            <p className="mr-2">CPU Power:</p>
            <div
              className={`w-16 h-8 rounded-full relative cursor-pointer ${
                cpuPower ? "bg-green-500" : "bg-gray-300"
              }`}
              onClick={toggleCPU}
            >
              <div
                className={`absolute w-6 h-6 rounded-full bg-white shadow transition-all ${
                  cpuPower ? "right-1" : "left-1"
                } top-1`}
              />
            </div>
          </div>

          <div className="mb-2 md:mb-0">
            <button
              onClick={stepCPU}
              disabled={!cpuPower}
              className={`px-4 py-2 rounded-lg mr-2 ${
                cpuPower
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Step
            </button>
            <button
              onClick={resetCPU}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Reset
            </button>
          </div>

          <div className="flex items-center">
            <p className="mr-2">Clock Speed:</p>
            <select
              value={clockSpeed}
              onChange={(e) => setClockSpeed(parseInt(e.target.value))}
              className="px-2 py-1 border rounded-lg"
            >
              <option value="1000">Very Slow</option>
              <option value="500">Slow</option>
              <option value="250">Medium</option>
              <option value="100">Fast</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-center">
          <div>
            <p className="font-medium">Instruction Pointer:</p>
            <p className="font-mono">
              {getInstructionPointer().toString(2).padStart(8, "0")}
            </p>
          </div>
          <div>
            <p className="font-medium">Current Instruction:</p>
            <p className="font-mono">{getCurrentInstruction()}</p>
          </div>
          <div>
            <p className="font-medium">Status:</p>
            <p
              className={`font-mono ${
                cpuStatus.includes("Error") ? "text-red-500" : ""
              }`}
            >
              {cpuStatus}
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-medium mb-3">Memory</h3>
      <p className="mb-3">
        Click on any bit to toggle it. The first byte (address 00000000) is the
        instruction pointer.
      </p>

      <div className="bg-gray-50 p-4 rounded-lg mb-4 overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {Array(8)
            .fill()
            .map((_, index) => {
              const address = memoryOffset + index;
              return (
                <div key={index} className="bg-white p-2 rounded-lg shadow-sm">
                  <div className="text-xs text-gray-500 mb-1">
                    {address.toString(2).padStart(8, "0")}
                  </div>
                  <div className="flex justify-center">
                    {memory[address]
                      .map((bit, bitIndex) => (
                        <button
                          key={bitIndex}
                          className={`w-5 h-5 m-px rounded-full ${
                            bit ? "bg-blue-500" : "bg-gray-300"
                          } ${
                            cpuPower ? "cursor-not-allowed" : "hover:opacity-80"
                          }`}
                          onClick={() => toggleMemoryBit(address, bitIndex)}
                          disabled={cpuPower}
                        />
                      ))
                      .reverse()}{" "}
                    {/* Reversed to show MSB on left */}
                  </div>
                  <div className="text-center mt-1">
                    {binaryToDecimal(memory[address])}
                  </div>
                </div>
              );
            })}
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => scrollMemory(-8)}
            disabled={memoryOffset <= 0}
            className={`px-3 py-1 rounded ${
              memoryOffset <= 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            ◀ Previous
          </button>

          <span className="text-sm">
            Showing addresses {memoryOffset.toString(2).padStart(8, "0")} -{" "}
            {(memoryOffset + 7).toString(2).padStart(8, "0")}
          </span>

          <button
            onClick={() => scrollMemory(8)}
            disabled={memoryOffset >= 248}
            className={`px-3 py-1 rounded ${
              memoryOffset >= 248
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next ▶
          </button>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-6">
        <h3 className="text-lg font-medium mb-2">Instruction Set</h3>
        <p className="mb-3">This CPU supports these instructions:</p>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse mb-4">
            <thead>
              <tr className="bg-blue-100">
                <th className="border px-4 py-2 text-left">Instruction</th>
                <th className="border px-4 py-2 text-left">Code</th>
                <th className="border px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">ADD</td>
                <td className="border px-4 py-2 font-mono">00000001</td>
                <td className="border px-4 py-2">
                  Add the value at address in (IP+1) to the value at address in
                  (IP+2)
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">SUB</td>
                <td className="border px-4 py-2 font-mono">00000010</td>
                <td className="border px-4 py-2">
                  Subtract the value at address in (IP+2) from the value at
                  address in (IP+1)
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">MOV</td>
                <td className="border px-4 py-2 font-mono">00000011</td>
                <td className="border px-4 py-2">
                  Move the value at address in (IP+1) to the address in (IP+2)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mb-2">
          All instructions are 3 bytes long (including operands). After each
          instruction, the CPU increments the instruction pointer by 3.
        </p>
        <p>The instruction pointer is stored at memory address 00000000.</p>
      </div>

      <h3 className="text-xl font-medium mb-3">Example Program: Addition</h3>
      <p className="mb-3">Here's a simple program that adds two numbers:</p>

      <div className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto mb-4 font-mono text-sm">
        <pre>
          {`Address | Value    | Meaning
--------|----------|--------
00      | 00000011 | Instruction Pointer (pointing to address 3)
01      | 00000000 | Not used
02      | 00000000 | Not used
03      | 00000011 | MOV instruction
04      | 00001001 | Source address (contains first number)
05      | 00001011 | Destination address
06      | 00000011 | MOV instruction
07      | 00001010 | Source address (contains second number)
08      | 00001100 | Destination address
09      | 00000101 | First number to add (5)
10      | 00000111 | Second number to add (7)
11      | 00000000 | Will contain result after first MOV
12      | 00000000 | Will contain result after second MOV
13      | 00000001 | ADD instruction
14      | 00001011 | First operand address
15      | 00001100 | Second operand address`}
        </pre>
      </div>

      <div className="flex justify-center">
        <button
          onClick={loadExampleProgram}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
        >
          Load Example Program
        </button>
      </div>
    </div>
  );
};

export default ComputerSimulator;
