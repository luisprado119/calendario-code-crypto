// Datos del curso
const courseData = {
    startDate: new Date(2025, 7, 18), // 18 de agosto de 2025 (mes 7 = agosto, 0-indexado)
    durationMonths: 9,
    weeks: [
        { number: 1, topic: "Bienvenido a Code Crypto" },
        { number: 2, topic: "Fundamentos de Software" },
        { number: 3, topic: "Fundamentos de Software" },
        { number: 4, topic: "Diagramas de Flujo Algorítmico I" },
        { number: 5, topic: "Diagramas de Flujo Algorítmico II" },
        { number: 6, topic: "JavaScript I" },
        { number: 7, topic: "JavaScript I" },
        { number: 8, topic: "JavaScript Avanzado" },
        { number: 9, topic: "JavaScript Avanzado" },
        { number: 10, topic: "TypeScript" },
        { number: 11, topic: "Diseño Web" },
        { number: 12, topic: "Proyecto React (Diseño)" },
        { number: 13, topic: "SQL Introducción" },
        { number: 14, topic: "Web Server con NodeJS" },
        { number: 15, topic: "Docker" },
        { number: 16, topic: "Proyecto Gal" },
        { number: 17, topic: "ReactJS" },
        { number: 18, topic: "ReactJS" },
        { number: 19, topic: "Intro a NextJS" },
        { number: 20, topic: "Proyecto Faucet Geth" },
        { number: 21, topic: "Proyecto Faucet Besu" },
        { number: 22, topic: "Semana de descanso" },
        { number: 23, topic: "Semana de descanso" },
        { number: 24, topic: "Semana de descanso" },
        { number: 25, topic: "Semana de descanso" },
        { number: 26, topic: "Semana de descanso" },
        { number: 27, topic: "Semana de descanso" },
        { number: 28, topic: "Ethereum Fundamentos" },
        { number: 29, topic: "Proyecto Cesta" },
        { number: 30, topic: "Proyecto Explorer & Proyecto Crypto" },
        { number: 31, topic: "Proyecto Ethereum" },
        { number: 32, topic: "Proyecto Besu" },
        { number: 33, topic: "Proyecto Final: Tokenización" },
        { number: 34, topic: "Proyecto Final: Tokenización" },
        { number: 35, topic: "Proyecto Final: Tokenización" },
        { number: 36, topic: "Proyecto Final: Tokenización" }
    ]
};

// Función para calcular fechas
function calculateDates() {
    const endDate = new Date(courseData.startDate);
    endDate.setMonth(endDate.getMonth() + courseData.durationMonths);
    
    const today = new Date();
    const daysSinceStart = Math.floor((today - courseData.startDate) / (1000 * 60 * 60 * 24));
    const totalDays = Math.floor((endDate - courseData.startDate) / (1000 * 60 * 60 * 24));
    
    return {
        startDate: courseData.startDate,
        endDate: endDate,
        today: today,
        daysSinceStart: daysSinceStart,
        totalDays: totalDays,
        daysRemaining: Math.max(0, totalDays - daysSinceStart)
    };
}

// Función para obtener la semana actual
function getCurrentWeek() {
    const dates = calculateDates();
    const daysSinceStart = dates.daysSinceStart;
    
    if (daysSinceStart < 0) {
        return { week: 0, status: 'upcoming', daysUntilStart: Math.abs(daysSinceStart) };
    }
    
    const currentWeek = Math.floor(daysSinceStart / 7) + 1;
    
    // Determinar el estado
    let status = 'upcoming';
    if (currentWeek <= 36) {
        status = 'current';
    }
    
    return { week: currentWeek, status: status };
}

// Función para obtener información de una semana específica
function getWeekInfo(weekNumber) {
    const dates = calculateDates();
    const weekStartDate = new Date(courseData.startDate);
    weekStartDate.setDate(weekStartDate.getDate() + (weekNumber - 1) * 7);
    
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);
    
    // Encontrar el tema de la semana
    let weekTopic = "Semana de descanso";
    
    const weekData = courseData.weeks.find(w => w.number === weekNumber);
    if (weekData) {
        weekTopic = weekData.topic;
    }
    
    // Determinar el estado de la semana
    const currentWeek = getCurrentWeek();
    let status = 'upcoming';
    
    if (weekNumber < currentWeek.week) {
        status = 'completed';
    } else if (weekNumber === currentWeek.week) {
        status = 'current';
    } else if (weekNumber > currentWeek.week + 1) {
        status = 'upcoming';
    } else {
        status = 'upcoming';
    }
    
    return {
        number: weekNumber,
        topic: weekTopic,
        startDate: weekStartDate,
        endDate: weekEndDate,
        status: status
    };
}

