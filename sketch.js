let canvas;
let video;
let poseNet;
let poses = [];
let sucess;

// Variables for Borders
let topBorder,botBorder;
let leftBorder,rightBorder;
let centerBorder;
let scaleF = 6;

// Declaring variables for different sounds
let bass,cymbal,drumsticks,hihat,snare,violin;

let musicNoteImage;

function preload(){
//preloading all the sounds needed to to be played once the model is ready

  bass = loadSound('bassHit.mp3');
  cymbal = loadSound('cymbal.mp3');
  drumsticks = loadSound('drumsticks.mp3');
  hihat = loadSound('hi-hat.mp3');
  snare = loadSound('snare.mp3');
  violin = loadSound('violin.mp3')
  
  musicNoteImage = loadImage("note.png");
}


function setup() {
//creating and centering the canvas
  createCanvas(windowWidth,windowHeight);
  
  //Setting scaling border varibales
  centerBorder = width/2;
  
  topBorder = (windowHeight/scaleF);
  botBorder = (windowHeight/scaleF)*4;
  
  leftBorder = windowWidth/scaleF;
  rightBorder = (windowWidth/scaleF)*5;

//Capture video from the webcam and hide it to just show the canvas
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

// Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function (results) {
    poses = results;
  });

}

function drawPlayingGrid(){
  //Grid lines for scaling measurements
  fill(0)
  // line(0,topBorder,width,topBorder);
  // line(centerBorder,0, centerBorder,height);
  // line(leftBorder,0,leftBorder,height);
  // line(rightBorder,0,rightBorder,height);
  noStroke();
  
  
  
  
  //box for Cymbal_1
  fill(222,205,195, 100);
  rect(5, 0, centerBorder-5,topBorder,20);
  
  //box for Cymbal_2
  fill(222,205,195, 100);
  rect(centerBorder+5, 0, (width/2)-10,topBorder,20);
  
  //box for hi hat
  fill(88, 147, 212, 100)
  rect(0,topBorder+5,leftBorder,topBorder*4.9,20);
  
  //box for snare
  fill(88, 147, 212, 100);
  rect(rightBorder,topBorder+5,width-rightBorder,topBorder*4.9,20);
  
  //Text
  fill(255);
  textSize(32);
  text('Snare',rightBorder,topBorder*1.5);
  
  text('Hi',leftBorder/6,topBorder*1.5);
  text('Hat',leftBorder/6,topBorder*1.9);
  
  text('Kick Bass',leftBorder,50);
  text('Violin',leftBorder*3.5,50);
  
}


function draw() {
//Push the hidden video onto the canvas
// Flip it using translate and scale to create a mirror
  push();
  translate(video.width, 0);
  scale(-1, 1);
  background(255, 240);
  pop();
  
  
  drawPlayingGrid()

// Function to draw the different body parts and their connections
  drawSkeleton()

// Function to draw the nose ellipse and logics for music playing
  posePlayer();
}//end draw()

