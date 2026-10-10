import { NextRequest, NextResponse } from 'next/server';
import { generateRoadmap } from '@/lib/ai';
import type { UserConstraints } from '@/lib/schemas';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dreamJob, constraints } = body as {
      dreamJob: string;
      constraints?: UserConstraints;
    };

    if (!dreamJob || dreamJob.trim().length < 3) {
      return NextResponse.json(
        { error: 'Please enter a more specific dream job target.' },
        { status: 400 }
      );
    }

    const roadmap = await generateRoadmap(dreamJob.trim(), constraints);
    return NextResponse.json(roadmap);
  } catch (error) {
    console.error('Roadmap generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate roadmap';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
