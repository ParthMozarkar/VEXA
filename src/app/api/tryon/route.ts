import { NextResponse } from 'next/server';

const MOCK_SUGGESTIONS = [
  "This outfit works well with your body proportions.",
  "Darker tones enhance your overall silhouette.",
  "The cut complements your natural posture.",
  "Excellent color match, bringing out a sophisticated look.",
  "The structural fit perfectly aligns with your shoulders."
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userImage, outfitId, outfitImageUrl } = body;

    // Simulate AI processing delay (6 seconds for the 4 steps illusion)
    await new Promise((resolve) => setTimeout(resolve, 6000));

    // For MVP, we use the outfit image
    const mockResultImage = outfitImageUrl;

    // Simulate AI intelligence
    const confidence = Math.floor(Math.random() * 10) + 88; // 88-97%
    const sizes = ["S", "M", "L"];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const suggestion = MOCK_SUGGESTIONS[Math.floor(Math.random() * MOCK_SUGGESTIONS.length)];

    return NextResponse.json({
      success: true,
      resultImage: mockResultImage,
      aiAnalysis: {
        confidence,
        size,
        styleMatch: "High",
        suggestion
      },
      message: "Virtual try-on completed successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process try-on" },
      { status: 500 }
    );
  }
}
