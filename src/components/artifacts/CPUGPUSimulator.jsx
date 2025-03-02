import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, Cpu, PlusCircle, MinusCircle } from 'lucide-react';

const CPUGPUSimulator = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [taskType, setTaskType] = useState('sequential');
  const [cpuCores, setCpuCores] = useState(4);
  const [gpuCores, setGpuCores] = useState(64);
  const [currentCpuTasks, setCurrentCpuTasks] = useState([]);
  const [currentGpuTasks, setCurrentGpuTasks] = useState([]);
  const [completedCpuTasks, setCompletedCpuTasks] = useState(0);
  const [completedGpuTasks, setCompletedGpuTasks] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [cpuCacheHits, setCpuCacheHits] = useState(0);
  const [gpuCacheHits, setGpuCacheHits] = useState(0);
  const [cpuBranchPrediction, setCpuBranchPrediction] = useState(true);
  const [showMemoryAccess, setShowMemoryAccess] = useState(false);

  const maxCores = {
    cpu: 16,
    gpu: 128
  };

  const taskDefinitions = {
    sequential: {
      name: "Sequential Processing",
      description: "Tasks that must be executed one after another (better for CPU)",
      cpuSpeed: 10,
      gpuSpeed: 2,
      cpuCacheHitRate: 0.8,
      gpuCacheHitRate: 0.3,
      branchDivergence: false,
    },
    parallel: {
      name: "Parallel Processing",
      description: "Tasks that can be executed simultaneously (better for GPU)",
      cpuSpeed: 10,
      gpuSpeed: 8,
      cpuCacheHitRate: 0.6,
      gpuCacheHitRate: 0.7,
      branchDivergence: false,
    },
    branching: {
      name: "Complex Branching",
      description: "Tasks with many conditional operations (better for CPU)",
      cpuSpeed: 9,
      gpuSpeed: 2,
      cpuCacheHitRate: 0.7,
      gpuCacheHitRate: 0.3,
      branchDivergence: true,
    },
    graphics: {
      name: "Graphics Rendering",
      description: "Highly parallel pixel/vertex calculations (ideal for GPU)",
      cpuSpeed: 3,
      gpuSpeed: 12,
      cpuCacheHitRate: 0.4,
      gpuCacheHitRate: 0.9,
      branchDivergence: false,
    }
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        // Advance simulation
        setElapsedTime(prev => prev + 1);
        
        // Process CPU tasks
        const currentTask = taskDefinitions[taskType];
        
        // CPU Processing
        const newCpuTasks = [...currentCpuTasks];
        let newCompletedCpu = completedCpuTasks;
        let newCpuCacheHits = cpuCacheHits;
        
        // For sequential tasks, only one core works at full efficiency
        // For parallel tasks, all cores work but with some overhead
        let effectiveCpuCores = taskType === 'sequential' ? 1 : cpuCores * 0.8;
        if (taskType === 'branching' && cpuBranchPrediction) {
          effectiveCpuCores = cpuCores * 0.9;
        }
        
        // CPU processes tasks
        for (let i = 0; i < effectiveCpuCores; i++) {
          if (Math.random() < currentTask.cpuCacheHitRate) {
            newCpuCacheHits++;
            newCompletedCpu += currentTask.cpuSpeed * speed * 1.5; // Cache hit bonus
          } else {
            newCompletedCpu += currentTask.cpuSpeed * speed;
          }
        }
        
        // GPU Processing
        const newGpuTasks = [...currentGpuTasks];
        let newCompletedGpu = completedGpuTasks;
        let newGpuCacheHits = gpuCacheHits;
        
        // GPU efficiency is affected by branch divergence
        let effectiveGpuCores = gpuCores;
        if (taskType === 'branching') {
          effectiveGpuCores = gpuCores * 0.3; // Branch divergence hurts GPU badly
        } else if (taskType === 'sequential') {
          effectiveGpuCores = gpuCores * 0.1; // Sequential tasks don't parallelize well
        }
        
        // GPU processes tasks
        for (let i = 0; i < effectiveGpuCores; i++) {
          if (Math.random() < currentTask.gpuCacheHitRate) {
            newGpuCacheHits++;
            newCompletedGpu += currentTask.gpuSpeed * speed * 1.3; // Cache hit bonus
          } else {
            newCompletedGpu += currentTask.gpuSpeed * speed;
          }
        }
        
        // Update state
        setCompletedCpuTasks(newCompletedCpu);
        setCompletedGpuTasks(newCompletedGpu);
        setCpuCacheHits(newCpuCacheHits);
        setGpuCacheHits(newGpuCacheHits);
        
        // Add visual tasks being processed
        if (currentCpuTasks.length < cpuCores && Math.random() > 0.7) {
          newCpuTasks.push({
            id: Date.now() + Math.random(),
            progress: 0,
            maxProgress: 100,
            color: getRandomColor()
          });
        }
        
        if (currentGpuTasks.length < gpuCores && Math.random() > 0.5) {
          for (let i = 0; i < 5; i++) { // GPUs process tasks in batches
            newGpuTasks.push({
              id: Date.now() + Math.random() + i,
              progress: 0,
              maxProgress: 100,
              color: getRandomColor()
            });
          }
        }
        
        // Progress existing tasks
        for (let i = 0; i < newCpuTasks.length; i++) {
          newCpuTasks[i].progress += currentTask.cpuSpeed * speed * 2;
          if (newCpuTasks[i].progress >= newCpuTasks[i].maxProgress) {
            newCpuTasks.splice(i, 1);
            i--;
          }
        }
        
        for (let i = 0; i < newGpuTasks.length; i++) {
          let gpuProgressRate = currentTask.gpuSpeed * speed;
          if (taskType === 'sequential') {
            gpuProgressRate *= 0.2; // Sequential tasks run slowly on GPU
          } else if (taskType === 'graphics') {
            gpuProgressRate *= 2.5; // Graphics tasks run very fast on GPU
          }
          
          newGpuTasks[i].progress += gpuProgressRate;
          if (newGpuTasks[i].progress >= newGpuTasks[i].maxProgress) {
            newGpuTasks.splice(i, 1);
            i--;
          }
        }
        
        setCurrentCpuTasks(newCpuTasks);
        setCurrentGpuTasks(newGpuTasks);
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, taskType, cpuCores, gpuCores, currentCpuTasks, currentGpuTasks, 
      completedCpuTasks, completedGpuTasks, speed, cpuCacheHits, gpuCacheHits, cpuBranchPrediction]);

  const getRandomColor = () => {
    const colors = ['#4287f5', '#42f5a7', '#f5d442', '#f54242', '#ae42f5'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentCpuTasks([]);
    setCurrentGpuTasks([]);
    setCompletedCpuTasks(0);
    setCompletedGpuTasks(0);
    setElapsedTime(0);
    setCpuCacheHits(0);
    setGpuCacheHits(0);
  };

  const handleCoreChange = (type, delta) => {
    if (type === 'cpu') {
      const newValue = Math.max(1, Math.min(maxCores.cpu, cpuCores + delta));
      setCpuCores(newValue);
    } else {
      const newValue = Math.max(16, Math.min(maxCores.gpu, gpuCores + delta));
      setGpuCores(newValue);
    }
  };

  const renderCores = (type, count, tasks) => {
    const cores = [];
    const coreSize = type === 'cpu' ? 32 : 12;
    const gap = type === 'cpu' ? 8 : 4;
    
    for (let i = 0; i < count; i++) {
      const task = tasks.find((t, index) => index % count === i);
      const hasTask = !!task;
      
      cores.push(
        <div 
          key={`${type}-${i}`}
          className={`inline-block m-1 rounded-sm transition-all duration-200 ${
            hasTask ? 'border border-blue-500' : 'border border-gray-300'
          }`} 
          style={{
            width: `${coreSize}px`,
            height: `${coreSize}px`,
            backgroundColor: hasTask ? task.color : '#f0f0f0',
          }}
        />
      );
    }
    
    // Arrange cores in a grid
    const columns = type === 'cpu' ? Math.min(4, count) : Math.min(16, Math.ceil(Math.sqrt(count)));
    
    return (
      <div 
        className="flex flex-wrap justify-center items-center"
        style={{
          width: `${columns * (coreSize + gap)}px`,
        }}
      >
        {cores}
      </div>
    );
  };

  const renderPerformanceMetrics = (type) => {
    const metrics = type === 'cpu' 
      ? {
          tasks: completedCpuTasks,
          cores: cpuCores,
          cacheHits: cpuCacheHits,
          tasksPerCore: completedCpuTasks / Math.max(1, cpuCores),
        }
      : {
          tasks: completedGpuTasks,
          cores: gpuCores,
          cacheHits: gpuCacheHits,
          tasksPerCore: completedGpuTasks / Math.max(1, gpuCores),
        };

    return (
      <div className="text-sm space-y-1">
        <div>Tasks completed: {Math.floor(metrics.tasks)}</div>
        <div>Efficiency: {(metrics.tasksPerCore).toFixed(2)} tasks/core</div>
        <div>Cache hits: {metrics.cacheHits}</div>
      </div>
    );
  };

  const renderMemoryAccess = () => {
    if (!showMemoryAccess) return null;
    
    return (
      <div className="mt-4 p-2 border border-gray-300 rounded-md">
        <h3 className="font-medium text-center mb-2">Memory Access Patterns</h3>
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <h4 className="text-center text-sm font-medium mb-1">CPU Memory</h4>
            <div className="h-16 bg-gray-100 relative overflow-hidden">
              {isRunning && currentCpuTasks.map((_, i) => (
                <div 
                  key={`cpu-mem-${i}`}
                  className="absolute w-2 h-2 rounded-full bg-blue-500 transition-all duration-300"
                  style={{
                    left: `${Math.random() * 90 + 5}%`,
                    top: `${Math.random() * 80 + 10}%`,
                    opacity: Math.random() * 0.8 + 0.2
                  }}
                />
              ))}
              <div className="text-xs text-center absolute bottom-0 w-full">
                Structured access pattern with caching
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-center text-sm font-medium mb-1">GPU Memory</h4>
            <div className="h-16 bg-gray-100 relative overflow-hidden">
              {isRunning && currentGpuTasks.map((_, i) => (
                <div 
                  key={`gpu-mem-${i}`}
                  className="absolute w-1 h-1 rounded-full bg-green-500 transition-all duration-300"
                  style={{
                    left: `${Math.random() * 90 + 5}%`,
                    top: `${Math.random() * 80 + 10}%`,
                    opacity: Math.random() * 0.8 + 0.2
                  }}
                />
              ))}
              <div className="text-xs text-center absolute bottom-0 w-full">
                Massively parallel memory access
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-4 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">CPU vs GPU Simulator</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <h2 className="font-semibold mb-2">Simulation Controls</h2>
          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => setIsRunning(!isRunning)} 
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 text-white"
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />} 
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button 
              onClick={resetSimulation} 
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-200"
            >
              <RefreshCw size={16} /> Reset
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 font-medium">Task Type:</label>
            <select 
              value={taskType} 
              onChange={(e) => setTaskType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {Object.entries(taskDefinitions).map(([key, task]) => (
                <option key={key} value={key}>
                  {task.name} - {task.description}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 font-medium">Simulation Speed:</label>
            <input 
              type="range" 
              min="1" 
              max="5" 
              step="1" 
              value={speed} 
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full" 
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="font-semibold mb-2">Architecture Settings</h2>
          
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="font-medium">CPU Cores: {cpuCores}</label>
              <div className="flex gap-1">
                <button 
                  onClick={() => handleCoreChange('cpu', -1)}
                  className="p-1 rounded-full bg-gray-200" 
                  disabled={cpuCores <= 1}
                >
                  <MinusCircle size={16} />
                </button>
                <button 
                  onClick={() => handleCoreChange('cpu', 1)} 
                  className="p-1 rounded-full bg-gray-200"
                  disabled={cpuCores >= maxCores.cpu}
                >
                  <PlusCircle size={16} />
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-2">
              Fewer, more powerful cores - better for complex sequential tasks
            </div>
            
            <div className="flex items-center justify-between">
              <label className="font-medium">GPU Cores: {gpuCores}</label>
              <div className="flex gap-1">
                <button 
                  onClick={() => handleCoreChange('gpu', -16)} 
                  className="p-1 rounded-full bg-gray-200"
                  disabled={gpuCores <= 16}
                >
                  <MinusCircle size={16} />
                </button>
                <button 
                  onClick={() => handleCoreChange('gpu', 16)} 
                  className="p-1 rounded-full bg-gray-200"
                  disabled={gpuCores >= maxCores.gpu}
                >
                  <PlusCircle size={16} />
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Many, simpler cores - better for parallel, identical tasks
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="branchPrediction" 
                checked={cpuBranchPrediction} 
                onChange={(e) => setCpuBranchPrediction(e.target.checked)}
              />
              <label htmlFor="branchPrediction" className="font-medium">CPU Branch Prediction</label>
            </div>
            <div className="text-xs text-gray-500">
              CPUs can predict execution paths to optimize performance
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="memoryAccess" 
                checked={showMemoryAccess} 
                onChange={(e) => setShowMemoryAccess(e.target.checked)}
              />
              <label htmlFor="memoryAccess" className="font-medium">Show Memory Access</label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border border-gray-300 rounded-md p-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Cpu size={20} />
            <h2 className="text-xl font-semibold">CPU</h2>
          </div>
          
          <div className="flex flex-col items-center justify-center mb-4">
            {renderCores('cpu', cpuCores, currentCpuTasks)}
          </div>
          
          <div className="text-center mb-4">
            <div className="text-sm text-gray-600 mb-1">Power per core: High</div>
            <div className="text-sm text-gray-600">Clock speed: 3-5 GHz</div>
          </div>
          
          <div className="border-t border-gray-300 pt-2">
            <h3 className="font-medium mb-1 text-center">Performance</h3>
            {renderPerformanceMetrics('cpu')}
          </div>
        </div>
        
        <div className="border border-gray-300 rounded-md p-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-green-600 text-white px-2 py-0.5 rounded text-sm">
              GPU
            </div>
            <h2 className="text-xl font-semibold">GPU</h2>
          </div>
          
          <div className="flex flex-col items-center justify-center mb-4">
            {renderCores('gpu', gpuCores, currentGpuTasks)}
          </div>
          
          <div className="text-center mb-4">
            <div className="text-sm text-gray-600 mb-1">Power per core: Low</div>
            <div className="text-sm text-gray-600">Clock speed: 1-2 GHz</div>
          </div>
          
          <div className="border-t border-gray-300 pt-2">
            <h3 className="font-medium mb-1 text-center">Performance</h3>
            {renderPerformanceMetrics('gpu')}
          </div>
        </div>
      </div>
      
      {renderMemoryAccess()}
      
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <h3 className="font-medium mb-1">Simulation Time: {elapsedTime} cycles</h3>
        <div className="flex justify-between">
          <div>CPU Tasks: {Math.floor(completedCpuTasks)}</div>
          <div>GPU Tasks: {Math.floor(completedGpuTasks)}</div>
        </div>
        <div className="mt-2 flex h-4 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 transition-all" 
            style={{ width: `${completedCpuTasks / (completedCpuTasks + completedGpuTasks) * 100 || 50}%` }}
          />
          <div 
            className="bg-green-500 transition-all" 
            style={{ width: `${completedGpuTasks / (completedCpuTasks + completedGpuTasks) * 100 || 50}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <div>CPU Performance</div>
          <div>GPU Performance</div>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-700">
        <h3 className="font-medium mb-2">Key Differences:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><b>CPU:</b> Few powerful cores (1-16) optimized for sequential processing and complex tasks</li>
          <li><b>GPU:</b> Many simple cores (hundreds/thousands) optimized for parallel, identical tasks</li>
          <li><b>Memory Access:</b> CPUs have larger caches and branch prediction for optimized data flow</li>
          <li><b>Ideal Tasks:</b> CPUs excel at varied tasks with branching logic; GPUs excel at data-parallel operations</li>
          <li><b>Task Scheduling:</b> CPUs handle complex task scheduling; GPUs need tasks to be pre-organized</li>
        </ul>
      </div>
    </div>
  );
};

export default CPUGPUSimulator;