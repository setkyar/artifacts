import React, { useState } from 'react';
import { Book } from 'lucide-react';

const ThinkingFastAndSlowSimulation = () => {
  const [currentBias, setCurrentBias] = useState('intro');
  const [ballAnswer, setBallAnswer] = useState('');
  const [ballAnswered, setBallAnswered] = useState(false);
  const [exposureStep, setExposureStep] = useState(0);
  const [statusQuoChoice, setStatusQuoChoice] = useState(null);
  const [steveChoice, setSteveChoice] = useState(null);
  const [exposedCount, setExposedCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleBallAnswerSubmit = () => {
    setBallAnswered(true);
  };

  const resetBallQuestion = () => {
    setBallAnswer('');
    setBallAnswered(false);
  };

  const handleNextExposureStep = () => {
    if (exposureStep < 3) {
      setExposureStep(exposureStep + 1);
    } else {
      setExposureStep(0);
    }
  };

  const increaseExposureCount = () => {
    setExposedCount(exposedCount + 1);
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-blue-600 px-6 py-4">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <Book className="mr-2" />
          Thinking Fast and Slow: Interactive Simulation
        </h1>
        <p className="text-blue-100 mt-1">Explore cognitive biases based on Daniel Kahneman's work</p>
      </div>

      {/* Navigation */}
      <div className="flex overflow-x-auto border-b border-gray-200">
        <button 
          onClick={() => setCurrentBias('intro')} 
          className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${currentBias === 'intro' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Introduction
        </button>
        <button 
          onClick={() => setCurrentBias('system1and2')} 
          className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${currentBias === 'system1and2' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          System 1 & 2
        </button>
        <button 
          onClick={() => setCurrentBias('exposure')} 
          className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${currentBias === 'exposure' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Frequent Exposure Bias
        </button>
        <button 
          onClick={() => setCurrentBias('statusquo')} 
          className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${currentBias === 'statusquo' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Status Quo Bias
        </button>
        <button 
          onClick={() => setCurrentBias('tunnelvision')} 
          className={`px-4 py-3 whitespace-nowrap font-medium text-sm ${currentBias === 'tunnelvision' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Tunnel Vision
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Introduction */}
        {currentBias === 'intro' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Welcome to the Cognitive Biases Simulator</h2>
            <p className="text-gray-600">
              This interactive simulation helps you understand three key cognitive biases from Daniel Kahneman's book "Thinking Fast and Slow":
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li><strong>Frequent Exposure Bias</strong> - We tend to prefer things we've been exposed to more frequently.</li>
              <li><strong>Status Quo Bias</strong> - We tend to prefer the current state of affairs due to loss aversion and the endowment effect.</li>
              <li><strong>Tunnel Vision</strong> - We tend to make decisions based on limited information and ignore contradictory data.</li>
            </ul>
            <p className="text-gray-600">
              Use the tabs above to explore each bias through interactive exercises. Let's start by understanding the two thinking systems that Kahneman describes.
            </p>
            <div className="flex justify-center mt-4">
              <button 
                onClick={() => setCurrentBias('system1and2')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Start Learning
              </button>
            </div>
          </div>
        )}

        {/* System 1 and 2 */}
        {currentBias === 'system1and2' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">System 1 vs System 2 Thinking</h2>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-4">
                Let's try the famous bat and ball problem from the video:
              </p>
              <p className="text-gray-800 font-medium mb-4">
                A bat and ball together cost $1.10. The bat costs $1 more than the ball. How much does the ball cost?
              </p>

              {!ballAnswered ? (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">$</span>
                  <input 
                    type="text" 
                    value={ballAnswer} 
                    onChange={(e) => setBallAnswer(e.target.value)}
                    className="border rounded p-2 w-20"
                    placeholder="0.00"
                  />
                  <button 
                    onClick={handleBallAnswerSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Check Answer
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">Your answer: $</span>
                    <span className="font-bold">{ballAnswer}</span>
                  </div>
                  
                  {ballAnswer === '0.05' ? (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                      <p className="font-medium">Correct! You used your System 2 thinking.</p>
                      <p className="mt-2">
                        If the ball costs $0.05 and the bat costs $1.00 more than the ball, then the bat costs $1.05.
                        Together they cost $1.10 ($0.05 + $1.05 = $1.10).
                      </p>
                    </div>
                  ) : ballAnswer === '0.10' || ballAnswer === '.10' || ballAnswer === '10' ? (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                      <p className="font-medium">That was your System 1 thinking!</p>
                      <p className="mt-2">
                        If the ball costs $0.10 and the bat costs $1.00 more than the ball, then the bat would cost $1.10.
                        Together they would cost $1.20 ($0.10 + $1.10 = $1.20), not $1.10.
                      </p>
                      <p className="mt-2">
                        The correct answer is $0.05. If the ball costs $0.05 and the bat costs $1.00 more than the ball,
                        then the bat costs $1.05. Together they cost $1.10 ($0.05 + $1.05 = $1.10).
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      <p className="font-medium">Let's reconsider.</p>
                      <p className="mt-2">
                        If the ball costs ${ballAnswer} and the bat costs $1.00 more than the ball, then the bat would cost ${parseFloat(ballAnswer) + 1}.
                        Together they would cost ${parseFloat(ballAnswer) + parseFloat(ballAnswer) + 1}.
                      </p>
                      <p className="mt-2">
                        The correct answer is $0.05. If the ball costs $0.05 and the bat costs $1.00 more than the ball,
                        then the bat costs $1.05. Together they cost $1.10 ($0.05 + $1.05 = $1.10).
                      </p>
                    </div>
                  )}
                  
                  <button 
                    onClick={resetBallQuestion}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">System 1: Fast Thinking</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Automatic and intuitive</li>
                  <li>Requires little effort</li>
                  <li>Makes snap judgments</li>
                  <li>Prone to cognitive biases</li>
                  <li>Like newspaper reporters collecting stories</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">System 2: Slow Thinking</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Deliberate and analytical</li>
                  <li>Requires effort and concentration</li>
                  <li>Verifies System 1's judgments</li>
                  <li>Helps overcome biases</li>
                  <li>Like a newspaper editor checking facts</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button 
                onClick={() => setCurrentBias('intro')}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Back to Intro
              </button>
              <button 
                onClick={() => setCurrentBias('exposure')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Next: Frequent Exposure Bias
              </button>
            </div>
          </div>
        )}

        {/* Frequent Exposure Bias */}
        {currentBias === 'exposure' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Frequent Exposure Bias</h2>
            
            <p className="text-gray-600">
              The more we see something, the more familiar it becomes, and we tend to trust it more.
              This is why advertisements are repeated so often!
            </p>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-medium text-lg text-gray-800 mb-4">Interactive Exercise: Familiarity Effect</h3>
              
              {exposureStep === 0 && (
                <div className="space-y-4">
                  <p className="text-gray-700">
                    In this exercise, you'll see how repeated exposure affects your preference.
                    First, I'll show you two unfamiliar words. You'll be exposed to one word more often than the other.
                  </p>
                  <div className="flex justify-center space-x-6">
                    <div className="p-3 bg-white rounded shadow-sm">Ravelin</div>
                    <div className="p-3 bg-white rounded shadow-sm">Zenith</div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button 
                      onClick={handleNextExposureStep}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Start Experiment
                    </button>
                  </div>
                </div>
              )}

              {exposureStep === 1 && (
                <div className="space-y-6">
                  <p className="text-gray-700 mb-4">
                    Click on the word "Zenith" each time you see it. This simulates being repeatedly exposed to something.
                  </p>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <button className="p-3 bg-white rounded shadow-sm hover:bg-gray-100">Ravelin</button>
                    <button 
                      onClick={increaseExposureCount}
                      className="p-3 bg-white rounded shadow-sm hover:bg-gray-100"
                    >
                      Zenith
                    </button>
                    <button className="p-3 bg-white rounded shadow-sm hover:bg-gray-100">Ravelin</button>
                    <button 
                      onClick={increaseExposureCount}
                      className="p-3 bg-white rounded shadow-sm hover:bg-gray-100"
                    >
                      Zenith
                    </button>
                    <button 
                      onClick={increaseExposureCount}
                      className="p-3 bg-white rounded shadow-sm hover:bg-gray-100"
                    >
                      Zenith
                    </button>
                    <button className="p-3 bg-white rounded shadow-sm hover:bg-gray-100">Ravelin</button>
                    <button 
                      onClick={increaseExposureCount}
                      className="p-3 bg-white rounded shadow-sm hover:bg-gray-100"
                    >
                      Zenith
                    </button>
                    <button className="p-3 bg-white rounded shadow-sm hover:bg-gray-100">Ravelin</button>
                  </div>
                  
                  <p className="text-center text-gray-700">
                    Clicks on "Zenith": {exposedCount}
                  </p>
                  
                  <div className="flex justify-center">
                    <button 
                      onClick={handleNextExposureStep}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      disabled={exposedCount < 4}
                    >
                      {exposedCount < 4 ? "Click Zenith at least 4 times" : "Continue"}
                    </button>
                  </div>
                </div>
              )}

              {exposureStep === 2 && (
                <div className="space-y-6">
                  <p className="text-gray-700">
                    Now, I'll ask you a question about these two words:
                  </p>
                  
                  <div className="bg-white p-4 rounded shadow-md">
                    <p className="font-medium text-gray-800 mb-4">Which word do you think means something positive?</p>
                    <div className="flex justify-center space-x-6">
                      <button 
                        onClick={handleNextExposureStep}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                      >
                        Ravelin
                      </button>
                      <button 
                        onClick={handleNextExposureStep}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                      >
                        Zenith
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {exposureStep === 3 && (
                <div className="space-y-4">
                  <p className="text-gray-700 mb-4">
                    Most people would choose "Zenith" after being repeatedly exposed to it, even though:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded shadow-sm">
                      <h4 className="font-medium text-gray-800">Ravelin</h4>
                      <p className="text-gray-600">A triangular fortification or detached outwork in military architecture.</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm">
                      <h4 className="font-medium text-gray-800">Zenith</h4>
                      <p className="text-gray-600">The highest point in the heavens, directly above the observer.</p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                    <h4 className="font-medium text-amber-800">The Lesson</h4>
                    <p className="text-amber-700">
                      We tend to prefer things simply because we've been exposed to them repeatedly.
                      This is why advertising works - the more we see a brand or product, the more we trust it.
                    </p>
                    <p className="text-amber-700 mt-2">
                      To overcome this bias, ask yourself: "Is this the best option, or just the option I've been frequently exposed to?"
                    </p>
                  </div>
                  
                  <div className="flex justify-center">
                    <button 
                      onClick={() => {
                        setExposureStep(0);
                        setExposedCount(0);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Reset Exercise
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button 
                onClick={() => setCurrentBias('system1and2')}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Back
              </button>
              <button 
                onClick={() => setCurrentBias('statusquo')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Next: Status Quo Bias
              </button>
            </div>
          </div>
        )}

        {/* Status Quo Bias */}
        {currentBias === 'statusquo' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Status Quo Bias</h2>
            
            <p className="text-gray-600">
              We tend to prefer things to stay the same due to loss aversion (losses feel worse than equivalent gains)
              and the endowment effect (we overvalue what we already have).
            </p>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-medium text-lg text-gray-800 mb-4">Interactive Exercise: Loss Aversion</h3>
              
              <div className="bg-white p-4 rounded shadow-md mb-6">
                <p className="font-medium text-gray-800 mb-4">Would you accept this coin flip bet?</p>
                <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-gray-700 mb-4">
                  <p><strong>Heads:</strong> You win $150</p>
                  <p><strong>Tails:</strong> You lose $100</p>
                </div>
                
                {statusQuoChoice === null ? (
                  <div className="flex justify-center space-x-4">
                    <button 
                      onClick={() => setStatusQuoChoice('accept')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Accept the Bet
                    </button>
                    <button 
                      onClick={() => setStatusQuoChoice('reject')}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject the Bet
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      You chose to <span className="font-medium">{statusQuoChoice === 'accept' ? 'accept' : 'reject'}</span> the bet.
                    </p>
                    
                    <div className="bg-blue-100 p-4 rounded border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">The Math Behind the Bet</h4>
                      <p className="text-blue-700">
                        On average, this bet has a positive expected value:
                      </p>
                      <p className="text-blue-700 font-medium">
                        (0.5 × $150) + (0.5 × -$100) = $75 - $50 = $25
                      </p>
                      <p className="text-blue-700 mt-2">
                        This means that if you took this bet many times, you would, on average, make $25 per bet.
                        Yet, many people reject this bet due to loss aversion - the psychological pain of losing $100
                        feels worse than the pleasure of winning $150.
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => setStatusQuoChoice(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <h4 className="font-medium text-amber-800">The Lesson</h4>
                <p className="text-amber-700">
                  Our brains naturally give about twice as much weight to losses as to equivalent gains.
                  This makes us overly cautious and prone to sticking with the status quo, even when change 
                  would be beneficial.
                </p>
                <p className="text-amber-700 mt-2">
                  To overcome this bias, ask yourself: "What opportunities am I losing by maintaining the status quo?"
                  This helps you give equal psychological weight to new options.
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button 
                onClick={() => setCurrentBias('exposure')}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Back
              </button>
              <button 
                onClick={() => setCurrentBias('tunnelvision')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Next: Tunnel Vision
              </button>
            </div>
          </div>
        )}

        {/* Tunnel Vision */}
        {currentBias === 'tunnelvision' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Tunnel Vision Bias</h2>
            
            <p className="text-gray-600">
              We tend to focus on limited information while making decisions, ignoring other important facts.
              Kahneman calls this "What You See Is All There Is" (WYSIATI).
            </p>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-medium text-lg text-gray-800 mb-4">Interactive Exercise: The Steve Problem</h3>
              
              <div className="bg-white p-4 rounded shadow-md mb-6">
                <p className="font-medium text-gray-800 mb-4">
                  Steve is a very shy and withdrawn American who's invariably helpful but has little interest in people 
                  or the world of reality. Steve is a meek and tidy soul and he has a need for order and structure.
                </p>
                <p className="font-medium text-gray-800 mb-4">Is Steve more likely to be:</p>
                
                {steveChoice === null ? (
                  <div className="flex justify-center space-x-4">
                    <button 
                      onClick={() => setSteveChoice('librarian')}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      A Librarian
                    </button>
                    <button 
                      onClick={() => setSteveChoice('farmer')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      A Farmer
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      You chose <span className="font-medium">{steveChoice === 'librarian' ? 'Librarian' : 'Farmer'}</span>.
                    </p>
                    
                    <button 
                      onClick={() => setShowExplanation(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
                    >
                      Show Explanation
                    </button>
                    
                    {showExplanation && (
                      <div className="bg-blue-100 p-4 rounded border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2">The Statistical Reality</h4>
                        <p className="text-blue-700">
                          While Steve's description matches our stereotype of a librarian, there's an important piece of 
                          information missing: the base rates.
                        </p>
                        <p className="text-blue-700 mt-2">
                          In the United States, there are approximately 20 times more male farmers than male librarians. 
                          Even if Steve sounds like a stereotypical librarian, the sheer numbers make it statistically more 
                          likely that he's a farmer.
                        </p>
                        <p className="text-blue-700 mt-2">
                          Our System 1 quickly matches the description to a stereotype and ignores the statistical probabilities. 
                          This is tunnel vision bias: focusing on what information is presented and ignoring what's missing.
                        </p>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => {
                        setSteveChoice(null);
                        setShowExplanation(false);
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <h4 className="font-medium text-amber-800">The Lesson</h4>
                <p className="text-amber-700">
                  We often make judgments based on limited information that's immediately available to us, 
                  while ignoring other important facts or statistics.
                </p>
                <p className="text-amber-700 mt-2">
                  To overcome this bias, ask yourself: "Why might the opposite be true?" or "What information 
                  am I missing?" This helps widen your perspective and consider alternative explanations.
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg mt-6">
              <h3 className="font-medium text-lg text-green-800 mb-2">Summary: The F.A.S.T. Framework</h3>
              <p className="text-green-700 mb-4">
                To avoid these cognitive biases, ask yourself these questions before making important decisions:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-green-700">
                <li>
                  <strong>F</strong>requent Exposure: "Is this the best option or just the option I've been frequently exposed to?"
                </li>
                <li>
                  <strong>S</strong>tatus Quo: "What opportunities am I losing by maintaining the status quo?"
                </li>
                <li>
                  <strong>T</strong>unnel Vision: "Why might the opposite be true? What information am I missing?"
                </li>
              </ol>
            </div>

            <div className="flex justify-between mt-6">
              <button 
                onClick={() => setCurrentBias('statusquo')}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Back
              </button>
              <button 
                onClick={() => setCurrentBias('intro')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Back to Start
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThinkingFastAndSlowSimulation;