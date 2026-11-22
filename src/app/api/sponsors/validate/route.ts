import { NextResponse } from 'next/server'
import { validateSponsorForPublication } from '@/lib/sponsor-validation'

export async function POST(request: Request) {
  try {
    const data: unknown = await request.json()

    const result = validateSponsorForPublication(data)

    if (!result.valid) {
      return NextResponse.json(
        {
          valid: false,
          reason: result.reason,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      message: 'Sponsor data passed publication validation',
    })
  } catch {
    return NextResponse.json(
      {
        valid: false,
        reason: 'Invalid JSON request',
      },
      { status: 400 }
    )
  }
}