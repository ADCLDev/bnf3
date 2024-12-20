import { adminAuth } from '@/lib/firebase/admin'
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    if (!adminAuth) {
      console.error('Firebase Admin Auth is not initialized');
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1]
    
    if (!idToken) {
      return NextResponse.json(
        { error: 'No token provided' }, 
        { status: 401 }
      )
    }

    try {
      const decodedToken = await adminAuth.verifyIdToken(idToken)
      return NextResponse.json({ user: decodedToken })
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError)
      return NextResponse.json(
        { error: 'Invalid token' }, 
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' }, 
      { status: 500 }
    )
  }
} 