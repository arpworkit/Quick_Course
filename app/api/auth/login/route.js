import { NextResponse } from 'next/server'
import { signIn } from '../../../../lib/supabase'
import { generateToken } from '../../../../lib/jwt'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, role } = body

    console.log('Login attempt for:', email, 'as role:', role)

    // Validate required fields
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      )
    }

    // Sign in with Supabase
    console.log('Attempting to sign in with Supabase...')
    const { data, error } = await signIn(email, password)

    if (error) {
      console.error('Supabase login error:', error)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('Login successful for user:', data.user?.id)

    // Generate JWT token
    const token = generateToken({
      userId: data.user.id,
      email: data.user.email,
      fullName: data.user.user_metadata?.full_name || '',
      role: role
    })

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata?.full_name || '',
        role: role
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}