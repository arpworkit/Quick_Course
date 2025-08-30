import { NextResponse } from 'next/server'
import { signUp } from '../../../../lib/supabase'
import { generateToken } from '../../../../lib/jwt'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, fullName, mobile, country, dateOfBirth, role } = body

    console.log('Signup attempt for:', email)
    console.log('Form data received:', { email, fullName, mobile, country, dateOfBirth, role })

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    // Create user in Supabase (Supabase handles password hashing internally)
    const userData = {
      full_name: fullName,
      mobile,
      country,
      date_of_birth: dateOfBirth,
      role
    }

    console.log('Attempting to create user in Supabase...')
    const { data, error } = await signUp(email, password, userData)

    if (error) {
      console.error('Supabase signup error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    console.log('User created successfully:', data.user?.id)

    // Generate JWT token
    const token = generateToken({
      userId: data.user.id,
      email: data.user.email,
      fullName,
      role
    })

    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName,
        role
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}