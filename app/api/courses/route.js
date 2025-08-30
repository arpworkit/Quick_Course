import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    // Mock course data - in a real application, this would come from a database
    const courses = [
      {
        id: 1,
        title: "Java",
        instructor: "Arpit",
        description: "Comprehensive Java programming course covering fundamentals to advanced concepts. Learn object-oriented programming, data structures, and build real-world applications.",
        price: 100,
        image: "/icons/course-icon.svg",
        enrolled: false,
        category: "Programming",
        duration: "8 weeks",
        level: "Beginner",
        createdDate: "25/8/2025",
        upiId: "arrpit@ybl",
        materials: [
          {
            fileName: "java-fundamentals-guide.pdf",
            fileType: "application/pdf",
            fileSize: "2.4 MB"
          },
          {
            fileName: "java-exercise-solutions.zip",
            fileType: "application/zip",
            fileSize: "1.8 MB"
          }
        ]
      },
      {
        id: 2,
        title: "Advanced Java",
        instructor: "Rekha",
        description: "Advanced Java programming techniques including Spring Framework, Hibernate, and enterprise application development. Perfect for experienced developers.",
        price: 500,
        image: "/icons/course-icon.svg",
        enrolled: false,
        category: "Programming",
        duration: "12 weeks",
        level: "Intermediate",
        createdDate: "15/7/2025",
        upiId: "rekha@paytm",
        materials: [
          {
            fileName: "spring-framework-tutorial.pdf",
            fileType: "application/pdf",
            fileSize: "3.2 MB"
          },
          {
            fileName: "hibernate-examples.zip",
            fileType: "application/zip",
            fileSize: "2.1 MB"
          },
          {
            fileName: "enterprise-java-project.zip",
            fileType: "application/zip",
            fileSize: "5.6 MB"
          }
        ]
      },
      {
        id: 3,
        title: "Java Mastery",
        instructor: "Ankit",
        description: "Master-level Java course covering microservices, performance optimization, and architectural patterns. Designed for senior developers and architects.",
        price: 200,
        image: "/icons/course-icon.svg",
        enrolled: false,
        category: "Programming",
        duration: "10 weeks",
        level: "Advanced",
        createdDate: "10/9/2025",
        upiId: "ankit@gpay",
        materials: [
          {
            fileName: "microservices-architecture.pdf",
            fileType: "application/pdf",
            fileSize: "4.1 MB"
          },
          {
            fileName: "performance-optimization-guide.pdf",
            fileType: "application/pdf",
            fileSize: "2.8 MB"
          }
        ]
      },
      {
        id: 4,
        title: "Python",
        instructor: "Sarah",
        description: "Complete Python programming course from basics to advanced. Learn web development with Django, data science with pandas, and automation scripting.",
        price: 150,
        image: "/icons/course-icon.svg",
        enrolled: false,
        category: "Programming",
        duration: "6 weeks",
        level: "Beginner",
        createdDate: "5/8/2025",
        upiId: "sarah@phonepe",
        materials: [
          {
            fileName: "python-basics-handbook.pdf",
            fileType: "application/pdf",
            fileSize: "1.9 MB"
          },
          {
            fileName: "django-project-template.zip",
            fileType: "application/zip",
            fileSize: "3.4 MB"
          }
        ]
      },
      {
        id: 5,
        title: "React",
        instructor: "Mike",
        description: "Modern React development course covering hooks, context API, Redux, and testing. Build scalable web applications with the latest React patterns and best practices.",
        price: 300,
        image: "/icons/course-icon.svg",
        enrolled: false,
        category: "Web Development",
        duration: "8 weeks",
        level: "Intermediate",
        createdDate: "20/7/2025",
        upiId: "mike@upi",
        materials: [
          {
            fileName: "react-hooks-guide.pdf",
            fileType: "application/pdf",
            fileSize: "2.7 MB"
          },
          {
            fileName: "redux-toolkit-examples.zip",
            fileType: "application/zip",
            fileSize: "4.2 MB"
          },
          {
            fileName: "react-testing-library-setup.zip",
            fileType: "application/zip",
            fileSize: "1.5 MB"
          }
        ]
      }
    ]

    return NextResponse.json({
      courses,
      total: courses.length
    })

  } catch (error) {
    console.error('Get courses error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
