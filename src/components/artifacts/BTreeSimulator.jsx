import React, { useState, useEffect } from 'react';

// B-Tree simulator component
const BTreeSimulator = () => {
  // State for the B-tree operations
  const [tree, setTree] = useState(null);
  const [order, setOrder] = useState(3);
  const [value, setValue] = useState('');
  const [explanation, setExplanation] = useState('');
  const [animations, setAnimations] = useState([]);
  const [animationStep, setAnimationStep] = useState(0);
  const [animationActive, setAnimationActive] = useState(false);
  const [operationHistory, setOperationHistory] = useState([]);

  // Initialize tree when order changes
  useEffect(() => {
    resetTree();
  }, [order]);

  // Reset the tree to empty state
  const resetTree = () => {
    const newTree = { keys: [], children: [], isLeaf: true };
    setTree(newTree);
    setExplanation(`New B-tree created with order ${order}`);
    setAnimations([]);
    setAnimationStep(0);
    setAnimationActive(false);
    setOperationHistory([]);
  };

  // Insert a key into the B-tree
  const insertKey = (key) => {
    if (!key || isNaN(parseInt(key))) {
      setExplanation('Please enter a valid number');
      return;
    }

    const keyNum = parseInt(key);
    setValue('');

    // Clone the tree and prepare animations
    let newTree = JSON.parse(JSON.stringify(tree));
    const newAnimations = [];

    // Record operation
    const newHistory = [...operationHistory, { type: 'insert', key: keyNum }];
    setOperationHistory(newHistory);

    // Perform insertion with animation tracking
    const result = insertKeyIntoNode(newTree, keyNum, null, newAnimations);

    if (result.split) {
      // If root was split, create a new root
      newTree = {
        keys: [result.medianKey],
        children: [result.leftChild, result.rightChild],
        isLeaf: false,
      };

      newAnimations.push({
        type: 'root-split',
        description: `Root node split, creating a new root with key ${result.medianKey}`,
      });
    }

    setTree(newTree);
    setAnimations(newAnimations);
    setAnimationStep(0);
    setAnimationActive(true);
    setExplanation(`Starting insertion of key ${keyNum}`);
  };

  // Helper function to insert key into a node
  const insertKeyIntoNode = (node, key, parent, animations) => {
    animations.push({
      type: 'visit-node',
      node: JSON.parse(JSON.stringify(node)),
      description: `Examining node with keys [${node.keys.join(', ')}] to insert ${key}`,
    });

    // Find position to insert
    let pos = 0;
    while (pos < node.keys.length && key > node.keys[pos]) {
      pos++;
    }

    // Check if key already exists
    if (pos < node.keys.length && key === node.keys[pos]) {
      animations.push({
        type: 'key-exists',
        node: JSON.parse(JSON.stringify(node)),
        keyPos: pos,
        description: `Key ${key} already exists in the node, no insertion needed`,
      });
      return { split: false };
    }

    // If it's a leaf node, insert the key
    if (node.isLeaf) {
      node.keys.splice(pos, 0, key);

      animations.push({
        type: 'insert-key',
        node: JSON.parse(JSON.stringify(node)),
        keyPos: pos,
        description: `Inserted key ${key} at position ${pos} in leaf node`,
      });

      // Check if node needs to be split (if it exceeds max keys)
      if (node.keys.length >= order) {
        return splitNode(node, parent, animations);
      }

      return { split: false };
    }

    // If it's an internal node, recursively insert into appropriate child
    animations.push({
      type: 'choose-child',
      node: JSON.parse(JSON.stringify(node)),
      childPos: pos,
      description: `Moving to child ${pos} to continue insertion`,
    });

    const result = insertKeyIntoNode(node.children[pos], key, node, animations);

    // If the child was split, we need to insert the median key and adjust children
    if (result.split) {
      node.keys.splice(pos, 0, result.medianKey);
      node.children.splice(pos + 1, 0, result.rightChild);

      animations.push({
        type: 'propagate-split',
        node: JSON.parse(JSON.stringify(node)),
        keyPos: pos,
        description: `Inserted promoted key ${result.medianKey} at position ${pos} in parent node`,
      });

      // Check if this node now needs to be split
      if (node.keys.length >= order) {
        return splitNode(node, parent, animations);
      }
    }

    return { split: false };
  };

  // Function to split a node when it's full
  const splitNode = (node, parent, animations) => {
    // Find the median position
    const medianPos = Math.floor(node.keys.length / 2);
    const medianKey = node.keys[medianPos];

    // Create right child with keys after median
    const rightChild = {
      keys: node.keys.slice(medianPos + 1),
      isLeaf: node.isLeaf,
      children: node.isLeaf ? [] : node.children.slice(medianPos + 1),
    };

    // Create left child (updated original node)
    const leftChild = {
      keys: node.keys.slice(0, medianPos),
      isLeaf: node.isLeaf,
      children: node.isLeaf ? [] : node.children.slice(0, medianPos + 1),
    };

    animations.push({
      type: 'split-node',
      leftChild: JSON.parse(JSON.stringify(leftChild)),
      rightChild: JSON.parse(JSON.stringify(rightChild)),
      medianKey,
      description: `Node is full with ${node.keys.length} keys. Splitting node, promoting median key ${medianKey} to parent`,
    });

    // Return the split information
    return {
      split: true,
      medianKey,
      leftChild,
      rightChild,
    };
  };

  // Search for a key in the B-tree
  const searchKey = (key) => {
    if (!key || isNaN(parseInt(key))) {
      setExplanation('Please enter a valid number');
      return;
    }

    const keyNum = parseInt(key);
    setValue('');

    // Prepare animations
    const newAnimations = [];

    // Record operation
    const newHistory = [...operationHistory, { type: 'search', key: keyNum }];
    setOperationHistory(newHistory);

    // Perform search with animation tracking
    const result = searchKeyInNode(tree, keyNum, newAnimations);

    setAnimations(newAnimations);
    setAnimationStep(0);
    setAnimationActive(true);
    setExplanation(`Starting search for key ${keyNum}`);
  };

  // Helper function to search for a key in a node
  const searchKeyInNode = (node, key, animations) => {
    if (!node) return { found: false };

    animations.push({
      type: 'search-node',
      node: JSON.parse(JSON.stringify(node)),
      description: `Searching for key ${key} in node with keys [${node.keys.join(', ')}]`,
    });

    // Find position where key might be
    let pos = 0;
    while (pos < node.keys.length && key > node.keys[pos]) {
      pos++;
    }

    // Check if key found
    if (pos < node.keys.length && key === node.keys[pos]) {
      animations.push({
        type: 'key-found',
        node: JSON.parse(JSON.stringify(node)),
        keyPos: pos,
        description: `Found key ${key} at position ${pos} in the node!`,
      });

      return { found: true };
    }

    // If leaf, key doesn't exist
    if (node.isLeaf) {
      animations.push({
        type: 'key-not-found',
        node: JSON.parse(JSON.stringify(node)),
        description: `Reached leaf node and key ${key} wasn't found. It doesn't exist in the tree.`,
      });

      return { found: false };
    }

    // Continue search in appropriate child
    animations.push({
      type: 'search-child',
      node: JSON.parse(JSON.stringify(node)),
      childPos: pos,
      description: `Key ${key} is not in this node. Continuing search in child ${pos}`,
    });

    return searchKeyInNode(node.children[pos], key, animations);
  };

  // Animation stepping
  const nextAnimationStep = () => {
    if (animationStep < animations.length - 1) {
      setAnimationStep(animationStep + 1);
      setExplanation(animations[animationStep + 1].description);
    } else {
      setAnimationActive(false);
      setExplanation('Operation complete!');
    }
  };

  const prevAnimationStep = () => {
    if (animationStep > 0) {
      setAnimationStep(animationStep - 1);
      setExplanation(animations[animationStep - 1].description);
    }
  };

  // Create a sample tree with predefined values
  const createSampleTree = () => {
    resetTree();
    const values = [10, 20, 5, 30, 40, 15, 35, 7];

    // Insert values sequentially
    let currentTree = { keys: [], children: [], isLeaf: true };

    values.forEach((val) => {
      // Simple insertion without animation for sample tree
      const result = insertIntoTree(currentTree, val);
      if (result.newRoot) {
        currentTree = result.newRoot;
      }
    });

    setTree(currentTree);
    setExplanation(
      `Created a sample B-tree with order ${order} and values: ${values.join(', ')}`
    );
  };

  // Helper function for sample tree creation (without animations)
  const insertIntoTree = (tree, key) => {
    let currentTree = JSON.parse(JSON.stringify(tree));

    // Simple insertion logic
    const result = simpleInsert(currentTree, key, null);

    if (result.split) {
      // Create a new root if needed
      const newRoot = {
        keys: [result.medianKey],
        children: [result.leftChild, result.rightChild],
        isLeaf: false,
      };
      return { newRoot };
    }

    return { newRoot: null };
  };

  const simpleInsert = (node, key, parent) => {
    // Find position to insert
    let pos = 0;
    while (pos < node.keys.length && key > node.keys[pos]) {
      pos++;
    }

    // Check if key already exists
    if (pos < node.keys.length && key === node.keys[pos]) {
      return { split: false };
    }

    // If it's a leaf node, insert the key
    if (node.isLeaf) {
      node.keys.splice(pos, 0, key);

      // Check if node needs to be split
      if (node.keys.length >= order) {
        return simpleSplitNode(node, parent);
      }

      return { split: false };
    }

    // If it's an internal node, recursively insert
    const result = simpleInsert(node.children[pos], key, node);

    // If the child was split, insert the median key
    if (result.split) {
      node.keys.splice(pos, 0, result.medianKey);
      node.children.splice(pos + 1, 0, result.rightChild);

      // Check if this node now needs to be split
      if (node.keys.length >= order) {
        return simpleSplitNode(node, parent);
      }
    }

    return { split: false };
  };

  const simpleSplitNode = (node, parent) => {
    // Find the median position
    const medianPos = Math.floor(node.keys.length / 2);
    const medianKey = node.keys[medianPos];

    // Create right child
    const rightChild = {
      keys: node.keys.slice(medianPos + 1),
      isLeaf: node.isLeaf,
      children: node.isLeaf ? [] : node.children.slice(medianPos + 1),
    };

    // Update left child (original node)
    node.keys = node.keys.slice(0, medianPos);
    if (!node.isLeaf) {
      node.children = node.children.slice(0, medianPos + 1);
    }

    // Return the split information
    return {
      split: true,
      medianKey,
      leftChild: node,
      rightChild,
    };
  };

  return (
    <div className="flex flex-col bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Interactive B-Tree Simulator
      </h2>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        <div className="flex items-center">
          <label className="mr-2">Order (m):</label>
          <select
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>

        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a value"
          className="border rounded px-2 py-1 w-28"
        />

        <button
          onClick={() => insertKey(value)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          Insert
        </button>

        <button
          onClick={() => searchKey(value)}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
        >
          Search
        </button>

        <button
          onClick={createSampleTree}
          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
        >
          Sample Tree
        </button>

        <button
          onClick={resetTree}
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
        >
          Reset
        </button>
      </div>

      {/* Animation controls */}
      {animationActive && animations.length > 0 && (
        <div className="mb-4 flex items-center justify-center gap-2">
          <button
            onClick={prevAnimationStep}
            disabled={animationStep === 0}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            ← Prev
          </button>

          <span>
            Step {animationStep + 1} of {animations.length}
          </span>

          <button
            onClick={nextAnimationStep}
            disabled={animationStep === animations.length - 1}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}

      {/* Explanation */}
      <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200 min-h-12">
        <p className="text-blue-800">{explanation}</p>
      </div>

      {/* B-tree Visualization */}
      <div className="border-2 border-gray-300 p-4 rounded bg-gray-50 overflow-auto min-h-64">
        {tree && (
          <BTreeVisualization
            tree={tree}
            animation={animationActive ? animations[animationStep] : null}
          />
        )}
      </div>

      {/* Properties of current tree */}
      <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
        <h3 className="font-semibold">Current B-Tree Properties:</h3>
        <ul className="list-disc ml-6 mt-1">
          <li>Order (m): {order}</li>
          <li>Maximum keys per node: {order - 1}</li>
          <li>Minimum keys per non-root node: {Math.ceil(order / 2) - 1}</li>
          <li>Operations performed: {operationHistory.length}</li>
        </ul>
      </div>

      {/* Educational Content */}
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="text-xl font-bold">What is a B-Tree?</h3>
        <p className="mt-2">
          A B-tree is a self-balancing tree data structure designed to
          efficiently handle large datasets, especially in systems like
          databases and file systems where data is stored on disk.
        </p>

        <h4 className="text-lg font-semibold mt-4">Key Properties:</h4>
        <ul className="list-disc ml-6 mt-2">
          <li>
            A B-tree of order <strong>m</strong> has nodes with at most{' '}
            <strong>m-1</strong> keys and <strong>m</strong> children
          </li>
          <li>
            Every node (except root) must have at least <strong>⌈m/2⌉-1</strong>{' '}
            keys
          </li>
          <li>All leaf nodes are at the same level (balanced height)</li>
          <li>Keys within each node are stored in sorted order</li>
        </ul>

        <h4 className="text-lg font-semibold mt-4">Operations:</h4>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded">
            <h5 className="font-bold">Search:</h5>
            <p>
              Start at the root and compare keys at each node to find the target
              key or determine it doesn't exist.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Time Complexity: O(log n)
            </p>
          </div>

          <div className="bg-blue-50 p-3 rounded">
            <h5 className="font-bold">Insert:</h5>
            <p>
              Find the appropriate leaf node, insert the key, and if necessary
              split the node and propagate upward.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Time Complexity: O(log n)
            </p>
          </div>
        </div>

        <h4 className="text-lg font-semibold mt-4">
          Why B-Trees are Important:
        </h4>
        <p className="mt-2">
          B-trees minimize disk I/O by organizing data into wide nodes with
          multiple keys. With large order values, even a small-height B-tree can
          store millions of keys, making them perfect for databases and file
          systems.
        </p>
      </div>
    </div>
  );
};

// Component to visualize the B-tree
const BTreeVisualization = ({ tree, animation }) => {
  if (!tree) return null;

  // Helper function to check if a node is highlighted in the current animation
  const isHighlighted = (node) => {
    if (!animation) return false;

    if (
      [
        'visit-node',
        'search-node',
        'insert-key',
        'key-found',
        'key-exists',
        'key-not-found',
        'search-child',
        'choose-child',
      ].includes(animation.type)
    ) {
      return (
        animation.node &&
        JSON.stringify(node) === JSON.stringify(animation.node)
      );
    }

    return false;
  };

  // Helper function to check if a specific key in a node is highlighted
  const isKeyHighlighted = (node, keyIndex) => {
    if (!animation) return false;

    if (['key-found', 'key-exists', 'insert-key'].includes(animation.type)) {
      return isHighlighted(node) && animation.keyPos === keyIndex;
    }

    return false;
  };

  // Helper function to check if a child pointer is highlighted
  const isChildHighlighted = (node, childIndex) => {
    if (!animation) return false;

    if (['search-child', 'choose-child'].includes(animation.type)) {
      return isHighlighted(node) && animation.childPos === childIndex;
    }

    return false;
  };

  // Recursive function to render a node and its children
  const renderNode = (node, level = 0) => {
    if (!node) return null;

    const nodeHighlighted = isHighlighted(node);

    return (
      <div className="flex flex-col items-center">
        {/* Node container */}
        <div
          className={`flex border-2 rounded p-2 mb-2 ${
            nodeHighlighted
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-700 bg-white'
          }`}
        >
          {/* Keys in the node */}
          {node.keys.map((key, i) => (
            <div
              key={i}
              className={`px-3 py-1 mx-1 rounded ${
                isKeyHighlighted(node, i)
                  ? 'bg-yellow-300 font-bold'
                  : nodeHighlighted
                    ? 'bg-blue-100'
                    : ''
              }`}
            >
              {key}
            </div>
          ))}
        </div>

        {/* Child pointers (when not a leaf) */}
        {!node.isLeaf && node.children.length > 0 && (
          <>
            {/* Lines to children */}
            <div className="flex justify-between w-full mb-1">
              {node.children.map((_, i) => (
                <div
                  key={i}
                  className={`border-l-2 h-8 mx-auto ${
                    isChildHighlighted(node, i)
                      ? 'border-green-500'
                      : 'border-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Child nodes */}
            <div className="flex justify-center gap-4">
              {node.children.map((child, i) => (
                <div key={i} className="px-2">
                  {renderNode(child, level + 1)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex justify-center py-4 overflow-x-auto">
      {renderNode(tree)}
    </div>
  );
};

export default BTreeSimulator;
