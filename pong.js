var ball, ball_el = document.getElementById("ball"),
	score0, score0_txt = document.getElementById("scoreboard0"),
	score1, score1_txt = document.getElementById("scoreboard1"),
	table = document.getElementById("table").getBoundingClientRect(),
	pedal0_el = document.getElementById("pedal0"),
	pedal1_el = document.getElementById("pedal1"),
	touch_order = new Array(),  
	playback, playback_txt = document.getElementById("playback"),
	players, players_txt = document.getElementById("players"),
	gameplay = true, winner = 0,
	ball_speed = 30, angle = 45, ai_speed = 15,
	debug0 = document.getElementById("debug0"),
	debug1 = document.getElementById("debug1");

touch_order[0] = -1;
touch_order[1] = -1;
playback = false;
playback_txt.innerHTML = "START";
players = 1;
players_txt.innerHTML = "2P";

function reset_ball(winner, gameover){
	ball_el.style.left = (table.right - table.left) / 2;
	ball_el.style.top = (table.top - table.bottom) / 2;
	ball = ball_el.getBoundingClientRect();
	if(winner == 1) angle = 0;
	else angle = 180;
	
	if(gameover){
		gameplay = false;
		playback = false;
		playback_txt.innerHTML = "RESTART";
		alert(winner+1+"P WINS!");
	}
	//if(players == 1) pedal1_el.style.top = (table.top - table.bottom) / 2;
}
function set_ball(dx, dy){
	var ball_x = ball_el.style.left, len_x = ball_x.length,
		ball_y = ball_el.style.top, len_y = ball_y.length,
		dxx, dyy;
	
	dxx = dx;
	dyy = dy;
	
	if(ball.top + dy < table.top){
		dyy = table.top - ball.top;
		dxx = dyy * dx / dy;
	}
	else if(ball.bottom + dy > table.bottom){
		dyy = table.bottom - ball.bottom;
		dxx = dyy * dx / dy;
	}
	else if(ball.left + dx < table.left){
		dxx = table.left - ball.left;
		dyy = dxx * dy / dx;
	}
	else if(ball.right + dx > table.right){
		dxx = table.right - ball.right;
		dyy = dxx * dy / dx;
	}
	else{
		dyy = dy;
		dxx = dx;
	}
	
	ball_el.style.left = Math.round(parseFloat(ball_x.substring(0, len_x - 2)) + dxx, 0);
	ball_el.style.top = Math.round(parseFloat(ball_y.substring(0, len_y - 2)) + dyy, 0);
	ball = ball_el.getBoundingClientRect();
}

function run_ball(){
	var dx, dy, new_x, new_y,
		hit_position, angle_ext,
		table = document.getElementById("table").getBoundingClientRect(),
		pedal0 = pedal0_el.getBoundingClientRect(),
		pedal1 = pedal1_el.getBoundingClientRect(),
		ball = ball_el.getBoundingClientRect();
	
	if(ball.top <= table.top && angle > 0){
		angle = -angle;
	}
	else if(ball.bottom >= table.bottom && angle < 0){
		angle = -angle;
	}
	else if(ball.left <= table.left && (angle > 90 || angle < -90)){
		if(pedal0.top < ball.bottom && pedal0.bottom > ball.top){
			hit_position = (((ball.bottom - ball.top) / 2 + ball.top) - ((pedal0.bottom - pedal0.top) / 2 + pedal0.top)) / (pedal0.bottom - pedal0.top) * 2;
			angle_ext = Math.round(0.21 * Math.abs(Math.abs(angle) - 90) * hit_position, 0);
			
			if(angle > 90) angle = 180 - angle - angle_ext;
			else angle = -angle - 180 - angle_ext;
		}
		else{
			score1 = parseInt(score1_txt.innerHTML) + 1;
			score1_txt.innerHTML = score1;
			winner = 1;

			if(score1 < 11 || score1 - score0 < 2){
				reset_ball(winner, false);
			}
			else{
				reset_ball(winner, true);
			}
		}
	}
	else if(ball.right >= table.right && (angle < 90 && angle > -90)){
		if(pedal1.top < ball.bottom && pedal1.bottom > ball.top){
			hit_position = (((ball.bottom - ball.top) / 2 + ball.top) - ((pedal1.bottom - pedal1.top) / 2 + pedal1.top)) / (pedal1.bottom - pedal1.top) * 2;
			angle_ext = Math.round(0.21 * Math.abs(Math.abs(angle) - 90) * hit_position, 0);

			if(angle >= 0){
				angle = 180 - angle + angle_ext;
				if(angle >= 180) angle = angle - 360;
			}
			else{
				angle = -angle - 180 + angle_ext;
				if(angle <= -180) angle = angle + 360;
			}
		}
		else{
			score0 = parseInt(score0_txt.innerHTML) + 1;
			score0_txt.innerHTML = score0;
			winner = 0;
			
			if(score0 < 11 || score0 - score1 < 2){
				reset_ball(winner, false);
			}
			else{
				reset_ball(winner, true);
			}
		}
	}

	dx = Math.round(ball_speed * Math.cos(-angle * Math.PI / 180), 0);
	dy = Math.round(ball_speed * Math.sin(-angle * Math.PI / 180), 0);
	set_ball(dx, dy);
	
	if(angle < 90 && angle > -90 && players == 1){
		if(pedal1_el.style.top == "") pedal1_el.style.top = "0px";
		if(ball.bottom <= pedal1.top && pedal1.top > table.top){
			pedal1_el.style.top = Math.round(parseFloat(pedal1_el.style.top.substring(0, pedal1_el.style.top.length - 2)) - ai_speed, 0);
		}
		else if(ball.top >= pedal1.top && pedal1.bottom < table.bottom){
			pedal1_el.style.top = Math.round(parseFloat(pedal1_el.style.top.substring(0, pedal1_el.style.top.length - 2)) + ai_speed, 0);
		}
	}
}

