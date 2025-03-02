import React, { useState, useEffect } from 'react';

const AgentSimulator = () => {
  // State for simulation
  const [activeArchitecture, setActiveArchitecture] = useState('augmented-llm');
  const [simulationStep, setSimulationStep] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState(1500); // milliseconds
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInput, setUserInput] = useState('Help me find the latest sales data and analyze the Q4 performance');
  const [simulationResult, setSimulationResult] = useState('');
  
  // Simulation logic
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setTimeout(() => {
        const maxSteps = getMaxSteps();
        if (simulationStep < maxSteps) {
          setSimulationStep(simulationStep + 1);
        } else {
          setIsPlaying(false);
        }
      }, simulationSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, simulationStep, simulationSpeed]);
  
  const getMaxSteps = () => {
    switch (activeArchitecture) {
      case 'augmented-llm': return 3;
      case 'prompt-chaining': return 5;
      case 'routing': return 4;
      case 'parallelization': return 4;
      case 'orchestrator-workers': return 6;
      case 'evaluator-optimizer': return 7;
      case 'autonomous-agent': return 8;
      default: return 4;
    }
  };
  
  const resetSimulation = () => {
    setSimulationStep(0);
    setIsPlaying(false);
    setSimulationResult('');
  };
  
  const togglePlayPause = () => {
    if (simulationStep >= getMaxSteps()) {
      resetSimulation();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleArchitectureChange = (architecture) => {
    setActiveArchitecture(architecture);
    resetSimulation();
  };
  
  // Visualization components for each architecture
  
  const AugmentedLLM = () => {
    const steps = [
      { id: 1, text: 'User sends query to LLM' },
      { id: 2, text: 'LLM processes query, accessing tools (retrieval, memory) as needed' },
      { id: 3, text: 'LLM provides a complete response' },
    ];
    
    const results = [
      '',
      'Accessing sales database and retrieving Q4 data...',
      'Analysis complete: Q4 sales were 12% higher than Q3, with strongest performance in December. Top performing products were...'
    ];
    
    useEffect(() => {
      if (simulationStep > 0) {
        setSimulationResult(results[simulationStep]);
      }
    }, [simulationStep]);
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Augmented LLM</h3>
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-2xl">
            {/* Diagram */}
            <div className="flex items-center justify-between mb-4">
              <div className={`rounded-full w-16 h-16 flex items-center justify-center ${simulationStep > 0 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
                <span>Input</span>
              </div>
              <div className={`h-1 flex-grow mx-2 ${simulationStep > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`rounded-lg w-24 h-24 flex items-center justify-center ${simulationStep > 0 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                <div className="text-center">
                  <div>LLM</div>
                  {simulationStep > 0 && simulationStep < 3 && 
                    <div className="text-xs mt-1 text-green-600">Processing...</div>
                  }
                </div>
              </div>
              <div className={`h-1 flex-grow mx-2 ${simulationStep > 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`rounded-full w-16 h-16 flex items-center justify-center ${simulationStep > 2 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
                <span>Output</span>
              </div>
            </div>
            
            {/* Tools */}
            <div className="flex justify-center space-x-6 mt-4">
              <div className={`p-3 rounded border ${simulationStep > 1 ? 'bg-purple-100 border-purple-500' : 'bg-gray-100 border-gray-300'}`}>
                <div className="text-sm text-center">Retrieval</div>
                {simulationStep === 2 && <div className="text-xs mt-1 text-purple-600">Sales Database</div>}
              </div>
              <div className={`p-3 rounded border ${simulationStep > 1 ? 'bg-purple-100 border-purple-500' : 'bg-gray-100 border-gray-300'}`}>
                <div className="text-sm text-center">Tools</div>
                {simulationStep === 2 && <div className="text-xs mt-1 text-purple-600">Analysis Tool</div>}
              </div>
              <div className={`p-3 rounded border ${simulationStep > 1 ? 'bg-purple-100 border-purple-500' : 'bg-gray-100 border-gray-300'}`}>
                <div className="text-sm text-center">Memory</div>
                {simulationStep === 2 && <div className="text-xs mt-1 text-purple-600">Previous Reports</div>}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t pt-3">
          <div className="text-sm font-semibold">Current Step:</div>
          <div className="mt-1">{simulationStep > 0 ? steps[simulationStep - 1].text : "Ready to start"}</div>
        </div>
      </div>
    );
  };
  
  const PromptChaining = () => {
    const steps = [
      { id: 1, text: 'User sends query to first LLM in chain' },
      { id: 2, text: 'LLM 1 processes query and breaks down the task' },
      { id: 3, text: 'Output from LLM 1 is verified by gate function' },
      { id: 4, text: 'LLM 2 retrieves and processes sales data' },
      { id: 5, text: 'LLM 3 performs analysis and delivers final output' },
    ];
    
    const results = [
      '',
      'Breaking down the task into subtasks: 1) Retrieve sales data 2) Analyze Q4 performance',
      'Task breakdown verified and approved. Proceeding to data retrieval.',
      'Retrieved sales data for Q4: October, November, December figures collected.',
      'Analysis complete: Q4 sales were 12% higher than Q3, with strongest performance in December. Top performing products were...'
    ];
    
    useEffect(() => {
      if (simulationStep > 0) {
        setSimulationResult(results[simulationStep]);
      }
    }, [simulationStep]);
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Prompt Chaining</h3>
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-2xl">
            {/* Diagram */}
            <div className="flex items-center justify-start mb-4">
              <div className={`rounded-full w-16 h-16 flex items-center justify-center ${simulationStep > 0 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
                <span>Input</span>
              </div>
              <div className={`h-1 w-10 mx-2 ${simulationStep > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`rounded-lg w-20 h-20 flex items-center justify-center ${simulationStep >= 1 && simulationStep < 3 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                <div className="text-center">
                  <div className="text-sm">LLM 1</div>
                  {simulationStep === 1 && 
                    <div className="text-xs mt-1 text-green-600">Planning</div>
                  }
                </div>
              </div>
              <div className={`h-1 w-10 mx-2 ${simulationStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`rounded-lg w-20 h-20 flex items-center justify-center ${simulationStep === 2 ? 'bg-yellow-100 border-2 border-yellow-500' : 'bg-gray-100'}`}>
                <div className="text-center">
                  <div className="text-sm">Gate</div>
                  {simulationStep === 2 && 
                    <div className="text-xs mt-1 text-yellow-600">Validating</div>
                  }
                </div>
              </div>
              <div className={`h-1 w-10 mx-2 ${simulationStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`rounded-lg w-20 h-20 flex items-center justify-center ${simulationStep >= 3 && simulationStep < 4 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                <div className="text-center">
                  <div className="text-sm">LLM 2</div>
                  {simulationStep === 3 && 
                    <div className="text-xs mt-1 text-green-600">Retrieving</div>
                  }
                </div>
              </div>
              <div className={`h-1 w-10 mx-2 ${simulationStep >= 4 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`rounded-lg w-20 h-20 flex items-center justify-center ${simulationStep >= 4 && simulationStep < 5 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                <div className="text-center">
                  <div className="text-sm">LLM 3</div>
                  {simulationStep === 4 && 
                    <div className="text-xs mt-1 text-green-600">Analyzing</div>
                  }
                </div>
              </div>
              <div className={`h-1 w-10 mx-2 ${simulationStep >= 5 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`rounded-full w-16 h-16 flex items-center justify-center ${simulationStep >= 5 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
                <span>Output</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t pt-3">
          <div className="text-sm font-semibold">Current Step:</div>
          <div className="mt-1">{simulationStep > 0 ? steps[simulationStep - 1].text : "Ready to start"}</div>
        </div>
      </div>
    );
  };
  
  const Routing = () => {
    const steps = [
      { id: 1, text: 'User sends query to router LLM' },
      { id: 2, text: 'Router LLM classifies the query and decides which specialist to use' },
      { id: 3, text: 'Query is routed to the data analysis specialist LLM' },
      { id: 4, text: 'Specialist LLM processes the query and provides response' },
    ];
    
    const results = [
      '',
      'Classifying query: This is a data analysis task requiring access to sales database.',
      'Routing to Data Analysis Specialist LLM with specialized knowledge of sales metrics and reporting.',
      'Analysis complete: Q4 sales were 12% higher than Q3, with strongest performance in December. Top performing products were...'
    ];
    
    useEffect(() => {
      if (simulationStep > 0) {
        setSimulationResult(results[simulationStep]);
      }
    }, [simulationStep]);
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Routing</h3>
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-2xl">
            {/* Diagram */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className={`rounded-full w-16 h-16 flex items-center justify-center ${simulationStep > 0 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
                  <span>Input</span>
                </div>
                <div className={`h-1 w-20 mx-2 ${simulationStep > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className={`rounded-lg w-28 h-28 flex items-center justify-center ${simulationStep >= 1 && simulationStep < 3 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                  <div className="text-center">
                    <div>Router LLM</div>
                    {simulationStep === 1 && 
                      <div className="text-xs mt-1 text-green-600">Classifying</div>
                    }
                  </div>
                </div>
              </div>
              
              {/* Specialist LLMs */}
              <div className="flex justify-center mt-2">
                <div className="flex flex-col items-center">
                  <div className={`h-10 w-1 ${simulationStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <div className="flex space-x-10">
                    <div className="flex flex-col items-center">
                      <div className={`h-5 w-1 ${simulationStep === 2 && false ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                      <div className={`rounded-lg w-24 h-24 flex items-center justify-center bg-gray-100`}>
                        <div className="text-center">
                          <div className="text-sm">Customer<br/>Service LLM</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`h-5 w-1 ${simulationStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                      <div className={`rounded-lg w-24 h-24 flex items-center justify-center ${simulationStep >= 3 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                        <div className="text-center">
                          <div className="text-sm">Data Analysis<br/>LLM</div>
                          {simulationStep === 3 && 
                            <div className="text-xs mt-1 text-green-600">Processing</div>
                          }
                        </div>
                      </div>
                      <div className={`h-5 w-1 ${simulationStep >= 4 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                      <div className={`rounded-full w-16 h-16 flex items-center justify-center ${simulationStep >= 4 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
                        <span>Output</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`h-5 w-1 ${simulationStep === 2 && false ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                      <div className={`rounded-lg w-24 h-24 flex items-center justify-center bg-gray-100`}>
                        <div className="text-center">
                          <div className="text-sm">Technical<br/>Support LLM</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t pt-3">
          <div className="text-sm font-semibold">Current Step:</div>
          <div className="mt-1">{simulationStep > 0 ? steps[simulationStep - 1].text : "Ready to start"}</div>
        </div>
      </div>
    );
  };
  
  const Parallelization = () => {
    const steps = [
      { id: 1, text: 'User sends query for data analysis' },
      { id: 2, text: 'Multiple LLMs process different aspects of the task in parallel' },
      { id: 3, text: 'Results from all LLMs are collected by the aggregator' },
      { id: 4, text: 'Aggregator combines results into a comprehensive response' },
    ];
    
    const results = [
      '',
      'Processing in parallel:\nLLM 1: Retrieving raw sales figures\nLLM 2: Calculating growth metrics\nLLM 3: Identifying top products',
      'Individual results collected:\n- Raw Q4 sales: $2.45M\n- Growth: 12% quarter-over-quarter\n- Top products: ProductX, ProductY, ProductZ',
      'Analysis complete: Q4 sales were $2.45M, representing 12% growth over Q3. Top performing products were ProductX (27% of sales), ProductY (18%), and ProductZ (15%).'
    ];
    
    useEffect(() => {
      if (simulationStep > 0) {
        setSimulationResult(results[simulationStep]);
      }
    }, [simulationStep]);
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Parallelization</h3>
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-2xl">
            {/* Diagram */}
            <div className="flex items-start justify-center mb-4">
              <div className={`rounded-full w-16 h-16 flex items-center justify-center mt-20 ${simulationStep > 0 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
                <span>Input</span>
              </div>
              <div className="flex flex-col items-center mx-4">
                <div className={`h-1 w-16 ${simulationStep > 0 ? 'bg-blue-500' : 'bg-gray-300'}`} style={{marginTop: '58px'}}></div>
                <div className="flex space-x-4 mt-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-10 w-1 ${simulationStep >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className={`rounded-lg w-20 h-20 flex items-center justify-center ${simulationStep >= 1 && simulationStep < 3 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                      <div className="text-center">
                        <div className="text-sm">LLM 1</div>
                        {simulationStep === 1 && 
                          <div className="text-xs mt-1 text-green-600">Sales Data</div>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`h-10 w-1 ${simulationStep >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className={`rounded-lg w-20 h-20 flex items-center justify-center ${simulationStep >= 1 && simulationStep < 3 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                      <div className="text-center">
                        <div className="text-sm">LLM 2</div>
                        {simulationStep === 1 && 
                          <div className="text-xs mt-1 text-green-600">Growth</div>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`h-10 w-1 ${simulationStep >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className={`rounded-lg w-20 h-20 flex items-center justify-center ${simulationStep >= 1 && simulationStep < 3 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                      <div className="text-center">
                        <div className="text-sm">LLM 3</div>
                        {simulationStep === 1 && 
                          <div className="text-xs mt-1 text-green-600">Products</div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className={`h-10 w-1 ${simulationStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <div className={`h-10 w-1 ${simulationStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <div className={`h-10 w-1 ${simulationStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                </div>
                <div className={`rounded-lg w-28 h-16 flex items-center justify-center ${simulationStep >= 2 && simulationStep < 4 ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-100'}`}>
                  <div className="text-center">Aggregator</div>
                </div>
                <div className={`h-10 w-1 ${simulationStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className={`rounded-full w-16 h-16 flex items-center justify-center ${simulationStep >= 4 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
                  <span>Output</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t pt-3">
          <div className="text-sm font-semibold">Current Step:</div>
          <div className="mt-1">{simulationStep > 0 ? steps[simulationStep - 1].text : "Ready to start"}</div>
        </div>
      </div>
    );
  };
  
  const OrchestratorWorkers = () => {
    const steps = [
      { id: 1, text: 'User sends complex query to orchestrator LLM' },
      { id: 2, text: 'Orchestrator analyzes the task and breaks it into subtasks' },
      { id: 3, text: 'Subtasks are assigned to specialized worker LLMs' },
      { id: 4, text: 'Worker LLMs execute their specialized subtasks' },
      { id: 5, text: 'Results are returned to the synthesizer' },
      { id: 6, text: 'Synthesizer combines results into a coherent response' },
    ];
    
    const results = [
      '',
      'Analyzing task requirements: need sales data retrieval, metric calculation, and performance analysis',
      'Delegating subtasks:\nWorker 1: Access Q4 sales database\nWorker 2: Calculate growth metrics\nWorker 3: Analyze product performance',
      'Workers executing specialized tasks using their expertise and tools',
      'Gathering results from workers:\n- Raw sales data collected\n- Growth metrics calculated\n- Product performance analyzed',
      'Synthesizing final response: Q4 sales were 12% higher than Q3, with strongest performance in December. Top performing products were ProductX (27%), ProductY (18%), and ProductZ (15%).'
    ];
    
    useEffect(() => {
      if (simulationStep > 0) {
        setSimulationResult(results[simulationStep]);
      }
    }, [simulationStep]);
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Orchestrator-Workers</h3>
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-2xl">
            {/* Diagram */}
            <div className="flex items-start justify-center mb-4">
              <div className={`rounded-full w-16 h-16 flex items-center justify-center ${simulationStep > 0 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
                <span>Input</span>
              </div>
              <div className={`h-1 w-16 mx-2 ${simulationStep > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`rounded-lg w-28 h-28 flex items-center justify-center ${simulationStep >= 1 && simulationStep < 3 ? 'bg-yellow-100 border-2 border-yellow-500' : 'bg-gray-100'}`}>
                  <div className="text-center">
                    <div>Orchestrator</div>
                    {simulationStep === 1 && 
                      <div className="text-xs mt-1 text-yellow-600">Planning</div>
                    }
                  </div>
                </div>
                <div className="flex space-x-8 mt-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-1 ${simulationStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className={`rounded-lg w-20 h-20 flex items-center justify-center ${simulationStep >= 3 && simulationStep < 5 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                      <div className="text-center">
                        <div className="text-sm">Worker 1</div>
                        {simulationStep === 3 && 
                          <div className="text-xs mt-1 text-green-600">Sales Data</div>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-1 ${simulationStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className={`rounded-lg w-20 h-20 flex items-center justify-center ${simulationStep >= 3 && simulationStep < 5 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                      <div className="text-center">
                        <div className="text-sm">Worker 2</div>
                        {simulationStep === 3 && 
                          <div className="text-xs mt-1 text-green-600">Growth</div>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-1 ${simulationStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className={`rounded-lg w-20 h-20 flex items-center justify-center ${simulationStep >= 3 && simulationStep < 5 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                      <div className="text-center">
                        <div className="text-sm">Worker 3</div>
                        {simulationStep === 3 && 
                          <div className="text-xs mt-1 text-green-600">Products</div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-8">
                  <div className={`h-6 w-1 ${simulationStep >= 4 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <div className={`h-6 w-1 ${simulationStep >= 4 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <div className={`h-6 w-1 ${simulationStep >= 4 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                </div>
                <div className={`rounded-lg w-28 h-16 flex items-center justify-center ${simulationStep >= 4 && simulationStep < 6 ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-100'}`}>
                  <div className="text-center">Synthesizer</div>
                </div>
                <div className={`h-6 w-1 ${simulationStep >= 5 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className={`rounded-full w-16 h-16 flex items-center justify-center ${simulationStep >= 6 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
                  <span>Output</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t pt-3">
          <div className="text-sm font-semibold">Current Step:</div>
          <div className="mt-1">{simulationStep > 0 ? steps[simulationStep - 1].text : "Ready to start"}</div>
        </div>
      </div>
    );
  };
  
  const EvaluatorOptimizer = () => {
    const steps = [
      { id: 1, text: 'User sends query for data analysis' },
      { id: 2, text: 'Generator LLM produces initial analysis' },
      { id: 3, text: 'Evaluator LLM reviews the analysis' },
      { id: 4, text: 'Evaluator provides feedback on areas to improve' },
      { id: 5, text: 'Generator creates improved analysis based on feedback' },
      { id: 6, text: 'Evaluator approves the improved analysis' },
      { id: 7, text: 'Final optimized result is delivered to user' },
    ];
    
    const results = [
      '',
      'Initial analysis: Q4 sales were higher than Q3, with good performance in December.',
      'Evaluating analysis: Lacks specific metrics and product performance details.',
      'Feedback: The analysis needs quantitative growth figures, specific month-by-month comparisons, and top product identification.',
      'Improved analysis: Q4 sales were 12% higher than Q3. October +8%, November +10%, December +18%. Top products: ProductX, ProductY, ProductZ.',
      'Evaluation: Analysis now contains specific metrics and product information. Approved.',
      'Final analysis: Q4 sales were 12% higher than Q3, with month-by-month growth of October (+8%), November (+10%), and December (+18%). Top performing products were ProductX (27% of sales), ProductY (18%), and ProductZ (15%).'
    ];
    
    useEffect(() => {
      if (simulationStep > 0) {
        setSimulationResult(results[simulationStep]);
      }
    }, [simulationStep]);
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Evaluator-Optimizer</h3>
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-2xl">
            {/* Diagram */}
            <div className="flex items-center justify-center mb-4">
              <div className={`rounded-full w-16 h-16 flex items-center justify-center ${simulationStep > 0 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
                <span>Input</span>
              </div>
              <div className={`h-1 w-16 mx-2 ${simulationStep > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className="flex">
                <div className="flex flex-col items-center mr-6">
                  <div className={`rounded-lg w-28 h-28 flex items-center justify-center ${[1, 4].includes(simulationStep) ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                    <div className="text-center">
                      <div>Generator</div>
                      {simulationStep === 1 && 
                        <div className="text-xs mt-1 text-green-600">Creating</div>
                      }
                      {simulationStep === 4 && 
                        <div className="text-xs mt-1 text-green-600">Improving</div>
                      }
                    </div>
                  </div>
                  <div className={`h-8 w-1 ${simulationStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <div className="rotate-90 w-8 h-1 bg-blue-500" style={{display: simulationStep >= 2 ? 'block' : 'none'}}></div>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`rounded-lg w-28 h-28 flex items-center justify-center ${[2, 3, 5].includes(simulationStep) ? 'bg-yellow-100 border-2 border-yellow-500' : 'bg-gray-100'}`}>
                    <div className="text-center">
                      <div>Evaluator</div>
                      {simulationStep === 2 && 
                        <div className="text-xs mt-1 text-yellow-600">Reviewing</div>
                      }
                      {simulationStep === 3 && 
                        <div className="text-xs mt-1 text-yellow-600">Feedback</div>
                      }
                      {simulationStep === 5 && 
                        <div className="text-xs mt-1 text-yellow-600">Approving</div>
                      }
                    </div>
                  </div>
                  {simulationStep >= 3 && simulationStep < 5 && (
                    <div className="flex items-center">
                      <div className="h-8 w-1 bg-red-500"></div>
                      <div className="-rotate-90 w-8 h-1 bg-red-500"></div>
                    </div>
                  )}
                  {simulationStep >= 6 && (
                    <>
                      <div className="h-8 w-1 bg-blue-500"></div>
                      <div className={`rounded-full w-16 h-16 flex items-center justify-center ${simulationStep >= 7 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
                        <span>Output</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* Arrows for flow direction */}
            {simulationStep >= 2 && (
              <div className="text-blue-500 text-xs text-center">
                Flow: Initial analysis → Evaluation → Feedback → Improved analysis → Final approval
              </div>
            )}
          </div>
        </div>
        <div className="border-t pt-3">
          <div className="text-sm font-semibold">Current Step:</div>
          <div className="mt-1">{simulationStep > 0 ? steps[simulationStep - 1].text : "Ready to start"}</div>
        </div>
      </div>
    );
  };
  
  const AutonomousAgent = () => {
    const steps = [
      { id: 1, text: 'User provides task to autonomous agent' },
      { id: 2, text: 'Agent analyzes task and formulates initial plan' },
      { id: 3, text: 'Agent interacts with environment tools to gather sales data' },
      { id: 4, text: 'Agent receives feedback from environment' },
      { id: 5, text: 'Agent uses tools to analyze Q4 performance' },
      { id: 6, text: 'Agent receives analysis results from environment' },
      { id: 7, text: 'Agent synthesizes final response based on all gathered information' },
      { id: 8, text: 'Agent delivers comprehensive response to user' },
    ];
    
    const results = [
      '',
      'Analyzing task: Understand Q4 sales performance. Planning approach: 1) Retrieve data 2) Calculate metrics 3) Identify patterns',
      'Executing plan step 1: Accessing sales database to retrieve Q4 data using database query tool',
      'Environment feedback: Raw sales data obtained for October, November, December',
      'Executing plan step 2: Using analysis tools to calculate growth rates and identify top products',
      'Environment feedback: Analysis complete - 12% overall growth, December strongest month, top products identified',
      'Synthesizing comprehensive response by combining all gathered information',
      'Final response: Q4 sales analysis shows 12% growth over Q3, with accelerating momentum (Oct +8%, Nov +10%, Dec +18%). Top products were ProductX (27%), ProductY (18%), and ProductZ (15%). Recommend focusing marketing on ProductX and investigating ProductZ\'s December surge.'
    ];
    
    useEffect(() => {
      if (simulationStep > 0) {
        setSimulationResult(results[simulationStep]);
      }
    }, [simulationStep]);
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Autonomous Agent</h3>
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-2xl">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center mr-8">
                <div className={`rounded-full w-16 h-16 flex items-center justify-center ${simulationStep > 0 ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-100'}`}>
                  <span>Human</span>
                </div>
                {simulationStep >= 8 && (
                  <div className="mt-4">
                    <div className="h-20 w-1 bg-blue-500"></div>
                    <div className="text-blue-500 text-xs whitespace-nowrap">Response delivered</div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center">
                <div className={`rounded-lg w-32 h-32 flex items-center justify-center ${simulationStep > 0 ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                  <div className="text-center">
                    <div>Agent LLM</div>
                    {simulationStep > 0 && simulationStep < 8 && 
                      <div className="text-xs mt-1 text-green-600">
                        {simulationStep === 1 ? "Planning" : 
                         simulationStep === 2 || simulationStep === 4 ? "Acting" :
                         simulationStep === 3 || simulationStep === 5 ? "Observing" :
                         simulationStep === 6 ? "Reasoning" : "Responding"}
                      </div>
                    }
                  </div>
                </div>
                
                {/* Stop button */}
                <div className="mt-4 mb-4">
                  <div className={`rounded-lg px-3 py-1 text-xs ${simulationStep > 0 ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-gray-100 text-gray-400'}`}>
                    Stop Condition
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center ml-8">
                <div className={`rounded-full w-16 h-16 flex items-center justify-center ${simulationStep >= 2 ? 'bg-orange-100 border-2 border-orange-500' : 'bg-gray-100'}`}>
                  <span>Environment</span>
                </div>
                
                {/* Action arrow */}
                {simulationStep === 2 || simulationStep === 4 ? (
                  <div className="h-6 w-16 flex items-center justify-center">
                    <div className="h-0.5 w-10 bg-blue-500"></div>
                    <div className="w-0 h-0 border-t-4 border-l-4 border-b-4 border-t-transparent border-l-blue-500 border-b-transparent"></div>
                  </div>
                ) : (
                  <div className="h-6 w-16 flex items-center justify-center">
                    <div className="h-0.5 w-10 bg-gray-300"></div>
                    <div className="w-0 h-0 border-t-4 border-l-4 border-b-4 border-t-transparent border-l-gray-300 border-b-transparent"></div>
                  </div>
                )}
                
                {/* Feedback arrow */}
                {simulationStep === 3 || simulationStep === 5 ? (
                  <div className="h-6 w-16 flex items-center justify-center rotate-180">
                    <div className="h-0.5 w-10 bg-green-500"></div>
                    <div className="w-0 h-0 border-t-4 border-l-4 border-b-4 border-t-transparent border-l-green-500 border-b-transparent"></div>
                  </div>
                ) : (
                  <div className="h-6 w-16 flex items-center justify-center rotate-180">
                    <div className="h-0.5 w-10 bg-gray-300"></div>
                    <div className="w-0 h-0 border-t-4 border-l-4 border-b-4 border-t-transparent border-l-gray-300 border-b-transparent"></div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Cycle labels */}
            {simulationStep >= 2 && (
              <div className="text-center mt-4 text-sm">
                <div className="font-semibold">Agent Loop:</div>
                <div className="flex justify-center space-x-4 mt-1">
                  <div className={`px-2 py-1 rounded ${[1, 6].includes(simulationStep) ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'}`}>Plan</div>
                  <div className={`px-2 py-1 rounded ${[2, 4].includes(simulationStep) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>Act</div>
                  <div className={`px-2 py-1 rounded ${[3, 5].includes(simulationStep) ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>Observe</div>
                  <div className={`px-2 py-1 rounded ${simulationStep === 7 ? 'bg-purple-100 text-purple-800' : 'bg-gray-100'}`}>Reflect</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="border-t pt-3">
          <div className="text-sm font-semibold">Current Step:</div>
          <div className="mt-1">{simulationStep > 0 ? steps[simulationStep - 1].text : "Ready to start"}</div>
        </div>
      </div>
    );
  };
  
  // Component to display the current architecture
  const ArchitectureDisplay = () => {
    switch (activeArchitecture) {
      case 'augmented-llm': return <AugmentedLLM />;
      case 'prompt-chaining': return <PromptChaining />;
      case 'routing': return <Routing />;
      case 'parallelization': return <Parallelization />;
      case 'orchestrator-workers': return <OrchestratorWorkers />;
      case 'evaluator-optimizer': return <EvaluatorOptimizer />;
      case 'autonomous-agent': return <AutonomousAgent />;
      default: return <AugmentedLLM />;
    }
  };
  
  // Main component
  return (
    <div className="container mx-auto p-4 font-sans">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">LLM Agent Architecture Simulator</h2>
        <p className="text-gray-700 mb-4">
          This simulator demonstrates different LLM agent architectures and workflow patterns. 
          Select an architecture below and use the controls to see how each one processes tasks.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-3">Architecture Selector</h3>
          <div className="space-y-2">
            <div 
              className={`p-2 rounded cursor-pointer ${activeArchitecture === 'augmented-llm' ? 'bg-blue-100 border-l-4 border-blue-500' : 'hover:bg-gray-100'}`}
              onClick={() => handleArchitectureChange('augmented-llm')}
            >
              <div className="font-medium">Augmented LLM</div>
              <div className="text-xs text-gray-600">Foundation: Single LLM with tools</div>
            </div>
            <div 
              className={`p-2 rounded cursor-pointer ${activeArchitecture === 'prompt-chaining' ? 'bg-blue-100 border-l-4 border-blue-500' : 'hover:bg-gray-100'}`}
              onClick={() => handleArchitectureChange('prompt-chaining')}
            >
              <div className="font-medium">Prompt Chaining</div>
              <div className="text-xs text-gray-600">Sequential steps with checks</div>
            </div>
            <div 
              className={`p-2 rounded cursor-pointer ${activeArchitecture === 'routing' ? 'bg-blue-100 border-l-4 border-blue-500' : 'hover:bg-gray-100'}`}
              onClick={() => handleArchitectureChange('routing')}
            >
              <div className="font-medium">Routing</div>
              <div className="text-xs text-gray-600">Task classification & direction</div>
            </div>
            <div 
              className={`p-2 rounded cursor-pointer ${activeArchitecture === 'parallelization' ? 'bg-blue-100 border-l-4 border-blue-500' : 'hover:bg-gray-100'}`}
              onClick={() => handleArchitectureChange('parallelization')}
            >
              <div className="font-medium">Parallelization</div>
              <div className="text-xs text-gray-600">Multiple LLMs working simultaneously</div>
            </div>
            <div 
              className={`p-2 rounded cursor-pointer ${activeArchitecture === 'orchestrator-workers' ? 'bg-blue-100 border-l-4 border-blue-500' : 'hover:bg-gray-100'}`}
              onClick={() => handleArchitectureChange('orchestrator-workers')}
            >
              <div className="font-medium">Orchestrator-Workers</div>
              <div className="text-xs text-gray-600">Dynamic task delegation</div>
            </div>
            <div 
              className={`p-2 rounded cursor-pointer ${activeArchitecture === 'evaluator-optimizer' ? 'bg-blue-100 border-l-4 border-blue-500' : 'hover:bg-gray-100'}`}
              onClick={() => handleArchitectureChange('evaluator-optimizer')}
            >
              <div className="font-medium">Evaluator-Optimizer</div>
              <div className="text-xs text-gray-600">Feedback loop for improvement</div>
            </div>
            <div 
              className={`p-2 rounded cursor-pointer ${activeArchitecture === 'autonomous-agent' ? 'bg-blue-100 border-l-4 border-blue-500' : 'hover:bg-gray-100'}`}
              onClick={() => handleArchitectureChange('autonomous-agent')}
            >
              <div className="font-medium">Autonomous Agent</div>
              <div className="text-xs text-gray-600">Self-directed LLM with environment</div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-3">Simulation Controls</h3>
            <div className="flex items-center justify-between mb-4">
              <button 
                className={`px-4 py-2 rounded ${isPlaying ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                onClick={togglePlayPause}
              >
                {isPlaying ? 'Pause' : simulationStep >= getMaxSteps() ? 'Restart' : 'Play'}
              </button>
              <button 
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={resetSimulation}
              >
                Reset
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Speed:</label>
              <input 
                type="range" 
                min="500" 
                max="3000" 
                step="100" 
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Fast</span>
                <span>Slow</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">User Input</h3>
            <textarea
              className="w-full p-2 border rounded text-sm h-20"
              value={userInput}
              onChange={(e) => {
                setUserInput(e.target.value);
                resetSimulation();
              }}
            />
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <ArchitectureDisplay />
          
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2">Simulation Output</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap h-32 overflow-y-auto">
              {simulationResult || "Simulation not started. Press Play to begin."}
            </pre>
          </div>
          
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2">Architecture Description</h3>
            <div className="text-sm">
              {activeArchitecture === 'augmented-llm' && (
                <div>
                  <p><strong>Augmented LLM</strong> is the fundamental building block of agentic systems. It consists of a single LLM enhanced with capabilities like:</p>
                  <ul className="list-disc ml-5 mt-2">
                    <li>Retrieval: Accessing external information sources</li>
                    <li>Tools: Using specialized tools to perform specific tasks</li>
                    <li>Memory: Maintaining context across interactions</li>
                  </ul>
                  <p className="mt-2">This pattern is best for straightforward tasks where a single model call with the right tools can solve the problem.</p>
                </div>
              )}
              
              {activeArchitecture === 'prompt-chaining' && (
                <div>
                  <p><strong>Prompt Chaining</strong> breaks a task into sequential steps, where each LLM call processes the output of the previous one. This workflow can include validation gates between steps.</p>
                  <p className="mt-2">Best used when:</p>
                  <ul className="list-disc ml-5 mt-1">
                    <li>Tasks can be cleanly decomposed into fixed subtasks</li>
                    <li>You want to trade latency for higher accuracy</li>
                    <li>Each subtask is simpler than the overall task</li>
                  </ul>
                  <p className="mt-2">Examples: Document generation with planning, multi-stage content creation.</p>
                </div>
              )}
              
              {activeArchitecture === 'routing' && (
                <div>
                  <p><strong>Routing</strong> classifies an input and directs it to specialized follow-up tasks. This allows for separation of concerns and building specialized prompts.</p>
                  <p className="mt-2">Best used when:</p>
                  <ul className="list-disc ml-5 mt-1">
                    <li>There are distinct categories of inputs that need different handling</li>
                    <li>Classification can be handled accurately</li>
                    <li>Specialization improves performance</li>
                  </ul>
                  <p className="mt-2">Examples: Customer service triage, directing tasks to appropriate specialized models.</p>
                </div>
              )}
              
              {activeArchitecture === 'parallelization' && (
                <div>
                  <p><strong>Parallelization</strong> allows multiple LLMs to work simultaneously on a task with results aggregated later. Two key variations:</p>
                  <ul className="list-disc ml-5 mt-2">
                    <li><strong>Sectioning:</strong> Breaking a task into independent subtasks run in parallel</li>
                    <li><strong>Voting:</strong> Running the same task multiple times to get diverse outputs</li>
                  </ul>
                  <p className="mt-2">Best used when multiple perspectives are needed or tasks can be parallelized for speed and thoroughness.</p>
                </div>
              )}
              
              {activeArchitecture === 'orchestrator-workers' && (
                <div>
                  <p><strong>Orchestrator-Workers</strong> uses a central LLM to dynamically break down tasks, delegate them to worker LLMs, and synthesize their results.</p>
                  <p className="mt-2">Best used when:</p>
                  <ul className="list-disc ml-5 mt-1">
                    <li>You can't predict the subtasks needed in advance</li>
                    <li>Tasks require different types of expertise</li>
                    <li>Flexibility in task distribution is important</li>
                  </ul>
                  <p className="mt-2">Examples: Complex coding tasks, multi-source research projects.</p>
                </div>
              )}
              
              {activeArchitecture === 'evaluator-optimizer' && (
                <div>
                  <p><strong>Evaluator-Optimizer</strong> creates a feedback loop where one LLM generates a response and another provides evaluation and feedback for improvement.</p>
                  <p className="mt-2">Best used when:</p>
                  <ul className="list-disc ml-5 mt-1">
                    <li>Clear evaluation criteria exist</li>
                    <li>Iterative refinement provides measurable value</li>
                    <li>Initial outputs can be significantly improved with feedback</li>
                  </ul>
                  <p className="mt-2">Examples: Document writing/editing, complex translations, multi-stage analysis.</p>
                </div>
              )}
              
              {activeArchitecture === 'autonomous-agent' && (
                <div>
                  <p><strong>Autonomous Agent</strong> systems allow LLMs to dynamically direct their own processes and tool usage over multiple steps, maintaining control over how they accomplish tasks.</p>
                  <p className="mt-2">Best used for:</p>
                  <ul className="list-disc ml-5 mt-1">
                    <li>Open-ended problems with unpredictable steps</li>
                    <li>Tasks where flexibility and adaptation are essential</li>
                    <li>Environments where the agent can safely experiment</li>
                  </ul>
                  <p className="mt-2">The agent operates in a loop of planning, acting, observing feedback, and reflecting—potentially over many iterations to complete complex tasks.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSimulator;