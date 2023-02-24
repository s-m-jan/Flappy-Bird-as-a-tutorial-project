let cvs = document.querySelector("#mycanvas");
let ctx = cvs.getContext("2d");

let state = {
    now: 0,
    getReady : 0, 
    game : 1,
    over : 2
}

cvs.addEventListener("click", ()=>{
    switch (state.now) {
        case state.getReady:
            state.now = state.game;
            break;
        case state.game:
            bird.flap()
            break;
    
        default:
            state.now = state.getReady;
            bird.dy = 150;
            bird.my = 0;
            bird.rotation = 0; 
            break;
    }
})

let frames = 0;
let DEGREE = Math.PI / 180;

let sprite = new Image();
sprite.src = "./images/sprite.png"

let downflap = new Image();
downflap.src = "./images/redbird-downflap.png"
let midflap = new Image();
midflap.src = "./images/redbird-midflap.png"
let upflap = new Image();
upflap.src = "./images/redbird-upflap.png"
let message = new Image();
message.src = "./images/message.png"
let Over = new Image();
Over.src = "./images/gameover.png"
let RedPipe = new Image();
RedPipe.src = "./images/pipe-red.png"
let GreenPipe = new Image();
GreenPipe.src = "./images/pipe-green.png"

let bg = {
    sx : 52 , 
    sy : 42,
    sw : 221,
    sh : 396,
    dx : 0,
    dy : 0,
    dw : 320,
    dh: 480,
    draw : function(){
        ctx.drawImage(sprite, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh)
    } 
}

let getReady = {
    dx : cvs.width/2 - 190/2,
    dy : 80,
    dw : 190,
    dh: 176,
    draw : function(){
        if(state.now === state.getReady) {
            ctx.drawImage(message,  this.dx, this.dy, this.dw, this.dh)
        }
        
    } 
}

let gameOver = {
    dx : cvs.width/2 - 190/2,
    dy : 80,
    dw : 190,
    dh: 40,
    draw : function(){
        if(state.now === state.over) {
            ctx.drawImage(Over,  this.dx, this.dy, this.dw, this.dh)
        }
    } 
}

let fg = {
    sx : 508 , 
    sy : 42,
    sw : 261,
    sh : 87,
    dx : 0,
    dy : 380,
    dw : 320,
    dh: 100,
    mx : 2,
    draw : function(){
        ctx.drawImage(sprite, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh)
        ctx.drawImage(sprite, this.sx, this.sy, this.sw, this.sh, this.dx + this.dw , this.dy, this.dw, this.dh)
    }, 
    update :  function(){
        if(state.now == state.game){
            this.dx = this.dx % (this.dw/2);
            this.dx -= this.mx;
        }

    }
}

let bird = {
    animation: [
        upflap,
        midflap,
        downflap,
        midflap
    ],
    dx : 50,
    dy : 150,
    dw : 36,
    dh: 25,
    animationnIndex : 1,
    gravity : .25,
    my : 0,
    jump : 4.6,
    rotation : 0,
    draw : function(){
        ctx.save();
        ctx.translate(this.dx, this.dy);
        ctx.rotate(this.rotation * DEGREE);
        ctx.drawImage(this.animation[this.animationnIndex],  - this.dw/2 ,  - this.dh/2 , this.dw, this.dh);
        ctx.restore();
    }, 
    update :  function(){
        if(state.now ===state.getReady){
            this.animationnIndex += frames % 10 ? 0 : 1;
            this.animationnIndex = this.animationnIndex % 4;
        }
        
        
        if(state.now === state.game){
            this.animationnIndex += frames % 5 ? 0 : 1;
            this.animationnIndex = this.animationnIndex % 4;
            if(this.dy + this.dh/2 + this.my > cvs.height - fg.dh ){
                    this.dy = cvs.height - fg.dh- this.dh/2;
                    this.animationnIndex = 2;
                    state.now = state.over;
            }else{
                this.my += this.gravity;
                this.dy += this.my
            }
            if (this.my > this.jump) {
                this.rotation = 90;
            } else {
                this.rotation = -25;
            }
            
        }
        

    },
    flap : function(){
        this.my = -this.jump;
    }
}


function draw(){
    bg.draw();
    fg.draw();
    
    bird.draw();
    getReady.draw();
    gameOver.draw();
}

function update(){
   bird.update();
   fg.update();
  
}

function animate(){
    draw();
    update();
    frames++;
    requestAnimationFrame(animate)
}

animate()
