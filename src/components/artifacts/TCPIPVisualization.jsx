import React, { useState, useEffect } from 'react';

const TCPIPVisualization = () => {
  const [activeTab, setActiveTab] = useState('handshake');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [packets, setPackets] = useState([]);

  // Define the simulation content for each tab
  const simulations = {
    handshake: {
      title: 'TCP Three-Way Handshake',
      description:
        'The TCP handshake establishes a connection before data transfer begins.',
      steps: [
        {
          title: 'SYN: Client Initiates',
          description: 'Client sends SYN packet',
          explanation:
            'The client initiates the connection by sending a SYN (synchronize) packet with an initial sequence number. This is like saying "I want to talk to you, and I\'ll start counting from this number."',
          packets: [
            {
              id: 'syn1',
              type: 'syn',
              from: 'client',
              to: 'server',
              content: 'SYN Seq=100',
            },
          ],
        },
        {
          title: 'SYN-ACK: Server Responds',
          description: 'Server sends SYN-ACK packet',
          explanation:
            "The server acknowledges the client's SYN and sends its own SYN with its initial sequence number. The acknowledgment number is the client's sequence number + 1, confirming receipt of the client's SYN.",
          packets: [
            {
              id: 'synack1',
              type: 'synack',
              from: 'server',
              to: 'client',
              content: 'SYN-ACK Seq=200, Ack=101',
            },
          ],
        },
        {
          title: 'ACK: Client Confirms',
          description: 'Client sends final ACK',
          explanation:
            "The client acknowledges the server's SYN by sending an ACK with an acknowledgment number equal to the server's sequence number + 1. The connection is now established and ready for data transfer.",
          packets: [
            {
              id: 'ack1',
              type: 'ack',
              from: 'client',
              to: 'server',
              content: 'ACK Ack=201',
            },
          ],
        },
      ],
    },
    transfer: {
      title: 'Data Transfer Process',
      description: 'How TCP ensures reliable data delivery across networks.',
      steps: [
        {
          title: 'Data Segmentation',
          description: 'Client breaks data into packets',
          explanation:
            'The client divides a large message into smaller segments, each with a sequence number. This allows the receiver to reassemble the data in the correct order even if packets arrive out of sequence.',
          packets: [
            {
              id: 'data1',
              type: 'data',
              from: 'client',
              to: 'server',
              content: 'HTTP GET /index.html Seq=101',
            },
            {
              id: 'data2',
              type: 'data',
              from: 'client',
              to: 'server',
              content: 'Host: example.com Seq=201',
              delay: 1,
            },
            {
              id: 'data3',
              type: 'data',
              from: 'client',
              to: 'server',
              content: 'User-Agent: Browser Seq=301',
              delay: 2,
            },
          ],
        },
        {
          title: 'Acknowledgment',
          description: 'Server acknowledges receipt',
          explanation:
            'The server acknowledges receipt of all data packets by sending an ACK with a cumulative acknowledgment number, indicating the next byte it expects to receive.',
          packets: [
            {
              id: 'ack2',
              type: 'ack',
              from: 'server',
              to: 'client',
              content: 'ACK=401 (All received)',
            },
          ],
        },
        {
          title: 'Server Response',
          description: 'Server sends response data',
          explanation:
            'The server processes the request and sends back its response, also broken into multiple packets with sequence numbers for reliable delivery.',
          packets: [
            {
              id: 'resp1',
              type: 'data',
              from: 'server',
              to: 'client',
              content: 'HTTP/1.1 200 OK Seq=201',
            },
            {
              id: 'resp2',
              type: 'data',
              from: 'server',
              to: 'client',
              content: 'Content-Type: text/html Seq=301',
              delay: 1,
            },
            {
              id: 'resp3',
              type: 'data',
              from: 'server',
              to: 'client',
              content: '<html>...</html> Seq=401',
              delay: 2,
            },
          ],
        },
      ],
    },
    routing: {
      title: 'IP Routing',
      description: 'How packets find their way across interconnected networks.',
      steps: [
        {
          title: 'Source to Local Router',
          description: 'Packet leaves your device',
          explanation:
            'Your device (192.168.1.5) creates a packet addressed to the destination (93.184.216.34). Since the destination is not on your local network, the packet is sent to your default gateway (local router).',
          packets: [
            {
              id: 'route1',
              type: 'data',
              from: 'client',
              to: 'router1',
              content: 'Dest: 93.184.216.34',
            },
          ],
        },
        {
          title: 'ISP Routing',
          description: 'Local router forwards to ISP',
          explanation:
            "Your local router examines the destination IP and forwards the packet to your Internet Service Provider's router, which has routes to more networks.",
          packets: [
            {
              id: 'route2',
              type: 'data',
              from: 'router1',
              to: 'router2',
              content: 'Forwarding to ISP',
            },
          ],
        },
        {
          title: 'Internet Backbone',
          description: 'Traversing the core internet',
          explanation:
            'The packet travels through the internet backbone - a network of high-capacity data routes connecting major ISPs and network hubs worldwide. Border Gateway Protocol (BGP) helps determine the optimal path.',
          packets: [
            {
              id: 'route3',
              type: 'data',
              from: 'router2',
              to: 'router3',
              content: 'Via Internet backbone',
            },
          ],
        },
        {
          title: 'Destination Network',
          description: 'Arriving at destination',
          explanation:
            "The packet reaches the destination network's router, which knows how to deliver it to the specific server (93.184.216.34). The server receives the packet and processes it.",
          packets: [
            {
              id: 'route4',
              type: 'data',
              from: 'router3',
              to: 'server',
              content: 'Final delivery',
            },
          ],
        },
      ],
    },
  };

  // Get current simulation data
  const currentSim = simulations[activeTab];
  const currentStepData = currentSim.steps[currentStep];
  const totalSteps = currentSim.steps.length;

  // Handle tab switching
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentStep(0);
    setPackets([]);
    setIsPlaying(false);
  };

  // Move to next step
  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Move to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Toggle auto-play
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Reset the simulation
  const resetSimulation = () => {
    setCurrentStep(0);
    setPackets([]);
    setIsPlaying(false);
  };

  // Auto-play effect
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStep < totalSteps - 1) {
          nextStep();
        } else {
          setIsPlaying(false);
        }
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, totalSteps]);

  // Update packets when step changes
  useEffect(() => {
    if (currentStepData) {
      // Clear previous packets
      setPackets([]);

      // Add new packets with delays if specified
      if (currentStepData.packets) {
        currentStepData.packets.forEach((packetData, index) => {
          const timer = setTimeout(
            () => {
              setPackets((prev) => [
                ...prev,
                {
                  ...packetData,
                  visible: true,
                  progress: 0,
                },
              ]);
            },
            (packetData.delay || 0) * 500
          );

          return () => clearTimeout(timer);
        });
      }
    }
  }, [currentStep, activeTab]);

  // Animate packet progress
  useEffect(() => {
    const interval = setInterval(() => {
      setPackets((prev) =>
        prev.map((packet) => ({
          ...packet,
          progress: Math.min(100, packet.progress + 5),
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Get node position based on id
  const getNodePosition = (nodeId) => {
    const positions = {
      client: { x: 100, y: 150 },
      server: { x: 700, y: 150 },
      router1: { x: 250, y: 150 },
      router2: { x: 400, y: 150 },
      router3: { x: 550, y: 150 },
    };

    return positions[nodeId] || { x: 0, y: 0 };
  };

  // Calculate packet position based on progress
  const getPacketPosition = (packet) => {
    const fromPos = getNodePosition(packet.from);
    const toPos = getNodePosition(packet.to);

    const x = fromPos.x + ((toPos.x - fromPos.x) * packet.progress) / 100;
    const y = fromPos.y;

    return { x, y };
  };

  // Get color for packet type
  const getPacketColor = (type) => {
    const colors = {
      syn: '#ff9800',
      synack: '#4caf50',
      ack: '#2196f3',
      data: '#9c27b0',
      fin: '#f44336',
    };

    return colors[type] || '#000000';
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Tab navigation */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'handshake' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => handleTabChange('handshake')}
        >
          TCP Handshake
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'transfer' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => handleTabChange('transfer')}
        >
          Data Transfer
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'routing' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => handleTabChange('routing')}
        >
          IP Routing
        </button>
      </div>

      {/* Content Header */}
      <div className="p-4 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800">{currentSim.title}</h2>
        <p className="text-gray-600">{currentSim.description}</p>
      </div>

      {/* Controls */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-3 py-1 rounded border ${currentStep === 0 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === totalSteps - 1}
            className={`px-3 py-1 rounded border ${currentStep === totalSteps - 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Next
          </button>
          <button
            onClick={togglePlay}
            className={`px-3 py-1 rounded border ${isPlaying ? 'bg-red-100 text-red-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            {isPlaying ? 'Pause' : 'Auto-Play'}
          </button>
          <button
            onClick={resetSimulation}
            className="px-3 py-1 rounded border bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Reset
          </button>
        </div>

        <div className="mt-2">
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {totalSteps}
          </div>
          <div className="font-medium">{currentStepData?.title}</div>
          <div className="text-sm text-gray-700">
            {currentStepData?.description}
          </div>
        </div>
      </div>

      {/* Visualization Area */}
      <div
        className="p-4 bg-white border-b border-gray-200"
        style={{ height: '300px', position: 'relative' }}
      >
        <svg width="100%" height="100%" viewBox="0 0 800 200">
          {/* Draw the network */}
          {activeTab === 'routing' ? (
            // Routing visualization with routers
            <>
              {/* Client */}
              <g>
                <rect
                  x="70"
                  y="130"
                  width="60"
                  height="40"
                  fill="#e3f2fd"
                  stroke="#2196f3"
                  strokeWidth="2"
                />
                <text
                  x="100"
                  y="120"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                >
                  Client
                </text>
                <text x="100" y="155" textAnchor="middle" fontSize="10">
                  192.168.1.5
                </text>
              </g>

              {/* Router 1 */}
              <polygon
                points="250,130 265,145 250,160 235,145"
                fill="#ffecb3"
                stroke="#ffa000"
                strokeWidth="2"
              />
              <text
                x="250"
                y="120"
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
              >
                Router 1
              </text>

              {/* Router 2 */}
              <polygon
                points="400,130 415,145 400,160 385,145"
                fill="#ffecb3"
                stroke="#ffa000"
                strokeWidth="2"
              />
              <text
                x="400"
                y="120"
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
              >
                Router 2
              </text>

              {/* Router 3 */}
              <polygon
                points="550,130 565,145 550,160 535,145"
                fill="#ffecb3"
                stroke="#ffa000"
                strokeWidth="2"
              />
              <text
                x="550"
                y="120"
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
              >
                Router 3
              </text>

              {/* Server */}
              <g>
                <rect
                  x="670"
                  y="130"
                  width="60"
                  height="40"
                  fill="#e8f5e9"
                  stroke="#4caf50"
                  strokeWidth="2"
                />
                <text
                  x="700"
                  y="120"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                >
                  Server
                </text>
                <text x="700" y="155" textAnchor="middle" fontSize="10">
                  93.184.216.34
                </text>
              </g>

              {/* Connection lines */}
              <line
                x1="130"
                y1="145"
                x2="235"
                y2="145"
                stroke="#90a4ae"
                strokeWidth="2"
              />
              <line
                x1="265"
                y1="145"
                x2="385"
                y2="145"
                stroke="#90a4ae"
                strokeWidth="2"
              />
              <line
                x1="415"
                y1="145"
                x2="535"
                y2="145"
                stroke="#90a4ae"
                strokeWidth="2"
              />
              <line
                x1="565"
                y1="145"
                x2="670"
                y2="145"
                stroke="#90a4ae"
                strokeWidth="2"
              />

              {/* Internet cloud */}
              <ellipse
                cx="400"
                cy="80"
                rx="150"
                ry="40"
                fill="#eceff1"
                stroke="#607d8b"
                strokeDasharray="5,5"
                strokeWidth="1"
              />
              <text
                x="400"
                y="85"
                textAnchor="middle"
                fontSize="16"
                fill="#607d8b"
              >
                Internet
              </text>
            </>
          ) : (
            // TCP visualization (handshake and data transfer)
            <>
              {/* Client */}
              <g>
                <rect
                  x="70"
                  y="100"
                  width="60"
                  height="100"
                  fill="#e3f2fd"
                  stroke="#2196f3"
                  strokeWidth="2"
                />
                <text
                  x="100"
                  y="90"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                >
                  Client
                </text>

                {/* Protocol layers */}
                <rect
                  x="40"
                  y="210"
                  width="120"
                  height="25"
                  fill="#f8bbd0"
                  stroke="#000"
                  strokeWidth="1"
                />
                <text x="100" y="227" textAnchor="middle" fontSize="12">
                  Application
                </text>

                <rect
                  x="40"
                  y="235"
                  width="120"
                  height="25"
                  fill="#c8e6c9"
                  stroke="#000"
                  strokeWidth="1"
                />
                <text x="100" y="252" textAnchor="middle" fontSize="12">
                  Transport (TCP)
                </text>

                <rect
                  x="40"
                  y="260"
                  width="120"
                  height="25"
                  fill="#bbdefb"
                  stroke="#000"
                  strokeWidth="1"
                />
                <text x="100" y="277" textAnchor="middle" fontSize="12">
                  Internet (IP)
                </text>

                <rect
                  x="40"
                  y="285"
                  width="120"
                  height="25"
                  fill="#d1c4e9"
                  stroke="#000"
                  strokeWidth="1"
                />
                <text x="100" y="302" textAnchor="middle" fontSize="12">
                  Network Interface
                </text>
              </g>

              {/* Server */}
              <g>
                <rect
                  x="670"
                  y="100"
                  width="60"
                  height="100"
                  fill="#e8f5e9"
                  stroke="#4caf50"
                  strokeWidth="2"
                />
                <text
                  x="700"
                  y="90"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                >
                  Server
                </text>

                {/* Protocol layers */}
                <rect
                  x="640"
                  y="210"
                  width="120"
                  height="25"
                  fill="#f8bbd0"
                  stroke="#000"
                  strokeWidth="1"
                />
                <text x="700" y="227" textAnchor="middle" fontSize="12">
                  Application
                </text>

                <rect
                  x="640"
                  y="235"
                  width="120"
                  height="25"
                  fill="#c8e6c9"
                  stroke="#000"
                  strokeWidth="1"
                />
                <text x="700" y="252" textAnchor="middle" fontSize="12">
                  Transport (TCP)
                </text>

                <rect
                  x="640"
                  y="260"
                  width="120"
                  height="25"
                  fill="#bbdefb"
                  stroke="#000"
                  strokeWidth="1"
                />
                <text x="700" y="277" textAnchor="middle" fontSize="12">
                  Internet (IP)
                </text>

                <rect
                  x="640"
                  y="285"
                  width="120"
                  height="25"
                  fill="#d1c4e9"
                  stroke="#000"
                  strokeWidth="1"
                />
                <text x="700" y="302" textAnchor="middle" fontSize="12">
                  Network Interface
                </text>
              </g>

              {/* Connection line */}
              <line
                x1="130"
                y1="150"
                x2="670"
                y2="150"
                stroke="#90a4ae"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </>
          )}

          {/* Draw the packets */}
          {packets.map((packet) => {
            const position = getPacketPosition(packet);
            return (
              <g
                key={packet.id}
                transform={`translate(${position.x}, ${position.y})`}
              >
                <rect
                  x="-40"
                  y="-15"
                  width="80"
                  height="30"
                  rx="4"
                  fill={getPacketColor(packet.type)}
                  opacity="0.9"
                />
                <text
                  x="0"
                  y="0"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {packet.type.toUpperCase()}
                </text>
                <text
                  x="0"
                  y="12"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="white"
                  fontSize="8"
                >
                  {packet.content}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Explanation */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <h3 className="font-bold text-gray-700 mb-2">Explanation:</h3>
        <p className="text-sm text-gray-600">{currentStepData?.explanation}</p>
      </div>

      {/* Legend */}
      <div className="p-4 bg-white border-t border-gray-200">
        <h3 className="font-bold text-gray-700 mb-2">Packet Types:</h3>
        <div className="flex flex-wrap gap-4">
          {activeTab === 'handshake' && (
            <>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded-sm mr-1"></div>
                <span className="text-xs">SYN</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-sm mr-1"></div>
                <span className="text-xs">SYN-ACK</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-sm mr-1"></div>
                <span className="text-xs">ACK</span>
              </div>
            </>
          )}

          {activeTab === 'transfer' && (
            <>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded-sm mr-1"></div>
                <span className="text-xs">DATA</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-sm mr-1"></div>
                <span className="text-xs">ACK</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-sm mr-1"></div>
                <span className="text-xs">FIN</span>
              </div>
            </>
          )}

          {activeTab === 'routing' && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded-sm mr-1"></div>
              <span className="text-xs">DATA PACKET</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TCPIPVisualization;
