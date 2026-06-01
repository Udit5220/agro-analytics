import dotenv from 'dotenv';
dotenv.config();

class GeminiKeyManager {
  constructor() {
    this.keys = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY // Fallback to original if defined
    ].filter(Boolean); // Only keep valid keys

    this.currentIndex = 0;
  }

  getNextKey() {
    if (this.keys.length === 0) {
      throw new Error('No Gemini API keys found in environment variables.');
    }

    const key = this.keys[this.currentIndex];
    
    // Rotate to the next key for the next call
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    
    return key;
  }

  get keyCount() {
    return this.keys.length;
  }
}

// Export a singleton instance
const geminiKeyManager = new GeminiKeyManager();
export default geminiKeyManager;
