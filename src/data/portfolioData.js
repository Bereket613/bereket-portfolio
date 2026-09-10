

export const skillsData = {
    "Data Analysis": {
        icon: "📊",
        projects: [
            { name: "EDH (2016) Data Analysis", link: "https://github.com/Bereket613/EDH-Data-Analysis" },
            { name: "Age V Salary Analysis", link: "https://github.com/Bereket613/-Age-vs-Salary-Analysis-Exploratory-Explanatory-Data-Visualization-in-Python" }
        ]
    },
    "Machine Learning": {
        icon: "🤖",
        projects: [
            { name: "Diabetes Prediction", link: "https://github.com/Bereket613/Diabetes-ML-Project" },
            { name: "Book Recommendation", link: "https://github.com/Bereket613/Book-Recommendation-System-using-K-Nearest-Neighbors" },
            { name: "SMS spam classification", link: "https://github.com/Bereket613/SMS-Spam-Classification-using-Machine-Learning" }
        ]
    },
    "AI Development": {
        icon: "🧠",
        projects: [
            { name: "Chat Bot", link: "https://github.com/Bereket613/-AI-Chatbot-using-NLP-TF-IDF" },
            { name: "Rock Paper Scissors Game", link: "https://github.com/Bereket613/rock-paper-scissors-bot" },
            { name: "Chat Bot (AI-ChatBot)", link: "https://github.com/Bereket613/AI-ChatBot" }
        ]
    },
    "Python": {
        icon: "🐍",
        projects: [
            { name: "Bank Management System", link: "https://github.com/Bereket613/-NEGAT-Bank-Management-System" },
            { name: "Task Scheduler", link: "https://github.com/Bereket613/-Priority-Based-Task-Scheduler-in-Python" }
        ]
    }
};

export const experienceData = [
    {
        title: "Member & Contributor – Techtonic Tribe Tech Club",
        subtitle: "Debre Berhan University",
        description: "Actively participate in tech meetups, workshops, and collaborative coding sessions. Contributed to multiple hackathons and group projects focusing on:",
        points: [
            "Frontend development using HTML, CSS, JavaScript, and React",
            "Python scripting and mini automation tasks"
        ],
        footer: "Earned certificates of recognition for contributions in all three technologies."
    }
];

export const contactConfig = {
    serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
    templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
    publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY
};
