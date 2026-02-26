export const launchConfetti = () => {
    const container = document.getElementById('confetti-container');
    if (!container) return;

    const colors = ['#e30034', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
    const shapes = ['square', 'circle', 'triangle'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';

        const size = Math.random() * 10 + 5 + 'px';
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        confetti.style.width = size;
        confetti.style.height = shape === 'triangle' ? '0' : size;
        confetti.style.backgroundColor = shape === 'triangle' ? 'transparent' : color;
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.position = 'absolute';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.borderRadius = shape === 'circle' ? '50%' : '0';

        if (shape === 'triangle') {
            confetti.style.borderLeft = '5px solid transparent';
            confetti.style.borderRight = '5px solid transparent';
            confetti.style.borderBottom = `10px solid ${color}`;
        }

        container.appendChild(confetti);

        const animation = confetti.animate([
            { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
            { transform: `translate(${Math.random() * 100 - 50}px, 100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        });

        animation.onfinish = () => confetti.remove();
    }
};
