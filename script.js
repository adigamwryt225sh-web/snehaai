document.addEventListener("DOMContentLoaded", () => {
    
    // --- HAMBURGER MENU TOGGLE LOGIC ---
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open'); 
    });

    // --- SIDEBAR SLIDE NAVIGATION LOGIC ---
    const sidebarBoxes = document.querySelectorAll('.sidebar-box');
    const contentSlides = document.querySelectorAll('.content-slide');

    sidebarBoxes.forEach(box => {
        box.addEventListener('click', () => {
            sidebarBoxes.forEach(b => b.classList.remove('active-tab'));
            contentSlides.forEach(slide => slide.classList.remove('active-slide'));
            
            box.classList.add('active-tab');
            const targetId = box.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active-slide');
            
            if(window.innerWidth < 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // --- 1. PREDICTION FORM & COMPANY LOGIC ---
    const form = document.getElementById("predictionForm");
    const resultBox = document.getElementById("resultBox");
    const predictionResult = document.getElementById("predictionResult");
    const progressBar = document.getElementById("progressBar");
    const companyBox = document.getElementById("companyBox");
    const companyTags = document.getElementById("companyTags");

    if(form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const cgpa = parseFloat(document.getElementById("cgpa").value);
            const marks = parseFloat(document.getElementById("marks").value);
            const branch = document.getElementById("branch").value;
            const backlogs = document.getElementById("backlogs").value;
            const internships = parseInt(document.getElementById("internships").value) || 0;
            const coding = document.getElementById("coding").value;

            let probability = (cgpa * 5.5) + (marks * 0.15) + (internships * 4);
            
            if (branch === "cse_core") probability += 10;
            if (branch === "cse_spec") probability += 12; 
            if (branch === "ece_ee") probability += 5;
            if (branch === "other") probability -= 5;

            if (backlogs === "1") probability -= 15;
            if (backlogs === "2") probability -= 30;
            if (backlogs === "3+") probability -= 50;

            if (coding === "intermediate") probability += 8;
            if (coding === "advanced") probability += 18;

            if (probability < 5) probability = 5; 
            if (probability > 98.5) probability = 98.5; 

            let companies = [];
            if (probability >= 85) {
                companies = [
                    { name: "Microsoft", url: "https://careers.microsoft.com/", desc: "SDE Roles, High Package, Product Based" },
                    { name: "Google", url: "https://careers.google.com/", desc: "Top Tier Tech, Global Impact Projects" },
                    { name: "Amazon", url: "https://www.amazon.jobs/", desc: "AWS, E-commerce, Fast-paced Environment" },
                    { name: "Atlassian", url: "https://www.atlassian.com/company/careers", desc: "Enterprise Software & Cloud Tools" }
                ];
            } else if (probability >= 70) {
                companies = [
                    { name: "TCS Digital", url: "https://www.tcs.com/careers", desc: "Advanced Tech & Development Roles" },
                    { name: "Cognizant GenC Next", url: "https://careers.cognizant.com/", desc: "Premium IT Services & Cloud Roles" },
                    { name: "Accenture", url: "https://www.accenture.com/in-en/careers", desc: "Global Consulting & Strategy" },
                    { name: "IBM", url: "https://www.ibm.com/careers", desc: "Cloud computing & Cognitive AI" }
                ];
            } else if (probability >= 50) {
                companies = [
                    { name: "TCS Ninja", url: "https://www.tcs.com/careers", desc: "Core IT Services & System Admin" },
                    { name: "Infosys", url: "https://www.infosys.com/careers/", desc: "Leading IT Services & Support" },
                    { name: "Wipro", url: "https://careers.wipro.com/", desc: "Global IT Consulting & Operations" },
                    { name: "Tech Mahindra", url: "https://careers.techmahindra.com/", desc: "Telecom, Networking & IT" }
                ];
            } else {
                companies = [
                    { name: "Local Startups", url: "https://wellfound.com/", desc: "High learning curve, versatile roles" },
                    { name: "Entry Level IT", url: "https://www.naukri.com/it-jobs", desc: "Junior Developer & Testing Roles" }
                ];
            }

            resultBox.classList.remove("hidden");
            companyBox.classList.add("hidden");
            progressBar.style.width = "0%"; 
            
            setTimeout(() => {
                predictionResult.innerText = `Placement Probability: ${probability.toFixed(1)}%`;
                progressBar.style.width = `${probability}%`;

                companyTags.innerHTML = "";
                companies.forEach(company => {
                    const card = document.createElement("a");
                    card.href = company.url;
                    card.target = "_blank";
                    card.className = "company-card";
                    
                    const title = document.createElement("strong");
                    title.innerText = company.name;
                    
                    const desc = document.createElement("span");
                    desc.innerText = company.desc;
                    
                    card.appendChild(title);
                    card.appendChild(desc);
                    companyTags.appendChild(card);
                });
                
                setTimeout(() => {
                    companyBox.classList.remove("hidden");
                }, 500);

            }, 100);
        });
    }

    // --- 2. SIDEBAR FEATURE: RESUME ATS SCORE CHECKER ---
    const atsForm = document.getElementById("atsForm");
    const atsResultBox = document.getElementById("atsResultBox");
    const atsScoreText = document.getElementById("atsScoreText");
    const atsProgressBar = document.getElementById("atsProgressBar");
    const atsFeedback = document.getElementById("atsFeedback");

    if(atsForm) {
        atsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const role = document.getElementById("targetRole").value;
            const text = document.getElementById("resumeText").value.toLowerCase();

            const keywordBank = {
                sde: ["dsa", "data structures", "algorithms", "c++", "java", "python", "git", "oop", "problem solving", "system design", "api"],
                data: ["python", "sql", "machine learning", "pandas", "numpy", "tableau", "power bi", "statistics", "deep learning", "data"],
                web: ["html", "css", "javascript", "react", "node", "express", "mongodb", "sql", "git", "api", "responsive"],
                core: ["c", "c++", "java", "sql", "linux", "networking", "dbms", "os", "communication", "project", "internship"]
            };

            const targetKeywords = keywordBank[role];
            let matched = [];
            let missing = [];

            targetKeywords.forEach(kw => {
                if (text.includes(kw)) {
                    matched.push(kw.toUpperCase());
                } else {
                    missing.push(kw.toUpperCase());
                }
            });

            // Calculate score based on keyword match + length bonus
            let score = Math.round((matched.length / targetKeywords.length) * 85);
            if (text.length > 150) score += 10;
            if (score > 98) score = 98;
            if (score < 20) score = 20;

            atsResultBox.classList.remove("hidden");
            atsProgressBar.style.width = "0%";

            setTimeout(() => {
                atsScoreText.innerText = `ATS Match Score: ${score}%`;
                atsProgressBar.style.width = `${score}%`;

                if (missing.length > 0) {
                    atsFeedback.innerText = `Matched Keywords: ${matched.length}/${targetKeywords.length}.\nTip: Consider adding keywords like ${missing.slice(0, 4).join(", ")} to boost your resume past automated filters!`;
                } else {
                    atsFeedback.innerText = "Excellent! Your resume contains all primary industry keywords for this role.";
                }
            }, 100);
        });
    }

    // --- 3. SIDEBAR FEATURE: MOCK INTERVIEW Q&A GENERATOR ---
    const generateQaBtn = document.getElementById("generateQaBtn");
    const qaContainer = document.getElementById("qaContainer");

    const qaDatabase = {
        dsa: [
            { q: "Q1: What is the difference between an Array and a Linked List?", a: "Arrays store elements in contiguous memory locations with O(1) index access, whereas Linked Lists store nodes dynamically using pointers with O(1) insertion/deletion." },
            { q: "Q2: Explain Time Complexity of Binary Search.", a: "Binary Search runs in O(log n) time because it repeatedly divides the sorted search space in half." },
            { q: "Q3: How does a Hash Table handle collisions?", a: "Common methods include Chaining (using linked lists at each bucket) and Open Addressing (Linear Probing, Quadratic Probing)." }
        ],
        oops: [
            { q: "Q1: What are the four main pillars of OOP?", a: "Encapsulation, Abstraction, Inheritance, and Polymorphism." },
            { q: "Q2: Difference between Method Overloading and Overriding?", a: "Overloading occurs at compile-time with the same method name but different parameters. Overriding occurs at runtime when a subclass redefines a parent class method." },
            { q: "Q3: What is a Virtual Function?", a: "A member function in a base class that you expect to redefine in derived classes to achieve runtime polymorphism." }
        ],
        dbms: [
            { q: "Q1: What are ACID properties in a database?", a: "Atomicity, Consistency, Isolation, and Durability — ensuring reliable database transactions." },
            { q: "Q2: Difference between INNER JOIN and LEFT JOIN?", a: "INNER JOIN returns only matching rows from both tables; LEFT JOIN returns all rows from the left table and matched rows from the right." },
            { q: "Q3: What is Normalization?", a: "The process of organizing data in a database to reduce redundancy and improve data integrity (1NF, 2NF, 3NF, BCNF)." }
        ],
        hr: [
            { q: "Q1: Tell me about yourself.", a: "Structure your answer as: Present (current degree/skills at CU), Past (key internships/projects), and Future (why you want to join their company)." },
            { q: "Q2: What is your biggest strength and weakness?", a: "Highlight a technical or collaborative strength with proof, and mention a real weakness along with the steps you are actively taking to improve it." },
            { q: "Q3: Why should we hire you?", a: "Align your core skills, adaptability, and project experience directly with the company's job description." }
        ]
    };

    if(generateQaBtn) {
        generateQaBtn.addEventListener("click", () => {
            const topic = document.getElementById("interviewTopic").value;
            const questions = qaDatabase[topic];

            qaContainer.innerHTML = "";
            qaContainer.classList.remove("hidden");

            questions.forEach(item => {
                const card = document.createElement("div");
                card.className = "qa-card";
                card.innerHTML = `<div class="qa-question">${item.q}</div><div class="qa-answer">${item.a}</div>`;
                qaContainer.appendChild(card);
            });
        });
    }

    // --- 4. SIDEBAR FEATURE: TARGET CGPA PLANNER ---
    const cgpaForm = document.getElementById("cgpaForm");
    const cgpaResultBox = document.getElementById("cgpaResultBox");
    const requiredSgpaText = document.getElementById("requiredSgpaText");
    const cgpaAdviceText = document.getElementById("cgpaAdviceText");

    if(cgpaForm) {
        cgpaForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const currentCgpa = parseFloat(document.getElementById("currentCgpaInput").value);
            const completedSems = parseInt(document.getElementById("completedSems").value);
            const targetCgpa = parseFloat(document.getElementById("targetCgpaInput").value);
            const totalSems = parseInt(document.getElementById("totalSems").value);

            const remainingSems = totalSems - completedSems;
            cgpaResultBox.classList.remove("hidden");

            if (remainingSems <= 0) {
                requiredSgpaText.innerText = "Course Completed!";
                cgpaAdviceText.innerText = "You have entered all semesters for your degree.";
                return;
            }

            const totalPointsNeeded = targetCgpa * totalSems;
            const currentPoints = currentCgpa * completedSems;
            const requiredSgpa = (totalPointsNeeded - currentPoints) / remainingSems;

            if (requiredSgpa > 10) {
                requiredSgpaText.innerText = `Required SGPA: ${requiredSgpa.toFixed(2)} (Not Possible)`;
                cgpaAdviceText.innerText = `Even with a 10.0 SGPA in your remaining ${remainingSems} semester(s), the maximum achievable CGPA is ${((currentPoints + (10 * remainingSems)) / totalSems).toFixed(2)}.`;
            } else if (requiredSgpa <= 0) {
                requiredSgpaText.innerText = "Target Already Achieved!";
                cgpaAdviceText.innerText = "Your current CGPA already exceeds your target goal. Maintain consistent grades!";
            } else {
                requiredSgpaText.innerText = `Required Average SGPA: ${requiredSgpa.toFixed(2)}`;
                cgpaAdviceText.innerText = `You need an average of ${requiredSgpa.toFixed(2)} SGPA across your remaining ${remainingSems} semester(s) to graduate with a ${targetCgpa.toFixed(2)} CGPA.`;
            }
        });
    }

    // ================= AI NEVI ASSISTANT LOGIC =================
    const neviBtn = document.getElementById("neviBtn");
    const neviModal = document.getElementById("neviModal");
    const closeNevi = document.getElementById("closeNevi");
    const neviSearchInput = document.getElementById("neviSearchInput");
    const cmdWrappers = document.querySelectorAll(".cmd-wrapper");

    neviBtn.addEventListener("click", () => {
        neviModal.classList.toggle("hidden-modal");
    });

    closeNevi.addEventListener("click", () => {
        neviModal.classList.add("hidden-modal");
    });

    function typeWriterEffect(element, text, speed = 15) {
        element.innerHTML = "";
        let i = 0;
        function typing() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            }
        }
        typing();
    }

    function getActionResponse(action) {
        switch(action) {
            case "search":
                return "Portal Search:\nUse the main dashboard form to calculate your placement probability or navigate using the left sidebar menu (Hamburger icon top-left).";
            case "developers":
                return "Website Developers:\n• Sneha (UID: 26BDA10152) - Lead Developer & UI Design\n• Yashika Bishnoi (UID: 26BDA10169) - Backend Logic & Analytics";
            case "companies":
                return "Expanded Placement Tiers:\n• Tier 1 (Dream): Microsoft, Google, Amazon, Atlassian (CTC: 20 LPA+)\n• Tier 2 (Super Dream): TCS Digital, Cognizant, Accenture (CTC: 7-12 LPA)\n• Tier 3 (Mass Recruiters): TCS Ninja, Infosys, Wipro (CTC: 3.5-5 LPA)";
            case "ats":
                return "📄 ATS Score Checker:\nNow live in the left sidebar! Open 'Resume ATS Checker' to scan your resume keywords against target roles.";
            case "interview":
                return "💡 Mock Interview Q&A:\nNow live in the left sidebar! Open 'Mock Interview Q&A' to practice DSA, OOPs, DBMS, and HR questions.";
            case "cgpa":
                return "📊 Target CGPA Planner:\nNow live in the left sidebar! Open 'Target CGPA Planner' to calculate the exact SGPA needed for your dream cutoff.";
            default:
                return "No matching information found.";
        }
    }

    cmdWrappers.forEach(wrapper => {
        const btn = wrapper.querySelector(".nevi-cmd-btn");
        const outputBox = wrapper.querySelector(".inline-output");
        const action = btn.getAttribute("data-action");

        btn.addEventListener("click", () => {
            cmdWrappers.forEach(w => {
                if(w !== wrapper) {
                    w.querySelector(".inline-output").classList.add("hidden");
                }
            });

            if(outputBox.classList.contains("hidden")) {
                outputBox.classList.remove("hidden");
                const textResponse = getActionResponse(action);
                typeWriterEffect(outputBox, textResponse, 15);
            } else {
                outputBox.classList.add("hidden");
            }
        });
    });

    neviSearchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        cmdWrappers.forEach(wrapper => {
            const btn = wrapper.querySelector(".nevi-cmd-btn");
            const text = btn.innerText.toLowerCase();
            if(text.includes(query) || !query) {
                wrapper.style.display = "flex";
            } else {
                wrapper.style.display = "none";
                wrapper.querySelector(".inline-output").classList.add("hidden");
            }
        });
    });
});