function move_pedal(pos_y, id){
	if(pos_y <= table.bottom - 55 && pos_y >= table.top + 45){
		id.style.top = pos_y - table.bottom - 60;
	}
	else if(pos_y > table.bottom - 55){
		id.style.top = -115;
	}
	else if(pos_y < table.top + 45){
		id.style.top = table.top - table.bottom - 15;
	}
}

document.onmousemove = function(e){
	var ev = e || event;
	move_pedal(ev.pageY, pedal0_el);
}

document.getElementById("touch_left").ontouchstart = function(e){
	if(touch_order[1] == -1) touch_order[0] = 0;
	else if(touch_order[1] == 0) touch_order[0] = 1;
}
document.getElementById("touch_left").ontouchend = function(e){
	if(touch_order[1] == -1) touch_order[0] = -1;
	else if(touch_order[1] == 0) touch_order[0] = -1;
	else if(touch_order[1] == 1){
		touch_order[0] = -1;
		touch_order[1] = 0;
	}
}
document.getElementById("touch_right").ontouchstart = function(e){
	if(players == 2){
		if(touch_order[0] == -1) touch_order[1] = 0;
		else if(touch_order[0] == 0) touch_order[1] = 1;
	}
}
document.getElementById("touch_right").ontouchend = function(e){
	if(players == 2){
		if(touch_order[0] == -1) touch_order[1] = -1;
		else if(touch_order[0] == 0) touch_order[1] = -1;
		else if(touch_order[0] == 1){
			touch_order[1] = -1;
			touch_order[0] = 0;
		}
	}
}

document.getElementById("touch_left").ontouchmove = function(e){
	var ev = e || event;
	ev.preventDefault();
	move_pedal(ev.touches[touch_order[0]].pageY, pedal0_el);
}
document.getElementById("touch_right").ontouchmove = function(e){
	var ev = e || event;
	ev.preventDefault();
	if(players == 2) move_pedal(ev.touches[touch_order[1]].pageY, pedal1_el);
}

playback_txt.onclick = function(){
	if(gameplay && playback){
		playback = false;
		playback_txt.innerHTML = "RESUME";
	}
	else if(gameplay && !playback){
		playback = true;
		playback_txt.innerHTML = "PAUSE";
	}
	else if(!gameplay){
		gameplay = true;
		score0_txt.innerHTML = "0";
		score1_txt.innerHTML = "0";
		reset_ball();
	}
}
players_txt.onclick = function(){
	if(players == 1){
		players = 2;
		players_txt.innerHTML = "1P";
	}
	else{
		players = 1;
		players_txt.innerHTML = "2P";
	}
	
	score0_txt.innerHTML = "0";
	score1_txt.innerHTML = "0";
	reset_ball();
	gameplay = true;
	playback = false;
	playback_txt.innerHTML = "START";
}

reset_ball();
window.setInterval(function(){
	if(gameplay && playback){
		run_ball();
	}
}, 50);