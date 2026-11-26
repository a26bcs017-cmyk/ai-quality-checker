// ============================
// Get HTML Elements
// ============================

const promptInput = document.getElementById("promptInput");
const checkBtn = document.getElementById("checkBtn");
const sampleBtn = document.getElementById("sampleBtn");
const clearBtn = document.getElementById("clearBtn");

const scoreValue = document.getElementById("scoreValue");
const ratingText = document.getElementById("ratingText");
const ratingDescription = document.getElementById("ratingDescription");

const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");

const componentResults = document.getElementById("componentResults");
const suggestions = document.getElementById("suggestions");
const errorMessage = document.getElementById("errorMessage");
const charCount = document.getElementById("charCount");

const scoreCircle = document.querySelector(".score-circle");

// ============================
// Component Keyword Definitions
// ============================

// Simple case-insensitive keyword detection.
// Each component has a list of keywords.

const components = [
    {
        name: "Role",
        description: "Who should the AI act as?",
        keywords: [
            "act as",
            "role:",
            "you are",
            "assume the role",
            "expert",
            "teacher",
            "tutor",
            "developer",
            "trainer"
        ],
        suggestion:
            'Add a role, such as "Act as a Python teacher" or "You are an expert writer".'
    },

    {
        name: "Task",
        description: "What should the AI do?",
        keywords: [
            "task:",
            "explain",
            "create",
            "write",
            "generate",
            "summarize",
            "analyse",
            "analyze",
            "compare",
            "design",
            "solve",
            "teach",
            "describe",
            "develop",
            "classify"
        ],
        suggestion:
            'Clearly describe what you want the AI to do, such as "Explain Python loops" or "Create a quiz".'
    },

    {
        name: "Context",
        description: "What background is provided?",
        keywords: [
            "context:",
            "background:",
            "for beginners",
            "for a beginner",
            "college student",
            "first year",
            "audience",
            "purpose",
            "i am",
            "designed for",
            "learning",
            "scenario"
        ],
        suggestion:
            'Provide background information, such as your learning level, audience or purpose.'
    },

    {
        name: "Constraints",
        description: "What rules should be followed?",
        keywords: [
            "constraint",
            "constraints:",
            "avoid",
            "do not",
            "don't",
            "must",
            "limit",
            "only",
            "simple english",
            "simple language",
            "no jargon",
            "without",
            "under ",
            "maximum",
            "minimum"
        ],
        suggestion:
            'Add rules, such as "Use simple English", "Avoid technical jargon" or "Keep it under 200 words".'
    },

    {
        name: "Output Format",
        description: "How should the answer be presented?",
        keywords: [
            "output format",
            "format:",
            "formatting",
            "headings",
            "bullet points",
            "bullets",
            "numbered list",
            "table",
            "json",
            "markdown",
            "paragraphs",
            "steps",
            "sections",
            "include answers"
        ],
        suggestion:
            'Specify how the response should look, such as headings, bullet points, tables or numbered steps.'
    }
];

// ============================
// Character Counter
// ============================

promptInput.addEventListener("input", () => {
    charCount.textContent =
        promptInput.value.length + " characters";

    errorMessage.textContent = "";
});

// ============================
// Check Prompt Button
// ============================

checkBtn.addEventListener("click", checkPrompt);

function checkPrompt() {

    const prompt = promptInput.value.trim();

    // Validate empty input
    if (prompt === "") {
        errorMessage.textContent =
            "⚠ Please enter a prompt before checking.";

        return;
    }

    errorMessage.textContent = "";

    // Convert prompt to lowercase for case-insensitive detection
    const lowerPrompt = prompt.toLowerCase();

    let score = 0;
    let detectedComponents = [];
    let missingComponents = [];

    // Check each component using keywords
    components.forEach(component => {

        const isDetected = component.keywords.some(keyword =>
            lowerPrompt.includes(keyword.toLowerCase())
        );

        if (isDetected) {
            score += 20;
            detectedComponents.push(component);
        } else {
            missingComponents.push(component);
        }

    });

    // Display score and results
    displayResults(score, detectedComponents, missingComponents);
}

// ============================
// Display Analysis Results
// ============================

