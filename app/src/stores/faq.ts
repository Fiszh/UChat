export const faqItems = [
    {
        question: "What is UChat?",
        answer: "UChat is a custom Twitch chat overlay that supports 7TV BetterTTV and FrankerFaceZ emotes"
    },
    {
        question: "How do I get my overlay URL?",
        answer: "After entering your channel name and customizing your settings the overlay URL will appear in the 'Overlay URL' section where you can copy it using the copy button"
    },
    {
        question: "Who made UChat?",
        answer: "UChat was made by uniiDev with the help of ftk789 & creepycode",
        links: [
            { name: "uniiDev", url: "https://api.unii.dev/twitch/528761326" },
            { name: "ftk789", url: "https://api.unii.dev/twitch/166427338" },
            { name: "creepycode", url: "https://api.unii.dev/twitch/404660262" }
        ]
    },
    {
        question: "Why do my settings stay after refreshing?",
        answer: "Theyre saved in your browser Click Reset Settings to reset"
    },
    {
        question: "What chat commands are available?",
        answer: "Commands can only be used by the broadcaster or a mod, you can also use commands with !uchat <command>",
        commands: [
            { cmd: "!reloadchat", desc: "Reloads the overlay" },
            { cmd: "!refreshchat", desc: "Refreshes the overlay" },
            { cmd: "!reloadws", desc: "Reconnects the 7TV and BTTV WebSockets" },
            { cmd: "!reconnectchat", desc: "Reconnects to Twitch IRC" }
        ]
    },
    {
        question: "How do the Save and Delete buttons work for testers?",
        answer: "Pressing Save updates only the settings you’ve changed on the server linked to your user ID Delete removes all your saved global settings from the server Local browser settings arent affected by Delete"
    },
    {
        question: "Is Twitch login required?",
        answer: "No"
    },
    {
        question: "Why is there a login button?",
        answer: "Early testers of UChat can log in to save their settings globally This way they only need to enter their channel name without using a long overlay URL"
    },
    {
        question: "Is my Twitch token safe?",
        answer: "Your token is only used for validation and is never stored on our servers"
    },
    {
        question: "What are the chances of becoming a tester?",
        answer: "The testing phase is over Currently no new testers are being accepted"
    },
    {
        question: "Where can I find the API?",
        answer: "You can access the API documentation here",
        links: [
            { name: "here", url: "https://api.unii.dev/docs/" }
        ]
    },
    {
        question: "What if my question isn't listed here?",
        answer: "For more information you can reach out via Twitch or Discord",
        links: [
            { name: "Twitch", url: "https://api.unii.dev/twitch/528761326" },
            { name: "Discord", url: "https://discord.com/users/703639905691238490" }
        ]
    },
    {
        question: "Where can I find the source code?",
        answer: "You can find the source code on GitHub",
        links: [
            { name: "GitHub", url: "https://github.com/Fiszh/UChat" }
        ]
    },
    {
        question: "What is YAUTO?",
        answer: 'YAUTO short for "Yet Another Useless Twitch Overlay" was the former name of this project It was renamed to UChat on 02/08/2025 for a cleaner and more recognizable name'
    },
    {
        question: "Will the overlay support Kick?",
        answer: 'No, currently due to the overall state of the platform I do not plans of adding that.'
    }
]

export const privacyItems = [
    "Your <strong>Twitch token</strong> is never stored; it is only sent to the server when needed to authenticate actions like login, saving, or deleting your settings.",
    "Settings you change are saved only in your browser so they stay after refresh or returning to the page; they are not stored on our servers unless you are a <strong>tester</strong> saving global settings.",
    "For <strong>testers</strong>, we store only their <strong>Twitch user ID</strong> and the settings they changed from default—nothing else.",
    'Pressing "<strong>Save</strong>" updates your saved global settings; "<strong>Delete</strong>" removes all your saved settings from our servers.',
    'Using "<strong>Reset Settings</strong>" clears all locally saved settings in your browser.',
    "We log every request made to our <strong>API</strong> to prevent spam or abuse.",
    "UChat and all services under <strong>unii.dev</strong> are independent and are not affiliated, endorsed, or sponsored by <strong>Twitch Interactive, Inc.</strong>"
];
