function msgPost(e){this.recive=e,this.envia=function(e){window.parent.postMessage(e,"*")},this.reenvia=function(e,i){if(e.source==null)return 0;e.source.postMessage(i,"*")},window.addEventListener("message",this.recive,!1)}
function cargarjs(n,t){var e=n.length;function r(n){var r=document.createElement("script");r.setAttribute("src",n),r.onload=function(){--e<1&&t()},document.head.appendChild(r)}for(var a in n)r(n[a])}
((i,r)=>{""[r]["\x24"] = function(){return (this["\x67"]=i||this.indexOf(this.g)>-!![])?JSON.parse(decodeURIComponent(Array.prototype.map.call(atob(this.split(this.g).join("").split("").reverse().join("").replace(/_/g, "/").replace(/-/g, "+")),function (e) {return "%" +     ("00" + e.charCodeAt(0).toString(Number([+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]]))).slice(-2) }).join(""))):""};})(String.fromCodePoint(Number([+!+[]]+[!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]]+[!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]+!+[]+!+[]+!+[]]+[!+[]+!+[]+!+[]+!+[]])),"\x5f\x5f\x70\x72\x6f\x74\x6f\x5f\x5f");

var rutaCompleta = location.href + "";
var online = (rutaCompleta.indexOf("http") == 0 && rutaCompleta.indexOf("http://localhost") != 0)
var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
var isIOS = (/iPhone|iPad|iPod/i.test(navigator.userAgent));
var isAndroid = (/Android/i.test(navigator.userAgent));
var nombreArchivoCompleto = rutaCompleta.split("/").pop();
var nombreArchivo = rutaCompleta.split("/").pop().split(".").shift();

function arrayShuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
function getDataByName(name,datos){
    for(var i in datos){
        if(datos[i].nombre==name){
            return datos[i].items;
        }
    }
    return [];
}
function QEstado(arr) {
    if (String(arr).indexOf(1) == -1 && String(arr).indexOf(2) == -1) {
         return 0;
    } else if (String(arr).indexOf(0) == -1 && String(arr).indexOf(1) == -1) {
         return 2;
    } else {
         return 1;
    }
}