import React, { useState, useEffect } from 'react';

const NodeJSEventLoopSimulator = () => {
  // State for simulator
  const [callStack, setCallStack] = useState([]);
  const [callbackQueue, setCallbackQueue] = useState([]);
  const [microtaskQueue, setMicrotaskQueue] = useState([]);
  const [timerQueue, setTimerQueue] = useState([]);
  const [ioPool, setIoPool] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [operationId, setOperationId] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // Reset all queues and stacks
  const resetSimulator = () => {
    setCallStack([]);
    setCallbackQueue([]);
    setMicrotaskQueue([]);
    setTimerQueue([]);
    setIoPool([]);
    setLogs([]);
    setIsRunning(false);
    setOperationId(1);
    setIsPaused(false);
  };

  // Logger function
  const addLog = (message) => {
    setLogs(prevLogs => [
      { id: prevLogs.length, message, timestamp: new Date().toLocaleTimeString() },
      ...prevLogs
    ].slice(0, 100));
  };

  // Add a function to the call stack
  const addToCallStack = (name, duration = 500) => {
    const id = operationId;
    setOperationId(prev => prev + 1);
    
    const operation = { id, name, duration };
    setCallStack(prev => [...prev, operation]);
    addLog(`Added "${name}" to call stack`);
    
    return operation;
  };

  // Add a timer function
  const addTimer = () => {
    const delay = Math.floor(Math.random() * 3) + 1;
    const timerName = `setTimeout (${delay}s)`;
    const timer = { id: operationId, name: timerName, delay: delay * 1000, callback: `Timer ${operationId} Callback` };
    
    setOperationId(prev => prev + 1);
    addToCallStack(timerName);
    
    setTimeout(() => {
      setTimerQueue(prev => [...prev, timer]);
      addLog(`Timer "${timerName}" completed and added to timer queue`);
    }, 10); // Immediately add to timer queue for simulation purposes
    
    addLog(`Added "${timerName}" timer`);
  };

  // Add an I/O operation
  const addIO = () => {
    const ioName = `I/O Operation ${operationId}`;
    const io = { id: operationId, name: ioName, duration: (Math.floor(Math.random() * 3) + 2) * 1000 };
    
    setOperationId(prev => prev + 1);
    addToCallStack(ioName);
    
    setTimeout(() => {
      setIoPool(prev => [...prev, io]);
      addLog(`Started "${ioName}" in I/O Pool`);
      
      setTimeout(() => {
        setIoPool(prev => prev.filter(item => item.id !== io.id));
        setCallbackQueue(prev => [...prev, { id: io.id, name: `${ioName} Callback` }]);
        addLog(`I/O "${ioName}" completed and callback added to callback queue`);
      }, io.duration);
    }, 10);
  };

  // Add a promise
  const addPromise = () => {
    const promiseName = `Promise ${operationId}`;
    
    setOperationId(prev => prev + 1);
    addToCallStack(promiseName);
    
    setTimeout(() => {
      setMicrotaskQueue(prev => [...prev, { id: operationId, name: `${promiseName} Then` }]);
      addLog(`Promise resolved and added "${promiseName} Then" to microtask queue`);
    }, 10);
    
    addLog(`Added "${promiseName}"`);
  };

  // Simulate event loop processing
  useEffect(() => {
    if (!isRunning || isPaused) return;
    
    const eventLoopInterval = setInterval(() => {
      // Process call stack
      if (callStack.length > 0) {
        const removed = callStack[callStack.length - 1];
        setCallStack(prev => prev.slice(0, -1));
        addLog(`Executed and removed "${removed.name}" from call stack`);
      } 
      // Process microtask queue (priority over callback queue)
      else if (microtaskQueue.length > 0) {
        const microtask = microtaskQueue[0];
        setMicrotaskQueue(prev => prev.slice(1));
        setCallStack(prev => [...prev, { ...microtask, duration: 500 }]);
        addLog(`Moved "${microtask.name}" from microtask queue to call stack`);
      }
      // Process timer queue next (simplified for the simulation)
      else if (timerQueue.length > 0) {
        const timer = timerQueue[0];
        setTimerQueue(prev => prev.slice(1));
        setCallStack(prev => [...prev, { id: timer.id, name: timer.callback, duration: 500 }]);
        addLog(`Moved "${timer.callback}" from timer queue to call stack`);
      }
      // Process callback queue last
      else if (callbackQueue.length > 0) {
        const callback = callbackQueue[0];
        setCallbackQueue(prev => prev.slice(1));
        setCallStack(prev => [...prev, { ...callback, duration: 500 }]);
        addLog(`Moved "${callback.name}" from callback queue to call stack`);
      }
    }, speed);
    
    return () => clearInterval(eventLoopInterval);
  }, [isRunning, callStack, callbackQueue, microtaskQueue, timerQueue, speed, isPaused]);

  // Colors for different components
  const colors = {
    callStack: 'bg-blue-100 border-blue-500',
    microtask: 'bg-purple-100 border-purple-500',
    timer: 'bg-yellow-100 border-yellow-500',
    callback: 'bg-green-100 border-green-500',
    io: 'bg-red-100 border-red-500',
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Node.js Event Loop Simulator</h1>
      
      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <button 
          onClick={() => addToCallStack('Synchronous Function')} 
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isPaused}
        >
          Add Sync Function
        </button>
        <button 
          onClick={addTimer} 
          className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          disabled={isPaused}
        >
          Add setTimeout
        </button>
        <button 
          onClick={addIO} 
          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          disabled={isPaused}
        >
          Add I/O Operation
        </button>
        <button 
          onClick={addPromise} 
          className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          disabled={isPaused}
        >
          Add Promise
        </button>
        <button 
          onClick={() => setIsRunning(!isRunning)} 
          className={`px-3 py-2 ${isRunning ? 'bg-gray-500' : 'bg-green-500'} text-white rounded hover:${isRunning ? 'bg-gray-600' : 'bg-green-600'}`}
        >
          {isRunning ? 'Stop Event Loop' : 'Start Event Loop'}
        </button>
        <button 
          onClick={() => setIsPaused(!isPaused)} 
          className={`px-3 py-2 ${isPaused ? 'bg-green-500' : 'bg-yellow-500'} text-white rounded hover:${isPaused ? 'bg-green-600' : 'bg-yellow-600'}`}
          disabled={!isRunning}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button 
          onClick={resetSimulator} 
          className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
      
      {/* Speed control */}
      <div className="mb-6 flex items-center justify-center gap-4">
        <label className="text-sm font-medium">
          Simulation Speed:
          <select 
            value={speed} 
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="ml-2 p-1 border rounded"
          >
            <option value={2000}>Slow</option>
            <option value={1000}>Normal</option>
            <option value={500}>Fast</option>
            <option value={200}>Very Fast</option>
          </select>
        </label>
      </div>
      
      {/* Main visualization area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Left column */}
        <div className="space-y-4">
          {/* Call Stack */}
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Call Stack (LIFO)</h2>
            <div className="min-h-48 flex flex-col-reverse">
              {callStack.map((item, index) => (
                <div key={`stack-${item.id}-${index}`} className={`p-2 my-1 border-l-4 rounded ${colors.callStack} animate-pulse`}>
                  {item.name}
                </div>
              ))}
              {callStack.length === 0 && (
                <div className="text-gray-400 italic">Empty Call Stack</div>
              )}
            </div>
          </div>
          
          {/* I/O Pool */}
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">I/O Pool (C++ libuv)</h2>
            <div className="min-h-32">
              {ioPool.map((item) => (
                <div key={`io-${item.id}`} className={`p-2 my-1 border-l-4 rounded ${colors.io}`}>
                  {item.name}
                </div>
              ))}
              {ioPool.length === 0 && (
                <div className="text-gray-400 italic">No Active I/O Operations</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right column */}
        <div className="space-y-4">
          {/* Microtask Queue */}
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Microtask Queue (Promise callbacks)</h2>
            <div className="min-h-32 flex flex-col">
              {microtaskQueue.map((item) => (
                <div key={`micro-${item.id}`} className={`p-2 my-1 border-l-4 rounded ${colors.microtask}`}>
                  {item.name}
                </div>
              ))}
              {microtaskQueue.length === 0 && (
                <div className="text-gray-400 italic">Empty Microtask Queue</div>
              )}
            </div>
          </div>
          
          {/* Timer Queue */}
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Timer Queue (setTimeout, setInterval)</h2>
            <div className="min-h-32 flex flex-col">
              {timerQueue.map((item) => (
                <div key={`timer-${item.id}`} className={`p-2 my-1 border-l-4 rounded ${colors.timer}`}>
                  {item.callback}
                </div>
              ))}
              {timerQueue.length === 0 && (
                <div className="text-gray-400 italic">Empty Timer Queue</div>
              )}
            </div>
          </div>
          
          {/* Callback Queue */}
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Callback Queue (I/O, HTTP, etc.)</h2>
            <div className="min-h-32 flex flex-col">
              {callbackQueue.map((item) => (
                <div key={`cb-${item.id}`} className={`p-2 my-1 border-l-4 rounded ${colors.callback}`}>
                  {item.name}
                </div>
              ))}
              {callbackQueue.length === 0 && (
                <div className="text-gray-400 italic">Empty Callback Queue</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Event loop explanation */}
      <div className="border rounded-lg p-4 mb-6 bg-white">
        <h2 className="text-lg font-semibold mb-2">How Node.js Event Loop Works</h2>
        <ol className="list-decimal ml-5 space-y-2">
          <li><strong>Call Stack:</strong> JavaScript is single-threaded, with a single call stack. When functions are called, they're pushed onto the stack.</li>
          <li><strong>Processing Order:</strong> The event loop checks different queues in a specific priority:
            <ul className="list-disc ml-5 mt-1">
              <li>First, it executes all code in the call stack</li>
              <li>Then it checks the microtask queue (Promises)</li>
              <li>Next, it checks the timer queue (setTimeout/setInterval)</li>
              <li>Finally, it checks the I/O callback queue</li>
            </ul>
          </li>
          <li><strong>Non-blocking I/O:</strong> I/O operations run in the background (libuv thread pool) and don't block the main thread.</li>
          <li><strong>Phases:</strong> The real Node.js event loop has more phases (timers, pending callbacks, idle/prepare, poll, check, close callbacks).</li>
        </ol>
      </div>
      
      {/* Execution logs */}
      <div className="border rounded-lg p-4 bg-gray-800 text-gray-200">
        <h2 className="text-lg font-semibold mb-2">Execution Log</h2>
        <div className="h-48 overflow-y-auto font-mono text-sm">
          {logs.map((log) => (
            <div key={log.id} className="py-1 border-b border-gray-700">
              <span className="text-gray-400">[{log.timestamp}]</span> {log.message}
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-gray-500 italic">No activity yet. Start the event loop and add operations.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NodeJSEventLoopSimulator;