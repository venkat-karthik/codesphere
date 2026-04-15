export const cTutorial = {
  title: "C For Beginners",
  description: "A beginner-friendly guide to the C programming language.",
  topics: [
    {
      slug: "introduction",
      title: "1. Introduction to C",
      content: [
        {
          type: "paragraph",
          text: "Welcome to C! C is one of the oldest and most powerful programming languages. Think of it as the 'grandfather' of many modern languages like C++, Java, and Python. Learning C helps you understand how computers work at a deeper level.",
        },
        {
          type: "paragraph",
          text: "C is known for being fast and efficient. It's used to create operating systems, web browsers, and other software where performance is very important.",
        },
        {
          type: "header",
          text: "Your First C Program",
        },
        {
          type: "paragraph",
          text: "Let's write your first C program. This program will print 'Hello, World!' to the screen. Every C program starts with a `main` function—it's the entry point of the program.",
        },
        {
          type: "code",
          language: "c",
          code: `
#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}
          `,
        },
        {
          type: "paragraph",
          text: "`#include <stdio.h>` is a special instruction that includes a library for standard input and output. `printf()` is the function we use to print text.",
        },
      ],
    },
    {
      slug: "syntax",
      title: "2. Basic Syntax",
      content: [
        {
          type: "paragraph",
          text: "C syntax has a few important rules you need to follow.",
        },
        {
          type: "header",
          text: "Semicolons and Curly Braces",
        },
        {
          type: "paragraph",
          text: "Every statement in C must end with a semicolon `;`. This tells the computer that the instruction is finished. We use curly braces `{}` to group statements together into a block, like in our `main` function.",
        },
        {
          type: "code",
          language: "c",
          code: `
int main() {
    // This is a block of code
    printf("First line;");
    printf("Second line;");
}
          `,
        },
        {
            type: "paragraph",
            text: "Forgetting a semicolon is a very common mistake for beginners!",
        }
      ],
    },
    {
      slug: "variables-data-types",
      title: "3. Variables & Data Types",
      content: [
        {
          type: "paragraph",
          text: "A variable is a container for storing a value. In C, you must tell the computer what type of data the variable will hold.",
        },
        {
          type: "header",
          text: "Declaring Variables",
        },
        {
          type: "paragraph",
          text: "Before you use a variable, you must 'declare' it by specifying its type and name.",
        },
        {
          type: "header",
          text: "Common Data Types",
        },
        {
            type: "list",
            items: [
                "**`int`**: For whole numbers (e.g., `5`, `-10`).",
                "**`float`**: For numbers with decimal points (e.g., `3.14`, `-0.5`).",
                "**`char`**: For a single character (e.g., `'A'`, `'b'`)."
            ]
        },
         {
          type: "code",
          language: "c",
          code: `
int age = 25;           // An integer
float weight = 68.5;    // A float
char initial = 'J';     // A character

printf("Age: %d", age); // %d is a placeholder for an integer
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
                text: "Control structures allow your program to make decisions and repeat actions."
            },
            {
                type: 'header',
                text: "The 'if-else' Statement"
            },
            {
                type: 'paragraph',
                text: "This statement runs a piece of code if a condition is true, and another piece of code if it's false."
            },
            {
                type: 'code',
                language: 'c',
                code: `
int score = 85;
if (score > 60) {
    printf("You passed!");
} else {
    printf("You failed.");
}
                `
            },
            {
                type: 'header',
                text: "The 'for' Loop"
            },
            {
                type: 'paragraph',
                text: "A `for` loop repeats a block of code a specific number of times."
            },
            {
                type: 'code',
                language: 'c',
                code: `
// This loop prints numbers 0 through 4
for (int i = 0; i < 5; i++) {
    printf("%d\\n", i);
}
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
                text: "A function is a named block of code that performs a task. Using functions helps organize your code into reusable pieces."
            },
            {
                type: 'header',
                text: "Defining and Calling a Function"
            },
            {
                type: 'paragraph',
                text: "Here, we define a function `add` that takes two integers and returns their sum."
            },
            {
                type: 'code',
                language: 'c',
                code: `
#include <stdio.h>

// Function declaration
int add(int a, int b);

int main() {
    int result = add(5, 3); // Calling the function
    printf("Result is: %d", result); // Prints: Result is: 8
    return 0;
}

// Function definition
int add(int a, int b) {
    return a + b;
}
                `
            }
        ]
    },
    {
      slug: "pointers",
      title: "6. Pointers (A Simple Intro)",
      content: [
          {
              type: 'paragraph',
              text: "This is an advanced topic, but let's try a simple explanation. Every variable in C is stored at a specific memory address in your computer."
          },
          {
              type: 'paragraph',
              text: "A **pointer** is a special variable that holds the *memory address* of another variable. Instead of holding a value like `10` or `'A'`, it holds the location of that value."
          },
          {
              type: 'header',
              text: "Why Use Pointers?"
          },
          {
            type: 'paragraph',
            text: "They are very powerful for making your programs more efficient, especially when working with large amounts of data."
          },
          {
              type: 'code',
              language: 'c',
              code: `
#include <stdio.h>

int main() {
    int age = 30;
    
    // A pointer 'pAge' that stores the memory address of the 'age' variable.
    int *pAge = &age;

    printf("The memory address of age is: %p\\n", pAge);
    
    // To get the value back from the pointer, we use *
    printf("The value stored at that address is: %d\\n", *pAge);

    return 0;
}
              `
          },
          {
            type: 'paragraph',
            text: "Don't worry if this seems confusing at first! It's one of the trickiest parts of C."
          }
      ]
  }
  ],
}; 