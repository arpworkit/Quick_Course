import { NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/jwt'

export async function POST(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }

    // Verify the token
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { courseId, courseName, instructor } = body

    // Validate required fields
    if (!courseId || !courseName || !instructor) {
      return NextResponse.json(
        { error: 'Course ID, name, and instructor are required' },
        { status: 400 }
      )
    }

    // In a real application, you would save this to a database
    // For now, we'll just return a success response
    // The frontend will handle storing in localStorage

    console.log(`User ${decoded.userId} enrolled in course ${courseId}`)

    return NextResponse.json({
      message: 'Successfully enrolled in course',
      enrollment: {
        userId: decoded.userId,
        courseId,
        courseName,
        instructor,
        enrolledAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Enrollment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }

    // Verify the token
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // In a real application, you would fetch from a database
    // For now, return empty array as the frontend handles localStorage
    return NextResponse.json({
      enrollments: []
    })

  } catch (error) {
    console.error('Get enrollments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
