import { describe, it, expect, vi } from "vitest";

// mock entire module before importing service
const mockGenerateContent = vi.fn();

vi.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: vi.fn(function () {
        this.getGenerativeModel = vi.fn(() => ({
            generateContent: mockGenerateContent,
        }));
    }),
}));

// set the env var before importing
process.env.GEMINI_API_KEY = 'test-key';
process.env.GEMINI_MODEL_NAME = 'test-model';

const { getTokenInsight } = await import('./ai.service.js');

describe('getTokenInsight', () => {
    it('should parse valid JSON response', async () => {
        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => '{"reasoning": "Stable market", "sentiment": "Neutral"}'
            }
        });

        const result = await getTokenInsight('test prompt');
        expect(result.reasoning).toBe('Stable market');
        expect(result.sentiment).toBe('Neutral');
    });

    it('should handle JSON wrapped in ```json', async () => {
        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => '```json\n{"reasoning": "Bull run", "sentiment": "Bullish"}\n```'
            }
        });

        const result = await getTokenInsight('test prompt');
        expect(result.reasoning).toBe('Bull run');
        expect(result.sentiment).toBe('Bullish');
    });

    it('should handle missing fields', async () => {
        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => '{"reasoning": "Stable market"}'
            }
        });

        await expect(getTokenInsight('test prompt')).rejects.toThrow();
    });

    it('should throw on invalid JSON', async () => {
        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => 'This is not a valid JSON at all'
            }
        });

        await expect(getTokenInsight('test prompt')).rejects.toThrow();

    });
});