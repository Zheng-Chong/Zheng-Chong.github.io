// 语言切换功能
let currentLang = 'zh';

const translations = {
    zh: {
        education: '教育经历',
        publications: '论文发表',
        academicService: '学术服务',
        reviewer: '审稿人',
        // ... 其他翻译
    },
    en: {
        education: 'Education',
        publications: 'Publications',
        academicService: 'Academic Service',
        reviewer: 'Reviewer',
        // ... 其他翻译
    }
};

function switchLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    updateContent();
    localStorage.setItem('preferredLanguage', currentLang);
}

function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = translations[currentLang][key];
    });
}

// PDF 导出功能
async function exportToPDF() {
    const element = document.body;
    const opt = {
        margin: 1,
        filename: 'Resume_ChongZheng.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}

// 访问计数功能
async function updateVisitCount() {
    try {
        const response = await fetch('https://api.countapi.xyz/hit/zheng-chong.github.io/visits');
        const data = await response.json();
        document.getElementById('visit-count').textContent = data.value;
    } catch (error) {
        console.error('Error updating visit count:', error);
    }
}

// 论文列表渲染功能
function renderPublications() {
    const container = document.getElementById('publications-container');
    container.innerHTML = '';

    Object.keys(publications).sort((a, b) => b - a).forEach(year => {
        const yearSection = document.createElement('div');
        yearSection.className = 'publication-year';
        yearSection.textContent = year;
        container.appendChild(yearSection);

        publications[year].forEach(pub => {
            const pubDiv = document.createElement('div');
            pubDiv.className = 'publication-item';

            const title = document.createElement('h4');
            title.className = 'title is-5';
            title.textContent = pub.title;

            const authors = document.createElement('p');
            authors.className = 'authors';
            authors.textContent = pub.authors.join(', ');

            const venue = document.createElement('p');
            venue.className = 'venue';
            venue.textContent = pub.venue;

            pubDiv.appendChild(title);
            pubDiv.appendChild(authors);
            pubDiv.appendChild(venue);

            if (pub.links) {
                const links = document.createElement('div');
                links.className = 'links';
                Object.entries(pub.links).forEach(([type, url]) => {
                    const link = document.createElement('a');
                    link.href = url;
                    link.textContent = `[${type}]`;
                    link.target = '_blank';
                    links.appendChild(link);
                    links.appendChild(document.createTextNode(' '));
                });
                pubDiv.appendChild(links);
            }

            container.appendChild(pubDiv);
        });
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 从本地存储加载语言偏好
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        currentLang = savedLang;
        updateContent();
    }

    // 更新访问计数
    updateVisitCount();

    // 渲染论文列表
    renderPublications();
}); 