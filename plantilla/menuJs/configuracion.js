let volume = document.getElementById('volume-slider');
volume.addEventListener("change", function(e) {
    volume = e.currentTarget.value / 100;
	
})

function showVal(newVal){
    document.getElementById("valBox").innerHTML=newVal.toString() +".0";
}