function displayResults(score, detected, missing) {

    // Update score
    scoreValue.textContent = score;

    // Update progress bar
    progressBar.style.width = score + "%";
    progressPercent.textContent = score + "%";

    // Update circular score indicator
    scoreCircle.style.background =
        `conic-gradient(#6554d9 ${score * 3.6}deg, #eeeafc ${score * 3.6}deg)`;

    // Update rating
    updateRating(score);

    // Display component results
    componentResults.innerHTML = "";

    components.forEach(component => {

        const isDetected = detected.some(
            item => item.name === component.name
        );

        const statusClass = isDetected ? "detected" : "missing";
        const statusIcon = isDetected ? "✓" : "✕";

        const componentItem = document.createElement("div");

        componentItem.className =
            `component-item ${statusClass}`;

        componentItem.innerHTML = `
            <span class="status-icon">${statusIcon}</span>

            <div class="component-info">
                <strong>${component.name}</strong>
                <small>${component.description}</small>
            </div>

            <span class="points">
                ${isDetected ? "+20" : "0"} / 20
            </span>
        `;

        componentResults.appendChild(componentItem);

    });

    // Display improvement suggestions
    displaySuggestions(missing);
}

// ============================
// Rating System
// ============================

function updateRating(score) {

    if (score === 100) {

        ratingText.textContent = "Excellent! 🎉";
        ratingDescription.textContent =
            "Your prompt includes all five components.";

    } else if (score === 80) {

        ratingText.textContent = "Very Good! 🌟";
        ratingDescription.textContent =
            "Your prompt is strong. Just one component is missing.";

    } else if (score === 60) {

        ratingText.textContent = "Good! 👍";
        ratingDescription.textContent =
            "Your prompt has a good foundation. Improve a few components.";

    } else if (score === 40) {

        ratingText.textContent = "Average 🙂";
        ratingDescription.textContent =
            "Your prompt needs more clarity and detail.";

    } else {

        ratingText.textContent = "Needs Improvement 💡";
        ratingDescription.textContent =
            "Add more components to make your prompt effective.";

    }
}

// ============================
// Improvement Suggestions
// ============================

function displaySuggestions(missing) {

    suggestions.innerHTML = `
        <h3>✨ Improvement Suggestions</h3>
    `;

    if (missing.length === 0) {

        suggestions.innerHTML += `
            <p>
                🎉 Excellent! All five components are detected.
                Your prompt is well structured.
            </p>
        `;

        return;
    }

    missing.forEach(component => {

        const suggestionItem = document.createElement("div");

        suggestionItem.className = "suggestion-item";

        suggestionItem.innerHTML = `
            <strong>Missing ${component.name}:</strong>
            <span>${component.suggestion}</span>
        `;

        suggestions.appendChild(suggestionItem);

    });
}

// ============================
// Load Sample Prompt Button
// ============================

sampleBtn.addEventListener("click", () => {

    promptInput.value =
        "Act as a Python programming tutor. " +
        "Explain Python loops to a beginner and provide two real-world examples. " +
        "Context: I am a first year college student learning Python. " +
        "Constraints: Use simple English and avoid complex technical jargon. " +
        "Output Format: Use headings, bullet points, examples and a short quiz.";

    charCount.textContent =
        promptInput.value.length + " characters";

    errorMessage.textContent = "";

    // Automatically check the sample prompt
    checkPrompt();

});

// ============================
// Clear Button
// ============================

clearBtn.addEventListener("click", resetChecker);

function resetChecker() {

    // Clear input
    promptInput.value = "";

    // Reset character count
    charCount.textContent = "0 characters";

    // Clear error message
    errorMessage.textContent = "";

    // Reset score
    scoreValue.textContent = "0";

    // Reset rating
    ratingText.textContent = "Waiting for analysis";
    ratingDescription.textContent =
        "Enter your prompt to get started.";

    // Reset progress bar
    progressBar.style.width = "0%";
    progressPercent.textContent = "0%";

    // Reset score circle
    scoreCircle.style.background =
        "conic-gradient(#6554d9 0deg, #eeeafc 0deg)";

    // Reset component results
    componentResults.innerHTML = "";

    components.forEach(component => {

        const item = document.createElement("div");

        item.className = "component-item neutral";

        item.innerHTML = `
            <span class="status-icon">○</span>

            <div class="component-info">
                <strong>${component.name}</strong>
                <small>${component.description}</small>
            </div>

            <span class="points">20 pts</span>
        `;

        componentResults.appendChild(item);

    });

    // Reset suggestions
    suggestions.innerHTML = `
        <h3>✨ Improvement Suggestions</h3>
        <p>
            Your suggestions will appear here after
            checking your prompt.
        </p>
    `;

}