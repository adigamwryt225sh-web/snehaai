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

    // --- PREDICTION FORM & COMPANY LOGIC ---
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

            // Base Algorithm mapping
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

            // Target Companies Array with Descriptions and Career Links
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

            // UI Reset
            resultBox.classList.remove("hidden");
            companyBox.classList.add("hidden");
            progressBar.style.width = "0%"; 
            
            // Render UI Animations
            setTimeout(() => {
                predictionResult.innerText = `Placement Probability: ${probability.toFixed(1)}%`;
                progressBar.style.width = `${probability}%`;

                // Render Company Link Cards
                companyTags.innerHTML = "";
                companies.forEach(company => {
                    // Create an <a> tag instead of a span
                    const card = document.createElement("a");
                    card.href = company.url;
                    card.target = "_blank"; // Opens link in a new tab
                    card.className = "company-card";
                    
                    // Create Name
                    const title = document.createElement("strong");
                    title.innerText = company.name;
                    
                    // Create Description
                    const desc = document.createElement("span");
                    desc.innerText = company.desc;
                    
                    // Add to card, then add card to container
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
});