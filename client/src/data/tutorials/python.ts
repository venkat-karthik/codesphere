export const pythonTutorial = {
  title: "Python For Beginners",
  description: "A beginner-friendly guide to the Python programming language.",
  topics: [
    {
      slug: "introduction",
      title: "1. Introduction to Python",
      content: [
        {
          type: "paragraph",
          text: "Welcome to the world of Python! Python is a simple and powerful programming language. Think of it like a special language that computers understand. We use it to give computers instructions.",
        },
        {
          type: "paragraph",
          text: "Why is Python so popular? Because its instructions look a lot like plain English, making it easier to read and write than many other languages. It's used for everything from building websites to creating games and analyzing data!",
        },
        {
          type: "header",
          text: "Your First Python Code",
        },
        {
          type: "paragraph",
          text: "Let's write your first line of Python code. This simple command will tell the computer to display the message 'Hello, World!'.",
        },
        {
          type: "code",
          language: "python",
          code: `print("Hello, World!")`,
        },
        {
          type: "paragraph",
          text: "When you run this code, the computer will show: `Hello, World!` on the screen. `print()` is a special command, or 'function', that tells the computer to display whatever you put inside the parentheses.",
        },
      ],
    },
    {
      slug: "syntax",
      title: "2. Basic Syntax",
      content: [
        {
          type: "paragraph",
          text: "Python's syntax is known for being clean and readable. The most important rule is indentation.",
        },
        {
          type: "header",
          text: "Indentation Matters",
        },
        {
          type: "paragraph",
          text: "In Python, you use spaces (usually four) at the beginning of a line to create a block of code. Other languages might use curly braces `{}`, but Python uses indentation. This makes the code look clean and organized.",
        },
        {
          type: "code",
          language: "python",
          code: `
if 5 > 2:
    print("Five is greater than two!") # This line is inside the 'if' block
          `,
        },
        {
            type: "paragraph",
            text: "If you forget the indentation, Python will give you an error. It's a strict rule, but it helps make all Python code look similar and easy to read.",
        }
      ],
    },
    {
      slug: "variables",
      title: "3. Variables & Data Types",
      content: [
        {
          type: "paragraph",
          text: "Imagine you have a box where you can store things. A variable is just like that box, but it holds a value in your code. You give it a name so you can find it later.",
        },
        {
          type: "header",
          text: "Creating Variables",
        },
        {
          type: "paragraph",
          text: "Creating a variable is as simple as choosing a name and giving it a value using the equals sign (`=`).",
        },
        {
          type: "code",
          language: "python",
          code: `
name = "Alice"  # A variable 'name' to store text
age = 10         # A variable 'age' to store a number
          `,
        },
        {
          type: "header",
          text: "Common Data Types",
        },
        {
            type: "paragraph",
            text: "Variables can hold different types of data. Here are the most common ones:"
        },
        {
            type: "list",
            items: [
                "**Text (String)**: Any text, like `'Hello'` or `'Alice'`. You use single or double quotes.",
                "**Number (Integer)**: A whole number, like `10` or `100`.",
                "**Number (Float)**: A number with a decimal point, like `3.14`.",
                "**Boolean**: Represents `True` or `False`. Used for making decisions."
            ]
        },
         {
          type: "code",
          language: "python",
          code: `
my_string = "This is a string"
my_integer = 25
my_float = 9.5
is_student = True # This is a boolean
          `,
        },
      ],
    },
    {
        slug: "control-structures",
        title: "4. Control Structures",
        content: [
            {
                type: 'paragraph',
                text: "Control structures let you control the flow of your program. They help your program make decisions and repeat actions."
            },
            {
                type: 'header',
                text: "The 'if' Statement"
            },
            {
                type: 'paragraph',
                text: "An `if` statement runs a block of code only if a certain condition is true."
            },
            {
                type: 'code',
                language: 'python',
                code: `
temperature = 30
if temperature > 25:
    print("It's a hot day!")
                `
            },
            {
                type: 'header',
                text: "The 'for' Loop"
            },
            {
                type: 'paragraph',
                text: "A `for` loop is used to repeat an action for each item in a sequence (like a list of numbers)."
            },
            {
                type: 'code',
                language: 'python',
                code: `
# This will print the numbers 0, 1, 2, 3, 4
for i in range(5):
    print(i)
                `
            }
        ]
    },
    {
        slug: "functions",
        title: "5. Functions",
        content: [
            {
                type: 'paragraph',
                text: "A function is a reusable block of code that performs a specific task. You can 'call' a function whenever you need it to run."
            },
            {
                type: 'header',
                text: "Creating a Function"
            },
            {
                type: 'paragraph',
                text: "You create a function using the `def` keyword, followed by a name and parentheses `()`."
            },
            {
                type: 'code',
                language: 'python',
                code: `
def greet():
    print("Hello from a function!")

# Call the function to run its code
greet()
                `
            },
            {
                type: 'header',
                text: "Function with Parameters"
            },
            {
                type: 'paragraph',
                text: "You can pass data into a function through 'parameters' (variables inside the parentheses)."
            },
            {
                type: 'code',
                language: 'python',
                code: `
def greet_person(name):
    print(f"Hello, {name}!")

# Call the function with a specific name
greet_person("Bob") # Outputs: Hello, Bob!
                `
            }
        ]
    }
  ],
}; 