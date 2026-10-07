const User = require('../models/User');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

const seedData = async () => {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Database already populated. Skipping seed.');
      return;
    }

    console.log('Seeding demo data into database...');

    // 1. Create Teacher
    const teacher = await User.create({
      name: 'Dr. Robert Smith',
      email: 'teacher@portal.edu',
      password: 'Teacher@123',
      role: 'teacher'
    });

    // 2. Create Students
    const student1 = await User.create({
      name: 'Alice Johnson',
      email: 'student1@portal.edu',
      password: 'Student@123',
      role: 'student'
    });

    const student2 = await User.create({
      name: 'Bob Davis',
      email: 'student2@portal.edu',
      password: 'Student@123',
      role: 'student'
    });

    const student3 = await User.create({
      name: 'Charlie Brown',
      email: 'student3@portal.edu',
      password: 'Student@123',
      role: 'student'
    });

    // 3. Create Sample Quizzes
    const webQuiz = await Quiz.create({
      title: 'Full Stack Web Development & React',
      subject: 'Web Technologies',
      description:
        'Test your core knowledge of modern full-stack web concepts including React, Node.js, HTTP, and RESTful architectures.',
      duration: 15,
      passingPercentage: 60,
      createdBy: teacher._id,
      questions: [
        {
          questionText: 'What is the primary purpose of the Virtual DOM in React?',
          options: [
            'Directly manipulate the browser DOM for faster CSS styling',
            'Minimize real DOM updates by computing diffs in memory',
            'Manage server-side SQL queries inside React components',
            'Handle HTTP web socket connections automatically'
          ],
          correctAnswer: 1,
          marks: 1
        },
        {
          questionText: 'Which HTTP method should be used for idempotent updates that replace an existing resource?',
          options: ['POST', 'PUT', 'PATCH', 'CONNECT'],
          correctAnswer: 1,
          marks: 1
        },
        {
          questionText: 'What hook is used in React to perform side effects in functional components?',
          options: ['useState', 'useMemo', 'useEffect', 'useCallback'],
          correctAnswer: 2,
          marks: 1
        },
        {
          questionText: 'Which HTTP status code signifies "201 Created"?',
          options: ['200', '201', '204', '301'],
          correctAnswer: 1,
          marks: 1
        },
        {
          questionText: 'What does JWT stand for in web security?',
          options: [
            'Java Web Transfer',
            'JavaScript Wide Token',
            'JSON Web Token',
            'Joint Wireless Telemetry'
          ],
          correctAnswer: 2,
          marks: 1
        },
        {
          questionText: 'Which Express.js function is used to register middleware in an application?',
          options: ['app.use()', 'app.register()', 'app.attach()', 'app.middleware()'],
          correctAnswer: 0,
          marks: 1
        },
        {
          questionText: 'In React, what is the role of key props when rendering lists?',
          options: [
            'To specify the encryption key for sensitive list items',
            'To help React identify which items have changed, added, or removed',
            'To set the CSS z-index priority of list elements',
            'To bind keyboard shortcut keys to each row'
          ],
          correctAnswer: 1,
          marks: 1
        },
        {
          questionText: 'What is CORS in web application architecture?',
          options: [
            'Content Origin Routing System',
            'Cross-Origin Resource Sharing',
            'Client Object Redirection Standard',
            'Centralized Open Resource Server'
          ],
          correctAnswer: 1,
          marks: 1
        }
      ]
    });

    const dsaQuiz = await Quiz.create({
      title: 'Data Structures & Algorithms Core Concepts',
      subject: 'Computer Science',
      description:
        'Comprehensive assessment on essential data structures, algorithm complexity, trees, graphs, and sorting techniques.',
      duration: 20,
      passingPercentage: 50,
      createdBy: teacher._id,
      questions: [
        {
          questionText: 'What is the worst-case time complexity of QuickSort?',
          options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
          correctAnswer: 2,
          marks: 2
        },
        {
          questionText: 'Which data structure follows the Last-In First-Out (LIFO) principle?',
          options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'],
          correctAnswer: 1,
          marks: 1
        },
        {
          questionText: 'What is the average time complexity to search an element in a Hash Table?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctAnswer: 0,
          marks: 1
        },
        {
          questionText: 'Which traversal of a Binary Search Tree produces values in sorted ascending order?',
          options: ['Pre-order', 'Post-order', 'In-order', 'Level-order'],
          correctAnswer: 2,
          marks: 2
        },
        {
          questionText: 'Which algorithm is typically used to find the shortest path in a weighted graph with non-negative edges?',
          options: ['Dijkstra’s Algorithm', 'Kruskal’s Algorithm', 'Floyd-Warshall', 'Depth-First Search'],
          correctAnswer: 0,
          marks: 2
        },
        {
          questionText: 'What is the minimum number of queues needed to implement a stack?',
          options: ['1', '2', '3', 'None, it is impossible'],
          correctAnswer: 1,
          marks: 2
        }
      ]
    });

    const dbQuiz = await Quiz.create({
      title: 'Database Management Systems & SQL',
      subject: 'Information Technology',
      description:
        'Evaluate your proficiency in relational models, SQL queries, normalization forms, and ACID transaction properties.',
      duration: 15,
      passingPercentage: 50,
      createdBy: teacher._id,
      questions: [
        {
          questionText: 'What does the "A" in ACID database transactions stand for?',
          options: ['Availability', 'Atomicity', 'Authentication', 'Authorization'],
          correctAnswer: 1,
          marks: 1
        },
        {
          questionText: 'Which SQL clause is used to filter records resulting from an aggregate function like COUNT or AVG?',
          options: ['WHERE', 'GROUP BY', 'HAVING', 'ORDER BY'],
          correctAnswer: 2,
          marks: 1
        },
        {
          questionText: 'What normal form eliminates transitive dependencies in relational tables?',
          options: ['1NF', '2NF', '3NF', 'BCNF'],
          correctAnswer: 2,
          marks: 1
        },
        {
          questionText: 'Which of the following database concepts ensures referential integrity between tables?',
          options: ['Primary Key', 'Foreign Key', 'Candidate Key', 'Surrogate Key'],
          correctAnswer: 1,
          marks: 1
        },
        {
          questionText: 'Which type of index is physically stored in the same order as the actual data rows in SQL Server?',
          options: ['Non-clustered index', 'Clustered index', 'Bitmap index', 'B-Tree secondary index'],
          correctAnswer: 1,
          marks: 1
        }
      ]
    });

    // 4. Create Sample Attempts for Alice and Bob
    // Alice's attempt on Web Quiz (Scored 7 out of 8, PASS)
    const evaluatedAnswersAlice = webQuiz.questions.map((q, idx) => ({
      questionId: q._id,
      questionText: q.questionText,
      options: q.options,
      selectedOption: idx === 3 ? 0 : q.correctAnswer, // Got question 4 wrong
      correctOption: q.correctAnswer,
      isCorrect: idx !== 3,
      marksAwarded: idx !== 3 ? 1 : 0,
      maxMarks: 1
    }));

    await QuizAttempt.create({
      student: student1._id,
      quiz: webQuiz._id,
      answers: evaluatedAnswersAlice,
      score: 7,
      totalMarks: 8,
      percentage: 87.5,
      correctAnswers: 7,
      wrongAnswers: 1,
      unanswered: 0,
      result: 'PASS',
      timeSpentSeconds: 420,
      attemptedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
    });

    // Bob's attempt on Web Quiz (Scored 4 out of 8, FAIL)
    const evaluatedAnswersBob = webQuiz.questions.map((q, idx) => ({
      questionId: q._id,
      questionText: q.questionText,
      options: q.options,
      selectedOption: idx % 2 === 0 ? q.correctAnswer : (q.correctAnswer + 1) % 4,
      correctOption: q.correctAnswer,
      isCorrect: idx % 2 === 0,
      marksAwarded: idx % 2 === 0 ? 1 : 0,
      maxMarks: 1
    }));

    await QuizAttempt.create({
      student: student2._id,
      quiz: webQuiz._id,
      answers: evaluatedAnswersBob,
      score: 4,
      totalMarks: 8,
      percentage: 50.0,
      correctAnswers: 4,
      wrongAnswers: 4,
      unanswered: 0,
      result: 'FAIL',
      timeSpentSeconds: 580,
      attemptedAt: new Date(Date.now() - 1000 * 60 * 60 * 18) // 18 hours ago
    });

    // Charlie's attempt on DSA Quiz (Scored 10 out of 10, PASS)
    const dsaTotalMarks = dsaQuiz.questions.reduce((sum, q) => sum + q.marks, 0);
    const evaluatedAnswersCharlie = dsaQuiz.questions.map((q) => ({
      questionId: q._id,
      questionText: q.questionText,
      options: q.options,
      selectedOption: q.correctAnswer,
      correctOption: q.correctAnswer,
      isCorrect: true,
      marksAwarded: q.marks,
      maxMarks: q.marks
    }));

    await QuizAttempt.create({
      student: student3._id,
      quiz: dsaQuiz._id,
      answers: evaluatedAnswersCharlie,
      score: dsaTotalMarks,
      totalMarks: dsaTotalMarks,
      percentage: 100.0,
      correctAnswers: dsaQuiz.questions.length,
      wrongAnswers: 0,
      unanswered: 0,
      result: 'PASS',
      timeSpentSeconds: 710,
      attemptedAt: new Date(Date.now() - 1000 * 60 * 60 * 6) // 6 hours ago
    });

    console.log('Sample data successfully seeded!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;
