import { NextRequest, NextResponse } from 'next/server';
import { expandNode } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nodeLabel, nodeDescription, targetRole } = body as {
      nodeLabel: string;
      nodeDescription: string;
      targetRole: string;
    };

    if (!nodeLabel || !targetRole) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 }
      );
    }

    const expansion = await expandNode(nodeLabel, nodeDescription || '', targetRole);
    return NextResponse.json(expansion);
  } catch (error) {
    console.error('Node expansion error:', error);
    const message = error instanceof Error ? error.message : 'Failed to expand node';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
