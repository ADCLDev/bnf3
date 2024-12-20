import { auth } from "@/lib/firebase/admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1]
    if (!idToken) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decodedToken = await auth.verifyIdToken(idToken)
    return NextResponse.json({ user: decodedToken })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid token'
    return NextResponse.json({ error: errorMessage }, { status: 401 })
  }
} 