/* 画布数据 */
var snCanvas;
var snake;
var fdCanvas;
var food;

/* 游戏数据 */
var speed;
var direction;
var head;
var score;

/* 控制按键 */
var up_code;
var down_code;
var left_code;
var right_code;

window.onload=function(){
	//绘制边框
	createBackground();

	//获取画布
	snCanvas=document.getElementById("snake");
	snake=snCanvas.getContext("2d");
	fdCanvas=document.getElementById("food");
	food=fdCanvas.getContext("2d");
		
	//点击按钮开始游戏
	var btn=document.getElementById("btn");
	btn.onclick=function(){
		document.getElementById("bg").removeChild(btn);
		initArgs();
		createFood(food);
		move(snake,food);
	};
}

/* 初始化数据 */
function initArgs() {
	document.getElementById("score").innerHTML=0;
	score=0;

	food.clearRect(0,0,600,400);
	snake.clearRect(0,0,600,400);
	speed=100;
	direction=1;
	head=10;
	r=[10,10,10];
	c=[10,11,12];
	foodC=0;
	foodR=0;

	up_code = 38;
	down_code = 40;
	left_code = 37;
	right_code = 39;
}

/* 初始化背景 */
function createBackground(){
	var bgCanvas=document.getElementById("background");
	var background=bgCanvas.getContext("2d");
	background.beginPath();
	background.moveTo(0,0);
	background.lineTo(600,0);
	background.lineTo(600,400);
	background.lineTo(0,400);
	background.lineTo(0,0);
	background.lineWidth=1;
	background.strokeStyle="#fff";
	background.stroke();
	background.closePath();
	// 绘制竖线
	var x=0,y=0;
	for(var i=0;i<30;i++)
	{
		x=i*20,y=0;
		background.beginPath();
		background.moveTo(x,y);
		y=600;
		background.lineTo(x,y);
		background.stroke();
		background.closePath();
	}
	// 绘制横线
	for(var j=0;j<20;j++)
	{
		x=0,y=j*20;
		background.beginPath();
		background.moveTo(x,y);
		x=600;
		background.lineTo(x,y);
		background.stroke();
		background.closePath();
	}
}

var r=[10,10,10];
var c=[10,11,12];

function changeNum(c,r)
{
	for(i=c.length-1;i>=1;i--)
	{
		c[i]=c[i-1];
		r[i]=r[i-1];
	}
}

var foodC=0;
var foodR=0;

/* 布置食物 */
function createFood()
{
	
	foodC=parseInt(Math.random()*30);
	foodR=parseInt(Math.random()*20);
	
	var crash=false;
	for(var i=0;i<c.length;i++)
	{
		if(foodC==c[i]&&foodR==r[i])
		{
			crash=true;
		}
	}
	
	if(!crash)
	{
		food.beginPath();
		food.rect(foodC*20,foodR*20,20,20);
		food.strokeStyle="#fff";
		food.fillStyle="red";
		food.fill();
		food.stroke();
	}
	else
	{
		createFood();
	}

}

var tailC;
var tailR;

/* 移动 */
function move()
{

	var timer=setInterval(function(){
		snake.clearRect(0,0,600,400);
		for(var i=0;i<c.length;i++)
		{
			snake.beginPath();
			snake.rect(c[i]*20,r[i]*20,20,20);
			snake.strokeStyle="#fff";
			snake.fillStyle="#3b9c01";
			snake.fill();
			snake.stroke();
		}

		window.onkeydown=function(){
			switch(event.keyCode){
				case left_code:if(direction!=3)
						direction=1;
						break;
				case up_code:if(direction!=4)
						direction=2;
						break;
				case right_code:if(direction!=1)
						direction=3;
						break;
				case down_code:if(direction!=2)
						direction=4;
						break;
			}
		}

		switch(direction){
			case 1:
				changeNum(c,r);
				c[0]--;		
				break;
			case 2:
				changeNum(c,r);
				r[0]--;
				break;
			case 3:
				changeNum(c,r);
				c[0]++;
				break;
			case 4:
				changeNum(c,r);
				r[0]++;
				break;	
		}	
		isWall(timer);
			
		//撞自己
		for(var j=1;j<c.length;j++)
		{
			if(c[0]==c[j]&&r[0]==r[j])
			{
				clearInterval(timer);
				fail(snake);				
			}
		}
			
			
		//吃到食物
		if(foodC==c[0]&&foodR==r[0])
		{
			food.clearRect(0,0,600,400);

			tailC=c[0];
			tailR=r[0];
				
			snake.beginPath();
			snake.rect(tailC*20,tailR*20,20,20);
			snake.strokeStyle="#fff";
			snake.fillStyle="3b9c01";
			snake.fill();
			snake.stroke();

			switch(direction){
			case 1:tailC--;		
					break;
			case 2:tailR--;
					break;
			case 3:tailC++;
					break;
			case 4:tailR++;
					break;	
			}	

			c.unshift(tailC);
			r.unshift(tailR);
			score++;
			document.getElementById("score").innerHTML=score;	
		  	createFood();
		}
	}
	,speed);
}

function isWall(timer){
	//撞墙
	if(c[0]<0||r[0]<0||c[0]>=30||r[0]>=20)
	{
		clearInterval(timer);
		fail(snake);
	}	
}

/* 游戏失败 */
function fail()
{
	var text=document.createElement("div");
	text.className="text";
	text.id="fail";
	text.innerHTML="click to replay"
	document.getElementById("bg").appendChild(text);
	document.getElementById("fail").onclick=function() {
		document.getElementById("bg").removeChild(text);
		initArgs();
		createFood();
		move();		
	}
}


