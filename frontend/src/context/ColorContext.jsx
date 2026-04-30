// src/contexts/ColorContext.js
const color =[
    '#0F0E47',
    '#CBCBCB',
    '#FFFFE3',
    '#6D8196',
]

export const colors = {
    // Deep UI Foundation
    background: "bg-[#0F0E47]",        
    cardBg: "bg-[#272757]",            // Elevated surface color for cards
    inputBg: "bg-[#0F0E47]/50",        // Sunken look for input fields
    
    // Typography
    text: "text-white",                // Pure white for maximum contrast
    textSecondary: "text-[#8686AC]",   // Muted lavender-grey for secondary info
    
    // UI Elements
    border: "border-[#505081]",        // Mid-tone blue for subtle borders
    link: "text-[#8686AC] hover:text-white",
    
    // Buttons & Branding
    gradientPrimary: "from-[#505081] to-[#272757]",
    buttonPrimary:
      "bg-[#505081] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#8686AC] transition-all",
    buttonSecondary:
      "text-white border border-[#505081] hover:bg-[#505081]/30 transition-colors",
    
    // Accents & Navigation
    accent: "text-[#8686AC]",
    accentBg: "bg-[#8686AC]",
    navBg: "bg-[#0F0E47]/80 backdrop-blur-xl border-b border-[#505081]",

    // Feedback States (Adjusted to sit better on dark navy)
    notification: {
      success: "bg-emerald-950/50 text-emerald-400 border-emerald-900",
      error: "bg-rose-950/50 text-rose-400 border-rose-900",
      warning: "bg-amber-950/50 text-amber-400 border-amber-900",
      info: "bg-[#505081]/30 text-[#8686AC] border-[#505081]",
    },
};