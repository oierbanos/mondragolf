	if (ball.position.x < width - hoyo + 5 && ball.position.x + ball.zabalera > width - hoyo && ball.velocity.x < 1 && ball.velocity.x > -1){
		ball.barruan = true;
	}
	if (ball.barruan){
		
		if (ball.position.x + ball.zabalera> width - hoyo + 5){
			ball.velocity.x = 0;
			ball.position.x + ball.zabalera = width - hoyo + 5;
		}
		
		if (ball.position.x < width - hoyo + 5){
			ball.velocity.x = 0;
			ball.position.x = width - hoyo + 5;
		}
		if (ball.position.y > height - ball.zabalera - ball.radius){
			ball.position.y = height - ball.zabalera - ball.radius;
			ball.velocity.x = 0;
			ball.velocity.y = 0;
		}
	}