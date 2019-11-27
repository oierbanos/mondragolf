/* Burak Kanber */
var width = window.innerWidth;
var height = window.innerHeight;
var canvas = ctx = false;
var frameRate = 1/40; // Seconds
var frameDelay = frameRate * 1000; // ms

var img = new Image();
	img.src = 'api.png';


/*
 * Experiment with values of mass, radius, restitution,
 * gravity (g), and density (rho)!
 * 
 * Changing the constants literally changes the environment
 * the ball is in. 
 * 
 * Some settings to try:
 * the moon: g = 1.6
 * water: rho = 1000, mass 5
 * beach ball: mass 0.05, radius 30
 * lead ball: mass 10, restitution -0.05
 */
 
var ball = {
    position: {x: 100, y: height-40},
    velocity: {x: 0, y: 0},
    mass: 0.045, //kg
    radius: 4.3, // 1px = 1cm
    restitution: -0.35
    };

//Constantes necesarias para las 
var ResisAire = 0.47;  // Resistencia que opone una esfera
var Vol = (4/3)*Math.PI*ball.radius*ball.radius*ball.radius;
var rho = ball.mass/Vol; // Densidad
var A = Math.PI * ball.radius * ball.radius / (10000); // Azalera
var g = 9.81;  // gravedad
var mouse = {x: 0, y: 0, isDown: false};
var mouseclick = {x: 0, y: 0, isDown: true};

function getMousePosition(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}

function onloadfuntzioak(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	height = canvas.height;
	width = canvas.width;

	ctx.drawImage(img, 0, canvas.height-150, 900, 150);
	
	
}

var mouseDown = function(e) {
	if(e.which == 1 && ball.velocity.x == 0) {
		getMousePosition(e);
		mouse.isDown = true;
		mouseclick.x = e.pageX;
		mouseclick.y = e.pageY;
		marra == true;
	}
}
var mouseUp = function(e) {
    if (e.which == 1 && ball.velocity.x == 0) {
        mouse.isDown = false;
        ball.velocity.y = (mouseclick.y - mouse.y) /20;
        ball.velocity.x = (mouseclick.x - mouse.x) /20;
    }
}

var setup = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    
    canvas.onmousemove = getMousePosition;
	canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;
	
	
	setInterval(rodarsuelo, 15); //Que la función se haga cada 15ms
	
    ctx.fillStyle = 'red';
    ctx.strokeStyle = '#000000';

    loopTimer = setInterval(loop, frameDelay);
}

//Reducir velocidad cuando no bota
function rodarsuelo(){
	
	if (ball.position.y > height-41 - ball.radius){ //Cuando esté en entre el suelo y la altura de 1px
		ball.velocity.x *= 0.97; //Se hace solo x0.97 porque se hace cada 15ms, cuanto mayor sea el intervalo, menor la multiplicación, se haría x 0.95 (por ejemplo)
	}
	if (ball.velocity.x == 0){
		ingame = false;
    }
	else ingame = true;
}

	
var loop = function() {
    if ( ! mouse.isDown) {
		
        // Calcular fuerzas: Fd = -1/2 * ResisAire * A * rho * v^2
        var Fx = -0.5 * ResisAire * A * rho * Math.abs(ball.velocity.x * ball.velocity.x);
        var Fy = -0.5 * ResisAire * A * rho * Math.abs(ball.velocity.y * ball.velocity.y);
        
		
		// Calcular aceleracion
        var ax = Fx / ball.mass;
        var ay = g + (Fy / ball.mass);
		
        // Conseguir nueva velocidad
        ball.velocity.x += ax*frameRate;
        ball.velocity.y += ay*frameRate;
        
        // Conseguir nueva posicion
        ball.position.x += ball.velocity.x*frameRate*40;
        ball.position.y += ball.velocity.y*frameRate*40;
    }
	
    // Collisiones
    if (ball.position.y > height-40 - ball.radius) {
			ball.velocity.y *= ball.restitution; //Que bote tendrá
			ball.position.y = height-40 - ball.radius; //Que no traspase el suelo
    }
    if (ball.position.x > 900 - ball.radius || ball.position.y < -200) { //Si se pasa del límite de el campo de golf, vuelve al inicio.
			ball.velocity.x = 0; //Empieza parada
			ball.velocity.y = 0;
			ball.position.x = 100 + ball.radius;
			ball.position.y = height-40 + ball.radius; 
    }
    if (ball.position.x < ball.radius) {
        ball.velocity.x = 0; //Empieza parada
        ball.velocity.y = 0;
        ball.position.x = 100 + ball.radius;
        ball.position.y = height-40 + ball.radius; 
    }
	if ( ball.velocity.x < 0.15 && ball.velocity.x > -0.15){
		ball.velocity.x = 0;
		ball.stopped = false;
	}
	

	
    // Dibujar pelota
    ctx.clearRect(0,0,width,height);
    onloadfuntzioak();
	
    ctx.save();
    
    ctx.translate(ball.position.x, ball.position.y);
    ctx.beginPath(); //Que se borre todas las pelotas viejas
    ctx.arc(0, 0, ball.radius, 0, Math.PI*2, true);
    ctx.fill(); //Redibujar la bola

    ctx.closePath();
    
    ctx.restore();


    // Dibujar línea de angulo y potencia
    if (mouse.isDown && ball.velocity.x < 0.1) {
        ctx.beginPath();
        ctx.moveTo(ball.position.x, ball.position.y);
        ctx.lineTo(ball.position.x + (mouse.x - mouseclick.x), ball.position.y + (mouse.y - mouseclick.y));
        ctx.stroke();
        ctx.closePath();
    }
}
    setup();