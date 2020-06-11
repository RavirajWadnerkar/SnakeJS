// Made with love by Raviraj Wadnerkar !
var body = [];
var state = 0;// 0->right, 1->down, 2- left, 3 is up;

//step 1
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#A7D948";
ctx.fillRect(0, 0, 520, 520);

//step 2
function handleKey(e) 
{
    e = e || window.event;
    var play = false;

    if (e.keyCode == '38'&&state!=1&&state!=3) 
    {
        // up arrow
        state = 3;
        play = true;

    }
    else if (e.keyCode == '40'&&state!=1&&state!=3) 
    {
        // down arrow
        state = 1;
        play = true;
    }
    else if (e.keyCode == '37'&&state!=0&&state!=2) 
    {
           // left arrow
        state = 2;
        play = true;
    }
    else if (e.keyCode == '39'&&state!=0&&state!=2) 
    {
           // right arrow
        state = 0;
        play = true;
    }

    if(play)
    playAudio();

}

document.onkeydown = handleKey;
//Play audio 

function playAudio()
{
    var audio = new Audio('https://www.soundjay.com/switch/switch-1.wav');
    audio.play();			
}

function playConsume()
{			
    var audio = new Audio('https://www.soundjay.com/button/button-3.wav');
    audio.play();			
}

//Made a matrix and of length and width =520
//Divided into 20 cells

var N = 20;
var size = 520;
var cellSize = size/N;
var matrix = new Array(N);
for (var i = 0; i < matrix.length; i++) 
{
     matrix[i] = new Array(N);
}

//Light Green is in the background and Dark Green is in the front
function drawCell(i,j)
{
    if( (i+j)%2==0 ) 
    {
        ctx.fillStyle = ("#8ECC39");
    }
    else
    {
        ctx.fillStyle = "#A7D948";
    }
    ctx.fillRect(cellSize*i, cellSize*j, cellSize, cellSize);
}

for (var i = 0; i < matrix.length; i++)
{
    for (var j = 0; j < matrix[i].length; j++)
    {
        matrix[i][j]=0;
        drawCell(i,j);
    }
}

//Initially the snake is of 3 cells
body.push([1+ N/2,N/2]);//Head
body.push([N/2,N/2]);//Middle
body.push([-1+N/2,N/2]);//Tail

var eyeImage = new Image();
eyeImage.src = "https://i.imgur.com/6jLbz7l.png";

var foodImage = new Image();
foodImage.src = "https://i.imgur.com/88saChB.png";

var counter = 0;
var foodX = 0;
var foodY = 0;

function generateFood()
{
    //Making sure that the food doesn't collide with the body
    //The random function will take care to generate the food at random position
    //When the snake eats the food then the loop will again start and generate the food
    var success = false;
    while(!success)
    {
        foodX = parseInt(Math.random()*N);
        foodY = parseInt(Math.random()*N);

        success = true;
        for(var i=0;i<body.length;i++)
        {
            if(body[i][0]==foodX && body[i][1]==foodY)
            {
                success = false;
            }
        }
    }
}
//Generate food called for the first time
generateFood();

//Update is taking care if Head(The 0th cell) of the body is colliding or not
function update()
{

    counter++;

    var increase = false;
    if(body[0][0]==foodX&&body[0][1]==foodY)
    {
        generateFood();
        playConsume();
        increase = true;
    }

    for (var i = 0; i < matrix.length; i++)
    {
        for (var j = 0; j < matrix[i].length; j++)
        {
            drawCell(i,j);
        }
    }
    
    //Redrawing Arena
    //Rendering the food
    ctx.drawImage(foodImage,foodX*cellSize, foodY*cellSize,	cellSize, cellSize);

    //This is the part where body is drawn
    for(var i=0;i<body.length;i++)
    {
        ctx.fillStyle = ("#527DF9");
        ctx.fillRect(cellSize*body[i][0], cellSize*body[i][1], cellSize, cellSize);//x and y coordinate of body

        //Eye Blinking
        if(i==0)
        {
            var marginX = cellSize/3;
            var marginY = cellSize/3;
        
            if(state==0||state==2)//Right or Left
            {
                marginX=0;
            }
            else if (state==1||state==3)//Up or Down
            {
                marginY=0;
            }

            //The image of EYE has 9 parts so dividing the image by 9 and loops
             ctx.drawImage(eyeImage,
                 0,28*(counter%9),
                 cellSize,cellSize,
                 cellSize*body[i][0]+marginX, 
                cellSize*body[i][1]+marginY,
                cellSize, cellSize);
            ctx.drawImage(eyeImage,
                0,28*(counter%9),
                cellSize,cellSize,
                cellSize*body[i][0]-marginX, 
                cellSize*body[i][1]-marginY, 
                cellSize, cellSize);
            /*	
                ctx.drawImage(tongueImage,
                    0,(504/21)*(counter%21),
                    48,
                    504/21,
                    cellSize*body[i][0]+cellSize, 
                    cellSize*body[i][1]-marginY, 
                    cellSize, cellSize);					
            */
        }
    }	

    //Decides which direction the head is moving then based on the state x and y will increment and also decides new position of head part 
    // 0->right, 1->down, 2- left, 3 is up;
    var x = 0;
    var y = 0;
    if(state==0)
    {
        x++;
    }
    else if(state==1)
    {
        y++;
    }
    else if(state==2)
    {
        x--;
    }
    else if(state==3)
    {
        y--;
    }

    var first = body[0];
    var arr = [ first[0]+x , first[1]+y ];
    //splice inserts one element to the body when called
    //example: when snake eats the food then body size increases
    body.splice(0,0, arr);
    //inserts at 0 index

    if(!increase)
    body.pop();
    //deletes the last element
    //To keep the snake moving, first element is added and last element is deleted
}

setInterval(update,300);
