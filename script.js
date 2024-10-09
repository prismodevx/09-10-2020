const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

const hearts = []; // Arreglo para almacenar los corazones
const totalHearts = 10; // Número total de corazones
let textOffset = 0; // Desplazamiento del texto
let imageOffset = 0; // Desplazamiento de la imagen
const textSpeed = 0.05; // Velocidad del desplazamiento
const imageSpeed = 0.5; // Velocidad de movimiento de la imagen
const maxLineWidth = 0.9; // Ancho máximo de la línea en relación al canvas

// Función para obtener un número aleatorio entre 1 y 7
function getRandomImageIndex(lastIndex) {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * 7) + 1; // Genera un número entre 1 y 7
    } while (newIndex === lastIndex); // Asegúrate de que no sea el mismo que el anterior
    return newIndex;
}

// Obtener el índice de la imagen almacenado en localStorage
const lastImageIndex = parseInt(localStorage.getItem('lastImageIndex')) || null;
const randomImageIndex = getRandomImageIndex(lastImageIndex); // Generar un índice aleatorio diferente
localStorage.setItem('lastImageIndex', randomImageIndex); // Almacenar el nuevo índice
const imageSrc = `${randomImageIndex}.jpeg`; // Construye la URL de la imagen

// Cargar la imagen
const image = new Image();
image.src = imageSrc; // Reemplaza con la URL de tu imagen
let imageWidth, imageHeight; // Variables para almacenar las dimensiones de la imagen

image.onload = function() {
    // Almacenar las dimensiones de la imagen al cargar
    imageWidth = image.width;
    imageHeight = image.height;
    animate(); // Inicia la animación después de cargar la imagen
};

// Ajustar el tamaño del canvas al tamaño de la ventana
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Función para crear un corazón
function createHeart() {
    const heart = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 40 + 70, // Tamaño aleatorio entre 30 y 50
        speed: Math.random() * 1 + 0.5, // Velocidad aleatoria
        direction: Math.random() * 2 * Math.PI, // Dirección aleatoria
        color: getRandomHeartColor(), // Color aleatorio romántico
    };
    hearts.push(heart);
}

// Función para obtener un color romántico aleatorio
function getRandomHeartColor() {
    const colors = [
        '#FF6F61', // Rosado
        '#FFB6C1', // Rosa claro
        '#FF69B4', // Hot Pink
        '#FF1493', // Rosa fuerte
        '#FF6347', // Tomate
        '#FF85C0', // Rosa pastel
        '#FF99CC', // Rosa suave
        '#FF7F50', // Coral
        '#FF5C94', // Rosa oscuro
        '#FFCED1'  // Rosa pálido
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Función para dibujar un corazón
function drawHeart(heart) {
    ctx.fillStyle = heart.color;
    ctx.beginPath();
    ctx.moveTo(heart.x, heart.y);
    ctx.bezierCurveTo(heart.x - heart.size / 2, heart.y - heart.size / 2, heart.x - heart.size, heart.y + heart.size / 2, heart.x, heart.y + heart.size);
    ctx.bezierCurveTo(heart.x + heart.size, heart.y + heart.size / 2, heart.x + heart.size / 2, heart.y - heart.size / 2, heart.x, heart.y);
    ctx.fill();
}

// Función para mover los corazones
function moveHearts() {
    for (const heart of hearts) {
        heart.x += Math.cos(heart.direction) * heart.speed;
        heart.y += Math.sin(heart.direction) * heart.speed;

        if (heart.x > canvas.width || heart.x < 0) {
            heart.direction = Math.PI - heart.direction; // Cambia la dirección horizontal
        }
        if (heart.y > canvas.height || heart.y < 0) {
            heart.direction = -heart.direction; // Cambia la dirección vertical
        }
    }
}

// Función para dividir el texto en líneas que quepan en el canvas
function wrapText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && line) {
            lines.push(line);
            line = word + ' '; // Inicia una nueva línea con la palabra actual
        } else {
            line = testLine; // Continúa la línea
        }
    }
    lines.push(line); // Añade la última línea

    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y + i * lineHeight);
    }
}

// Función para dibujar el texto con un degradado colorido
function drawAnimatedText() {
    const text = '¡Te amo y siempre te voy a amar 💖!';
    
    // Crear un gradiente con colores románticos
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#FF6F61'); // Color rosado
    gradient.addColorStop(0.5, '#FFB6C1'); // Color rosa claro
    gradient.addColorStop(1, '#FF1493'); // Color rosa fuerte

    const fontSize = 48; // Tamaño de fuente constante
    ctx.font = `bold ${fontSize}px 'Dancing Script', cursive`; // Cambia la fuente aquí y agrega 'bold'
    ctx.fillStyle = gradient;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Efecto de rebote en el texto
    textOffset = Math.sin(Date.now() * 0.005) * 10; // Movimiento oscilante

    const lineHeight = fontSize * 1.2; // Altura de línea
    const maxWidth = canvas.width * maxLineWidth; // Ancho máximo de línea
    wrapText(text, canvas.width / 2, 50 + textOffset, maxWidth, lineHeight);
}

// Función para dibujar el segundo texto en la parte inferior de la pantalla
function drawBottomText() {
    const text = 'Mi Hadhira preciosa';

    // Crear un gradiente con colores románticos
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#FF6F61'); // Color rosado
    gradient.addColorStop(0.5, '#FFB6C1'); // Color rosa claro
    gradient.addColorStop(1, '#FF1493'); // Color rosa fuerte

    const fontSize = 36; // Tamaño de fuente constante para el texto inferior
    ctx.font = `bold ${fontSize}px 'Dancing Script', cursive`; // Cambia la fuente aquí y agrega 'bold'
    ctx.fillStyle = gradient;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Efecto de rebote en el texto
    const bottomTextOffset = Math.sin(Date.now() * 0.005) * 5; // Movimiento oscilante

    const lineHeight = fontSize * 1.2; // Altura de línea
    const maxWidth = canvas.width * maxLineWidth; // Ancho máximo de línea
    wrapText(text, canvas.width / 2, canvas.height - 50 + bottomTextOffset, maxWidth, lineHeight);
}

// Función para dibujar la imagen en el centro del canvas manteniendo la relación de aspecto
function drawImage() {
    const scale = 400 / Math.max(imageWidth, imageHeight); // Escala para mantener la relación de aspecto
    const imageScaledWidth = imageWidth * scale;
    const imageScaledHeight = imageHeight * scale;

    // Desplazamiento de la imagen para que se mueva
    imageOffset += imageSpeed;
    const imageX = (canvas.width / 2 - imageScaledWidth / 2) + Math.sin(imageOffset * 0.01) * 50; // Movimiento oscilante
    const imageY = canvas.height / 2 - imageScaledHeight / 2;
    ctx.drawImage(image, imageX, imageY, imageScaledWidth, imageScaledHeight); // Ajustar el tamaño de la imagen
}

// Función de animación
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
    for (const heart of hearts) {
        drawHeart(heart); // Dibuja cada corazón
    }
    moveHearts(); // Mueve los corazones
    drawImage(); // Dibuja la imagen
    drawAnimatedText(); // Dibuja el texto animado
    drawBottomText(); // Dibuja el texto inferior
    requestAnimationFrame(animate); // Llama a la función de animación
}

// Redimensionar el canvas al cambiar el tamaño de la ventana
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Ajustar el tamaño del canvas inicialmente

// Crear corazones
for (let i = 0; i < totalHearts; i++) {
    createHeart();
}
