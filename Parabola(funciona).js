
var width = window.innerWidth;
var height = window.innerHeight;
var canvas = ctx = false;
var frameRate = 1/40; // Seconds
var frameDelay = frameRate * 1000; // ms
var hoyo = 500;

var img = new Image();
	img.src = 'api.png';
var pelota = new Image();
	pelota.src = 'pelota.png';
var sol = new Image();
	sol.src = 'Sol.png';
var warning = new Image();
	warning.src = 'Warning.png';
var bandera = new Image();
	bandera.src = 'Bandera2.png';


 
var ball = {
    position: {x: 100, y: height-55},
    velocity: {x: 0, y: 0},
    mass: 0.045, //kg
    radius: 4.3, // 1px = 1cm
    rebotividad: -0.35,
	zabalera: 25,
	uran: false,
	barruan: false,
	amaitu: false,
	restitutionarena: -0.2,

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
	if(window.innerWidth < 1000){
		canvas.width = 1000;
		canvas.height = window.innerHeight;
		height = canvas.height;
		width = 1000;
	}
	else if(window.innerWidth > 2700){
		canvas.width = 2700;
		canvas.height = window.innerHeight;
		height = canvas.height;
		width = 2700;
	}
	else{
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		height = canvas.height;
		width = canvas.width;
	}
	
	ctx.drawImage(pelota, 99, canvas.height-55, 15, 15);
}

var mouseDown = function(e) {
	if(e.which == 1 && ball.velocity.x == 0 && Math.abs(ball.velocity.y) < 0.1) {
		getMousePosition(e);
		mouse.isDown = true;
		mouseclick.x = e.pageX;
		mouseclick.y = e.pageY;
	}
}
var mouseUp = function(e) {
    if (e.which == 1 && ball.velocity.x == 0 && Math.abs(ball.velocity.y) < 0.1) {
        mouse.isDown = false;
        ball.velocity.y = (mouseclick.y - mouse.y) /20;
        ball.velocity.x = (mouseclick.x - mouse.x) /20;
		hasiera = false;
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
	
	if (ball.position.y > height - ball.zabalera - 44){ //Cuando esté en entre el suelo y la altura de 1px
		ball.velocity.x *= 0.97; //Se hace solo x0.97 porque se hace cada 15ms, cuanto mayor sea el intervalo, menor la multiplicación, se haría x 0.95 (por ejemplo)
		if (ball.position.x >= 500 && ball.position.x <= 650){
			ball.velocity.x *= 0.60;
		}
	}
}

function color(){
	
	if(Math.abs(mouseclick.x-mouse.x) + Math.abs(mouseclick.y-mouse.y) < 200 ){
		ctx.strokeStyle = 'green';
	}
	if(Math.abs(mouseclick.x-mouse.x) + Math.abs(mouseclick.y-mouse.y) > 200 && Math.abs(mouseclick.x-mouse.x) + Math.abs(mouseclick.y-mouse.y) < 500){
		ctx.strokeStyle = 'yellow';
	}
	if(Math.abs(mouseclick.x-mouse.x) + Math.abs(mouseclick.y-mouse.y) > 500){
		ctx.strokeStyle = 'red';
	}
}


var loop = function() {
	if(!ball.uran){
		if(! ball.amaitu){
		
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
		if ((ball.position.x < width - hoyo + 5 && ball.position.x + ball.zabalera > width - hoyo && ball.velocity.x < 1.4 && ball.velocity.x > -1.4 && Math.abs(ball.velocity.y) <= 0.25)){
			ball.barruan = true;
		}
		
		if(ball.barruan){
			if (ball.position.x > width - 500 - ball.zabalera && ball.position.y < height - ball.zabalera - 40){
				ball.velocity.x *= ball.rebotividad;
				ball.position.x = width - 500 - ball.zabalera;
			}
			
			if(ball.position.x < width - 505&& ball.position.y < height - ball.zabalera - 40){
				ball.velocity.x *= ball.rebotividad;
				ball.position.x = width - 505;
			}
			if (ball.position.y > height - ball.zabalera - ball.radius){
				ball.position.y = height - ball.zabalera - ball.radius;
				ball.velocity.x = 0;
				ball.velocity.y = 0;
				ball.amaitu = true;
			}
		}

		else if (! ball.barruan){
			if (ball.position.x >= 470 && ball.position.x <= 670){
				if (ball.position.y > height - ball.zabalera - 40) {
						ball.velocity.y *= ball.restitutionarena; //Que bote tendrá
						ball.position.y = height - ball.zabalera - 40; //Que no traspase el suelo
				}
				if ( ball.velocity.x < 0.25 && ball.velocity.x > -0.25){
					ball.velocity.x = 0;
				}
			}
			else{
				if (ball.position.y > height - ball.zabalera - 40) {
					ball.velocity.y *= ball.rebotividad; //Que bote tendrá
					ball.position.y = height - ball.zabalera - 40; //Que no traspase el suelo
	
				}
				if (ball.position.x > width - 200 - ball.radius && ball.velocity.x == 0 || ball.position.y < -200 || ball.position.x > width + 250 || ball.position.x < -200 || (ball.position.x < 0 && ball.velocity.x == 0)) { //Si se pasa del límite de el campo de golf, vuelve al inicio.
					ball.velocity.x = 0; //Empieza parada
					ball.velocity.y = 0;
					ball.position.x = 100 + ball.radius;
					ball.position.y = height - ball.zabalera - 40; 
				}
				
				if ( ball.velocity.x < 0.25 && ball.velocity.x > -0.25){
					ball.velocity.x = 0;
				}
			}
		}
		
		if(width !=  window.innerWidth || height !=  window.innerHeight){
			if(window.innerWidth < 1000){
				canvas.width = 1000;
				canvas.height = window.innerHeight;
				height = canvas.height;
				width = 1000;
			}
			else if(window.innerWidth > 2700){
				canvas.width = 2700;
				canvas.height = window.innerHeight;
				height = canvas.height;
				width = 2700;
			}
			else{
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
				height = canvas.height;
				width = canvas.width;
			}
		}

		
		// Limpiar pantalla y redibujar suelo/sol
		ctx.fillStyle = '#003399';
		ctx.fillRect(0,0,width,height);
		ctx.drawImage(warning, width - 200, height-200, 100, 200);0
		
		ctx.drawImage(img, 0, canvas.height-150, 2700, 150);
		ctx.drawImage(bandera, width - 500, height-121, 28, 130);

		ctx.drawImage(sol, width-400, 0, 400, 400);
		
		
		ctx.save();
		//Mover pelota
		ctx.translate(ball.position.x, ball.position.y);
		ctx.drawImage(pelota, 15, 15);
		ctx.beginPath(); //Que se borre todas las pelotas viejas
		ctx.arc(0, 0, ball.radius, 0, Math.PI*2, true);


		ctx.closePath();
		
		ctx.restore();


		// Dibujar línea de angulo y potencia
		if (mouse.isDown && ball.velocity.x < 0.1) {
			ctx.beginPath();
			ctx.lineWidth = 2;
			color();
			ctx.moveTo(ball.position.x + ball.zabalera - ball.radius, ball.position.y + ball.zabalera - ball.radius);
			ctx.lineTo(ball.position.x + ball.zabalera - ball.radius +(mouse.x - mouseclick.x), ball.position.y + ball.zabalera - ball.radius +(mouse.y - mouseclick.y));
			ctx.stroke();
			ctx.closePath();
		}
	}
	}
	else if (ball.uran){
		//Aurrekoa bezalakoa +/-
		
	}
   
}
    setup();