import React, { useState, useEffect } from 'react';

const CompilerSimulator = () => {
  const [activeStage, setActiveStage] = useState(0);
  const [sourceCode, setSourceCode] = useState(
    'int main() {\n  int a = 5;\n  int b = 10;\n  int c = a + b;\n  return c;\n}'
  );
  const [speed, setSpeed] = useState(2); // 1-5, with 5 being fastest
  const [isPlaying, setIsPlaying] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [ast, setAst] = useState(null);
  const [semanticInfo, setSemanticInfo] = useState(null);
  const [irCode, setIrCode] = useState([]);
  const [optimizedIr, setOptimizedIr] = useState([]);
  const [machineCode, setMachineCode] = useState([]);
  const [executable, setExecutable] = useState(null);
  const [highlightedCode, setHighlightedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const stages = [
    {
      name: 'Source Code',
      description: 'The program written in a high-level language',
    },
    {
      name: 'Lexical Analysis',
      description: 'Breaking source code into tokens',
    },
    {
      name: 'Syntax Analysis',
      description: 'Building an Abstract Syntax Tree (AST)',
    },
    {
      name: 'Semantic Analysis',
      description: 'Checking for logical errors and type consistency',
    },
    {
      name: 'Intermediate Code',
      description: 'Converting to platform-independent representation',
    },
    { name: 'Optimization', description: 'Improving code efficiency' },
    { name: 'Code Generation', description: 'Translating to machine code' },
    { name: 'Linking', description: 'Creating the final executable' },
  ];

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(
        () => {
          if (activeStage < stages.length - 1) {
            setActiveStage((prevStage) => prevStage + 1);
          } else {
            setIsPlaying(false);
          }
        },
        (6 - speed) * 1000
      ); // Adjust speed

      return () => clearTimeout(timer);
    }
  }, [isPlaying, activeStage, speed, stages.length]);

  useEffect(() => {
    processCurrentStage();
  }, [activeStage, sourceCode]);

  const processCurrentStage = () => {
    switch (activeStage) {
      case 0: // Source Code
        setHighlightedCode(sourceCode);
        break;
      case 1: // Lexical Analysis
        performLexicalAnalysis();
        break;
      case 2: // Syntax Analysis
        performSyntaxAnalysis();
        break;
      case 3: // Semantic Analysis
        performSemanticAnalysis();
        break;
      case 4: // Intermediate Code
        generateIntermediateCode();
        break;
      case 5: // Optimization
        performOptimization();
        break;
      case 6: // Code Generation
        generateMachineCode();
        break;
      case 7: // Linking
        performLinking();
        break;
      default:
        break;
    }
  };

  const performLexicalAnalysis = () => {
    // Simulate lexical analysis
    const tokenRegex =
      /(\bint\b|\bmain\b|\breturn\b|\b[a-zA-Z_][a-zA-Z0-9_]*\b|\d+|[=+;(){}])/g;
    const tokenMatches = sourceCode.match(tokenRegex) || [];

    // Classify tokens
    const newTokens = tokenMatches.map((token) => {
      let type = '';
      if (/^int$|^main$|^return$/.test(token)) {
        type = 'keyword';
      } else if (
        /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token) &&
        !/^int$|^main$|^return$/.test(token)
      ) {
        type = 'identifier';
      } else if (/^\d+$/.test(token)) {
        type = 'literal';
      } else if (/^[=+]$/.test(token)) {
        type = 'operator';
      } else if (/^[;(){}]$/.test(token)) {
        type = 'punctuation';
      }
      return { value: token, type };
    });

    setTokens(newTokens);

    // Highlight tokens in source code
    let highlighted = sourceCode;
    let index = 0;

    setHighlightedCode(
      <div className="font-mono">
        {sourceCode.split('\n').map((line, lineIdx) => (
          <div key={lineIdx} className="whitespace-pre">
            {line
              .split(
                /(\bint\b|\bmain\b|\breturn\b|\b[a-zA-Z_][a-zA-Z0-9_]*\b|\d+|[=+;(){}]|\s+)/
              )
              .filter(Boolean)
              .map((part, partIdx) => {
                if (part.match(/^\s+$/)) {
                  return <span key={partIdx}>{part}</span>;
                }

                let className = '';
                if (/^int$|^main$|^return$/.test(part)) {
                  className = 'text-blue-600';
                } else if (
                  /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(part) &&
                  !/^int$|^main$|^return$/.test(part)
                ) {
                  className = 'text-green-600';
                } else if (/^\d+$/.test(part)) {
                  className = 'text-purple-600';
                } else if (/^[=+]$/.test(part)) {
                  className = 'text-red-600';
                } else if (/^[;(){}]$/.test(part)) {
                  className = 'text-yellow-600';
                }

                return className ? (
                  <span key={partIdx} className={className}>
                    {part}
                  </span>
                ) : (
                  <span key={partIdx}>{part}</span>
                );
              })}
          </div>
        ))}
      </div>
    );
  };

  const performSyntaxAnalysis = () => {
    // Create a simple AST structure based on the tokens
    const simplifiedAst = {
      type: 'Program',
      body: [
        {
          type: 'FunctionDeclaration',
          name: 'main',
          returnType: 'int',
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'VariableDeclaration',
                name: 'a',
                dataType: 'int',
                initializer: { type: 'NumericLiteral', value: 5 },
              },
              {
                type: 'VariableDeclaration',
                name: 'b',
                dataType: 'int',
                initializer: { type: 'NumericLiteral', value: 10 },
              },
              {
                type: 'VariableDeclaration',
                name: 'c',
                dataType: 'int',
                initializer: {
                  type: 'BinaryExpression',
                  operator: '+',
                  left: { type: 'Identifier', name: 'a' },
                  right: { type: 'Identifier', name: 'b' },
                },
              },
              {
                type: 'ReturnStatement',
                argument: { type: 'Identifier', name: 'c' },
              },
            ],
          },
        },
      ],
    };

    setAst(simplifiedAst);

    // Visual representation of AST
    setHighlightedCode(
      <div className="font-mono text-sm max-h-96 overflow-auto">
        <div className="flex justify-center">
          <AstNode node={simplifiedAst} />
        </div>
      </div>
    );
  };

  const performSemanticAnalysis = () => {
    // Perform semantic analysis (symbol table, type checking)
    const symbolTable = [
      { name: 'main', type: 'function', returnType: 'int' },
      { name: 'a', type: 'variable', dataType: 'int', scope: 'main', value: 5 },
      {
        name: 'b',
        type: 'variable',
        dataType: 'int',
        scope: 'main',
        value: 10,
      },
      {
        name: 'c',
        type: 'variable',
        dataType: 'int',
        scope: 'main',
        value: null,
        expression: 'a + b',
      },
    ];

    setSemanticInfo({ symbolTable });

    // Show semantic analysis results
    setHighlightedCode(
      <div className="font-mono max-h-96 overflow-auto">
        <h3 className="font-bold mb-2">Symbol Table</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Data Type</th>
              <th className="border border-gray-300 px-4 py-2">Scope</th>
              <th className="border border-gray-300 px-4 py-2">Value/Info</th>
            </tr>
          </thead>
          <tbody>
            {symbolTable.map((symbol, i) => (
              <tr key={i}>
                <td className="border border-gray-300 px-4 py-2">
                  {symbol.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {symbol.type}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {symbol.dataType || '-'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {symbol.scope || 'global'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {symbol.value !== undefined && symbol.value !== null
                    ? symbol.value
                    : symbol.expression || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="font-bold mt-4 mb-2">Type Checking</h3>
        <div className="bg-green-100 p-3 rounded">
          <p>All expressions have compatible types.</p>
          <p>✓ int a = 5; (int ← int literal)</p>
          <p>✓ int b = 10; (int ← int literal)</p>
          <p>✓ int c = a + b; (int ← int + int)</p>
          <p>✓ return c; (function returns int as declared)</p>
        </div>
      </div>
    );
  };

  const generateIntermediateCode = () => {
    // Generate three-address code as IR
    const ir = [
      { op: 'assignment', result: 'a', arg1: '5', arg2: null },
      { op: 'assignment', result: 'b', arg1: '10', arg2: null },
      { op: 'add', result: 't1', arg1: 'a', arg2: 'b' },
      { op: 'assignment', result: 'c', arg1: 't1', arg2: null },
      { op: 'return', result: null, arg1: 'c', arg2: null },
    ];

    setIrCode(ir);

    // Display IR code
    setHighlightedCode(
      <div className="font-mono max-h-96 overflow-auto">
        <h3 className="font-bold mb-2">
          Three-Address Intermediate Representation
        </h3>
        <div className="bg-gray-50 p-4 rounded">
          {ir.map((instr, i) => (
            <div key={i} className="mb-1">
              {i + 1}: {formatIrInstruction(instr)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const performOptimization = () => {
    // Perform some simple optimizations
    const optimizations = [
      {
        type: 'Constant Folding',
        description: 'Pre-computing constant expressions',
      },
      {
        type: 'Dead Code Elimination',
        description: 'Removing unused variables or unreachable code',
      },
      {
        type: 'Copy Propagation',
        description: 'Replacing variables with their values when possible',
      },
    ];

    // Show optimization process
    const optimized = [
      { op: 'assignment', result: 'a', arg1: '5', arg2: null },
      { op: 'assignment', result: 'b', arg1: '10', arg2: null },
      // Constant folding: a + b → 15
      {
        op: 'assignment',
        result: 'c',
        arg1: '15',
        arg2: null,
        optimized: true,
        optimization: 'Constant Folding',
      },
      {
        op: 'return',
        result: null,
        arg1: '15',
        arg2: null,
        optimized: true,
        optimization: 'Copy Propagation',
      },
    ];

    setOptimizedIr(optimized);

    setHighlightedCode(
      <div className="font-mono max-h-96 overflow-auto">
        <h3 className="font-bold mb-2">
          Optimized Intermediate Representation
        </h3>
        <div className="bg-gray-50 p-4 rounded">
          {optimized.map((instr, i) => (
            <div
              key={i}
              className={`mb-1 ${instr.optimized ? 'bg-yellow-100 p-1 rounded' : ''}`}
            >
              {i + 1}: {formatIrInstruction(instr)}
              {instr.optimized && (
                <span className="text-green-600 ml-2">
                  ← {instr.optimization}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const generateMachineCode = () => {
    // Generate pseudo-assembly code
    const assembly = [
      { instruction: '.text', comment: 'Code section' },
      { instruction: '.global main', comment: 'Export main symbol' },
      { instruction: 'main:', comment: 'Function entry point' },
      {
        instruction: '  push {fp, lr}',
        comment: 'Save frame pointer and link register',
      },
      { instruction: '  mov fp, sp', comment: 'Set up frame pointer' },
      {
        instruction: '  sub sp, sp, #12',
        comment: 'Allocate space for variables',
      },
      { instruction: '  mov r0, #5', comment: 'Load immediate value 5' },
      {
        instruction: '  str r0, [fp, #-4]',
        comment: 'Store value in variable a',
      },
      { instruction: '  mov r0, #10', comment: 'Load immediate value 10' },
      {
        instruction: '  str r0, [fp, #-8]',
        comment: 'Store value in variable b',
      },
      {
        instruction: '  mov r0, #15',
        comment: 'Load immediate value 15 (optimized a+b)',
      },
      {
        instruction: '  str r0, [fp, #-12]',
        comment: 'Store value in variable c',
      },
      {
        instruction: '  mov r0, #15',
        comment: 'Load return value (optimized)',
      },
      { instruction: '  mov sp, fp', comment: 'Restore stack pointer' },
      { instruction: '  pop {fp, pc}', comment: 'Return from function' },
    ];

    setMachineCode(assembly);

    setHighlightedCode(
      <div className="font-mono max-h-96 overflow-auto">
        <h3 className="font-bold mb-2">Assembly Code (ARM)</h3>
        <div className="bg-gray-50 p-4 rounded">
          {assembly.map((line, i) => (
            <div key={i} className="mb-1">
              <span className="mr-2">{line.instruction}</span>
              {line.comment && (
                <span className="text-gray-500">; {line.comment}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const performLinking = () => {
    // Simulate object file and linking
    const objectFile = {
      name: 'main.o',
      symbols: ['main'],
      size: '120 bytes',
      sections: [
        { name: '.text', size: '68 bytes', content: 'Code section' },
        { name: '.data', size: '0 bytes', content: 'Initialized data' },
        { name: '.bss', size: '12 bytes', content: 'Uninitialized data' },
      ],
    };

    const libraries = [
      { name: 'libc.so', provides: ['printf', 'scanf', 'malloc', 'free'] },
    ];

    const executable = {
      name: 'program',
      size: '8.2 KB',
      entryPoint: '0x00010000',
      segments: [
        { name: '.text', startAddr: '0x00010000', size: '4.1 KB' },
        { name: '.data', startAddr: '0x00020000', size: '1.1 KB' },
        { name: '.bss', startAddr: '0x00030000', size: '3.0 KB' },
      ],
    };

    setExecutable(executable);

    setHighlightedCode(
      <div className="max-h-96 overflow-auto">
        <div className="mb-4">
          <h3 className="font-bold mb-2">Object File</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p>
              <span className="font-bold">Filename:</span> {objectFile.name}
            </p>
            <p>
              <span className="font-bold">Size:</span> {objectFile.size}
            </p>
            <p>
              <span className="font-bold">Exported Symbols:</span>{' '}
              {objectFile.symbols.join(', ')}
            </p>

            <div className="mt-2">
              <p className="font-bold">Sections:</p>
              <ul className="list-disc ml-5">
                {objectFile.sections.map((section, i) => (
                  <li key={i}>
                    {section.name} ({section.size}) - {section.content}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-4 font-bold">Linking Process</div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="flex justify-center items-center my-4">
            <div className="bg-blue-100 p-3 rounded border border-blue-200 text-center mr-4">
              <div className="font-bold mb-1">main.o</div>
              <div className="text-sm">Object File</div>
            </div>
            <div className="text-2xl mx-2">+</div>
            <div className="bg-green-100 p-3 rounded border border-green-200 text-center mr-4">
              <div className="font-bold mb-1">Runtime Library</div>
              <div className="text-sm">C Standard Library</div>
            </div>
            <div className="text-2xl mx-2">→</div>
            <div className="bg-purple-100 p-3 rounded border border-purple-200 text-center">
              <div className="font-bold mb-1">program</div>
              <div className="text-sm">Executable</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-2">Final Executable</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p>
              <span className="font-bold">Filename:</span> {executable.name}
            </p>
            <p>
              <span className="font-bold">Size:</span> {executable.size}
            </p>
            <p>
              <span className="font-bold">Entry Point:</span>{' '}
              {executable.entryPoint}
            </p>

            <div className="mt-2">
              <p className="font-bold">Memory Layout:</p>
              <ul className="list-disc ml-5">
                {executable.segments.map((segment, i) => (
                  <li key={i}>
                    {segment.name}: {segment.startAddr} - {segment.size}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 bg-green-100 p-2 rounded text-center">
              <p className="font-bold">Program Ready for Execution!</p>
              <p className="text-sm">
                The operating system can now load and run this program
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const formatIrInstruction = (instr) => {
    switch (instr.op) {
      case 'assignment':
        return `${instr.result} = ${instr.arg1}`;
      case 'add':
        return `${instr.result} = ${instr.arg1} + ${instr.arg2}`;
      case 'sub':
        return `${instr.result} = ${instr.arg1} - ${instr.arg2}`;
      case 'mul':
        return `${instr.result} = ${instr.arg1} * ${instr.arg2}`;
      case 'div':
        return `${instr.result} = ${instr.arg1} / ${instr.arg2}`;
      case 'return':
        return `return ${instr.arg1}`;
      default:
        return `${instr.op} ${instr.result || ''} ${instr.arg1 || ''} ${instr.arg2 || ''}`;
    }
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setActiveStage(0);
    setIsPlaying(false);
  };

  const handleSourceCodeChange = (e) => {
    setSourceCode(e.target.value);
  };

  const handleSpeedChange = (e) => {
    setSpeed(parseInt(e.target.value));
  };

  const handleStageChange = (index) => {
    setActiveStage(index);
    setIsPlaying(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">
        Interactive Compiler Simulator
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center mb-4 bg-gray-100 p-4 rounded">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePlay}
            className={`px-4 py-2 rounded ${isPlaying ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
          >
            Reset
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span>Speed:</span>
          <input
            type="range"
            min="1"
            max="5"
            value={speed}
            onChange={handleSpeedChange}
            className="w-24"
          />
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex mb-6 overflow-x-auto py-2">
        {stages.map((stage, index) => (
          <div
            key={index}
            onClick={() => handleStageChange(index)}
            className={`flex-none cursor-pointer px-4 py-2 mx-1 rounded text-center transition-colors duration-200 min-w-fit
              ${
                activeStage === index
                  ? 'bg-blue-500 text-white'
                  : activeStage > index
                    ? 'bg-blue-200'
                    : 'bg-gray-200'
              }`}
          >
            <div className="font-bold">{stage.name}</div>
            <div className="text-xs">{stage.description}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        {/* Input Area */}
        <div className="border rounded p-4 flex flex-col">
          <h2 className="text-lg font-bold mb-2">Source Code</h2>
          <textarea
            value={sourceCode}
            onChange={handleSourceCodeChange}
            className="font-mono p-2 border rounded flex-grow"
            disabled={activeStage !== 0}
          />
        </div>

        {/* Output Area */}
        <div className="border rounded p-4 flex flex-col">
          <h2 className="text-lg font-bold mb-2">
            {stages[activeStage].name} Output
          </h2>
          <div className="bg-white p-3 border rounded flex-grow overflow-auto">
            {highlightedCode}
          </div>
        </div>
      </div>

      {/* Stage Explanation */}
      <div className="mt-4 bg-blue-50 p-4 rounded">
        <h3 className="font-bold">{stages[activeStage].name}</h3>
        <p>{getStageExplanation(activeStage)}</p>
      </div>
    </div>
  );
};

// AST Node visualization component
const AstNode = ({ node }) => {
  if (!node) return null;

  const nodeColors = {
    Program: 'bg-blue-100',
    FunctionDeclaration: 'bg-green-100',
    BlockStatement: 'bg-yellow-100',
    VariableDeclaration: 'bg-purple-100',
    BinaryExpression: 'bg-red-100',
    Identifier: 'bg-indigo-100',
    NumericLiteral: 'bg-pink-100',
    ReturnStatement: 'bg-cyan-100',
  };

  // Render different node types
  const renderNodeContent = () => {
    switch (node.type) {
      case 'Program':
        return <span>Program</span>;
      case 'FunctionDeclaration':
        return (
          <span>
            {node.returnType} {node.name}()
          </span>
        );
      case 'BlockStatement':
        return <span>Block</span>;
      case 'VariableDeclaration':
        return (
          <span>
            {node.dataType} {node.name}
          </span>
        );
      case 'BinaryExpression':
        return <span>{node.operator}</span>;
      case 'Identifier':
        return <span>{node.name}</span>;
      case 'NumericLiteral':
        return <span>{node.value}</span>;
      case 'ReturnStatement':
        return <span>return</span>;
      default:
        return <span>{node.type}</span>;
    }
  };

  // Calculate children based on node type
  const getChildren = () => {
    switch (node.type) {
      case 'Program':
        return node.body || [];
      case 'FunctionDeclaration':
        return node.body ? [node.body] : [];
      case 'BlockStatement':
        return node.body || [];
      case 'VariableDeclaration':
        return node.initializer ? [node.initializer] : [];
      case 'BinaryExpression':
        return [node.left, node.right].filter(Boolean);
      case 'ReturnStatement':
        return node.argument ? [node.argument] : [];
      default:
        return [];
    }
  };

  const children = getChildren();

  return (
    <div className="flex flex-col items-center">
      <div
        className={`${nodeColors[node.type] || 'bg-gray-100'} p-2 rounded-lg border border-gray-300 mb-2 text-center min-w-20`}
      >
        {renderNodeContent()}
      </div>

      {children.length > 0 && (
        <>
          <div className="w-px h-4 bg-gray-400"></div>
          <div className="flex">
            {children.map((child, index) => (
              <div key={index} className="flex flex-col items-center">
                {index > 0 && <div className="w-4"></div>}
                <AstNode node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Explanations for each stage
const getStageExplanation = (stage) => {
  const explanations = [
    "This is the original source code written in a high-level programming language. In this case, it's a simple C program that adds two numbers and returns the result.",

    'During lexical analysis (tokenization), the compiler reads the source code character by character and groups them into meaningful units called tokens. Each token represents a syntactic element like a keyword, identifier, operator, or punctuation mark.',

    'Syntax analysis (parsing) constructs an Abstract Syntax Tree (AST) from the tokens. The AST represents the hierarchical structure of the program and verifies that the code follows the grammar rules of the language.',

    'Semantic analysis examines the AST to ensure the code makes logical sense. It checks for type compatibility, scope rules, and builds a symbol table to track identifiers and their properties.',

    'Intermediate code generation translates the AST into a simpler, platform-independent representation. Three-address code is a common form of intermediate representation, where each instruction has at most three operands.',

    'Optimization improves the efficiency of the intermediate code by applying various techniques. This may include constant folding, dead code elimination, loop optimization, and more sophisticated transformations.',

    'Code generation converts the optimized intermediate code into machine code specific to the target architecture. This typically produces assembly language instructions that the processor can directly execute.',

    'Linking combines object files (compiled code) with necessary libraries to create the final executable program. It resolves references between different code modules and sets up the memory layout.',
  ];

  return explanations[stage] || '';
};

export default CompilerSimulator;
