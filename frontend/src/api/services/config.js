export const HF_CONFIG = {
    API_KEY: import.meta.env.VITE_API_AI_KEY,
    API_URL: 'https://api-inference.huggingface.co/models',
    MODELS: {
        CONTENT_CLASSIFIER: 'facebook/roberta-hate-speech-detection-vietnamese',
        QUALITY_CHECKER: 'vinai/phobert-base-vietnamese'
    }
};