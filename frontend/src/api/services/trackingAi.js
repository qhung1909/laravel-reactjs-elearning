class UsageTracker {
    constructor() {
        this.requestCount = 0;
        this.errors = [];
    }

    trackRequest() {
        this.requestCount++;
        this.checkThreshold();
    }

    trackError(error) {
        this.errors.push({
            timestamp: new Date(),
            error: error.message
        });
    }

    checkThreshold() {
        if (this.requestCount > 25000) { 
            console.warn('API usage approaching limit');
        }
    }

    getStats() {
        return {
            totalRequests: this.requestCount,
            errors: this.errors,
            errorRate: (this.errors.length / this.requestCount) * 100
        };
    }
}

export const usageTracker = new UsageTracker();