function drawSkeleton(){
  
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;

    // Seperating out the 17 keypoints posenet returns
    let nose = pose.keypoints[0];
    let leftEye = pose.keypoints[1];
    let rightEye = pose.keypoints[2];
    let leftEar = pose.keypoints[3];
    let rightEar = pose.keypoints[4];
    let leftShoulder = pose.keypoints[5];
    let rightShoulder = pose.keypoints[6];
    let leftElbow = pose.keypoints[7];
    let rightElbow = pose.keypoints[8];
    let leftWrist = pose.keypoints[9];
    let rightWrist = pose.keypoints[10];
    let leftHip = pose.keypoints[11];
    let rightHip = pose.keypoints[12];
    let leftKnee = pose.keypoints[13];
    let rightKnee = pose.keypoints[14];

    if (nose.score > 0.5) {
      strokeWeight(10)
      strokeCap(ROUND);
      stroke(255, 112, 84, 135);
      //line joining right shouder and elbow
      line(width - rightShoulder.position.x, rightShoulder.position.y, width - rightElbow.position.x, rightElbow.position.y);
      //line joining left shoulder to elbow
      line(width - leftShoulder.position.x, leftShoulder.position.y, width - leftElbow.position.x, leftElbow.position.y);

      // right shoulder socket
      noStroke();
      fill(255, 112, 84, 127);
      ellipse(width - rightShoulder.position.x, rightShoulder.position.y, 30, 30);
      //left shoulder socket
      ellipse(width - leftShoulder.position.x, leftShoulder.position.y, 30, 30);

      // Socket to elbow
      stroke(0, 255, 239, 135);
      line(width - rightElbow.position.x, rightElbow.position.y, width - rightWrist.position.x, rightWrist.position.y);
      line(width - leftElbow.position.x, leftElbow.position.y, width - leftWrist.position.x, leftWrist.position.y);

      //Elbows
      fill(0, 255, 239, 127);
      noStroke();
      ellipse(width - leftElbow.position.x, leftElbow.position.y, 30, 30);
      ellipse(width - rightElbow.position.x, rightElbow.position.y, 30, 30);

      // Wrists
      fill(88, 147, 212, 127);
      ellipse(width - rightWrist.position.x, rightWrist.position.y, 30, 30);
      ellipse(width - leftWrist.position.x, leftWrist.position.y, 30, 30);


      //torso quardilateral
      stroke(36, 112, 160, 135);
      fill(36, 112, 160, 127);
      quad(width - rightShoulder.position.x, rightShoulder.position.y,width - leftShoulder.position.x,leftShoulder.position.y, width - leftHip.position.x, leftHip.position.y, width - rightHip.position.x, rightHip.position.y);

      stroke(255, 118, 87, 135);
      fill(255, 118, 87, 127);

      let faceRadius = dist(width - nose.position.x, nose.position.y, width - leftEar.position.x, leftEye.position.y);
      ellipse(width - nose.position.x, nose.position.y, faceRadius, faceRadius+ 60);

      image(musicNoteImage, width - leftEye.position.x, leftEye.position.y, 40, 80);
      image(musicNoteImage, width - rightEye.position.x, rightEye.position.y, 40, 80);


      //Hips socket
      noStroke();
      fill(124, 71, 137, 127)
      ellipse(width - rightHip.position.x, rightHip.position.y, 30, 30);
      ellipse(width - leftHip.position.x, leftHip.position.y, 30, 30);

      // lines from hips to knees
      stroke(167, 209, 41, 127);
      line(width - rightHip.position.x, rightHip.position.y, width - rightKnee.position.x, rightKnee.position.y);
      line(width - leftHip.position.x, leftHip.position.y, width - leftKnee.position.x, leftKnee.position.y);

    }

  }
}

function posePlayer()  {

// Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;

    // Seperating out the 17 keypoints posenet returns
    let nose = pose.keypoints[0];
	let leftEye = pose.keypoints[1];
	let rightEye = pose.keypoints[2];
    let leftEar = pose.keypoints[3];
    let rightEar = pose.keypoints[4];
    let leftShoulder = pose.keypoints[5];
    let rightShoulder = pose.keypoints[6];
    let leftElbow = pose.keypoints[7];
    let rightElbow = pose.keypoints[8];
    let leftWrist = pose.keypoints[9];
    let rightWrist = pose.keypoints[10];
    let leftHip = pose.keypoints[11];
    let rightHip = pose.keypoints[12];
    let leftKnee = pose.keypoints[13];
    let rightKnee = pose.keypoints[14];

    // From experimentation nose seems to be the best detected body part
    // Hence if there is a nose means there is a human present
    //Also trying to avoid multiple pose detection of people farther off
    
    if (nose.score > 0.5) {

      //================== Right wrist playing conditions for SNARE ==========================
      if(rightWrist.position.x > 0 && (width - rightWrist.position.x) > rightBorder && 
        rightWrist.position.y > 0 && rightWrist.position.y > topBorder &&
         !snare.isPlaying())
      {
        snare.play();
      }
      
      else if(width - rightWrist.position.x < rightBorder){
        snare.stop();
      }
      
      
      //================== Right wrist playing conditions for violin ==========================
      if(rightWrist.position.y < topBorder && rightWrist.position.y > 0 &&
        centerBorder - rightWrist.position.x > 0 && width - rightWrist.position.x < rightBorder &&
          !violin.isPlaying())
      {
        violin.play();
        
      }else if(rightWrist.position.y > topBorder*2)
{
        violin.stop();
      }
      
      
       //================== Left wrist playing conditions for HI HAT ==========================
      if(leftWrist.position.x > 0 && (width - leftWrist.position.x) < leftBorder && 
         leftWrist.position.y > 0 && leftWrist.position.y > topBorder &&
           !hihat.isPlaying())
      {
        hihat.play();
        
      } else if(width - leftWrist.position.x > leftBorder && leftWrist.position.x > 0 ){
        hihat.stop();
      }
      
      //================== left wrist playing conditions for Kick Bass ==========================
      if(leftWrist.position.y < topBorder && leftWrist.position.y > 0 &&
        leftWrist.position.x > 0 && leftWrist.position.y < centerBorder && 
         !bass.isPlaying())
      {
        bass.play();
        
      }else if(leftWrist.position.y > topBorder){
        bass.stop();
      }

      


      

    }//end if nose found
  }//end forloop


}//end pose()
