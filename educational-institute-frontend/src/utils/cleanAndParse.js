export const cleanAndParse = (str) => {
  console.log(`parse: ${str}`);

  try {
    if (!str) {
      return [];
    }

    if (typeof str !== "string") {
      return Array.isArray(str) ? str : [];
    }

    // Remove extra escaping and fix double-encoded JSON
    let cleanedStr = str.replace(/\\"/g, '"'); // Replace escaped quotes with actual quotes

    // If the string is still wrapped in extra quotes, remove them
    if (cleanedStr.startsWith('"') && cleanedStr.endsWith('"')) {
      cleanedStr = cleanedStr.slice(1, -1);
    }

    // Attempt parsing
    let parsed = JSON.parse(cleanedStr);

    // If the result is still a stringified JSON, parse again
    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }

    console.log(`the string parsed:`, parsed);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("cleanAndParse: Failed to parse JSON string:", str, error);
    return []; // Return an empty array instead of crashing
  }
};