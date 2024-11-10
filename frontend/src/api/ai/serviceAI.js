import axios from 'axios';
import { HF_CONFIG } from '../services/config';

class HuggingFaceService {
    constructor() {
        this.client = axios.create({
            baseURL: HF_CONFIG.API_URL,
            headers: {
                'Authorization': `Bearer ${HF_CONFIG.API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
    }

    async classifyContent(text) {
        try {
            const response = await this.client.post(
                `/${HF_CONFIG.MODELS.CONTENT_CLASSIFIER}`,
                { inputs: text }
            );
            return response.data;
        } catch (error) {
            console.error('Error classifying content:', error);
            throw error;
        }
    }

    async checkQuality(text) {
        try {
            const response = await this.client.post(
                `/${HF_CONFIG.MODELS.QUALITY_CHECKER}`,
                { inputs: text }
            );
            return response.data;
        } catch (error) {
            console.error('Error checking quality:', error);
            throw error;
        }
    }
}

export const huggingFaceService = new HuggingFaceService();