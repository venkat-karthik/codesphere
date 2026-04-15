export const javaTutorial = {
  title: "Java For Beginners",
  description: "A beginner-friendly guide to the Java programming language.",
  topics: [
    {
      slug: "introduction",
      title: "1. Introduction to Java",
      content: [
        {
          type: "paragraph",
          text: "Hello and welcome to Java! Java is a very popular and versatile programming language. It's famous for its 'write once, run anywhere' philosophy, which means a Java program can run on any computer that has the Java Virtual Machine (JVM).",
        },
        {
          type: "paragraph",
          text: "Java is used to build everything from mobile apps (Android is largely built on Java) to large-scale enterprise applications for big companies.",
        },
        {
          type: "header",
          text: "Your First Java Program",
        },
        {
          type: "paragraph",
          text: "Let's write your first Java program. In Java, all code must live inside a 'class'. A class is like a blueprint for creating objects. The `main` method is the starting point for any Java program.",
        },
        {
          type: "code",
          language: "java",
          code: `
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
          `,
        },
        {
          type: "paragraph",
          text: "`public class Main` declares a class named `Main`. `System.out.println()` is the command used to print text to the console. It's a bit long, but it's very precise!",
        },
      ],
    },
    {
      slug: "syntax",
      title: "2. Basic Syntax",
      content: [
        {
          type: "paragraph",
          text: "Java's syntax is similar to C and C++. It's a 'statically-typed' language, which means you must declare the type of every variable.",
        },
        {
          type: "header",
          text: "Curly Braces, Semicolons, and Classes",
        },
        {
          type: "paragraph",
          text: "Like C, every statement must end with a semicolon `;`. Code blocks are surrounded by curly braces `{}`. And importantly, your file name must match your public class name (e.g., the `Main` class must be in a file named `Main.java`).",
        },
        {
          type: "code",
          language: "java",
          code: `
public class MyProgram { // Class name is MyProgram
    public static void main(String[] args) { // Start of a block
        // This file should be saved as MyProgram.java
        System.out.println("Java is specific!");
    } // End of a block
}
          `,
        },
      ],
    },
    {
      slug: "variables-data-types",
      title: "3. Variables & Data Types",
      content: [
        {
          type: "paragraph",
          text: "In Java, every variable must be declared with a specific data type before you can use it. This helps prevent bugs by ensuring you're always using the right kind of data.",
        },
        {
          type: "header",
          text: "Common Data Types",
        },
        {
            type: "list",
            items: [
                "**`int`**: For whole numbers (e.g., `10`, `-200`).",
                "**`double`**: For floating-point (decimal) numbers (e.g., `19.99`, `-0.01`).",
                "**`boolean`**: Can only be `true` or `false`.",
                "**`char`**: For single characters (e.g., `'a'`, `'%'`).",
                "**`String`**: For sequences of characters (text). Note the capital 'S'!"
            ]
        },
         {
          type: "code",
          language: "java",
          code: `
int score = 100;
double price = 4.99;
boolean isLoggedIn = false;
String greeting = "Hello, Java!";

System.out.println(greeting);
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
                text: "Control structures are used to control the flow of execution in your program."
            },
            {
                type: 'header',
                text: "The 'if-else' Statement"
            },
            {
                type: 'paragraph',
                text: "It allows your program to make decisions based on conditions."
            },
            {
                type: 'code',
                language: 'java',
                code: `
int time = 20;
if (time < 18) {
  System.out.println("Good day.");
} else {
  System.out.println("Good evening.");
}
// Outputs: "Good evening."
                `
            },
            {
                type: 'header',
                text: "The 'for' Loop"
            },
            {
                type: 'paragraph',
                text: "A `for` loop is perfect for when you want to run a block of code a known number of times."
            },
            {
                type: 'code',
                language: 'java',
                code: `
// Prints numbers from 0 to 4
for (int i = 0; i < 5; i++) {
  System.out.println(i);
}
                `
            }
        ]
    },
    {
        slug: "methods",
        title: "5. Methods (Functions in Java)",
        content: [
            {
                type: 'paragraph',
                text: "In Java, functions are called 'methods', and they always belong to a class."
            },
            {
                type: 'header',
                text: "Creating and Calling a Method"
            },
            {
                type: 'paragraph',
                text: "A method is a block of code which only runs when it is called. You can pass data, known as parameters, into a method."
            },
            {
                type: 'code',
                language: 'java',
                code: `
public class Main {
  // Create a method
  static void myMethod(String name) {
    System.out.println("Hello, " + name);
  }

  public static void main(String[] args) {
    myMethod("Alice"); // Call the method with an argument
    myMethod("Bob");
  }
}
                `
            }
        ]
    },
    {
      slug: "oop",
      title: "6. Object-Oriented Programming (OOP)",
      content: [
          {
              type: 'paragraph',
              text: "Java is built on the concept of Object-Oriented Programming. OOP is a way of thinking about programming by modeling real-world things as 'objects'."
          },
          {
              type: 'header',
              text: "Classes and Objects"
          },
          {
            type: 'paragraph',
            text: "A **Class** is a blueprint (like a plan for a house). An **Object** is an instance of a class (like an actual house built from the plan). An object has properties (like color) and methods (like opening a door)."
          },
          {
              type: 'code',
              language: 'java',
              code: `
// Create a class called 'Dog'
class Dog {
  String breed; // Property

  // Method
  void bark() {
    System.out.println("Woof Woof!");
  }
}

public class Main {
    public static void main(String[] args) {
        Dog myDog = new Dog(); // Create a new Dog object
        myDog.breed = "Labrador";
        
        System.out.println("My dog is a " + myDog.breed);
        myDog.bark(); // Call the bark method
    }
}
              `
          },
          {
            type: 'paragraph',
            text: "This is a very simple example of OOP. It's a big topic, but this is the core idea!"
          }
      ]
    }
  ],
}; 