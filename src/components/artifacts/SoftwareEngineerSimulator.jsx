import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Code,
  DollarSign,
  FileText,
  Users,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const SoftwareEngineerSimulator = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showScenarioResult, setShowScenarioResult] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [scenarioChoice, setScenarioChoice] = useState(null);
  const [scores, setScores] = useState({
    coding: 60,
    value: 60,
    decisions: 60,
    teamwork: 60,
    learning: 60,
  });

  // Quiz state
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const updateScore = (aspect, amount) => {
    setScores((prev) => ({
      ...prev,
      [aspect]: Math.min(100, Math.max(0, prev[aspect] + amount)),
    }));
  };

  const scenarios = [
    {
      id: 1,
      title: 'Feature with a Tight Deadline',
      description:
        'Your team needs to implement a new feature that customers are requesting. The deadline is in two weeks, which is quite tight.',
      choices: [
        {
          text: 'Cut corners on testing and code quality to meet the deadline at all costs',
          outcomes: {
            coding: -10,
            value: -5,
            decisions: -5,
            teamwork: 0,
            learning: 0,
          },
          feedback:
            'While you met the deadline, the poor code quality has introduced several bugs that your team now has to fix, creating more work in the long run.',
        },
        {
          text: 'Negotiate with stakeholders to reduce the feature scope while maintaining quality',
          outcomes: {
            coding: +5,
            value: +10,
            decisions: +10,
            teamwork: +5,
            learning: +5,
          },
          feedback:
            "Great choice! You've demonstrated informed decision-making by balancing short-term needs with long-term quality. Your team appreciates your focus on sustainability.",
        },
        {
          text: 'Work extra hours to implement everything perfectly',
          outcomes: {
            coding: +5,
            value: -5,
            decisions: -5,
            teamwork: 0,
            learning: 0,
          },
          feedback:
            "You delivered high-quality code, but the extra hours weren't necessary and created an unsustainable precedent. Sometimes perfectly engineered solutions aren't the most valuable use of resources.",
        },
      ],
    },
    {
      id: 2,
      title: 'Legacy Code Issue',
      description:
        "You've discovered a significant design flaw in some legacy code that your feature depends on. Fixing it properly would take a week.",
      choices: [
        {
          text: 'Implement a quick workaround for your feature and move on',
          outcomes: {
            coding: -5,
            value: +5,
            decisions: -5,
            teamwork: -5,
            learning: -5,
          },
          feedback:
            "Your workaround lets you move quickly now, but you've left a trap for other developers who will need to work with this code later.",
        },
        {
          text: 'Document the issue thoroughly and propose a proper refactoring plan for the future',
          outcomes: {
            coding: 0,
            value: +10,
            decisions: +10,
            teamwork: +10,
            learning: +5,
          },
          feedback:
            "Excellent choice! You've maximized current value while enabling informed decisions in the future. Your team will appreciate knowing about this issue before they stumble into it.",
        },
        {
          text: 'Stop everything and spend the week fixing the legacy code properly',
          outcomes: {
            coding: +10,
            value: -5,
            decisions: -5,
            teamwork: 0,
            learning: +5,
          },
          feedback:
            'While your refactoring improves code quality, it may not have been the most valuable use of time right now. Sometimes perfect is the enemy of good enough.',
        },
      ],
    },
    {
      id: 3,
      title: 'New Technology Decision',
      description:
        "Your team needs to choose a new framework for an upcoming project. You're familiar with Technology A but have heard good things about the newer Technology B.",
      choices: [
        {
          text: 'Advocate strongly for Technology A since you already know it well',
          outcomes: {
            coding: +5,
            value: 0,
            decisions: -10,
            teamwork: -5,
            learning: -10,
          },
          feedback:
            "Sticking with what you know can be expedient, but you've missed an opportunity to learn and possibly adopt a better solution.",
        },
        {
          text: 'Spend time researching both technologies, create prototypes, and make a data-driven recommendation',
          outcomes: {
            coding: +5,
            value: +5,
            decisions: +10,
            teamwork: +5,
            learning: +10,
          },
          feedback:
            'Excellent! You practiced informed decision-making and continuous learning. Your team benefits from your thorough analysis.',
        },
        {
          text: 'Defer to others on the team who seem more passionate about the decision',
          outcomes: {
            coding: 0,
            value: 0,
            decisions: -5,
            teamwork: 0,
            learning: -5,
          },
          feedback:
            "While avoiding conflict, you've missed an opportunity to contribute valuable perspective and learn something new.",
        },
      ],
    },
    {
      id: 4,
      title: 'Cross-Team Collaboration',
      description:
        "Your feature depends on an API from another team, but their documentation is outdated and the implementation doesn't match what's documented.",
      choices: [
        {
          text: "Complain to your manager about the other team's poor documentation",
          outcomes: {
            coding: 0,
            value: -5,
            decisions: -5,
            teamwork: -10,
            learning: -5,
          },
          feedback:
            "This approach creates team friction without solving the problem. You've made it harder for teams to work together effectively in the future.",
        },
        {
          text: 'Figure out how the API actually works through experimentation and write your own workarounds',
          outcomes: {
            coding: +5,
            value: 0,
            decisions: -5,
            teamwork: -5,
            learning: +5,
          },
          feedback:
            "While you unblocked yourself, you've missed an opportunity to improve documentation for everyone and build cross-team relationships.",
        },
        {
          text: 'Reach out directly to the API team, collaborate on understanding the issues, and offer to help update the documentation',
          outcomes: {
            coding: +5,
            value: +5,
            decisions: +10,
            teamwork: +10,
            learning: +10,
          },
          feedback:
            "Great choice! You've enabled better decision-making for everyone while building positive relationships across teams.",
        },
      ],
    },
    {
      id: 5,
      title: 'Production Bug Emergency',
      description:
        "A critical bug has been reported in production code you wrote. Customer data could be affected if it's not fixed quickly.",
      choices: [
        {
          text: 'Quickly push a fix without thorough testing since this is an emergency',
          outcomes: {
            coding: -10,
            value: -5,
            decisions: -10,
            teamwork: -5,
            learning: -5,
          },
          feedback:
            'Your hasty fix introduced two new bugs. Emergency situations require careful decision-making, not panic.',
        },
        {
          text: "Deny responsibility and suggest it might be caused by another team's code",
          outcomes: {
            coding: -5,
            value: -10,
            decisions: -10,
            teamwork: -10,
            learning: -10,
          },
          feedback:
            "Deflecting responsibility damages trust and doesn't solve the problem. Great engineers own their mistakes and learn from them.",
        },
        {
          text: 'Acknowledge the issue, analyze the root cause carefully, validate your fix with tests, and document what you learned',
          outcomes: {
            coding: +10,
            value: +10,
            decisions: +10,
            teamwork: +10,
            learning: +10,
          },
          feedback:
            'Excellent approach! You addressed the immediate issue responsibly while setting yourself and your team up for better decisions in the future.',
        },
      ],
    },
    // New scenarios
    {
      id: 6,
      title: 'Code Review Feedback',
      description:
        "You've submitted a pull request and received detailed critical feedback from a senior engineer. Some comments seem nitpicky to you.",
      choices: [
        {
          text: 'Defend your approach and push back on most of the feedback',
          outcomes: {
            coding: -5,
            value: -5,
            decisions: -5,
            teamwork: -10,
            learning: -10,
          },
          feedback:
            "By dismissing feedback, you've missed valuable learning opportunities and created tension with a senior team member.",
        },
        {
          text: 'Make all the suggested changes without questioning anything',
          outcomes: {
            coding: +5,
            value: 0,
            decisions: -5,
            teamwork: +5,
            learning: 0,
          },
          feedback:
            'While you avoided conflict, blindly implementing changes without understanding the reasoning limits your growth and might lead to similar issues in the future.',
        },
        {
          text: "Thank them for the detailed review, ask clarifying questions about feedback you don't understand, and incorporate the valuable suggestions",
          outcomes: {
            coding: +10,
            value: +5,
            decisions: +10,
            teamwork: +10,
            learning: +10,
          },
          feedback:
            "Excellent! You've demonstrated a growth mindset and professional communication while still maintaining your agency as an engineer.",
        },
      ],
    },
    {
      id: 7,
      title: 'Technical Debt Dilemma',
      description:
        "Your team's codebase has accumulated significant technical debt that's slowing down new feature development. Management wants new features, not refactoring.",
      choices: [
        {
          text: 'Focus solely on new features as requested and work around the technical debt',
          outcomes: {
            coding: -5,
            value: -5,
            decisions: -10,
            teamwork: 0,
            learning: -5,
          },
          feedback:
            "You've delivered short-term value but contributed to a growing problem that will eventually become unmanageable.",
        },
        {
          text: 'Secretly spend time refactoring without telling management',
          outcomes: {
            coding: +5,
            value: 0,
            decisions: -5,
            teamwork: -5,
            learning: +5,
          },
          feedback:
            'While your code improvements are valuable, operating without transparency damages trust and may lead to missed expectations.',
        },
        {
          text: 'Quantify the impact of technical debt on velocity and present a business case for targeted incremental improvements alongside feature work',
          outcomes: {
            coding: +5,
            value: +10,
            decisions: +10,
            teamwork: +5,
            learning: +5,
          },
          feedback:
            "Great approach! You've balanced technical needs with business realities while building trust through transparent communication about trade-offs.",
        },
      ],
    },
    {
      id: 8,
      title: 'Junior Developer Mentoring',
      description:
        "A new junior developer has joined your team and is struggling with their first assignments. They're clearly frustrated but haven't asked for help.",
      choices: [
        {
          text: "Let them figure it out on their own - that's how developers learn best",
          outcomes: {
            coding: 0,
            value: -10,
            decisions: -5,
            teamwork: -10,
            learning: -5,
          },
          feedback:
            "The junior developer continued to struggle for weeks, affecting team velocity and their confidence. Sometimes hands-off isn't the right approach.",
        },
        {
          text: 'Take over their tasks and complete them yourself to keep the project on track',
          outcomes: {
            coding: 0,
            value: 0,
            decisions: -5,
            teamwork: -5,
            learning: -5,
          },
          feedback:
            "While you unblocked the immediate work, you've missed an opportunity to help develop a team member and possibly damaged their confidence.",
        },
        {
          text: 'Schedule regular check-ins, offer specific guidance without taking over, and create a safe space for questions',
          outcomes: {
            coding: +5,
            value: +5,
            decisions: +10,
            teamwork: +10,
            learning: +10,
          },
          feedback:
            "Excellent mentoring approach! You've supported their growth while building team cohesion and demonstrating leadership skills.",
        },
      ],
    },
    {
      id: 9,
      title: 'Architecture Decision',
      description:
        'Your team needs to design a new system that must handle significant scale. You have several architectural approaches to consider.',
      choices: [
        {
          text: 'Choose the most cutting-edge architecture using technologies you want to learn',
          outcomes: {
            coding: +5,
            value: -10,
            decisions: -10,
            teamwork: -5,
            learning: +5,
          },
          feedback:
            'Your choice created unnecessary complexity and risk. Technology choices should be driven by requirements, not personal interest.',
        },
        {
          text: 'Make the decision quickly based on your intuition to save time and start coding',
          outcomes: {
            coding: 0,
            value: -5,
            decisions: -10,
            teamwork: -5,
            learning: -5,
          },
          feedback:
            'Your hasty approach led to significant rework later. Architecture decisions deserve careful consideration and collaboration.',
        },
        {
          text: 'Document requirements, explore multiple options with their trade-offs, build proof-of-concepts for risky areas, and involve the team in the decision',
          outcomes: {
            coding: +5,
            value: +10,
            decisions: +10,
            teamwork: +10,
            learning: +10,
          },
          feedback:
            "Excellent approach! You've demonstrated systems thinking and collaborative decision-making that will lead to a more robust solution.",
        },
      ],
    },
    {
      id: 10,
      title: 'Unclear Requirements',
      description:
        "You've been assigned a task with vague requirements. The product manager is busy and hard to reach.",
      choices: [
        {
          text: "Start implementing based on your best guess of what's needed",
          outcomes: {
            coding: 0,
            value: -10,
            decisions: -10,
            teamwork: -5,
            learning: -5,
          },
          feedback:
            'You built the wrong thing and had to start over. Coding without clear requirements is a recipe for wasted effort.',
        },
        {
          text: 'Wait until the product manager is available to provide clearer requirements before starting',
          outcomes: {
            coding: 0,
            value: -5,
            decisions: -5,
            teamwork: 0,
            learning: 0,
          },
          feedback:
            'While you avoided building the wrong thing, your passive approach caused unnecessary delays.',
        },
        {
          text: 'Document your understanding of requirements, identify key questions, book a short meeting with stakeholders, and proceed incrementally with frequent feedback',
          outcomes: {
            coding: +5,
            value: +10,
            decisions: +10,
            teamwork: +10,
            learning: +5,
          },
          feedback:
            "Great job taking initiative while managing risk! You've demonstrated excellent requirements gathering skills and stakeholder management.",
        },
      ],
    },
  ];

  const quizQuestions = [
    {
      question:
        'What is the most appropriate action when you discover a security vulnerability in your codebase?',
      options: [
        'Fix it quietly without telling anyone to avoid alarming stakeholders',
        'Document the issue, assess its severity, notify security team, and follow proper disclosure protocols',
        'Immediately release a public statement about the vulnerability to warn users',
        'Wait until your next scheduled release to address it along with other bugs',
      ],
      correctAnswer: 1,
    },
    {
      question:
        "A teammate consistently submits code with formatting issues and minor bugs. What's the best approach?",
      options: [
        'Fix their code for them each time without saying anything',
        'Report them to your manager for poor performance',
        'Offer to pair program and share helpful tools and resources for code quality',
        'Add more automated tests to catch their mistakes',
      ],
      correctAnswer: 2,
    },
    {
      question: 'When estimating work for your sprint, you should:',
      options: [
        'Always double your initial estimate to account for unknowns',
        'Provide the most optimistic timeline to keep stakeholders happy',
        'Consider complexity, potential blockers, and historical data on similar tasks',
        "Only estimate tasks you've done before since everything else is unpredictable",
      ],
      correctAnswer: 2,
    },
    {
      question: 'Which approach to testing is generally most effective?',
      options: [
        'Extensive manual testing before each release',
        'A combination of unit, integration, and end-to-end tests with appropriate coverage',
        "Focusing only on unit tests since they're faster to write and run",
        'Letting QA handle all testing so developers can focus on features',
      ],
      correctAnswer: 1,
    },
    {
      question:
        "When introducing a new technology to your stack, what's most important?",
      options: [
        'Choosing the most popular option with the largest community',
        'Selecting whatever will look best on your resume',
        'Evaluating how it fits with existing architecture, team expertise, and long-term needs',
        'Going with the option that has the best marketing materials',
      ],
      correctAnswer: 2,
    },
    {
      question:
        'When working with legacy code without tests, you should first:',
      options: [
        'Rewrite it completely from scratch',
        'Add characterization tests to document current behavior before making changes',
        'Make your changes carefully and hope nothing breaks',
        'Refuse to work on it until someone else adds tests',
      ],
      correctAnswer: 1,
    },
    {
      question:
        "What's the most valuable information to include in code documentation?",
      options: [
        'Detailed explanation of every line of code',
        'Why decisions were made, not just what the code does',
        'Names of all developers who have modified the code',
        'Complex technical jargon to demonstrate expertise',
      ],
      correctAnswer: 1,
    },
    {
      question:
        'When you discover that a project will miss its deadline, you should:',
      options: [
        'Work nights and weekends to catch up no matter what',
        'Hide the information until the last possible moment',
        'Communicate proactively, explain the situation, and present options to stakeholders',
        'Blame external factors or other teams for the delay',
      ],
      correctAnswer: 2,
    },
    {
      question:
        "What's the best approach to technical disagreements with teammates?",
      options: [
        "Always defer to the most senior person's opinion",
        'Have the manager make the final decision',
        'Engage in respectful discussion focused on data, tradeoffs, and project goals',
        'Implement your preferred solution first to prove it works better',
      ],
      correctAnswer: 2,
    },
    {
      question:
        "What's most important for maintaining a healthy codebase over time?",
      options: [
        'Following consistent patterns and practices that the team agrees on',
        'Using the newest frameworks and libraries available',
        'Having the most talented developers on your team',
        'Creating detailed documentation for everything',
      ],
      correctAnswer: 0,
    },
  ];

  const handleScenarioChoice = (choice) => {
    setScenarioChoice(choice);
    setShowScenarioResult(true);

    // Update scores based on the choice
    Object.entries(choice.outcomes).forEach(([aspect, change]) => {
      updateScore(aspect, change);
    });
  };

  const startNewScenario = () => {
    const availableScenarios = scenarios.filter((s) => s !== currentScenario);
    const nextScenario =
      availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
    setCurrentScenario(nextScenario);
    setShowScenarioResult(false);
    setScenarioChoice(null);
  };

  const resetSimulation = () => {
    setScores({
      coding: 60,
      value: 60,
      decisions: 60,
      teamwork: 60,
      learning: 60,
    });
    setCurrentScenario(null);
    setShowScenarioResult(false);
    setScenarioChoice(null);
    setActiveTab('dashboard');
    setIsQuizActive(false);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizCompleted(false);
    setQuizScore(0);
  };

  const startQuiz = () => {
    setIsQuizActive(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizCompleted(false);
    setQuizScore(0);
  };

  const handleQuizAnswer = (answerIndex) => {
    const newUserAnswers = [...userAnswers, answerIndex];
    setUserAnswers(newUserAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score
      const correct = newUserAnswers.filter(
        (answer, index) => answer === quizQuestions[index].correctAnswer
      ).length;

      setQuizScore(correct);
      setQuizCompleted(true);

      // Update profile scores based on quiz performance
      const percentCorrect = (correct / quizQuestions.length) * 100;
      const scoreIncrease = Math.floor((percentCorrect - 60) / 4); // Adjust scores based on performance

      // Update all scores
      Object.keys(scores).forEach((aspect) => {
        updateScore(aspect, scoreIncrease);
      });
    }
  };

  const getQuizLevel = () => {
    if (quizScore >= 9) return 'Distinguished Engineer';
    if (quizScore >= 8) return 'Principal Engineer';
    if (quizScore >= 6) return 'Senior Engineer';
    if (quizScore >= 5) return 'Software Engineer';
    if (quizScore >= 3) return 'Junior Engineer';
    return 'Intern';
  };

  const renderGauges = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {Object.entries(scores).map(([key, value]) => (
          <div
            key={key}
            className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
          >
            <h3 className="text-lg font-semibold capitalize mb-2">{key}</h3>
            <div className="w-full h-6 bg-gray-200 rounded-full">
              <div
                className="h-6 rounded-full flex items-center justify-end px-2 text-white font-semibold"
                style={{
                  width: `${value}%`,
                  backgroundColor:
                    value > 80
                      ? '#10B981'
                      : value > 50
                        ? '#3B82F6'
                        : value > 30
                          ? '#F59E0B'
                          : '#EF4444',
                }}
              >
                {value}%
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderScenario = () => {
    if (!currentScenario) {
      return (
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">
            Software Engineering Scenarios
          </h2>
          <p className="mb-6">
            Face real-world challenges and see how your decisions affect your
            expertise as a software engineer.
          </p>
          <button
            onClick={startNewScenario}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start First Scenario
          </button>
        </div>
      );
    }

    if (showScenarioResult) {
      return (
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4">
            {currentScenario.title} - Result
          </h2>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="font-medium mb-2">Your choice:</p>
            <p className="italic">{scenarioChoice.text}</p>
          </div>

          <div className="mb-6">
            <p className="font-medium mb-2">Feedback:</p>
            <p className="bg-blue-50 p-4 rounded-lg">
              {scenarioChoice.feedback}
            </p>
          </div>

          <div className="mb-6">
            <p className="font-medium mb-2">Impact on your expertise:</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(scenarioChoice.outcomes)
                .filter(([_, change]) => change !== 0)
                .map(([aspect, change]) => (
                  <div key={aspect} className="flex items-center">
                    <span className="capitalize w-24">{aspect}:</span>
                    <span
                      className={
                        change > 0
                          ? 'text-green-600 font-semibold'
                          : 'text-red-600 font-semibold'
                      }
                    >
                      {change > 0 ? `+${change}` : change}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <button
            onClick={startNewScenario}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next Scenario
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">{currentScenario.title}</h2>
        <p className="mb-6">{currentScenario.description}</p>

        <h3 className="font-semibold mb-2">What will you do?</h3>
        <div className="space-y-3">
          {currentScenario.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleScenarioChoice(choice)}
              className="w-full text-left p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    if (!isQuizActive) {
      return (
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">
            Software Engineering Knowledge Quiz
          </h2>
          <p className="mb-6">
            Test your software engineering knowledge with a 10-question
            assessment to determine your skill level.
          </p>
          <button
            onClick={startQuiz}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Start Quiz
          </button>
        </div>
      );
    }

    if (quizCompleted) {
      return (
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Quiz Results</h2>

          <div className="text-center mb-6">
            <div className="text-6xl font-bold mb-2 text-blue-600">
              {quizScore} / {quizQuestions.length}
            </div>
            <p className="text-xl mb-1">
              Your level:{' '}
              <span className="font-semibold">{getQuizLevel()}</span>
            </p>
            <p className="text-gray-600">
              Based on your knowledge of software engineering best practices
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-4 text-lg">Question Review:</h3>
            <div className="space-y-4">
              {quizQuestions.map((q, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${userAnswers[index] === q.correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
                >
                  <div className="flex items-start">
                    {userAnswers[index] === q.correctAnswer ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-1 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">
                        {index + 1}. {q.question}
                      </p>
                      <p className="mt-1">
                        <span className="font-medium">Your answer:</span>{' '}
                        {q.options[userAnswers[index]]}
                      </p>
                      {userAnswers[index] !== q.correctAnswer && (
                        <p className="mt-1 text-green-800">
                          <span className="font-medium">Correct answer:</span>{' '}
                          {q.options[q.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => {
                setIsQuizActive(false);
                setActiveTab('dashboard');
              }}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => {
                setIsQuizActive(true);
                setCurrentQuestionIndex(0);
                setUserAnswers([]);
                setQuizCompleted(false);
              }}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      );
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];

    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Progress:{' '}
            {Math.round((currentQuestionIndex / quizQuestions.length) * 100)}%
          </span>
        </div>

        <div className="mb-8">
          <p className="text-lg mb-6">{currentQuestion.question}</p>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleQuizAnswer(index)}
                className="w-full text-left p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderLearningContent = () => {
    const aspects = [
      {
        title: 'Being a Competent Coder',
        icon: <Code className="h-6 w-6 text-blue-500" />,
        description:
          "The foundation of software engineering expertise is writing good code. While this is considered a baseline skill, it's absolutely essential.",
        tips: [
          'Master the fundamentals of your programming languages',
          'Pay attention to error handling, memory consumption, and performance',
          'Write code that fits well with surrounding components and systems',
          'Focus on readability and maintainability',
        ],
      },
      {
        title: 'Maximizing Current Value of Work',
        icon: <DollarSign className="h-6 w-6 text-green-500" />,
        description:
          'Great engineers make appropriate economic trade-offs, balancing immediate needs with long-term considerations.',
        tips: [
          'Consider both immediate and future costs of your decisions',
          'Understand when to build for the future vs. optimizing for the present',
          'Balance technical excellence with business needs and deadlines',
          'Be pragmatic about technical debt',
        ],
      },
      {
        title: 'Practicing Informed Decision-Making',
        icon: <FileText className="h-6 w-6 text-purple-500" />,
        description:
          'Software engineering involves countless decisions. Great engineers follow processes that lead to better outcomes.',
        tips: [
          'Gather relevant information before making technical decisions',
          'Be systematic when investigating problems',
          "Ask for help when needed and leverage others' expertise",
          'Be open-minded and data-driven rather than relying on assumptions',
        ],
      },
      {
        title: 'Enabling Others to Make Decisions Efficiently',
        icon: <Users className="h-6 w-6 text-orange-500" />,
        description:
          "Great engineers make others' jobs easier rather than harder by providing what they need to make good decisions.",
        tips: [
          'Be honest about progress, challenges, and timelines',
          'Proactively manage expectations',
          'Communicate technical concepts clearly to non-technical stakeholders',
          'Create shared understanding across teams',
        ],
      },
      {
        title: 'Continuously Learning',
        icon: <BookOpen className="h-6 w-6 text-red-500" />,
        description:
          'Software engineering expertise requires ongoing growth and adaptation as the field constantly evolves.',
        tips: [
          'Stay curious about new technologies and approaches',
          'Update your knowledge as best practices evolve',
          'Learn from both successes and failures',
          'Be open to feedback and willing to change your perspective',
        ],
      },
    ];

    return (
      <div className="space-y-8 p-4">
        {aspects.map((aspect, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start mb-4">
              {aspect.icon}
              <h2 className="text-xl font-bold ml-2">{aspect.title}</h2>
            </div>
            <p className="mb-4">{aspect.description}</p>
            <h3 className="font-semibold mb-2">Tips for improvement:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {aspect.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const getCareerLevel = () => {
    const average =
      Object.values(scores).reduce((sum, score) => sum + score, 0) / 5;

    if (average >= 90) return 'Distinguished Engineer';
    if (average >= 80) return 'Principal Engineer';
    if (average >= 70) return 'Senior Engineer';
    if (average >= 60) return 'Software Engineer';
    if (average >= 40) return 'Junior Engineer';
    return 'Intern';
  };

  const renderDashboard = () => {
    const userData = [
      { name: 'Coding', value: scores.coding },
      { name: 'Value', value: scores.value },
      { name: 'Decisions', value: scores.decisions },
      { name: 'Teamwork', value: scores.teamwork },
      { name: 'Learning', value: scores.learning },
    ];

    return (
      <div className="p-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Software Engineer Profile</h2>
            <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
              {getCareerLevel()}
            </span>
          </div>

          <div className="flex items-center mb-6">
            <Award className="h-10 w-10 text-yellow-500 mr-3" />
            <div>
              <h3 className="font-semibold">Overall Expertise</h3>
              <div className="w-full h-6 bg-gray-200 rounded-full mt-1">
                <div
                  className="h-6 rounded-full flex items-center justify-end px-2 text-white font-semibold"
                  style={{
                    width: `${Object.values(scores).reduce((sum, score) => sum + score, 0) / 5}%`,
                    backgroundColor: '#3B82F6',
                  }}
                >
                  {Math.round(
                    Object.values(scores).reduce(
                      (sum, score) => sum + score,
                      0
                    ) / 5
                  )}
                  %
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">
              Your Skills Breakdown
            </h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart
                  data={userData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Skill Level"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {renderGauges()}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Next Steps</h2>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => setActiveTab('scenarios')}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Practice with Scenarios
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Take Knowledge Assessment Quiz
            </button>
            <button
              onClick={() => setActiveTab('learn')}
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Learn About Great Software Engineering
            </button>
            <button
              onClick={resetSimulation}
              className="px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reset Simulation
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">
            Great Software Engineer Simulator
          </h1>
          <p className="text-sm opacity-80">
            Based on research from "What Makes a Great Software Engineer" by
            Paul Luo Li
          </p>
        </div>
      </header>

      <div className="container mx-auto mt-4">
        <div className="flex mb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 mx-1 rounded-t-lg font-medium ${activeTab === 'dashboard' ? 'bg-white shadow-sm' : 'bg-gray-200'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-4 py-2 mx-1 rounded-t-lg font-medium ${activeTab === 'scenarios' ? 'bg-white shadow-sm' : 'bg-gray-200'}`}
          >
            Scenarios
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 mx-1 rounded-t-lg font-medium ${activeTab === 'quiz' ? 'bg-white shadow-sm' : 'bg-gray-200'}`}
          >
            Knowledge Quiz
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`px-4 py-2 mx-1 rounded-t-lg font-medium ${activeTab === 'learn' ? 'bg-white shadow-sm' : 'bg-gray-200'}`}
          >
            Learning Center
          </button>
        </div>

        <div className="bg-white rounded-lg shadow min-h-screen">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'scenarios' && renderScenario()}
          {activeTab === 'quiz' && renderQuiz()}
          {activeTab === 'learn' && renderLearningContent()}
        </div>
      </div>
    </div>
  );
};

export default SoftwareEngineerSimulator;