// Función para formatear fechas
function formatDate(date) {
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Función para actualizar el estado actual
function updateCurrentStatus() {
    const dates = calculateDates();
    const currentWeek = getCurrentWeek();
    const weekInfo = getWeekInfo(currentWeek.week);
    
    const statusCard = document.getElementById('statusCard');
    const statusIcon = document.getElementById('statusIcon');
    const currentWeekEl = document.getElementById('currentWeek');
    const currentTopic = document.getElementById('currentTopic');
    const statusBadge = document.getElementById('statusBadge');
    const daysRemaining = document.getElementById('daysRemaining');
    
    // Actualizar información básica
    currentWeekEl.textContent = `Semana ${currentWeek.week}`;
    currentTopic.textContent = weekInfo.topic;
    daysRemaining.textContent = `Días restantes: ${dates.daysRemaining}`;
    
    // Determinar estado y actualizar UI
    let statusText = '';
    let statusClass = '';
    let iconClass = '';
    
    if (dates.daysSinceStart < 0) {
        statusText = 'Curso no iniciado';
        statusClass = 'behind';
        iconClass = 'fas fa-clock';
    } else if (currentWeek.week > 36) {
        statusText = 'Curso finalizado';
        statusClass = 'completed';
        iconClass = 'fas fa-check-circle';
    } else {
        const expectedWeek = Math.floor(dates.daysSinceStart / 7) + 1;
        if (currentWeek.week === expectedWeek) {
            statusText = 'Al día';
            statusClass = 'on-track';
            iconClass = 'fas fa-check-circle';
        } else if (currentWeek.week > expectedWeek) {
            statusText = 'Adelantado';
            statusClass = 'ahead';
            iconClass = 'fas fa-forward';
        } else {
            statusText = 'Atrasado';
            statusClass = 'behind';
            iconClass = 'fas fa-exclamation-triangle';
        }
    }
    
    statusBadge.textContent = statusText;
    statusBadge.className = `status-badge ${statusClass}`;
    statusIcon.innerHTML = `<i class="${iconClass}"></i>`;
}

// Función para generar las tarjetas de semanas
function generateWeekCards() {
    const weeksGrid = document.getElementById('weeksGrid');
    weeksGrid.innerHTML = '';
    
    for (let weekNum = 1; weekNum <= 36; weekNum++) {
        const weekInfo = getWeekInfo(weekNum);
        const weekCard = createWeekCard(weekInfo);
        weeksGrid.appendChild(weekCard);
    }
}

// Función para crear una tarjeta de semana
function createWeekCard(weekInfo) {
    const card = document.createElement('div');
    card.className = `week-card ${weekInfo.status}`;
    card.dataset.week = weekInfo.number;
    
    const weekHeader = document.createElement('div');
    weekHeader.className = 'week-header';
    
    const weekNumber = document.createElement('div');
    weekNumber.className = 'week-number';
    weekNumber.textContent = `Semana ${weekInfo.number}`;
    
    const weekDate = document.createElement('div');
    weekDate.className = 'week-date';
    weekDate.textContent = `${formatDate(weekInfo.startDate)} - ${formatDate(weekInfo.endDate)}`;
    
    weekHeader.appendChild(weekNumber);
    weekHeader.appendChild(weekDate);
    
    const weekTopic = document.createElement('div');
    weekTopic.className = 'week-topic';
    weekTopic.textContent = weekInfo.topic;
    
    const weekStatus = document.createElement('div');
    weekStatus.className = `week-status ${weekInfo.status}`;
    
    switch (weekInfo.status) {
        case 'completed':
            weekStatus.textContent = 'Completada';
            break;
        case 'current':
            weekStatus.textContent = 'Actual';
            break;
        case 'upcoming':
            weekStatus.textContent = 'Próxima';
            break;
    }
    
    card.appendChild(weekHeader);
    card.appendChild(weekTopic);
    card.appendChild(weekStatus);
    
    return card;
}

// Función para actualizar el progreso general
function updateProgress() {
    const dates = calculateDates();
    const progressPercentage = Math.min(100, Math.max(0, (dates.daysSinceStart / dates.totalDays) * 100));
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressFill.style.width = `${progressPercentage}%`;
    progressText.textContent = `${Math.round(progressPercentage)}%`;
}

// Función para filtrar semanas
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const weekCards = document.querySelectorAll('.week-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase active al botón clickeado
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            weekCards.forEach(card => {
                card.style.display = 'block';
                
                if (filter === 'completed' && !card.classList.contains('completed')) {
                    card.style.display = 'none';
                } else if (filter === 'current' && !card.classList.contains('current')) {
                    card.style.display = 'none';
                } else if (filter === 'upcoming' && !card.classList.contains('upcoming')) {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Función para actualizar la información del curso
function updateCourseInfo() {
    const dates = calculateDates();
    const endDateFormatted = dates.endDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    // Actualizar la fecha de fin en el HTML
    const endDateElement = document.querySelector('.course-info .info-item:nth-child(2) span');
    if (endDateElement) {
        endDateElement.textContent = `Fin: ${endDateFormatted}`;
    }
}

// Función principal de inicialización
function initializeApp() {
    updateCurrentStatus();
    generateWeekCards();
    updateProgress();
    setupFilters();
    updateCourseInfo();
    
    // Actualizar cada minuto
    setInterval(() => {
        updateCurrentStatus();
        updateProgress();
    }, 60000);
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', initializeApp);
