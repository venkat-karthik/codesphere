import dotenv from 'dotenv';
dotenv.config();

import { db } from './db';
import { roadmaps, resources, problems, users, communityChannels, liveClasses } from '@shared/schema';
import bcrypt from 'bcryptjs';
async function seed() {
  if (!db) {
    console.error('No DATABASE_URL set — cannot seed.');
    process.exit(1);
  }

  console.log('🌱 Seeding database...');

  // Clear existing seeded data to prevent duplicates on re-run
  await db.delete(resources);
  await db.delete(roadmaps);
  await db.delete(problems);
  await db.delete(communityChannels);
  await db.delete(liveClasses);
  // Keep users — don't wipe real registered accounts, just upsert demo ones

  // ─── Demo Users ───────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('admin123', 12);
  const studentHash = await bcrypt.hash('student123', 12);

  // Upsert admin account — always ensure correct password & role
  await db.insert(users).values({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@codesphere.com',
    password: adminHash,
    role: 'admin',
    level: 10,
    xp: 5000,
    streak: 30,
    theme: 'nature',
    subscriptionType: 'pro',
    totalStudyTime: 0,
  }).onConflictDoUpdate({
    target: users.email,
    set: { password: adminHash, role: 'admin' },
  });

  // Upsert student account — always ensure correct password & role
  await db.insert(users).values({
    firstName: 'Student',
    lastName: 'User',
    email: 'student@codesphere.com',
    password: studentHash,
    role: 'student',
    level: 5,
    xp: 1250,
    streak: 7,
    theme: 'nature',
    subscriptionType: 'free',
    totalStudyTime: 0,
  }).onConflictDoUpdate({
    target: users.email,
    set: { password: studentHash, role: 'student' },
  });

  // ─── Roadmaps ─────────────────────────────────────────────────────────
  await db.insert(roadmaps).values([
    {
      title: 'Frontend Developer',
      description: 'Master modern frontend technologies including React, Vue, and advanced CSS',
      category: 'Web Development',
      difficulty: 'Beginner',
      estimatedTime: '3-4 months',
      modules: [
        { id: 'html', title: 'HTML Fundamentals', completed: false },
        { id: 'css', title: 'CSS Basics', completed: false },
        { id: 'js', title: 'JavaScript Essentials', completed: false },
        { id: 'responsive', title: 'Responsive Design', completed: false },
        { id: 'es6', title: 'ES6+ Features', completed: false },
        { id: 'react', title: 'React Fundamentals', completed: false },
        { id: 'state', title: 'State Management', completed: false },
      ],
    },
    {
      title: 'Backend Developer',
      description: 'Learn server-side development with Node.js, databases, and REST APIs',
      category: 'Web Development',
      difficulty: 'Intermediate',
      estimatedTime: '4-5 months',
      modules: [
        { id: 'node', title: 'Node.js Basics', completed: false },
        { id: 'express', title: 'Express Framework', completed: false },
        { id: 'sql', title: 'SQL & PostgreSQL', completed: false },
        { id: 'rest', title: 'REST API Design', completed: false },
        { id: 'auth', title: 'Authentication & Security', completed: false },
        { id: 'deploy', title: 'Deployment & DevOps', completed: false },
      ],
    },
    {
      title: 'Full Stack Developer',
      description: 'Complete path covering both frontend and backend development',
      category: 'Web Development',
      difficulty: 'Advanced',
      estimatedTime: '6-8 months',
      modules: [
        { id: 'html', title: 'HTML & CSS', completed: false },
        { id: 'js', title: 'JavaScript', completed: false },
        { id: 'react', title: 'React', completed: false },
        { id: 'node', title: 'Node.js & Express', completed: false },
        { id: 'db', title: 'Databases', completed: false },
        { id: 'deploy', title: 'Full Stack Deployment', completed: false },
      ],
    },
    {
      title: 'Data Science',
      description: 'Master Python, machine learning, data analysis, and visualization',
      category: 'Data Science',
      difficulty: 'Intermediate',
      estimatedTime: '5-6 months',
      modules: [
        { id: 'python', title: 'Python Basics', completed: false },
        { id: 'numpy', title: 'NumPy & Pandas', completed: false },
        { id: 'viz', title: 'Data Visualization', completed: false },
        { id: 'ml', title: 'Machine Learning', completed: false },
        { id: 'dl', title: 'Deep Learning Intro', completed: false },
      ],
    },
    {
      title: 'DevOps Engineer',
      description: 'Learn CI/CD, Docker, Kubernetes, and cloud platforms',
      category: 'DevOps',
      difficulty: 'Advanced',
      estimatedTime: '5-6 months',
      modules: [
        { id: 'linux', title: 'Linux Fundamentals', completed: false },
        { id: 'docker', title: 'Docker & Containers', completed: false },
        { id: 'k8s', title: 'Kubernetes', completed: false },
        { id: 'cicd', title: 'CI/CD Pipelines', completed: false },
        { id: 'cloud', title: 'Cloud Platforms (AWS/GCP)', completed: false },
      ],
    },
  ]).onConflictDoNothing();

  // ─── Resources ────────────────────────────────────────────────────────
  await db.insert(resources).values([
    {
      title: 'JavaScript Fundamentals Handbook',
      description: 'A comprehensive guide to JavaScript basics including variables, functions, and objects',
      category: 'javascript',
      type: 'pdf',
      difficulty: 'beginner',
      tags: ['fundamentals', 'basics'],
      downloadCount: 1245,
      fileSize: '2.4 MB',
      pageCount: 42,
      url: 'https://eloquentjavascript.net/Eloquent_JavaScript.pdf',
    },
    {
      title: 'React Hooks Explained',
      description: 'Deep dive into React hooks with practical examples and best practices',
      category: 'react',
      type: 'pdf',
      difficulty: 'intermediate',
      tags: ['hooks', 'react'],
      downloadCount: 887,
      fileSize: '1.8 MB',
      pageCount: 36,
      url: 'https://legacy.reactjs.org/docs/hooks-intro.html',
    },
    {
      title: 'CSS Grid and Flexbox Mastery',
      description: 'Master modern CSS layout techniques with detailed examples',
      category: 'css',
      type: 'pdf',
      difficulty: 'intermediate',
      tags: ['layout', 'css'],
      downloadCount: 756,
      fileSize: '3.2 MB',
      pageCount: 28,
      url: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
    },
    {
      title: 'Building RESTful APIs with Node.js',
      description: 'Learn to create robust APIs using Node.js, Express, and PostgreSQL',
      category: 'nodejs',
      type: 'pdf',
      difficulty: 'advanced',
      tags: ['backend', 'api'],
      downloadCount: 632,
      fileSize: '4.1 MB',
      pageCount: 54,
      url: 'https://nodejs.org/en/docs/guides/getting-started-guide',
    },
    {
      title: 'TypeScript for React Developers',
      description: 'Practical guide to using TypeScript with React for type-safe applications',
      category: 'typescript',
      type: 'pdf',
      difficulty: 'intermediate',
      tags: ['typescript', 'react'],
      downloadCount: 543,
      fileSize: '2.7 MB',
      pageCount: 48,
      url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    },
    {
      title: 'HTML5 Semantic Elements Guide',
      description: 'Comprehensive guide to semantic HTML for better accessibility and SEO',
      category: 'html',
      type: 'pdf',
      difficulty: 'beginner',
      tags: ['html', 'accessibility'],
      downloadCount: 421,
      fileSize: '1.5 MB',
      pageCount: 32,
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element',
    },
  ]).onConflictDoNothing();

  // ─── Problems ─────────────────────────────────────────────────────────
  await db.insert(problems).values([
    // ── Arrays Easy ──
    { title: 'Two Sum', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', difficulty: 'Easy', category: 'Arrays', tags: ['Array', 'Hash Table'], xpReward: 100, isDaily: true, hints: ['Use a hash map for O(n) time', 'For each x, check if target-x exists'], solution: 'https://leetcode.com/problems/two-sum/' },
    { title: 'Best Time to Buy and Sell Stock', description: 'Find the maximum profit from buying and selling a stock once.', difficulty: 'Easy', category: 'Arrays', tags: ['Array', 'Dynamic Programming'], xpReward: 100, isDaily: false, hints: ['Track minimum price seen so far', 'profit = current - min'], solution: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
    { title: 'Plus One', description: 'Given a large integer represented as an integer array digits, increment the large integer by one and return the resulting array.', difficulty: 'Easy', category: 'Arrays', tags: ['Array', 'Math'], xpReward: 80, isDaily: false, hints: ['Handle carry from the last digit', 'Edge case: all 9s'], solution: 'https://leetcode.com/problems/plus-one/' },
    { title: 'Move Zeroes', description: 'Move all 0s to the end of the array while maintaining the relative order of the non-zero elements.', difficulty: 'Easy', category: 'Arrays', tags: ['Array', 'Two Pointers'], xpReward: 80, isDaily: false, hints: ['Two pointer approach', 'Swap non-zero with zero'], solution: 'https://leetcode.com/problems/move-zeroes/' },
    { title: 'Running Sum of 1d Array', description: 'Given an array nums, return the running sum where runningSum[i] = sum(nums[0]…nums[i]).', difficulty: 'Easy', category: 'Arrays', tags: ['Array', 'Prefix Sum'], xpReward: 80, isDaily: false, hints: ['Accumulate sum in-place'], solution: 'https://leetcode.com/problems/running-sum-of-1d-array/' },
    { title: 'Majority Element', description: 'Given an array nums of size n, return the majority element (appears more than n/2 times).', difficulty: 'Easy', category: 'Arrays', tags: ['Array', 'Hash Table', 'Sorting'], xpReward: 100, isDaily: false, hints: ['Boyer-Moore Voting Algorithm', 'Or sort and return middle'], solution: 'https://leetcode.com/problems/majority-element/' },
    { title: 'Squares of a Sorted Array', description: 'Given an integer array sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.', difficulty: 'Easy', category: 'Arrays', tags: ['Array', 'Two Pointers', 'Sorting'], xpReward: 80, isDaily: false, hints: ['Two pointers from both ends', 'Compare absolute values'], solution: 'https://leetcode.com/problems/squares-of-a-sorted-array/' },
    { title: "Pascal's Triangle", description: "Given an integer numRows, return the first numRows of Pascal's triangle.", difficulty: 'Easy', category: 'Arrays', tags: ['Array', 'Dynamic Programming'], xpReward: 80, isDaily: false, hints: ['Each element = sum of two above', 'Start with [1]'], solution: "https://leetcode.com/problems/pascals-triangle/" },
    // ── Arrays Medium ──
    { title: 'Merge Intervals', description: 'Given an array of intervals, merge all overlapping intervals.', difficulty: 'Medium', category: 'Arrays', tags: ['Array', 'Sorting'], xpReward: 250, isDaily: false, hints: ['Sort by start time', 'Merge if current start <= prev end'], solution: 'https://leetcode.com/problems/merge-intervals/' },
    { title: '3Sum', description: 'Find all unique triplets in the array which gives the sum of zero.', difficulty: 'Medium', category: 'Arrays', tags: ['Array', 'Two Pointers', 'Sorting'], xpReward: 300, isDaily: false, hints: ['Sort first', 'Fix one, two-pointer for rest', 'Skip duplicates'], solution: 'https://leetcode.com/problems/3sum/' },
    { title: 'Product of Array Except Self', description: 'Return an array where each element is the product of all other elements. No division allowed.', difficulty: 'Medium', category: 'Arrays', tags: ['Array', 'Prefix Sum'], xpReward: 250, isDaily: false, hints: ['Prefix products left pass', 'Suffix products right pass'], solution: 'https://leetcode.com/problems/product-of-array-except-self/' },
    { title: 'Subarray Sum Equals K', description: 'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals k.', difficulty: 'Medium', category: 'Arrays', tags: ['Array', 'Hash Table', 'Prefix Sum'], xpReward: 250, isDaily: false, hints: ['Prefix sum + hash map', 'count[prefixSum - k]'], solution: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
    { title: 'Container With Most Water', description: 'Find two lines that together with the x-axis form a container that holds the most water.', difficulty: 'Medium', category: 'Arrays', tags: ['Array', 'Two Pointers', 'Greedy'], xpReward: 250, isDaily: false, hints: ['Two pointers from ends', 'Move the shorter line inward'], solution: 'https://leetcode.com/problems/container-with-most-water/' },
    { title: 'Jump Game', description: 'Given an array of non-negative integers, determine if you can reach the last index.', difficulty: 'Medium', category: 'Arrays', tags: ['Array', 'Greedy', 'Dynamic Programming'], xpReward: 250, isDaily: false, hints: ['Track max reachable index', 'Greedy: update max reach at each step'], solution: 'https://leetcode.com/problems/jump-game/' },
    // ── Arrays Hard ──
    { title: 'First Missing Positive', description: 'Given an unsorted integer array nums, return the smallest missing positive integer. Must run in O(n) time and O(1) space.', difficulty: 'Hard', category: 'Arrays', tags: ['Array', 'Hash Table'], xpReward: 400, isDaily: false, hints: ['Place each number in its correct index', 'Scan for first index where nums[i] != i+1'], solution: 'https://leetcode.com/problems/first-missing-positive/' },
    { title: 'Largest Rectangle in Histogram', description: 'Given an array of integers heights representing the histogram bar heights, find the area of the largest rectangle.', difficulty: 'Hard', category: 'Arrays', tags: ['Array', 'Stack', 'Monotonic Stack'], xpReward: 400, isDaily: false, hints: ['Use a monotonic stack', 'Pop when current bar is shorter'], solution: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
    // ── Dynamic Programming Easy ──
    { title: 'Maximum Subarray', description: 'Find the contiguous subarray with the largest sum and return its sum.', difficulty: 'Easy', category: 'Dynamic Programming', tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'], xpReward: 100, isDaily: false, hints: ["Kadane's algorithm", 'currentSum = max(num, currentSum + num)'], solution: 'https://leetcode.com/problems/maximum-subarray/' },
    { title: 'Climbing Stairs', description: 'You can climb 1 or 2 steps. How many distinct ways can you climb to the top of n stairs?', difficulty: 'Easy', category: 'Dynamic Programming', tags: ['Math', 'Dynamic Programming', 'Memoization'], xpReward: 100, isDaily: false, hints: ['Fibonacci pattern', 'dp[i] = dp[i-1] + dp[i-2]'], solution: 'https://leetcode.com/problems/climbing-stairs' },
    { title: 'Counting Bits', description: 'For every number i in the range [0, n], count the number of 1s in its binary representation.', difficulty: 'Easy', category: 'Dynamic Programming', tags: ['Dynamic Programming', 'Bit Manipulation'], xpReward: 80, isDaily: false, hints: ['dp[i] = dp[i >> 1] + (i & 1)'], solution: 'https://leetcode.com/problems/counting-bits/' },
    // ── Dynamic Programming Medium ──
    { title: 'Coin Change', description: 'Return the fewest number of coins needed to make up the given amount. Return -1 if impossible.', difficulty: 'Medium', category: 'Dynamic Programming', tags: ['Array', 'Dynamic Programming', 'BFS'], xpReward: 250, isDaily: false, hints: ['Bottom-up DP', 'dp[i] = min(dp[i], dp[i-coin]+1)'], solution: 'https://leetcode.com/problems/coin-change/' },
    { title: 'Word Break', description: 'Given a string s and a dictionary wordDict, return true if s can be segmented into dictionary words.', difficulty: 'Medium', category: 'Dynamic Programming', tags: ['Hash Table', 'String', 'Dynamic Programming', 'Trie'], xpReward: 250, isDaily: false, hints: ['dp[i] = true if s[0..i] can be segmented', 'Check all substrings ending at i'], solution: 'https://leetcode.com/problems/word-break/' },
    { title: 'House Robber', description: 'Rob houses without robbing two adjacent ones. Return the maximum amount you can rob.', difficulty: 'Medium', category: 'Dynamic Programming', tags: ['Array', 'Dynamic Programming'], xpReward: 250, isDaily: false, hints: ['dp[i] = max(dp[i-1], dp[i-2] + nums[i])'], solution: 'https://leetcode.com/problems/house-robber/' },
    { title: 'Longest Increasing Subsequence', description: 'Return the length of the longest strictly increasing subsequence.', difficulty: 'Medium', category: 'Dynamic Programming', tags: ['Array', 'Binary Search', 'Dynamic Programming'], xpReward: 250, isDaily: false, hints: ['dp[i] = max LIS ending at i', 'Or use patience sorting with binary search'], solution: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
    // ── Dynamic Programming Hard ──
    { title: 'Trapping Rain Water', description: 'Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.', difficulty: 'Hard', category: 'Dynamic Programming', tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'], xpReward: 400, isDaily: false, hints: ['Two pointer: track maxLeft and maxRight', 'water[i] = min(maxL, maxR) - height[i]'], solution: 'https://leetcode.com/problems/trapping-rain-water/' },
    { title: 'Edit Distance', description: 'Given two strings word1 and word2, return the minimum number of operations to convert word1 to word2.', difficulty: 'Hard', category: 'Dynamic Programming', tags: ['String', 'Dynamic Programming'], xpReward: 400, isDaily: false, hints: ['2D DP table', 'dp[i][j] = min ops to convert word1[0..i] to word2[0..j]'], solution: 'https://leetcode.com/problems/edit-distance/' },
    // ── Strings Easy ──
    { title: 'Longest Common Prefix', description: 'Write a function to find the longest common prefix string amongst an array of strings.', difficulty: 'Easy', category: 'Strings', tags: ['String', 'Trie'], xpReward: 80, isDaily: false, hints: ['Compare character by character', 'Use first string as reference'], solution: 'https://leetcode.com/problems/longest-common-prefix/' },
    { title: 'Roman to Integer', description: 'Convert a Roman numeral string to an integer.', difficulty: 'Easy', category: 'Strings', tags: ['Hash Table', 'Math', 'String'], xpReward: 80, isDaily: false, hints: ['Map each symbol to value', 'Subtract if smaller value precedes larger'], solution: 'https://leetcode.com/problems/roman-to-integer/' },
    // ── Strings Medium ──
    { title: 'Longest Substring Without Repeating Characters', description: 'Find the length of the longest substring without repeating characters.', difficulty: 'Medium', category: 'Strings', tags: ['Hash Table', 'String', 'Sliding Window'], xpReward: 250, isDaily: false, hints: ['Sliding window with a set', 'Shrink window when duplicate found'], solution: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
    { title: 'Longest Palindromic Substring', description: 'Given a string s, return the longest palindromic substring in s.', difficulty: 'Medium', category: 'Strings', tags: ['String', 'Dynamic Programming'], xpReward: 250, isDaily: false, hints: ['Expand around center', 'Check both odd and even length palindromes'], solution: 'https://leetcode.com/problems/longest-palindromic-substring/' },
    { title: 'Group Anagrams', description: 'Given an array of strings strs, group the anagrams together.', difficulty: 'Medium', category: 'Strings', tags: ['Array', 'Hash Table', 'String', 'Sorting'], xpReward: 250, isDaily: false, hints: ['Sort each string as key', 'Use sorted string as hash map key'], solution: 'https://leetcode.com/problems/group-anagrams/' },
    // ── Trees Easy ──
    { title: 'Maximum Depth of Binary Tree', description: 'Given the root of a binary tree, return its maximum depth.', difficulty: 'Easy', category: 'Trees', tags: ['Tree', 'DFS', 'BFS', 'Binary Tree'], xpReward: 80, isDaily: false, hints: ['Recursive: 1 + max(left, right)', 'Or BFS level count'], solution: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
    { title: 'Invert Binary Tree', description: 'Given the root of a binary tree, invert the tree, and return its root.', difficulty: 'Easy', category: 'Trees', tags: ['Tree', 'DFS', 'BFS', 'Binary Tree'], xpReward: 80, isDaily: false, hints: ['Swap left and right children recursively'], solution: 'https://leetcode.com/problems/invert-binary-tree/' },
    { title: 'Symmetric Tree', description: 'Given the root of a binary tree, check whether it is a mirror of itself.', difficulty: 'Easy', category: 'Trees', tags: ['Tree', 'DFS', 'BFS', 'Binary Tree'], xpReward: 80, isDaily: false, hints: ['Compare left.left with right.right and left.right with right.left'], solution: 'https://leetcode.com/problems/symmetric-tree/' },
    // ── Trees Medium ──
    { title: 'Binary Tree Level Order Traversal', description: 'Return the level order traversal of a binary tree\'s node values.', difficulty: 'Medium', category: 'Trees', tags: ['Tree', 'BFS', 'Binary Tree'], xpReward: 250, isDaily: false, hints: ['BFS with queue', 'Track level size to group nodes'], solution: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
    { title: 'Validate Binary Search Tree', description: 'Given the root of a binary tree, determine if it is a valid binary search tree.', difficulty: 'Medium', category: 'Trees', tags: ['Tree', 'DFS', 'Binary Search Tree', 'Binary Tree'], xpReward: 250, isDaily: false, hints: ['Pass min/max bounds recursively', 'In-order traversal should be sorted'], solution: 'https://leetcode.com/problems/validate-binary-search-tree/' },
    // ── Graphs Medium ──
    { title: 'Number of Islands', description: 'Given an m x n 2D binary grid, return the number of islands.', difficulty: 'Medium', category: 'Graphs', tags: ['Array', 'DFS', 'BFS', 'Union Find', 'Matrix'], xpReward: 250, isDaily: false, hints: ['DFS/BFS to mark visited land', 'Increment count for each unvisited land cell'], solution: 'https://leetcode.com/problems/number-of-islands/' },
    { title: 'Clone Graph', description: 'Given a reference of a node in a connected undirected graph, return a deep copy of the graph.', difficulty: 'Medium', category: 'Graphs', tags: ['Hash Table', 'DFS', 'BFS', 'Graph'], xpReward: 250, isDaily: false, hints: ['DFS with a visited map', 'Map original node to its clone'], solution: 'https://leetcode.com/problems/clone-graph/' },
    // ── Linked Lists ──
    { title: 'Reverse Linked List', description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.', difficulty: 'Easy', category: 'Linked Lists', tags: ['Linked List', 'Recursion'], xpReward: 100, isDaily: false, hints: ['Three pointers: prev, curr, next', 'Or recursion'], solution: 'https://leetcode.com/problems/reverse-linked-list/' },
    { title: 'Merge Two Sorted Lists', description: 'Merge two sorted linked lists and return it as a sorted list.', difficulty: 'Easy', category: 'Linked Lists', tags: ['Linked List', 'Recursion'], xpReward: 100, isDaily: false, hints: ['Compare heads, take smaller', 'Recursion works cleanly'], solution: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
    { title: 'Linked List Cycle', description: 'Given head of a linked list, determine if the linked list has a cycle.', difficulty: 'Easy', category: 'Linked Lists', tags: ['Hash Table', 'Linked List', 'Two Pointers'], xpReward: 80, isDaily: false, hints: ["Floyd's cycle detection", 'Fast and slow pointers'], solution: 'https://leetcode.com/problems/linked-list-cycle/' },
    { title: 'LRU Cache', description: 'Design a data structure that follows the Least Recently Used cache constraint with O(1) get and put.', difficulty: 'Hard', category: 'Linked Lists', tags: ['Hash Table', 'Linked List', 'Design', 'Doubly-Linked List'], xpReward: 400, isDaily: false, hints: ['HashMap + Doubly Linked List', 'Move accessed node to head'], solution: 'https://leetcode.com/problems/lru-cache/' },
    // ── Binary Search ──
    { title: 'Binary Search', description: 'Given a sorted array of integers, return the index of the target, or -1 if not found.', difficulty: 'Easy', category: 'Binary Search', tags: ['Array', 'Binary Search'], xpReward: 80, isDaily: false, hints: ['left = 0, right = n-1', 'mid = (left+right)//2'], solution: 'https://leetcode.com/problems/binary-search/' },
    { title: 'Search in Rotated Sorted Array', description: 'Search for a target in a rotated sorted array. Return its index or -1.', difficulty: 'Medium', category: 'Binary Search', tags: ['Array', 'Binary Search'], xpReward: 250, isDaily: false, hints: ['Determine which half is sorted', 'Check if target is in sorted half'], solution: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
    { title: 'Median of Two Sorted Arrays', description: 'Given two sorted arrays nums1 and nums2, return the median of the two sorted arrays. O(log(m+n)) time.', difficulty: 'Hard', category: 'Binary Search', tags: ['Array', 'Binary Search', 'Divide and Conquer'], xpReward: 400, isDaily: false, hints: ['Binary search on the smaller array', 'Partition both arrays'], solution: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
    // ── Stack ──
    { title: 'Valid Parentheses', description: 'Determine if the input string containing brackets is valid.', difficulty: 'Easy', category: 'Stack', tags: ['String', 'Stack'], xpReward: 100, isDaily: false, hints: ['Push opening, pop on closing', 'Stack empty at end = valid'], solution: 'https://leetcode.com/problems/valid-parentheses/' },
    { title: 'Min Stack', description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.', difficulty: 'Easy', category: 'Stack', tags: ['Stack', 'Design'], xpReward: 100, isDaily: false, hints: ['Use auxiliary stack for minimums', 'Push min alongside each element'], solution: 'https://leetcode.com/problems/min-stack/' },
    { title: 'Daily Temperatures', description: 'Return an array where answer[i] is the number of days until a warmer temperature.', difficulty: 'Medium', category: 'Stack', tags: ['Array', 'Stack', 'Monotonic Stack'], xpReward: 250, isDaily: false, hints: ['Monotonic decreasing stack', 'Store indices, pop when warmer found'], solution: 'https://leetcode.com/problems/daily-temperatures/' },
    // ── Heap ──
    { title: 'K Closest Points to Origin', description: 'Given an array of points, return the k closest points to the origin.', difficulty: 'Medium', category: 'Heap', tags: ['Array', 'Math', 'Divide and Conquer', 'Sorting', 'Heap'], xpReward: 250, isDaily: false, hints: ['Max heap of size k', 'Or sort by distance'], solution: 'https://leetcode.com/problems/k-closest-points-to-origin/' },
    { title: 'Merge K Sorted Lists', description: 'Merge k sorted linked lists and return it as one sorted list.', difficulty: 'Hard', category: 'Heap', tags: ['Linked List', 'Divide and Conquer', 'Heap', 'Merge Sort'], xpReward: 400, isDaily: false, hints: ['Min heap with k elements', 'Or divide and conquer merge'], solution: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
    // ── Math ──
    { title: 'Palindrome Number', description: 'Given an integer x, return true if x is a palindrome.', difficulty: 'Easy', category: 'Math', tags: ['Math'], xpReward: 80, isDaily: false, hints: ['Negative numbers are not palindromes', 'Reverse the number and compare'], solution: 'https://leetcode.com/problems/palindrome-number/' },
    { title: 'Missing Number', description: 'Given an array containing n distinct numbers in range [0, n], find the missing number.', difficulty: 'Easy', category: 'Math', tags: ['Array', 'Hash Table', 'Math', 'Binary Search', 'Bit Manipulation'], xpReward: 80, isDaily: false, hints: ['Expected sum = n*(n+1)/2', 'Missing = expected - actual'], solution: 'https://leetcode.com/problems/missing-number/' },
  ]).onConflictDoNothing();

  // ─── Video Resources ──────────────────────────────────────────────────
  await db.insert(resources).values([
    {
      title: 'React Hooks Complete Guide',
      description: 'Master React Hooks with practical examples — useState, useEffect, useContext, and custom hooks.',
      category: 'react',
      type: 'video',
      difficulty: 'intermediate',
      tags: ['React', 'Hooks', 'useState', 'useEffect'],
      downloadCount: 12500,
      fileSize: '45:30',
      pageCount: null,
      url: 'https://www.youtube.com/watch?v=O6P86uwfdR0',
    },
    {
      title: 'JavaScript ES6+ Features',
      description: 'Learn modern JavaScript features every developer should know — arrow functions, destructuring, promises, async/await.',
      category: 'javascript',
      type: 'video',
      difficulty: 'beginner',
      tags: ['JavaScript', 'ES6', 'Arrow Functions', 'Destructuring'],
      downloadCount: 8900,
      fileSize: '32:15',
      pageCount: null,
      url: 'https://www.youtube.com/watch?v=WZQc7RUAg18',
    },
    {
      title: 'CSS Grid Layout Mastery',
      description: 'Build complex layouts with CSS Grid from basics to advanced techniques.',
      category: 'css',
      type: 'video',
      difficulty: 'intermediate',
      tags: ['CSS', 'Grid', 'Layout', 'Responsive'],
      downloadCount: 7200,
      fileSize: '28:45',
      pageCount: null,
      url: 'https://www.youtube.com/watch?v=jV8B24rSN5o',
    },
    {
      title: 'Node.js REST API from Scratch',
      description: 'Build a production-ready REST API with Node.js, Express, and PostgreSQL.',
      category: 'nodejs',
      type: 'video',
      difficulty: 'intermediate',
      tags: ['Node.js', 'Express', 'REST API', 'PostgreSQL'],
      downloadCount: 6400,
      fileSize: '52:10',
      pageCount: null,
      url: 'https://www.youtube.com/watch?v=l8WPWK9mS5M',
    },
    {
      title: 'TypeScript for Beginners',
      description: 'Get started with TypeScript — types, interfaces, generics, and integrating with React.',
      category: 'typescript',
      type: 'video',
      difficulty: 'beginner',
      tags: ['TypeScript', 'Types', 'Interfaces', 'React'],
      downloadCount: 5800,
      fileSize: '38:20',
      pageCount: null,
      url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
    },
    {
      title: 'Python for Data Science',
      description: 'Learn Python fundamentals for data science — NumPy, Pandas, and Matplotlib.',
      category: 'python',
      type: 'video',
      difficulty: 'beginner',
      tags: ['Python', 'NumPy', 'Pandas', 'Data Science'],
      downloadCount: 9100,
      fileSize: '61:45',
      pageCount: null,
      url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
    },
  ]).onConflictDoNothing();

  // ─── Community Channels ───────────────────────────────────────────────
  await db.insert(communityChannels).values([
    { name: 'general',       description: 'General discussions',          type: 'text',  creatorId: 1, isPrivate: false, memberCount: 0 },
    { name: 'help',          description: 'Get help with coding problems', type: 'text',  creatorId: 1, isPrivate: false, memberCount: 0 },
    { name: 'announcements', description: 'Important updates and news',    type: 'text',  creatorId: 1, isPrivate: false, memberCount: 0 },
    { name: 'javascript',    description: 'JavaScript discussions',        type: 'text',  creatorId: 1, isPrivate: false, memberCount: 0 },
    { name: 'python',        description: 'Python programming help',       type: 'text',  creatorId: 1, isPrivate: false, memberCount: 0 },
    { name: 'react',         description: 'React development',             type: 'text',  creatorId: 1, isPrivate: false, memberCount: 0 },
    { name: 'study-group',   description: 'Voice chat for study sessions', type: 'voice', creatorId: 1, isPrivate: false, memberCount: 0 },
    { name: 'office-hours',  description: 'Live help with instructors',    type: 'voice', creatorId: 1, isPrivate: false, memberCount: 0 },
  ]).onConflictDoNothing();

  // ─── Live Classes ───────────────────────────────────────────────────────
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(14, 0, 0, 0);

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  dayAfter.setHours(10, 0, 0, 0);

  await db.insert(liveClasses).values([
    {
      title: 'JavaScript Fundamentals Live Session',
      description: 'Interactive session covering JavaScript basics, ES6 features, and modern development practices.',
      instructorId: '1',
      instructorName: 'Sarah Chen',
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000),
      status: 'scheduled',
      maxParticipants: 30,
      currentParticipants: 12,
      roomId: 'room_sample_1',
      isRecording: false,
      tags: ['JavaScript', 'Beginner', 'ES6'],
    },
    {
      title: 'React Hooks Deep Dive',
      description: 'Advanced React concepts including custom hooks, context API, and performance optimization.',
      instructorId: '2',
      instructorName: 'Mike Rodriguez',
      startTime: dayAfter,
      endTime: new Date(dayAfter.getTime() + 1.5 * 60 * 60 * 1000),
      status: 'scheduled',
      maxParticipants: 25,
      currentParticipants: 8,
      roomId: 'room_sample_2',
      isRecording: false,
      tags: ['React', 'Advanced', 'Hooks'],
    },
  ]).onConflictDoNothing();

  console.log('✅ Seed complete.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
