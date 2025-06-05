document.addEventListener('DOMContentLoaded', function() {
    // Play both background music tracks simultaneously
    const backgroundMusic1 = document.getElementById('background-music-1');
    const backgroundMusic2 = document.getElementById('background-music-2');
    
    // Keep track of sound state
    let isMuted = false;
    
    if (backgroundMusic1 && backgroundMusic2) {
        // Set volume for each track
        backgroundMusic1.volume = 0.1; // Lower volume for rain sound (10%)
        backgroundMusic2.volume = 0.2; // Keep theme song at 20%
        
        // Loop both tracks
        backgroundMusic1.loop = true;
        backgroundMusic2.loop = true;
        
        // Setup sound toggle button
        const soundToggle = document.getElementById('sound-toggle');
        const volumeUpIcon = soundToggle.querySelector('.fa-volume-up');
        const volumeMuteIcon = soundToggle.querySelector('.fa-volume-mute');
        
        soundToggle.addEventListener('click', function() {
            if (isMuted) {
                // Unmute audio
                backgroundMusic1.volume = 0.1;
                backgroundMusic2.volume = 0.2;
                volumeUpIcon.style.display = 'inline';
                volumeMuteIcon.style.display = 'none';
                isMuted = false;
            } else {
                // Mute audio
                backgroundMusic1.volume = 0;
                backgroundMusic2.volume = 0;
                volumeUpIcon.style.display = 'none';
                volumeMuteIcon.style.display = 'inline';
                isMuted = true;
            }
        });
        
        // Play music when user interacts with the page (to comply with autoplay policies)
        const playMusic = () => {
            // Play both tracks
            backgroundMusic1.play().catch(error => {
                console.log('Auto-play was prevented for track 1. User interaction is required:', error);
            });
            
            backgroundMusic2.play().catch(error => {
                console.log('Auto-play was prevented for track 2. User interaction is required:', error);
            });
            
            // Remove the event listeners once music starts playing
            document.removeEventListener('click', playMusic);
            document.removeEventListener('keydown', playMusic);
            document.removeEventListener('touchstart', playMusic);
        };
        
        // Try to play immediately (may be blocked by browser)
        playMusic();
        
        // Add event listeners for user interaction to start music
        document.addEventListener('click', playMusic);
        document.addEventListener('keydown', playMusic);
        document.addEventListener('touchstart', playMusic);
        
        // Handle page visibility changes to restart music if needed
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                backgroundMusic1.play().catch(e => console.log('Could not auto-resume music 1:', e));
                backgroundMusic2.play().catch(e => console.log('Could not auto-resume music 2:', e));
            }
        });
    }

    // Adicionar classe fade-in a todos os itens da timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.classList.add('fade-in');
        // Adicionar um atraso progressivo para criar um efeito cascata
        item.style.transitionDelay = `${index * 0.15}s`;
    });

    // Função para verificar se um elemento está visível na viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }

    // Função para mostrar elementos quando estiverem visíveis
    function showVisibleItems() {
        const items = document.querySelectorAll('.fade-in');
        items.forEach(item => {
            if (isElementInViewport(item)) {
                item.classList.add('visible');
            }
        });
    }

    // Executar a primeira verificação após um pequeno atraso
    setTimeout(showVisibleItems, 300);

    // Adicionar event listener para verificar ao rolar a página
    window.addEventListener('scroll', showVisibleItems);
    
    // Animação suave para links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Ajustar para a navbar fixa
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Adicionar funcionalidade para ampliar imagens ao clicar
    const timelineImages = document.querySelectorAll('.timeline-img');
    timelineImages.forEach(img => {
        img.addEventListener('click', function() {
            // Criar um modal para mostrar a imagem ampliada
            const modal = document.createElement('div');
            modal.classList.add('image-modal');
            
            const modalImg = document.createElement('img');
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.classList.add('modal-close');
            
            modal.appendChild(closeBtn);
            modal.appendChild(modalImg);
            document.body.appendChild(modal);
            
            // Adicionar efeito fade-in
            setTimeout(() => {
                modal.classList.add('visible');
            }, 10);
            
            // Fechar o modal ao clicar no botão ou fora da imagem
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            // Função para fechar o modal
            function closeModal() {
                modal.classList.remove('visible');
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            }
        });
    });
    
    // Adicionar estilo para o modal de imagem
    const style = document.createElement('style');
    style.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .image-modal.visible {
            opacity: 1;
        }
        
        .image-modal img {
            max-width: 90%;
            max-height: 90%;
            border-radius: 8px;
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
        }
        
        .modal-close {
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 40px;
            color: white;
            background: transparent;
            border: none;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
    
    // Adicionar contador de visualização das seções
    let hasVisitedSections = {};
    
    function trackSectionVisits() {
        const sections = document.querySelectorAll('section.timeline-item');
        
        sections.forEach((section, index) => {
            if (isElementInViewport(section) && !hasVisitedSections[index]) {
                hasVisitedSections[index] = true;
                
                // Opcional: Registrar de alguma forma que o usuário viu esta seção
                console.log(`Usuário visualizou a seção de ${section.querySelector('h3').textContent}`);
            }
        });
    }
    
    window.addEventListener('scroll', trackSectionVisits);
    
    // Verificar links de "ver mais" e adicionar funcionalidade
    document.querySelectorAll('.btn-outline-primary').forEach(btn => {
        if (btn.textContent.includes('Ver mais')) {
            btn.addEventListener('click', function() {
                const content = this.closest('.timeline-content');
                const hiddenContent = content.querySelector('.hidden-content');
                
                if (hiddenContent) {
                    hiddenContent.classList.toggle('show');
                    this.innerHTML = hiddenContent.classList.contains('show') ? 
                        '<i class="fas fa-minus-circle me-2"></i>Ver menos' : 
                        '<i class="fas fa-plus-circle me-2"></i>Ver mais';
                }
            });
        }
    });

    // Adicionar código para fechar menu automático em dispositivos móveis
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const menuToggle = document.getElementById('navbarNav');
    const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle: false});

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) { // Se estiver em visualização mobile
                bsCollapse.hide();
            }
        });
    });
}); 