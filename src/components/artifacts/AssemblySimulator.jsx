import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '../../components/ui/alert';

const AssemblySimulator = () => {
  // CPU State
  const [registers, setRegisters] = useState({
    AX: 0,
    BX: 0,
    CX: 0,
    DX: 0,
    PC: 0, // Program Counter
    IR: '', // Instruction Register
  });

  // Memory State (instructions and data)
  const [memory, setMemory] = useState([
    {
      address: '0x100',
      content: 'MOV AX, 5',
      binary: '10111000 00000101',
      type: 'instruction',
    },
    {
      address: '0x101',
      content: 'MOV BX, 10',
      binary: '10111011 00001010',
      type: 'instruction',
    },
    {
      address: '0x102',
      content: 'ADD AX, BX',
      binary: '00000011 11000011',
      type: 'instruction',
    },
    {
      address: '0x103',
      content: 'MOV [0x200], AX',
      binary: '10100011 00000001',
      type: 'instruction',
    },
    {
      address: '0x200',
      content: '0',
      binary: '00000000 00000000',
      type: 'data',
    },
  ]);

  // Current execution state
  const [execState, setExecState] = useState('idle'); // idle, fetch, decode, execute
  const [selectedInstruction, setSelectedInstruction] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [explanation, setExplanation] = useState(
    'Click "Start" to begin the simulation.'
  );

  // UI settings
  const [speed, setSpeed] = useState(1000); // milliseconds per step
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Custom program
  const [customProgram, setCustomProgram] = useState(
    ['MOV AX, 5', 'MOV BX, 10', 'ADD AX, BX', 'MOV [0x200], AX'].join('\n')
  );

  // Load custom program into memory
  const loadProgram = () => {
    const lines = customProgram.trim().split('\n');
    const newMemory = [...memory];

    // Replace instruction entries with new program
    lines.forEach((line, index) => {
      if (index < 4) {
        // Only support up to 4 instructions
        // Generate fake binary representation
        const fakeBinary = generateFakeBinary(line);
        newMemory[index] = {
          address: `0x${(0x100 + index).toString(16)}`,
          content: line,
          binary: fakeBinary,
          type: 'instruction',
        };
      }
    });

    // Reset data memory cell
    newMemory[4] = {
      address: '0x200',
      content: '0',
      binary: '00000000 00000000',
      type: 'data',
    };

    setMemory(newMemory);
    resetSimulation();
  };

  // Generate plausible binary representation for display
  const generateFakeBinary = (instruction) => {
    // This is just for visual effect, not actual assembly translation
    const parts = instruction.split(' ').map((p) => p.replace(',', ''));
    let binary = '';

    // Create fake opcodes
    if (parts[0] === 'MOV') binary = '10111000 ';
    else if (parts[0] === 'ADD') binary = '00000011 ';
    else if (parts[0] === 'SUB') binary = '00101011 ';
    else binary = '11111111 ';

    // Add fake operand bits
    if (parts[1] === 'AX') binary += '00';
    else if (parts[1] === 'BX') binary += '11';
    else if (parts[1].includes('[')) binary += '10';
    else binary += '01';

    // Complete with some random bits to make it look like binary
    binary += Math.floor(Math.random() * 100000)
      .toString(2)
      .padStart(14, '0');
    return binary.substring(0, 17);
  };

  // Reset simulation state
  const resetSimulation = () => {
    setRegisters({
      AX: 0,
      BX: 0,
      CX: 0,
      DX: 0,
      PC: 0,
      IR: '',
    });
    setCurrentStep(0);
    setExecState('idle');
    setSelectedInstruction(null);
    setExplanation('Click "Start" to begin the simulation.');
    setIsRunning(false);
    setIsCompleted(false);
  };

  // Start or pause simulation
  const toggleSimulation = () => {
    if (isCompleted) {
      resetSimulation();
      return;
    }

    setIsRunning(!isRunning);
    if (execState === 'idle') {
      setExecState('fetch');
      setExplanation('Starting the fetch-decode-execute cycle...');
    }
  };

  // Step through simulation manually
  const stepSimulation = () => {
    if (isCompleted) {
      resetSimulation();
      return;
    }

    if (execState === 'idle') {
      setExecState('fetch');
      setExplanation('Starting the fetch-decode-execute cycle...');
    } else {
      advanceState();
    }
  };

  // Advance to the next state of execution
  const advanceState = () => {
    if (execState === 'fetch') {
      // Fetch the instruction at PC
      const pc = registers.PC;
      if (pc >= 4) {
        setIsCompleted(true);
        setIsRunning(false);
        setExplanation('Program execution completed!');
        return;
      }

      const instruction = memory[pc].content;
      const newRegisters = { ...registers, IR: instruction };
      setRegisters(newRegisters);
      setSelectedInstruction(pc);
      setExplanation(
        `FETCH: Retrieving instruction at address ${memory[pc].address}: "${instruction}". This instruction is loaded into the Instruction Register (IR).`
      );
      setExecState('decode');
    } else if (execState === 'decode') {
      // Decode the instruction
      const instruction = registers.IR;
      setExplanation(
        `DECODE: The Control Unit is analyzing "${instruction}" to determine what operation to perform and what data to use.`
      );
      setExecState('execute');
    } else if (execState === 'execute') {
      // Execute the instruction
      const instruction = registers.IR;
      const parts = instruction.split(' ');
      const opcode = parts[0];
      const operands = parts
        .slice(1)
        .join(' ')
        .split(',')
        .map((p) => p.trim());

      const newRegisters = { ...registers };
      let explanation = `EXECUTE: `;

      if (opcode === 'MOV') {
        if (operands[0] === 'AX') {
          if (operands[1].startsWith('[')) {
            // Handle memory to register mov
            const address = operands[1].replace('[', '').replace(']', '');
            explanation += `Moving value from memory address ${address} to register AX`;
          } else {
            // Direct value to register
            const value = parseInt(operands[1], 10);
            newRegisters.AX = value;
            explanation += `Moving value ${value} into register AX`;
          }
        } else if (operands[0] === 'BX') {
          // Similar for BX
          const value = parseInt(operands[1], 10);
          newRegisters.BX = value;
          explanation += `Moving value ${value} into register BX`;
        } else if (operands[0].startsWith('[')) {
          // Handle register to memory mov
          const address = operands[0].replace('[', '').replace(']', '');
          const memIndex = memory.findIndex((m) => m.address === address);
          if (memIndex !== -1) {
            const newMemory = [...memory];
            const value = newRegisters[operands[1]];
            newMemory[memIndex] = {
              ...newMemory[memIndex],
              content: value.toString(),
              binary: value.toString(2).padStart(16, '0'),
            };
            setMemory(newMemory);
            explanation += `Moving value ${value} from register ${operands[1]} to memory address ${address}`;
          }
        }
      } else if (opcode === 'ADD') {
        // Handle addition
        if (operands[0] === 'AX' && operands[1] === 'BX') {
          const result = newRegisters.AX + newRegisters.BX;
          newRegisters.AX = result;
          explanation += `Adding the value in BX (${registers.BX}) to AX (${registers.AX}), storing result (${result}) in AX`;
        }
      } else if (opcode === 'SUB') {
        // Handle subtraction
        if (operands[0] === 'AX' && operands[1] === 'BX') {
          const result = newRegisters.AX - newRegisters.BX;
          newRegisters.AX = result;
          explanation += `Subtracting the value in BX (${registers.BX}) from AX (${registers.AX}), storing result (${result}) in AX`;
        }
      }

      // Increment program counter for the next instruction
      newRegisters.PC = registers.PC + 1;
      setRegisters(newRegisters);
      setExplanation(explanation);
      setExecState('fetch');
      setCurrentStep(currentStep + 1);
    }
  };

  // Auto-advance simulation when running
  useEffect(() => {
    let timer;
    if (isRunning && !isCompleted) {
      timer = setTimeout(() => {
        advanceState();
      }, speed);
    }
    return () => clearTimeout(timer);
  }, [isRunning, registers, execState, speed, isCompleted]);

  // Color coding based on state
  const getColor = (component) => {
    const activeStyle = 'bg-blue-100 border-blue-500';
    const normalStyle = 'bg-gray-50';

    if (
      execState === 'fetch' &&
      (component === 'pc' || component === 'memory' || component === 'cu')
    ) {
      return activeStyle;
    }
    if (execState === 'decode' && (component === 'ir' || component === 'cu')) {
      return activeStyle;
    }
    if (
      execState === 'execute' &&
      (component === 'alu' ||
        component === 'registers' ||
        component === 'memory')
    ) {
      return activeStyle;
    }

    return normalStyle;
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded">
      {/* Title and Description */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">
          Interactive Assembly Simulator
        </h1>
        <p className="mb-4">
          Visualize how assembly code executes at the hardware level
        </p>
      </div>

      {/* Main simulator container */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left column: CPU and Memory */}
        <div className="flex-1 flex flex-col gap-4">
          {/* CPU Component */}
          <div className="border rounded p-4">
            <h2 className="text-lg font-bold mb-2">CPU</h2>

            {/* Control Unit */}
            <div className={`border p-2 rounded mb-2 ${getColor('cu')}`}>
              <h3 className="font-semibold">Control Unit</h3>
              <div className="flex gap-2 items-center">
                {/* Program Counter */}
                <div className={`p-2 border rounded ${getColor('pc')} flex-1`}>
                  <span className="block text-xs">Program Counter (PC)</span>
                  <span className="block font-mono">{`0x${(0x100 + registers.PC).toString(16)}`}</span>
                </div>

                {/* Instruction Register */}
                <div className={`p-2 border rounded ${getColor('ir')} flex-1`}>
                  <span className="block text-xs">
                    Instruction Register (IR)
                  </span>
                  <span className="block font-mono truncate">
                    {registers.IR || '(empty)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Registers */}
            <div className={`border p-2 rounded mb-2 ${getColor('registers')}`}>
              <h3 className="font-semibold">Registers</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(registers)
                  .filter(([key]) => !['PC', 'IR'].includes(key))
                  .map(([reg, value]) => (
                    <div key={reg} className="p-2 border rounded">
                      <span className="block text-xs">{reg}</span>
                      <span className="block font-mono">{value}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* ALU */}
            <div className={`border p-2 rounded ${getColor('alu')}`}>
              <h3 className="font-semibold">Arithmetic Logic Unit (ALU)</h3>
              <div className="p-2 border rounded bg-gray-50">
                <span className="block text-xs">
                  Operations: ADD, SUB, CMP, etc.
                </span>
              </div>
            </div>
          </div>

          {/* Memory Component */}
          <div className={`border rounded p-4 ${getColor('memory')}`}>
            <h2 className="text-lg font-bold mb-2">Memory</h2>
            <div className="overflow-auto max-h-64">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Address</th>
                    <th className="text-left">Content</th>
                    <th className="text-left">Binary</th>
                    <th className="text-left">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {memory.map((cell, index) => (
                    <tr
                      key={cell.address}
                      className={
                        selectedInstruction === index
                          ? 'bg-yellow-100'
                          : index === 4
                            ? 'bg-green-50'
                            : ''
                      }
                    >
                      <td className="font-mono">{cell.address}</td>
                      <td className="font-mono">{cell.content}</td>
                      <td className="font-mono text-xs">{cell.binary}</td>
                      <td>{cell.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column: Code Editor, Controls, Explanations */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Assembly Code Editor */}
          <div className="border rounded p-4">
            <h2 className="text-lg font-bold mb-2">Assembly Code</h2>
            <textarea
              className="w-full h-32 p-2 font-mono border rounded mb-2"
              value={customProgram}
              onChange={(e) => setCustomProgram(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={loadProgram}
            >
              Load Program
            </button>
            <div className="mt-2 text-xs text-gray-600">
              <p>Supported instructions: MOV, ADD, SUB</p>
              <p>Example: MOV AX, 5 | ADD AX, BX | MOV [0x200], AX</p>
            </div>
          </div>

          {/* Execution Controls */}
          <div className="border rounded p-4">
            <h2 className="text-lg font-bold mb-2">Execution Controls</h2>
            <div className="flex items-center gap-2 mb-4">
              <button
                className={`px-4 py-2 rounded ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                onClick={toggleSimulation}
              >
                {isCompleted ? 'Reset' : isRunning ? 'Pause' : 'Start'}
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={stepSimulation}
                disabled={isRunning}
              >
                Step
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={resetSimulation}
              >
                Reset
              </button>
              <div className="flex-1"></div>
              <div>
                <label className="block text-xs mb-1">Speed:</label>
                <select
                  className="border rounded p-1"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                >
                  <option value={2000}>Slow</option>
                  <option value={1000}>Normal</option>
                  <option value={500}>Fast</option>
                </select>
              </div>
            </div>

            {/* Execution State */}
            <div className="border rounded p-2 mb-4">
              <div className="flex gap-2 justify-between">
                <div
                  className={`p-2 rounded ${execState === 'fetch' ? 'bg-blue-100' : 'bg-gray-100'}`}
                >
                  Fetch
                </div>
                <div className="font-bold">→</div>
                <div
                  className={`p-2 rounded ${execState === 'decode' ? 'bg-blue-100' : 'bg-gray-100'}`}
                >
                  Decode
                </div>
                <div className="font-bold">→</div>
                <div
                  className={`p-2 rounded ${execState === 'execute' ? 'bg-blue-100' : 'bg-gray-100'}`}
                >
                  Execute
                </div>
              </div>
            </div>
          </div>

          {/* Explanation Box */}
          <div className="border rounded p-4">
            <h2 className="text-lg font-bold mb-2">Explanation</h2>
            <Alert>
              <AlertDescription>{explanation}</AlertDescription>
            </Alert>
          </div>

          {/* Help Information */}
          <div className="border rounded p-4">
            <h2 className="text-lg font-bold mb-2">How This Works</h2>
            <div className="space-y-2 text-sm">
              <p>
                This simulator demonstrates the fetch-decode-execute cycle that
                CPUs use to process instructions:
              </p>
              <ol className="list-decimal ml-5">
                <li>
                  <strong>Fetch:</strong> The CPU retrieves an instruction from
                  memory using the Program Counter (PC).
                </li>
                <li>
                  <strong>Decode:</strong> The Control Unit interprets what the
                  instruction means.
                </li>
                <li>
                  <strong>Execute:</strong> The CPU performs the operation
                  (using the ALU for calculations).
                </li>
              </ol>
              <p>
                Try writing your own simple assembly program in the editor, then
                watch it execute step by step!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssemblySimulator;
