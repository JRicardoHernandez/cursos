// JavaScript Document


var video = document.getElementById("video1");

let volume = document.getElementById('volume-slider');
volume.addEventListener("change", function (e) {
  volume = e.currentTarget.value / 100;

})
  document.getElementById("valBox").innerHTML = localStorage.volumen;
  document.getElementById("volume-slider").value = localStorage.volumen;



function showVal(newVal) {

	  document.getElementById("valBox").innerHTML = localStorage.volumen;
	localStorage.volumen = newVal.toString();
	video.volume=localStorage.volumen
}




function play() {
  video.play();
}

function pause() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

function stop() {
  video.pause();
  video.currentTime = 0;
}

function turnUpVolume() {
  if (video.volume < 0.9) {
    video.volume += 0.1;
  }
}

function turnDownVolume() {
  if (video.volume > 0.1) {
    video.volume -= 0.1;
  }
}
