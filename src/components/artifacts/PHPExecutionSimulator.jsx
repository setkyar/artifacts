import React, { useState, useEffect } from 'react';
import _ from 'lodash';

const PHPExecutionSimulator = () => {
  const [code, setCode] = useState('<?php\n// Try editing this code\n$name = "World";\necho "Hello, " . $name . "!";\n\n// Or try a loop\nfor ($i = 0; $i < 3; $i++) {\n    echo "\\nLoop iteration: " . $i;\n}\n?>');
  const [output, setOutput] = useState('');
  const [variables, setVariables] = useState({});
  const [executionStack, setExecutionStack] = useState([]);
  const [executionStep, setExecutionStep] = useState(0);
  const [executionSpeed, setExecutionSpeed] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);
  const [executionPhase, setExecutionPhase] = useState('idle');
  const [executionSteps, setExecutionSteps] = useState([]);
  const [opcodes, setOpcodes] = useState([]);
  const [currentLineHighlight, setCurrentLineHighlight] = useState(null);
  
  // Parse PHP code and generate execution steps
  const parseCode = (phpCode) => {
    const lines = phpCode.split('\n');
    const steps = [];
    const localOpcodes = [];
    let insidePhpBlock = false;
    let lineNum = 0;
    
    lines.forEach((line, index) => {
      lineNum = index + 1;
      const trimmedLine = line.trim();
      
      // Check for PHP opening/closing tags
      if (trimmedLine.includes('<?php')) {
        insidePhpBlock = true;
        steps.push({
          phase: 'parsing',
          description: `Found PHP opening tag at line ${lineNum}`,
          line: lineNum,
          code: line
        });
        return;
      }
      
      if (trimmedLine.includes('?>')) {
        insidePhpBlock = false;
        steps.push({
          phase: 'parsing',
          description: `Found PHP closing tag at line ${lineNum}`,
          line: lineNum,
          code: line
        });
        return;
      }
      
      if (!insidePhpBlock || trimmedLine === '' || trimmedLine.startsWith('//')) {
        if (trimmedLine.startsWith('//')) {
          steps.push({
            phase: 'parsing',
            description: `Skipping comment at line ${lineNum}`,
            line: lineNum,
            code: line
          });
        }
        return;
      }
      
      // Process PHP code
      if (trimmedLine.startsWith('echo ')) {
        const echoContent = trimmedLine.substring(5, trimmedLine.length - 1);
        steps.push({
          phase: 'parsing',
          description: `Parsing echo statement at line ${lineNum}`,
          line: lineNum,
          code: line
        });
        
        localOpcodes.push({
          op: 'ECHO',
          arg: echoContent,
          line: lineNum
        });
        
        steps.push({
          phase: 'execution',
          description: `Executing echo statement with content: ${echoContent}`,
          line: lineNum,
          code: line,
          output: `Outputs: ${echoContent.replace(/"/g, '')}`
        });
      } else if (trimmedLine.match(/^\$[a-zA-Z0-9_]+ = .+;$/)) {
        // Variable assignment
        const parts = trimmedLine.split('=');
        const varName = parts[0].trim();
        const varValue = parts[1].trim().slice(0, -1); // Remove the semicolon
        
        steps.push({
          phase: 'parsing',
          description: `Parsing variable assignment at line ${lineNum}`,
          line: lineNum,
          code: line
        });
        
        localOpcodes.push({
          op: 'ASSIGN',
          arg: {
            name: varName,
            value: varValue
          },
          line: lineNum
        });
        
        steps.push({
          phase: 'execution',
          description: `Assigning value ${varValue} to variable ${varName}`,
          line: lineNum,
          code: line,
          varName: varName,
          varValue: varValue.replace(/"/g, '')
        });
      } else if (trimmedLine.startsWith('for ')) {
        // Simple for loop parsing
        const forMatch = trimmedLine.match(/for \(\$([a-zA-Z0-9_]+) = ([0-9]+); \$[a-zA-Z0-9_]+ < ([0-9]+); \$[a-zA-Z0-9_]+\+\+\) {/);
        
        if (forMatch) {
          const loopVar = forMatch[1];
          const startVal = parseInt(forMatch[2]);
          const endVal = parseInt(forMatch[3]);
          
          steps.push({
            phase: 'parsing',
            description: `Parsing for loop at line ${lineNum}`,
            line: lineNum,
            code: line
          });
          
          localOpcodes.push({
            op: 'FOR_INIT',
            arg: {
              loopVar: `$${loopVar}`,
              startVal: startVal,
              endVal: endVal
            },
            line: lineNum
          });
          
          // Initialize the loop
          steps.push({
            phase: 'execution',
            description: `Initializing for loop: $${loopVar} = ${startVal}`,
            line: lineNum,
            code: line,
            varName: `$${loopVar}`,
            varValue: startVal
          });
          
          // Simulate loop iterations (limited for simplicity)
          for (let i = startVal; i < endVal; i++) {
            steps.push({
              phase: 'execution',
              description: `Loop iteration with $${loopVar} = ${i}`,
              line: lineNum + 1,
              code: `    // Inside loop body with $${loopVar} = ${i}`,
              varName: `$${loopVar}`,
              varValue: i
            });
            
            // Find statements inside the loop block
            let blockDepth = 1;
            let currentLine = lineNum + 1;
            
            while (blockDepth > 0 && currentLine < lines.length) {
              const loopLine = lines[currentLine].trim();
              
              if (loopLine.includes('{')) blockDepth++;
              if (loopLine.includes('}')) blockDepth--;
              
              if (blockDepth > 0 && loopLine.startsWith('echo ')) {
                const echoContent = loopLine.substring(5, loopLine.length - 1);
                
                // Replace any instances of the loop variable
                const replacedContent = echoContent.replace(new RegExp(`\\$${loopVar}`, 'g'), i);
                
                steps.push({
                  phase: 'execution',
                  description: `Loop body: Executing echo with $${loopVar} = ${i}`,
                  line: currentLine + 1,
                  code: lines[currentLine],
                  output: `Outputs: ${replacedContent.replace(/"/g, '').replace(/\\\\/g, '\\')}`
                });
              }
              
              currentLine++;
            }
            
            // Increment loop variable
            steps.push({
              phase: 'execution',
              description: `Incrementing $${loopVar} from ${i} to ${i+1}`,
              line: lineNum,
              code: line,
              varName: `$${loopVar}`,
              varValue: i+1
            });
          }
          
          // End of loop
          steps.push({
            phase: 'execution',
            description: `Loop condition $${loopVar} < ${endVal} is false, exiting loop`,
            line: lineNum,
            code: line
          });
        }
      } else if (trimmedLine === '}') {
        steps.push({
          phase: 'parsing',
          description: `Found closing brace at line ${lineNum}`,
          line: lineNum,
          code: line
        });
      } else {
        steps.push({
          phase: 'parsing',
          description: `Parsing line ${lineNum}`,
          line: lineNum,
          code: line
        });
      }
    });
    
    return { steps, opcodes: localOpcodes };
  };
  
  // Run the code simulation
  const runCode = () => {
    setIsRunning(true);
    setExecutionPhase('lexing');
    setOutput('');
    setVariables({});
    setExecutionStack([]);
    
    // Parse the code
    setTimeout(() => {
      setExecutionPhase('parsing');
      setTimeout(() => {
        const { steps, opcodes: localOpcodes } = parseCode(code);
        setExecutionSteps(steps);
        setOpcodes(localOpcodes);
        
        setExecutionPhase('compilation');
        setTimeout(() => {
          setExecutionPhase('execution');
          
          // Start execution simulation
          setExecutionStep(0);
          simulateExecution(steps, 0);
        }, executionSpeed);
      }, executionSpeed);
    }, executionSpeed);
  };
  
  // Simulate execution step by step
  const simulateExecution = (steps, currentStep) => {
    if (currentStep >= steps.length) {
      setExecutionPhase('completed');
      setIsRunning(false);
      setCurrentLineHighlight(null);
      return;
    }
    
    const step = steps[currentStep];
    setCurrentLineHighlight(step.line);
    
    // Update execution state based on the current step
    setExecutionStep(currentStep);
    
    if (step.phase === 'execution') {
      if (step.varName && step.varValue !== undefined) {
        // Update variables
        setVariables(prevVars => ({
          ...prevVars,
          [step.varName]: step.varValue
        }));
      }
      
      if (step.output) {
        // Update output
        setOutput(prevOutput => prevOutput + (prevOutput ? '\n' : '') + step.output.substring(9));
      }
    }
    
    // Move to next step after delay
    setTimeout(() => {
      simulateExecution(steps, currentStep + 1);
    }, executionSpeed);
  };
  
  // Reset the simulation
  const resetSimulation = () => {
    setExecutionPhase('idle');
    setOutput('');
    setVariables({});
    setExecutionStack([]);
    setExecutionStep(0);
    setIsRunning(false);
    setCurrentLineHighlight(null);
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">PHP Code Execution Simulator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Section */}
        <div>
          <div className="mb-2 flex justify-between items-center">
            <h2 className="text-lg font-semibold">PHP Code</h2>
            <div>
              <label className="mr-2 text-sm">Execution Speed:</label>
              <select 
                value={executionSpeed} 
                onChange={(e) => setExecutionSpeed(parseInt(e.target.value))}
                className="border rounded p-1 text-sm"
                disabled={isRunning}
              >
                <option value="2000">Slow</option>
                <option value="1000">Medium</option>
                <option value="500">Fast</option>
              </select>
            </div>
          </div>
          
          <div className="relative border rounded bg-gray-900 text-white font-mono text-sm">
            <textarea
              className="w-full h-64 p-4 bg-transparent outline-none resize-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isRunning}
            />
            
            {currentLineHighlight && (
              <div 
                className="absolute left-0 right-0 h-6 bg-yellow-500 bg-opacity-30"
                style={{ 
                  top: `${(currentLineHighlight - 1) * 1.5}rem`, 
                  pointerEvents: 'none'
                }}
              />
            )}
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              onClick={runCode}
              disabled={isRunning}
            >
              Run
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400"
              onClick={resetSimulation}
              disabled={isRunning}
            >
              Reset
            </button>
          </div>
        </div>
        
        {/* Execution and Output Section */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Execution Process</h2>
            <div className="flex mb-4">
              {['lexing', 'parsing', 'compilation', 'execution', 'completed'].map((phase) => (
                <div 
                  key={phase}
                  className={`flex-1 py-2 px-1 text-center text-xs capitalize border-b-4 ${executionPhase === phase ? 'border-blue-500 font-bold' : 'border-gray-300'}`}
                >
                  {phase}
                </div>
              ))}
            </div>
            
            <div className="border rounded p-4 h-32 overflow-y-auto bg-gray-100">
              {executionStep === 0 && executionPhase === 'idle' && (
                <div className="text-gray-500">Execution details will appear here</div>
              )}
              
              {executionPhase === 'lexing' && (
                <div className="text-blue-600">
                  <p>Lexical Analysis (Lexing):</p>
                  <p>Breaking PHP code into tokens like keywords, identifiers, operators...</p>
                </div>
              )}
              
              {executionPhase === 'parsing' && (
                <div className="text-green-600">
                  <p>Syntax Analysis (Parsing):</p>
                  <p>Organizing tokens into an Abstract Syntax Tree (AST)</p>
                </div>
              )}
              
              {executionPhase === 'compilation' && (
                <div className="text-purple-600">
                  <p>Compilation to Opcode:</p>
                  <p>Converting AST to Zend Virtual Machine opcodes</p>
                  <div className="mt-2 text-xs border-t pt-1">
                    {opcodes.map((op, idx) => (
                      <div key={idx} className="font-mono">
                        {op.op} {JSON.stringify(op.arg)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {executionPhase === 'execution' && executionStep > 0 && (
                <div className="text-orange-600">
                  <p><strong>Current step:</strong></p>
                  <p>{executionSteps[executionStep]?.description}</p>
                </div>
              )}
              
              {executionPhase === 'completed' && (
                <div className="text-blue-600">
                  <p>Execution completed successfully!</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Variables</h2>
              <div className="border rounded p-4 h-32 overflow-y-auto bg-white">
                {Object.keys(variables).length === 0 ? (
                  <div className="text-gray-500">No variables defined yet</div>
                ) : (
                  <div className="font-mono text-sm">
                    {Object.entries(variables).map(([name, value]) => (
                      <div key={name} className="mb-1">
                        <span className="text-green-600">{name}</span> = <span className="text-blue-600">{typeof value === 'string' ? `"${value}"` : value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Output</h2>
              <div className="border rounded p-4 h-32 overflow-y-auto bg-white font-mono">
                {output ? (
                  <pre className="whitespace-pre-wrap text-sm">{output}</pre>
                ) : (
                  <div className="text-gray-500">No output generated yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-600">
        <h3 className="font-semibold">How PHP Execution Works:</h3>
        <ul className="list-disc pl-5 mt-2">
          <li><strong>Lexical Analysis (Lexing):</strong> PHP code is broken down into tokens</li>
          <li><strong>Syntax Analysis (Parsing):</strong> Tokens are organized into an Abstract Syntax Tree (AST)</li>
          <li><strong>Compilation:</strong> AST is converted to bytecode (opcodes) for the Zend Virtual Machine</li>
          <li><strong>Execution:</strong> The Zend Engine executes the opcodes, handling variables, functions, and output</li>
        </ul>
        <p className="mt-2"><strong>Note:</strong> This is a simplified simulation. Real PHP execution includes more complex processes like autoloading, module initialization, and memory management.</p>
      </div>
    </div>
  );
};

export default PHPExecutionSimulator;