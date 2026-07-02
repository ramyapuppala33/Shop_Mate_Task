/*
 * Feature 1: Product Description Generation using AI
 * Uses simple text generation.
 */
async function generateProductDescriptionWithAI(productName, category) {
    const prompt = "You are an expert e-commerce copywriter.\n" +
        "Write a catchy, SEO-friendly product description (max " +
        "100 words) for: " + productName + "\n" +
        "Under the category: " + category + "\n" +
        "Tone: Professional yet exciting.";
    try {
        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        return result.text;
    } catch (error) {
        console.error("Error generating product description:", error);
        return "Description unavailable";
    }
}

module.exports = {
    generateProductDescriptionWithAI,
};