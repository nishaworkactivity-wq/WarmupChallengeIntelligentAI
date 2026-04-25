export async function sendMessageToAI(history) {
  // Replace with your actual Gemini API key or use environment variable
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "API_KEY";
  
  if (API_KEY === "API_KEY" || !API_KEY) {
    // Return a mock response for demo purposes
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `**(Mock Response)** \n\nI see you want to learn! This is a simulated response since no API key is provided. Please add your \`VITE_GEMINI_API_KEY\` to your \`.env\` file to use the real Google AI Studio API. Let me know what you want to learn!`;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  // Format the history for the Gemini API
  // history should be an array of objects: { role: 'user' | 'model', text: '...' }
  const formattedContents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: formattedContents,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error?.message || "Failed to fetch response from Gemini API");
    }

    const data = await response.json();
    
    // Extract text from the Gemini response structure
    const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResult) {
       throw new Error("Invalid response structure from Gemini API");
    }
    
    return textResult;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
}
