import { huggingFaceService } from "./serviceAI";

export class ContentModerationService {
    static async moderateContent(content) {
        try {
            const [contentClassification, qualityCheck] = await Promise.all([
                huggingFaceService.classifyContent(content),
                huggingFaceService.checkQuality(content)
            ]);

            const hasInappropriateContent = 
                contentClassification[0].label === 'HATE_SPEECH' && 
                contentClassification[0].score > 0.8;

            const hasGoodQuality = qualityCheck[0].score > 0.7;

            return {
                isAppropriate: !hasInappropriateContent,
                hasQualityContent: hasGoodQuality,
                scores: {
                    content: contentClassification[0].score,
                    quality: qualityCheck[0].score
                }
            };
        } catch (error) {
            console.error('Error in content moderation:', error);
            throw error;
        }
    }
}