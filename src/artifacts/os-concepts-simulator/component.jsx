import React, { useState, useEffect, useRef } from 'react';

const OSConceptsSimulator = () => {
  // State variables
  const [activeTab, setActiveTab] = useState('kernel-user');
  const [cpuMode, setCpuMode] = useState('user');
  const [systemCalls, setSystemCalls] = useState([]);
  const [threads, setThreads] = useState([]);
  const [nextThreadId, setNextThreadId] = useState(1);
  const [sharedResource, setSharedResource] = useState(0);
  const [resourceAccess, setResourceAccess] = useState(null);
  const [logs, setLogs] = useState([]);
  const [syncPrimitive, setSyncPrimitive] = useState('none');
  const [mutex, setMutex] = useState({ locked: false, owner: null });
  const [semaphore, setSemaphore] = useState({ count: 2, waitingThreads: [] });
  const [showRaceCondition, setShowRaceCondition] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Refs
  const logEndRef = useRef(null);

  // Scroll logs to bottom when they update
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Add log message
  const addLog = (message, type = 'info') => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    setLogs((prevLogs) => [...prevLogs, { message, timestamp, type }]);
  };

  // Create a new thread
  const createThread = () => {
    const newThread = {
      id: nextThreadId,
      state: 'ready',
      progress: 0,
      taskType: Math.random() > 0.5 ? 'compute' : 'io',
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    };

    setThreads((prevThreads) => [...prevThreads, newThread]);
    setNextThreadId((prevId) => prevId + 1);
    addLog(`Created Thread #${nextThreadId}`, 'thread');
  };

  // Execute system call
  const executeSystemCall = (call) => {
    setCpuMode('kernel');
    addLog(`System call: ${call}`, 'syscall');
    setSystemCalls((prev) => [...prev, call]);

    // Simulate kernel processing
    setTimeout(() => {
      setCpuMode('user');
      addLog(`Returned from system call: ${call}`, 'syscall');
    }, 1500);
  };

  // Access shared resource by a thread
  const accessResource = (threadId) => {
    const thread = threads.find((t) => t.id === threadId);
    if (!thread || thread.state !== 'running') return;

    if (syncPrimitive === 'none') {
      // No synchronization - direct access
      setResourceAccess(threadId);
      addLog(
        `Thread #${threadId} is accessing shared resource without synchronization`,
        'warning'
      );

      // Simulate resource modification
      setTimeout(() => {
        setSharedResource((prev) => prev + 1);
        setResourceAccess(null);
        addLog(
          `Thread #${threadId} modified shared resource, new value: ${sharedResource + 1}`,
          'resource'
        );
      }, 1000);
    } else if (syncPrimitive === 'mutex') {
      // Use mutex
      if (mutex.locked && mutex.owner !== threadId) {
        addLog(`Thread #${threadId} waiting for mutex`, 'warning');
        // Thread is blocked waiting
        updateThreadState(threadId, 'blocked');
      } else {
        // Acquire mutex
        setMutex({ locked: true, owner: threadId });
        setResourceAccess(threadId);
        addLog(
          `Thread #${threadId} acquired mutex and is accessing shared resource`,
          'mutex'
        );

        // Simulate resource modification
        setTimeout(() => {
          setSharedResource((prev) => prev + 1);
          addLog(
            `Thread #${threadId} modified shared resource, new value: ${sharedResource + 1}`,
            'resource'
          );

          // Release mutex
          setTimeout(() => {
            setMutex({ locked: false, owner: null });
            setResourceAccess(null);
            addLog(`Thread #${threadId} released mutex`, 'mutex');

            // Check if any threads are waiting
            const waitingThread = threads.find((t) => t.state === 'blocked');
            if (waitingThread) {
              updateThreadState(waitingThread.id, 'running');
              addLog(
                `Thread #${waitingThread.id} unblocked and ready to run`,
                'thread'
              );
            }
          }, 500);
        }, 1000);
      }
    } else if (syncPrimitive === 'semaphore') {
      // Use semaphore
      if (semaphore.count > 0) {
        // Acquire semaphore
        setSemaphore((prev) => ({ ...prev, count: prev.count - 1 }));
        setResourceAccess(threadId);
        addLog(
          `Thread #${threadId} acquired semaphore (count: ${semaphore.count - 1}) and is accessing shared resource`,
          'semaphore'
        );

        // Simulate resource modification
        setTimeout(() => {
          setSharedResource((prev) => prev + 1);
          addLog(
            `Thread #${threadId} modified shared resource, new value: ${sharedResource + 1}`,
            'resource'
          );

          // Release semaphore
          setTimeout(() => {
            setSemaphore((prev) => {
              // If threads are waiting, wake one up
              let newWaitingThreads = [...prev.waitingThreads];
              if (newWaitingThreads.length > 0) {
                const nextThreadId = newWaitingThreads.shift();
                updateThreadState(nextThreadId, 'running');
                addLog(
                  `Thread #${nextThreadId} unblocked by semaphore release`,
                  'thread'
                );
                return { count: prev.count, waitingThreads: newWaitingThreads };
              } else {
                // No waiting threads, increment counter
                return { ...prev, count: prev.count + 1 };
              }
            });
            setResourceAccess(null);
            addLog(`Thread #${threadId} released semaphore`, 'semaphore');
          }, 500);
        }, 1000);
      } else {
        // Add to waiting list
        setSemaphore((prev) => ({
          ...prev,
          waitingThreads: [...prev.waitingThreads, threadId],
        }));
        updateThreadState(threadId, 'blocked');
        addLog(`Thread #${threadId} waiting for semaphore`, 'warning');
      }
    }
  };

  // Update thread state
  const updateThreadState = (threadId, newState) => {
    setThreads((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === threadId ? { ...thread, state: newState } : thread
      )
    );
  };

  // Run or pause simulation
  const toggleSimulation = () => {
    setIsPaused((prev) => !prev);
    addLog(isPaused ? 'Simulation resumed' : 'Simulation paused', 'system');
  };

  // Simulate thread execution
  const runThreads = () => {
    if (isPaused) return;

    setThreads((prevThreads) =>
      prevThreads.map((thread) => {
        if (thread.state === 'running' && thread.progress < 100) {
          // Thread is making progress
          return {
            ...thread,
            progress: Math.min(thread.progress + Math.random() * 10, 100),
          };
        } else if (thread.state === 'ready') {
          // Start thread
          return { ...thread, state: 'running' };
        } else if (thread.state === 'running' && thread.progress >= 100) {
          // Thread completed
          addLog(`Thread #${thread.id} completed execution`, 'thread');
          return { ...thread, state: 'completed' };
        }
        return thread;
      })
    );
  };

  // Run simulation
  useEffect(() => {
    const interval = setInterval(() => {
      runThreads();
    }, 500);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Demonstrate race condition
  const demonstrateRaceCondition = () => {
    setShowRaceCondition(true);
    setSyncPrimitive('none');
    setSharedResource(0);

    // Create multiple threads
    const newThreads = [];
    for (let i = 0; i < 3; i++) {
      newThreads.push({
        id: nextThreadId + i,
        state: 'ready',
        progress: 0,
        taskType: 'compute',
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      });
    }

    setThreads(newThreads);
    setNextThreadId(nextThreadId + 3);
    addLog(
      'Demonstrating race condition with 3 threads accessing shared resource',
      'system'
    );

    // Schedule conflicting access
    setTimeout(() => {
      accessResource(nextThreadId);
      setTimeout(() => accessResource(nextThreadId + 1), 200);
      setTimeout(() => accessResource(nextThreadId + 2), 400);
    }, 1000);
  };

  // Reset simulation
  const resetSimulation = () => {
    setThreads([]);
    setNextThreadId(1);
    setSharedResource(0);
    setResourceAccess(null);
    setMutex({ locked: false, owner: null });
    setSemaphore({ count: 2, waitingThreads: [] });
    setShowRaceCondition(false);
    setSystemCalls([]);
    setCpuMode('user');
    setLogs([]);
    addLog('Simulation reset', 'system');
  };

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">
        Operating System Concepts Simulator
      </h1>

      {/* Tab Navigation */}
      <div className="flex mb-4 bg-white rounded-lg shadow overflow-hidden">
        <button
          className={`px-4 py-2 ${activeTab === 'kernel-user' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
          onClick={() => setActiveTab('kernel-user')}
        >
          Kernel vs User Mode
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'threading' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
          onClick={() => setActiveTab('threading')}
        >
          Multi-Threading
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'synchronization' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
          onClick={() => setActiveTab('synchronization')}
        >
          Synchronization
        </button>
      </div>

      {/* Main Controls */}
      <div className="flex space-x-2 mb-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={toggleSimulation}
        >
          {isPaused ? 'Resume' : 'Pause'} Simulation
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={resetSimulation}
        >
          Reset
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={createThread}
        >
          Create Thread
        </button>
        {activeTab === 'synchronization' && (
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            onClick={demonstrateRaceCondition}
          >
            Demo Race Condition
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row">
        {/* Simulation Area */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow mb-4 lg:mb-0 lg:mr-4">
          {/* Kernel/User Mode Tab */}
          {activeTab === 'kernel-user' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Kernel vs User Mode
              </h2>

              {/* CPU Mode */}
              <div className="mb-6">
                <div className="text-lg mb-2">Current CPU Mode:</div>
                <div
                  className={`text-3xl font-bold ${cpuMode === 'kernel' ? 'text-red-600' : 'text-blue-600'}`}
                >
                  {cpuMode === 'kernel' ? 'KERNEL MODE' : 'USER MODE'}
                </div>
                <div className="text-gray-600 mt-2">
                  {cpuMode === 'kernel'
                    ? 'Executing privileged operations with full hardware access'
                    : 'Running application code with restricted permissions'}
                </div>
              </div>

              {/* Mode Transition */}
              <div className="mb-6">
                <div className="text-lg mb-2">
                  System Calls (User → Kernel Transition)
                </div>
                <div className="flex flex-wrap space-x-2">
                  <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 mb-2"
                    onClick={() => executeSystemCall('read()')}
                  >
                    read()
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 mb-2"
                    onClick={() => executeSystemCall('write()')}
                  >
                    write()
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 mb-2"
                    onClick={() => executeSystemCall('open()')}
                  >
                    open()
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 mb-2"
                    onClick={() => executeSystemCall('socket()')}
                  >
                    socket()
                  </button>
                </div>
              </div>

              {/* Recent System Calls */}
              <div>
                <div className="text-lg mb-2">Recent System Calls:</div>
                <div className="bg-gray-100 p-3 rounded max-h-32 overflow-y-auto">
                  {systemCalls.length > 0 ? (
                    systemCalls.slice(-5).map((call, index) => (
                      <div key={index} className="mb-1">
                        {call}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No system calls yet</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Threading Tab */}
          {activeTab === 'threading' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Multi-Threading</h2>

              {/* Thread Pool */}
              <div className="mb-6">
                <div className="text-lg mb-2">Active Threads:</div>
                <div className="space-y-3">
                  {threads.length > 0 ? (
                    threads.map((thread) => (
                      <div key={thread.id} className="border rounded p-3">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium">Thread #{thread.id}</div>
                          <div
                            className={`px-2 rounded text-white ${
                              thread.state === 'running'
                                ? 'bg-green-500'
                                : thread.state === 'ready'
                                  ? 'bg-blue-500'
                                  : thread.state === 'blocked'
                                    ? 'bg-yellow-500'
                                    : thread.state === 'completed'
                                      ? 'bg-gray-500'
                                      : 'bg-gray-500'
                            }`}
                          >
                            {thread.state.toUpperCase()}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-2 text-gray-600">Progress:</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-4">
                            <div
                              className={`h-4 rounded-full`}
                              style={{
                                width: `${thread.progress}%`,
                                backgroundColor: thread.color,
                              }}
                            />
                          </div>
                          <div className="ml-2">
                            {Math.round(thread.progress)}%
                          </div>
                        </div>
                        <div className="mt-2 text-gray-600">
                          Task:{' '}
                          {thread.taskType === 'compute'
                            ? 'CPU Computation'
                            : 'I/O Operation'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No active threads</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Synchronization Tab */}
          {activeTab === 'synchronization' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Synchronization Primitives
              </h2>

              {/* Primitive Selection */}
              <div className="mb-6">
                <div className="text-lg mb-2">
                  Select Synchronization Primitive:
                </div>
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1 rounded ${syncPrimitive === 'none' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    onClick={() => {
                      setSyncPrimitive('none');
                      addLog('Synchronization disabled', 'system');
                    }}
                  >
                    None
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${syncPrimitive === 'mutex' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    onClick={() => {
                      setSyncPrimitive('mutex');
                      addLog('Using mutex for synchronization', 'system');
                    }}
                  >
                    Mutex
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${syncPrimitive === 'semaphore' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    onClick={() => {
                      setSyncPrimitive('semaphore');
                      addLog('Using semaphore for synchronization', 'system');
                    }}
                  >
                    Semaphore
                  </button>
                </div>
              </div>

              {/* Shared Resource */}
              <div className="mb-6">
                <div className="text-lg mb-2">Shared Resource:</div>
                <div className="bg-white border-2 border-gray-300 rounded-lg p-4 text-center">
                  <div className="text-4xl font-bold">{sharedResource}</div>
                  <div className="mt-2 text-gray-600">
                    {resourceAccess !== null
                      ? `Currently accessed by Thread #${resourceAccess}`
                      : 'Not currently accessed'}
                  </div>
                </div>
              </div>

              {/* Resource Access */}
              <div className="mb-4">
                <div className="text-lg mb-2">Manual Resource Access:</div>
                <div className="flex flex-wrap space-x-2">
                  {threads.map((thread) => (
                    <button
                      key={thread.id}
                      className={`px-3 py-1 rounded mb-2 ${
                        thread.state === 'running'
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={thread.state !== 'running'}
                      onClick={() => accessResource(thread.id)}
                    >
                      Thread #{thread.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primitive Status */}
              {syncPrimitive === 'mutex' && (
                <div className="mb-4 p-3 bg-gray-100 rounded">
                  <div className="font-medium">Mutex Status:</div>
                  <div className="mt-1">
                    {mutex.locked
                      ? `Locked by Thread #${mutex.owner}`
                      : 'Unlocked'}
                  </div>
                </div>
              )}

              {syncPrimitive === 'semaphore' && (
                <div className="mb-4 p-3 bg-gray-100 rounded">
                  <div className="font-medium">Semaphore Status:</div>
                  <div className="mt-1">Count: {semaphore.count}</div>
                  <div className="mt-1">
                    Waiting Threads:{' '}
                    {semaphore.waitingThreads.length > 0
                      ? semaphore.waitingThreads
                          .map((id) => `#${id}`)
                          .join(', ')
                      : 'None'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Log Area */}
        <div className="lg:w-1/3 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">System Log</h2>
          <div className="bg-black text-white p-3 rounded h-96 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`mb-1 ${
                  log.type === 'warning'
                    ? 'text-yellow-300'
                    : log.type === 'error'
                      ? 'text-red-400'
                      : log.type === 'syscall'
                        ? 'text-cyan-300'
                        : log.type === 'thread'
                          ? 'text-green-300'
                          : log.type === 'mutex'
                            ? 'text-purple-300'
                            : log.type === 'semaphore'
                              ? 'text-blue-300'
                              : log.type === 'resource'
                                ? 'text-pink-300'
                                : 'text-gray-300'
                }`}
              >
                <span className="text-gray-500">[{log.timestamp}]</span>{' '}
                {log.message}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Concepts Explained</h2>

        {activeTab === 'kernel-user' && (
          <div>
            <p className="mb-2">
              <span className="font-semibold">User Mode:</span> Restricted
              environment where applications run with limited access to system
              resources. Programs can't directly access hardware or perform
              privileged operations.
            </p>
            <p className="mb-2">
              <span className="font-semibold">Kernel Mode:</span> Privileged
              state with unrestricted access to all hardware and memory. The
              kernel handles critical functions like process scheduling and
              device management.
            </p>
            <p className="mb-2">
              <span className="font-semibold">System Calls:</span> Interface
              between user applications and the kernel. When an application
              needs to perform a privileged operation, it makes a system call
              that triggers a switch from user mode to kernel mode.
            </p>
          </div>
        )}

        {activeTab === 'threading' && (
          <div>
            <p className="mb-2">
              <span className="font-semibold">Thread:</span> The smallest unit
              of execution within a process. Multiple threads in the same
              process share memory but have their own execution state.
            </p>
            <p className="mb-2">
              <span className="font-semibold">Process vs Thread:</span> A
              process has its own memory space, while threads share the
              process's memory. Threads are lightweight and easier to
              create/destroy than processes.
            </p>
            <p className="mb-2">
              <span className="font-semibold">Thread States:</span> Threads can
              be in various states like running (executing code), ready (waiting
              to be scheduled), blocked (waiting for a resource or I/O), or
              completed.
            </p>
          </div>
        )}

        {activeTab === 'synchronization' && (
          <div>
            <p className="mb-2">
              <span className="font-semibold">Race Condition:</span> When
              multiple threads access shared data simultaneously without proper
              synchronization, leading to unpredictable results.
            </p>
            <p className="mb-2">
              <span className="font-semibold">Mutex (Mutual Exclusion):</span>{' '}
              Ensures only one thread can access a resource at a time. A thread
              must acquire the mutex before accessing the resource and release
              it afterward.
            </p>
            <p className="mb-2">
              <span className="font-semibold">Semaphore:</span> Controls access
              to a resource by multiple threads using a counter. A thread
              decrements the counter to access the resource and increments it
              when done. If the counter is zero, threads wait.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OSConceptsSimulator;
