// Datos del curso
const courseData = {
    startDate: new Date(2025, 7, 18), // 18 de agosto de 2025 (mes 7 = agosto, 0-indexado)
    durationMonths: 9,
    weeks: [
        { number: 1, topic: "Bienvenido a Code Crypto", duration: 1 },
        { number: 2, topic: "Fundamentos de Software", duration: 2 },
        { number: 4, topic: "Diagramas de Flujo Algorítmico I", duration: 1 },
        { number: 5, topic: "Diagramas de Flujo Algorítmico II", duration: 1 },
        { number: 6, topic: "JavaScript I", duration: 1 },
        { number: 7, topic: "JavaScript II", duration: 1 },
        { number: 8, topic: "JavaScript Avanzado", duration: 2 },
        { number: 10, topic: "TypeScript", duration: 1 },
        { number: 11, topic: "Diseño Web", duration: 1 },
        { number: 12, topic: "Proyecto React (Diseño)", duration: 1 },
        { number: 13, topic: "SQL Introducción", duration: 1 },
        { number: 14, topic: "Web Server con NodeJS", duration: 1 },
        { number: 15, topic: "Docker", duration: 1 },
        { number: 16, topic: "Proyecto SQL", duration: 1 },
        { number: 17, topic: "ReactJS", duration: 2 },
        { number: 19, topic: "Intro a NextJS", duration: 1 },
        { number: 20, topic: "Proyecto Faucet Geth", duration: 1 },
        { number: 21, topic: "Proyecto Faucet Besu", duration: 1 },
        { number: 22, topic: "Contenido Adicional I", duration: 1 },
        { number: 23, topic: "Contenido Adicional II", duration: 1 },
        { number: 24, topic: "Contenido Adicional III", duration: 1 },
        { number: 25, topic: "Contenido Adicional IV", duration: 1 },
        { number: 26, topic: "Contenido Adicional V", duration: 1 },
        { number: 27, topic: "Contenido Adicional VI", duration: 1 },
        { number: 28, topic: "Ethereum Fundamentos", duration: 1 },
        { number: 29, topic: "Proyecto Cesta", duration: 1 },
        { number: 30, topic: "Proyecto Explorer & Proyecto Crypto", duration: 1 },
        { number: 31, topic: "Proyecto Ethereum", duration: 1 },
        { number: 32, topic: "Proyecto Besu", duration: 1 },
        { number: 33, topic: "Proyecto Final: Tokenización", duration: 4 }
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
    
    // Debug: mostrar información en consola
    console.log('Debug - Fecha de inicio:', dates.startDate.toLocaleDateString('es-ES'));
    console.log('Debug - Fecha actual:', dates.today.toLocaleDateString('es-ES'));
    console.log('Debug - Días desde inicio:', daysSinceStart);
    
    if (daysSinceStart < 0) {
        console.log('Debug - Curso no iniciado, días hasta inicio:', Math.abs(daysSinceStart));
        return { week: 0, status: 'upcoming', daysUntilStart: Math.abs(daysSinceStart) };
    }
    
    const currentWeek = Math.floor(daysSinceStart / 7) + 1;
    console.log('Debug - Semana calculada:', currentWeek);
    
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
    
    // Encontrar el tema de la semana - buscar si esta semana pertenece a algún bloque
    let weekTopic = "Contenido Adicional";
    let weekDuration = 1;
    let isPartOfBlock = false;
    
    // Buscar si esta semana es parte de un bloque de múltiples semanas
    for (const weekData of courseData.weeks) {
        if (weekNumber >= weekData.number && weekNumber < weekData.number + weekData.duration) {
            weekTopic = weekData.topic;
            weekDuration = weekData.duration;
            isPartOfBlock = true;
            
            // Si es parte de un bloque, agregar indicador
            if (weekData.duration > 1) {
                const weekInBlock = weekNumber - weekData.number + 1;
                weekTopic += ` (Parte ${weekInBlock}/${weekData.duration})`;
            }
            break;
        }
    }
    
    // Si no es parte de un bloque, verificar si hay tema específico
    if (!isPartOfBlock) {
        const weekData = courseData.weeks.find(w => w.number === weekNumber);
        if (weekData) {
            weekTopic = weekData.topic;
            weekDuration = weekData.duration;
        }
    }
    
    // Determinar el estado de la semana
    const currentWeek = getCurrentWeek();
    let status = 'upcoming';
    
    if (weekNumber < currentWeek.week) {
        status = 'completed';
    } else if (weekNumber === currentWeek.week) {
        status = 'current';
    } else {
        status = 'upcoming';
    }
    
    return {
        number: weekNumber,
        topic: weekTopic,
        startDate: weekStartDate,
        endDate: weekEndDate,
        status: status,
        duration: weekDuration
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
