Design a complete, modern, responsive frontend for an AI-powered device repair assistant web application.

PROJECT CONCEPT:
The application helps users diagnose problems with everyday electronic devices and guides them through repairing the device instead of immediately replacing it. The product name and logo are NOT finalized yet, so use a clean dummy brand name such as "REPAIRREPLACE" and a simple placeholder logo/icon. Do not spend design effort on creating a final logo or brand identity.

TECHNOLOGY:
- TypeScript
- React
- Tailwind CSS
- Vite
- Other frontend libraries are allowed where useful
- The design should be realistic and practical to implement with these technologies.

DESIGN DIRECTION:
Create a premium but approachable visual identity inspired by woodworking, repair workshops, tools, craftsmanship, and wooden materials.

Use a warm woody visual language rather than making the interface look like a generic AI chatbot.

Suggested primary colors:
- #6C79C0
- #E6C79C

Use these together with appropriate warm wood tones, cream/off-white surfaces, dark brown/charcoal text, subtle borders, and natural-looking contrast.

The background should feel slightly woody and tactile. Use subtle wood-grain textures, grain patterns, workshop-inspired details, soft shadows, paper/wood surfaces, or tasteful material textures. Keep the background subtle enough that readability and usability remain excellent.

Avoid:
- Generic purple AI gradients
- Overly futuristic neon UI
- Excessive glassmorphism
- Excessive rounded cards
- Overloaded dashboards
- Stock-photo-heavy layouts
- Designs that look obviously AI-generated

The interface should feel like a real product designed by a professional frontend designer.

The design should be clean, direct, functional, slightly rugged, and premium.

IMPORTANT:
The website must be fully responsive and mobile-first because the project will be demonstrated on both desktop and a smartphone.

Create three pages:

==================================================
1. LANDING PAGE
==================================================

Create a strong hero section with a direct headline explaining the product.

Example direction:
"Don't replace it yet."
"Diagnose it. Repair it. Keep it."

Keep the copy short and direct.

Hero should include:
- Dummy logo/brand
- Navigation
- Main headline
- Short supporting text
- Primary CTA: "Start Repair"
- Secondary CTA: "How It Works"
- Visual representation of the repair concept using tools, device components, wood/workshop elements, or a tasteful product illustration

Navigation:
- Logo / dummy brand
- Home
- About
- Start Repair button

Hero should immediately communicate:
1. Something is broken
2. The AI helps understand the problem
3. The user gets guided repair instructions

Below the hero:

HOW IT WORKS
Show 3 simple steps:
1. Describe the problem
2. AI diagnoses the issue
3. Follow the repair steps

FEATURES
Show 3–4 concise features:
- Image-based diagnosis
- Step-by-step repair guidance
- Safety warnings
- Relevant repair guides

Add a small section explaining:
"Repair before you replace."

Include a CTA near the bottom:
"Start a Repair"

Finish with a clean footer containing:
- Dummy logo
- Short description
- Navigation
- Contact placeholder
- GitHub / social placeholders

Keep all landing page copy short and realistic.

==================================================
2. HOME / REPAIR ASSISTANT PAGE
==================================================

This is the MAIN PRODUCT EXPERIENCE and should receive the most design attention.

The page should feel like a professional repair workspace, not a ChatGPT clone.

Create:
- Top navigation
- Main repair workspace
- Prompt/input area
- Image upload area
- Device/problem context
- Clear action button

MAIN PROMPT AREA:

Create a large, visually attractive input area in the center.

Placeholder text:
"What’s wrong with your device?"

Supporting text:
"Describe the problem or upload photos."

The prompt area should support:
- Text input
- Multiple image uploads
- Image thumbnails
- Remove image buttons
- Upload button
- Camera/upload option on mobile
- Submit button: "Diagnose & Repair"

Also include subtle examples such as:
"Laptop suddenly shuts down"
"Phone screen is not responding"
"Fan is making a strange noise"

The input area should look like a repair/workbench surface, while still being modern and clean.

IMPORTANT INTERACTION:
When the prompt/input area is clicked, the existing placeholder/demo content should be cleared so the user can start typing immediately.

Only design this interaction/state for now.
Do NOT design the actual AI response functionality yet.

Create a clean empty/input state and an active/focused state.

Also design the uploaded-image state with 1–3 image thumbnails so the interface clearly supports multiple images.

Do not build the complete AI response page yet. Only design the prompt/input experience and its interaction states.

Include responsive behavior:
- On desktop: large centered repair workspace
- On mobile: stacked layout, large touch-friendly controls, easy image upload, no horizontal scrolling
- Buttons should be comfortable for touch
- Prompt should adapt naturally to small screens
- Navigation should become a clean mobile menu

==================================================
3. ABOUT PAGE
==================================================

Create a simple but visually interesting About page.

Sections:

ABOUT THE PROJECT
Explain briefly:
"RepairReplace is an AI-powered repair assistant designed to help people understand what's wrong with their devices and guide them through possible repairs."

WHY WE BUILT IT
Focus on:
- People replacing devices because they don't know how to repair them
- Making repair information easier to understand
- Helping users make better repair vs replacement decisions

HOW IT WORKS
Give a concise visual explanation:
User → Images + Problem → AI Analysis → Repair Guidance

TEAM
Create a clean team section with placeholder profiles.

CONTACT
Include:
- Email placeholder
- GitHub placeholder
- LinkedIn placeholder

Keep this section integrated into the About page rather than creating a separate Contact page.

==================================================
RESPONSIVE DESIGN
==================================================

The entire design MUST be fully responsive.

Design for:
- Desktop
- Laptop
- Tablet
- Mobile phone

Mobile is especially important because the application will be demonstrated on a smartphone.

On mobile:
- Navigation collapses into a hamburger menu
- Hero typography scales appropriately
- Cards stack vertically
- Prompt area becomes full-width
- Image uploads become touch-friendly
- CTA buttons should be easy to tap
- Maintain the wood-inspired visual style without making the interface visually heavy
- No horizontal scrolling
- Maintain good spacing and readability

==================================================
UI / UX DETAILS
==================================================

Use:
- Subtle hover effects
- Smooth transitions
- Clear focus states
- Micro-interactions
- Accessible contrast
- Consistent spacing
- Consistent typography hierarchy
- Realistic buttons and form controls
- Responsive cards
- Subtle wood/workshop textures
- Tasteful tool/repair motifs

The UI should feel dynamic and interactive even though this is currently a frontend design.

Use realistic content instead of lorem ipsum.

Keep text direct and concise.

The overall visual impression should be:

"Modern AI product + professional repair workshop + natural wood craftsmanship."

Do not make it look like a traditional hardware store website.

Do not make it look like a generic AI SaaS dashboard.

The final design should feel original, practical, premium, and suitable for a hackathon project that could realistically become a production application.

IMPORTANT FINAL REQUIREMENT:
Create all three pages:
1. Landing
2. Home / Repair Assistant
3. About

Use a dummy logo and dummy brand identity for now because the final name/logo will be designed separately later.

For the Home page, ONLY design the prompt/input and upload experience. When the user clicks the prompt, clear the demo/placeholder content and show the active typing state. We will design the actual AI-generated repair response interface separately later.