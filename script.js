// Sistema de autenticación mejorado
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 horas
        this.users = {
            'ecovida': { 
                username: 'ecovida', 
                password: 'demo123', 
                orgName: 'EcoVida Colombia',
                avatar: 'EV',
                id: 'ecovida',
                email: 'contacto@ecovida.org'
            },
            'educacion': { 
                username: 'educacion', 
                password: 'demo123', 
                orgName: 'Fundación Educación para Todos',
                avatar: 'FE',
                id: 'educacion',
                email: 'info@educacionparatodos.org'
            },
            'salud': { 
                username: 'salud', 
                password: 'demo123', 
                orgName: 'Alianza Salud Comunitaria',
                avatar: 'AS',
                id: 'salud',
                email: 'contacto@alianzasalud.org'
            },
            'derechos': { 
                username: 'derechos', 
                password: 'demo123', 
                orgName: 'Defensores de Derechos Humanos',
                avatar: 'DH',
                id: 'derechos',
                email: 'info@defensoresddh.org'
            },
            'tecnologia': { 
                username: 'tecnologia', 
                password: 'demo123', 
                orgName: 'Tecnología Inclusiva',
                avatar: 'TI',
                id: 'tecnologia',
                email: 'contacto@tecnologiainclusiva.org'
            },
            'mujeres': { 
                username: 'mujeres', 
                password: 'demo123', 
                orgName: 'Mujeres y Justicia',
                avatar: 'MJ',
                id: 'mujeres',
                email: 'info@mujeresjusticia.org'
            }
        };
        this.loadUserSession();
    }

    login(username, password) {
        const user = this.users[username.toLowerCase()];
        if (user && user.password === password) {
            this.currentUser = {
                ...user,
                loginTime: new Date().getTime(),
                sessionId: this.generateSessionId()
            };
            this.saveUserSession();
            this.updateUserInterface();
            this.showWelcomeMessage();
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        this.clearUserSession();
        this.updateUserInterface();
        this.showLogoutMessage();
        // Redirigir después de un breve delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    isAuthenticated() {
        if (!this.currentUser) return false;
        
        // Verificar si la sesión ha expirado
        const currentTime = new Date().getTime();
        const sessionAge = currentTime - this.currentUser.loginTime;
        
        if (sessionAge > this.sessionTimeout) {
            this.logout();
            return false;
        }
        
        return true;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    generateSessionId() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }

    saveUserSession() {
        localStorage.setItem('userSession', JSON.stringify(this.currentUser));
    }

    loadUserSession() {
        try {
            const sessionData = localStorage.getItem('userSession');
            if (sessionData) {
                this.currentUser = JSON.parse(sessionData);

                if (!this.isAuthenticated()) {
                    this.clearUserSession();
                }
            }
        } catch (error) {
            console.log('Error loading session:', error);
            this.clearUserSession();
        }
    }


    clearUserSession() {
    localStorage.removeItem('userSession');
    }

    requireAuth(callback, action = 'realizar esta acción') {
        if (this.isAuthenticated()) {
            callback();
        } else {
            this.showAuthModal(action);
        }
    }

    showAuthModal(action = 'realizar esta acción') {
        // Remover modal existente si existe
        const existingModal = document.querySelector('.auth-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-overlay"></div>
            <div class="auth-modal-content">
                <div class="auth-modal-header">
                    <h3>🔐 Iniciar Sesión Requerido</h3>
                    <button class="auth-modal-close" onclick="this.closest('.auth-modal').remove()">×</button>
                </div>
                <div class="auth-modal-body">
                    <p>Para ${action} necesitas iniciar sesión con tu cuenta de organización.</p>
                    <div class="demo-accounts">
                        <p><strong>Cuentas de demostración:</strong></p>
                        <ul>
                            <li>ecovida / demo123</li>
                            <li>educacion / demo123</li>
                            <li>salud / demo123</li>
                        </ul>
                    </div>
                </div>
                <div class="auth-modal-buttons">
                    <a href="login.html" class="btn btn-primary">Iniciar Sesión</a>
                    <button class="btn btn-secondary" onclick="this.closest('.auth-modal').remove()">Cancelar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Agregar estilos del modal si no existen
        this.addModalStyles();
    }

    addModalStyles() {
        if (document.querySelector('#auth-modal-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'auth-modal-styles';
        styles.textContent = `
            .auth-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .auth-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(5px);
            }
            
            .auth-modal-content {
                background: white;
                border-radius: 12px;
                padding: 0;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
                z-index: 1;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            
            .auth-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem 2rem;
                border-bottom: 1px solid #e2e8f0;
            }
            
            .auth-modal-header h3 {
                margin: 0;
                color: #2563eb;
            }
            
            .auth-modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                color: #64748b;
            }
            
            .auth-modal-body {
                padding: 2rem;
            }
            
            .demo-accounts {
                background: #f8fafc;
                padding: 1rem;
                border-radius: 8px;
                margin-top: 1rem;
            }
            
            .demo-accounts ul {
                margin: 0.5rem 0 0 0;
                padding-left: 1.5rem;
            }
            
            .demo-accounts li {
                margin: 0.25rem 0;
                font-family: monospace;
                font-size: 0.9rem;
            }
            
            .auth-modal-buttons {
                display: flex;
                gap: 1rem;
                padding: 1.5rem 2rem;
                border-top: 1px solid #e2e8f0;
            }
            
            .auth-modal-buttons .btn {
                flex: 1;
                text-align: center;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .auth-modal-buttons .btn-primary {
                background: #2563eb;
                color: white;
            }
            
            .auth-modal-buttons .btn-secondary {
                background: #6b7280;
                color: white;
            }
            
            .auth-modal-buttons .btn:hover {
                transform: translateY(-2px);
            }
        `;
        
        document.head.appendChild(styles);
    }

    showWelcomeMessage() {
        const user = this.getCurrentUser();
        if (user) {
            this.showToast(`¡Bienvenido ${user.orgName}! 🎉`, 'success');
        }
    }

    showLogoutMessage() {
        this.showToast('Sesión cerrada correctamente. ¡Hasta pronto! 👋', 'info');
    }

    showToast(message, type = 'info') {
        // Remover toast existente
        const existingToast = document.querySelector('.auth-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `auth-toast auth-toast-${type}`;
        toast.textContent = message;
        
        // Agregar estilos del toast
        this.addToastStyles();
        
        document.body.appendChild(toast);
        
        // Mostrar toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Ocultar toast después de 3 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    addToastStyles() {
        if (document.querySelector('#auth-toast-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'auth-toast-styles';
        styles.textContent = `
            .auth-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10001;
                transform: translateX(400px);
                opacity: 0;
                transition: all 0.3s ease;
                max-width: 400px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            }
            
            .auth-toast.show {
                transform: translateX(0);
                opacity: 1;
            }
            
            .auth-toast-success {
                background: #059669;
            }
            
            .auth-toast-error {
                background: #dc2626;
            }
            
            .auth-toast-info {
                background: #2563eb;
            }
        `;
        
        document.head.appendChild(styles);
    }

    updateUserInterface() {
        this.updateNavbar();
        this.updateFormFields();
        this.updateInteractionButtons();
    }

    updateNavbar() {
        const navContainer = document.querySelector('.nav-container');
        if (!navContainer) return;

        // Remover estado de usuario existente
        const existingUserStatus = document.querySelector('.user-status');
        if (existingUserStatus) {
            existingUserStatus.remove();
        }

        if (this.isAuthenticated()) {
            const user = this.getCurrentUser();
            
            // Crear elemento de estado de usuario
            const userStatus = document.createElement('div');
            userStatus.className = 'user-status';
            userStatus.innerHTML = `
                <div class="user-info">
                    <div class="user-avatar">${user.avatar}</div>
                    <div class="user-details">
                        <div class="user-name">${user.orgName}</div>
                        <div class="user-status-indicator">En línea</div>
                    </div>
                </div>
                <button class="logout-btn" onclick="auth.logout()" title="Cerrar sesión">
                    <span>Salir</span>
                </button>
            `;
            
            navContainer.appendChild(userStatus);
            this.addNavbarStyles();
        }
    }

    addNavbarStyles() {
        if (document.querySelector('#navbar-user-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'navbar-user-styles';
        styles.textContent = `
            .user-status {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0.5rem;
                border-radius: 8px;
                background: rgba(37, 99, 235, 0.1);
                border: 1px solid rgba(37, 99, 235, 0.2);
            }
            
            .user-info {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .user-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #2563eb;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 0.9rem;
            }
            
            .user-details {
                display: flex;
                flex-direction: column;
                gap: 0.125rem;
            }
            
            .user-name {
                font-weight: 600;
                color: #1e293b;
                font-size: 0.9rem;
            }
            
            .user-status-indicator {
                font-size: 0.75rem;
                color: #059669;
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }
            
            .user-status-indicator::before {
                content: '●';
                color: #059669;
            }
            
            .logout-btn {
                background: #dc2626;
                color: white;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.85rem;
                font-weight: 500;
                transition: all 0.3s ease;
            }
            
            .logout-btn:hover {
                background: #b91c1c;
                transform: translateY(-1px);
            }
            
            @media (max-width: 768px) {
                .user-status {
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .user-details {
                    text-align: center;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    updateFormFields() {
        // Auto-llenar formularios con datos del usuario autenticado
        const user = this.getCurrentUser();
        if (user) {
            const orgNameField = document.getElementById('org-name');
            if (orgNameField) {
                orgNameField.value = user.orgName;
                orgNameField.disabled = true;
                orgNameField.style.background = '#f8fafc';
            }
        }
    }

    updateInteractionButtons() {
        // Actualizar textos de botones según el estado de autenticación
        const interactionButtons = document.querySelectorAll('.org-btn, .post-btn');
        interactionButtons.forEach(btn => {
            if (this.isAuthenticated()) {
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                btn.disabled = false;
            } else {
                btn.style.opacity = '0.7';
                btn.style.cursor = 'not-allowed';
            }
        });
    }
}

// Instancia global del sistema de autenticación
const auth = new AuthSystem();

// Inicialización cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar carrusel
    initializeCarousel();
    
    // Inicializar menú móvil
    initializeMobileMenu();
    
    // Actualizar interfaz de usuario
    auth.updateUserInterface();
    
    // Configurar formulario de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Configurar formulario de registro
    const registerForm = document.getElementById('form-ong');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
    
    // Agregar event listeners para interacciones
    addInteractionListeners();
});

function initializeCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        if (slides[index]) {
            slides[index].classList.add('active');
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    if (slides.length > 0) {
        setInterval(nextSlide, 5000);
    }
}

function initializeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        auth.showToast('Por favor ingresa usuario y contraseña', 'error');
        return;
    }
    
    if (auth.login(username, password)) {
        // Redirigir según la página actual o preferencia del usuario
        setTimeout(() => {
            window.location.href = 'feed.html';
        }, 1500);
    } else {
        auth.showToast('Usuario o contraseña incorrectos. Verifica los datos de demo.', 'error');
        
        // Mostrar ayuda con las cuentas de demo
        setTimeout(() => {
            const demoInfo = document.createElement('div');
            demoInfo.className = 'demo-info';
            demoInfo.innerHTML = `
                <p><strong>Cuentas de demostración disponibles:</strong></p>
                <ul>
                    <li>ecovida / demo123</li>
                    <li>educacion / demo123</li>
                    <li>salud / demo123</li>
                </ul>
            `;
            
            const form = document.getElementById('login-form');
            if (form && !document.querySelector('.demo-info')) {
                form.appendChild(demoInfo);
            }
        }, 1000);
    }
}

function handleRegistration(e) {
    e.preventDefault();
    auth.showToast('¡Registro enviado exitosamente! Te contactaremos pronto.', 'success');
    e.target.reset();
}

function addInteractionListeners() {
    // Botones de crear post
    const createPostBtn = document.querySelector('button[onclick="createPost()"]');
    if (createPostBtn) {
        createPostBtn.onclick = function() {
            auth.requireAuth(() => createPost(), 'crear publicaciones');
        };
    }
    
    // Botones de interacción en cards de organizaciones
    const orgButtons = document.querySelectorAll('.org-btn');
    orgButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            auth.requireAuth(() => handleOrgInteraction(this), 'conectar con organizaciones');
        });
    });
    
    // Botones de interacción en posts
    const postButtons = document.querySelectorAll('.post-btn');
    postButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.textContent.toLowerCase();
            if (action.includes('gusta') || action.includes('comentar') || action.includes('colaborar')) {
                auth.requireAuth(() => handlePostInteraction(this), 'interactuar con publicaciones');
            }
        });
    });
}

function createPost() {
    const postTitle = document.getElementById('post-title')?.value.trim();
    const postContent = document.getElementById('post-content')?.value.trim();
    
    if (!postTitle || !postContent) {
        auth.showToast('Por favor, completa el título y contenido del post', 'error');
        return;
    }
    
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;
    
    const user = auth.getCurrentUser();
    const postId = 'post-' + Date.now();
    
    const newPost = document.createElement('div');
    newPost.className = 'post';
    newPost.id = postId;
    newPost.innerHTML = `
        <div class="post-header">
            <div class="post-avatar">${user.avatar}</div>
            <div class="post-info">
                <h4>${user.orgName}</h4>
                <div class="post-date">Ahora</div>
            </div>
        </div>
        <div class="post-content">
            <h4>${postTitle}</h4>
            <p>${postContent}</p>
        </div>
        <div class="post-actions">
            <button class="post-btn like-btn" onclick="handleLike('${postId}')">
                👍 Me gusta (<span class="like-count">0</span>)
            </button>
            <button class="post-btn comment-btn" onclick="handleComment('${postId}')">
                💬 Comentar
            </button>
            <button class="post-btn collaborate-btn" onclick="handleCollaborate('${postId}')">
                🤝 Colaborar
            </button>
        </div>
    `;
    
    postsContainer.insertBefore(newPost, postsContainer.firstChild);
    
    // Limpiar formulario
    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';
    
    // Animación de entrada
    newPost.style.opacity = '0';
    newPost.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        newPost.style.transition = 'all 0.3s ease';
        newPost.style.opacity = '1';
        newPost.style.transform = 'translateY(0)';
    }, 100);
    
    auth.showToast('¡Publicación creada exitosamente! 🎉', 'success');
}

function handleOrgInteraction(button) {
    const user = auth.getCurrentUser();
    const orgCard = button.closest('.org-card');
    const orgName = orgCard.querySelector('.org-name').textContent;
    
    auth.showToast(`¡Excelente ${user.orgName}! Se ha enviado tu solicitud a ${orgName}`, 'success');
    
    // Cambiar estado del botón
    button.textContent = '✅ Solicitud enviada';
    button.disabled = true;
    button.style.background = '#059669';
}

function handlePostInteraction(button) {
    const user = auth.getCurrentUser();
    const action = button.textContent.toLowerCase();
    
    if (action.includes('gusta')) {
        handleLike(button);
    } else if (action.includes('comentar')) {
        handleComment(button);
    } else if (action.includes('colaborar')) {
        handleCollaborate(button);
    }
}

function handleLike(buttonOrPostId) {
    const user = auth.getCurrentUser();
    let likeBtn, likeCount;
    
    if (typeof buttonOrPostId === 'string') {
        // Se llamó con postId
        likeBtn = document.querySelector(`#${buttonOrPostId} .like-btn`);
        likeCount = document.querySelector(`#${buttonOrPostId} .like-count`);
    } else {
        // Se llamó con el botón
        likeBtn = buttonOrPostId;
        likeCount = likeBtn.querySelector('.like-count') || likeBtn.querySelector('span');
    }
    
    if (likeBtn && likeCount) {
        const currentLikes = parseInt(likeCount.textContent) || 0;
        likeCount.textContent = currentLikes + 1;
        
        // Efecto visual
        likeBtn.style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            likeBtn.style.animation = '';
        }, 300);
        
        auth.showToast(`¡Tu like ha sido registrado! 👍`, 'success');
    }
}

function handleComment(buttonOrPostId) {
    const user = auth.getCurrentUser();
    let post;
    
    if (typeof buttonOrPostId === 'string') {
        post = document.getElementById(buttonOrPostId);
    } else {
        post = buttonOrPostId.closest('.post');
    }
    
    const comment = prompt('Escribe tu comentario:');
    if (comment && comment.trim()) {
        auth.showToast(`¡Comentario enviado! 💬`, 'success');
        
        // Aquí podrías agregar el comentario visualmente al post
        // Por simplicidad, solo mostramos el toast
    }
}

function handleCollaborate(buttonOrPostId) {
    const user = auth.getCurrentUser();
    let post;
    
    if (typeof buttonOrPostId === 'string') {
        post = document.getElementById(buttonOrPostId);
    } else {
        post = buttonOrPostId.closest('.post');
    }
    
    const postAuthor = post.querySelector('.post-info h4').textContent;
    auth.showToast(`¡Solicitud de colaboración enviada a ${postAuthor}! 🤝`, 'success');
}

// Función para continuar como invitado (desde login.html)
function continueAsGuest() {
    auth.showToast('Navegando como invitado. Funcionalidad limitada.', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Agregar estilos para animaciones
document.addEventListener('DOMContentLoaded', function() {
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .demo-info {
            margin-top: 1rem;
            padding: 1rem;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
        }
        
        .demo-info ul {
            margin: 0.5rem 0 0 0;
            padding-left: 1.5rem;
        }
        
        .demo-info li {
            margin: 0.25rem 0;
            font-family: monospace;
            font-size: 0.9rem;
            color: #374151;
        }
    `;
    
    document.head.appendChild(animationStyles);
});