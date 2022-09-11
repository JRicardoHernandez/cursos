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

var msg;

function recive(event){    
    //console.log("Recive ",event)
    if( typeof(event.data)!="string" || event.data.indexOf("soy")==-1 ){
        return 0;
    }
    var plantilladata=JSON.parse(event.data);    
    switch(plantilladata.cmd){
        case "loadgetExcelData":
            if(window.loadgetExcelDataRetorno){
                window.loadgetExcelDataRetorno(plantilladata.res)
            }
        break;
        case "getExcelData":
            if(window.getExcelDataRetorno){
                window.getExcelDataRetorno(plantilladata.res)
            }
        break;
        case "getAllExcelData":
            if(window.getAllExcelDataRetorno){
                window.getAllExcelDataRetorno(plantilladata.res)
            }
        break;
        case "getData":
            if(window.getDataRetorno){
                window.getDataRetorno(plantilladata.res)
            }
        break;        
        case "getAllData":
            if(window.getAllDataRetorno){
                window.getAllDataRetorno(plantilladata.res)
            }
        break;
    }
}

function iniciar(){
    msg=new msgPost(recive);   

    if(window.loadgetExcelData)window.loadgetExcelData(function(r){            
        if(typeof(r)=="object" && r.autocompletar!=""){                        
            var auto=Number(r.autocompletar)            
            if(!Number.isNaN(auto) && r.eval==""){
                setTimeout(function(){
                    console.log("  - AutoCompletado ",nombreArchivo,auto)
                    if(window.htmlcompleto)window.htmlcompleto();
                },auto*1000)
            }
        }
    })

}

/*
    Obtiene datos en el excel del html actual.
      window.loadgetExcelData(fn)   - fn es una funcion callback recive como parametro un 
                                      se llama automaticamente para ver si tiene autocompletado.
*/
window.loadgetExcelData = function(fn) {
    window.loadgetExcelDataRetorno = fn;
    msg.envia((JSON.stringify({
        soy: "html",
        file: nombreArchivoCompleto,        
        cmd: "loadgetExcelData"        
    })));
}



/*
    Obtiene datos en el excel del html actual.
      window.getExcelData(fn)     - fn es una funcion callback recive como parametro un 
                                    arreglo de objetos y contiene los datos del html actual en el excel.
*/
window.getExcelData = function(fn) {
    window.getExcelDataRetorno = fn;
    msg.envia((JSON.stringify({
        soy: "html",
        file: nombreArchivoCompleto,        
        cmd: "getExcelData"        
    })));
}

/*
    Obtiene datos en el excel de todos los html.
      window.getAllExcelData(fn)     - fn es una funcion callback recive como parametro un 
                                    arreglo de objetos y contiene los datos de todos los html en el excel.
*/
window.getAllExcelData = function(fn) {
    window.getAllExcelDataRetorno = fn;
    msg.envia((JSON.stringify({
        soy: "html",        
        file: nombreArchivoCompleto,
        cmd: "getAllExcelData"        
    })));
}

/*
    Obtiene o Escribe datos guardados por el html actual
      window.getData(fn)          - fn es una funcion callback recive como parametro un 
                                     objeto guardado por html actual.
      window.setData(setdato)     - setdato es un objeto para guardar por el html actual.      
*/
window.getData = function(fn) {
    window.getDataRetorno = fn;
    msg.envia((JSON.stringify({
        soy: "html",        
        file: nombreArchivoCompleto,
        cmd: "getData"        
    })));
}
window.setData = function(setdato) {
    msg.envia((JSON.stringify({
        soy: "html",       
        file: nombreArchivoCompleto, 
        cmd: "setData",
        data: setdato        
    })));
}


/*
    Obtiene o Escribe datos guardados por todos los htmls
      window.getAllData(fn)             - fn es una funcion callback recive como parametro un 
                                           arreglo de objetos de los datos guardados por todos los html.
      window.setAllData(setAlldato)     - setAlldato es un arreglo de objetos obtenido por window.getAllData 
                                           para modificar algun dato guardado por uno o varios htmls.      
*/
window.getAllData = function(fn) {
    window.getAllDataRetorno = fn;
    msg.envia((JSON.stringify({
        soy: "html",        
        file: nombreArchivoCompleto,
        cmd: "getAllData"        
    })));
}
window.setAllData = function(setAlldato) {
    msg.envia((JSON.stringify({
        soy: "html",        
        file: nombreArchivoCompleto,
        cmd: "setAllData",
        data: setAlldato        
    })));
}

/*
    Navegacion de plantilla 
      window.atras()      - le envia a la plantilla instruccion de ir al anterior.
      window.siguiente()  - le envia a la plantilla instruccion de ir al siguiente.
      window.ir(n)        - le envia a la plantilla instruccion de ir al n html de 
                             la lista del excel n empieza 0.
*/
window.atras = function() {
    msg.envia((JSON.stringify({
        soy: "html",
        file: nombreArchivoCompleto,
        cmd: "atras"
    })));
}
window.siguiente = function() {
    msg.envia((JSON.stringify({
        soy: "html",
        file: nombreArchivoCompleto,
        cmd: "siguiente"
    })));
}
window.ir = function(n) {
    msg.envia((JSON.stringify({
        soy: "html",
        file: nombreArchivoCompleto,
        cmd: "ir",
        n: n
    })));
}

/*
    Enviar cambio de estatus a plantilla 
      window.htmlcompleto(selector,boleano)  - envia a plantilla estatus de completado del html actual.
      
*/
window.htmlcompleto = function() {
    msg.envia((JSON.stringify({
        soy: "html",  
        file: nombreArchivoCompleto,      
        cmd: "htmlcompleto"
    })));
}

/*
    Envia modificacion a la plantilla para mostrar u ocultar algun selector especifico 
      window.muestraOculta("")  - selector a nivel plantilla, boleano para mostrar u ocultar (true o false),
                                               una vez se mueva a otro html los elementos como la barra y siguiente y atras 
                                               automaticamente se muestran como antes de la modificacion.
      
*/
window.muestraOculta = function(selector,boleano) {
    msg.envia((JSON.stringify({
        soy: "html",  
        file: nombreArchivoCompleto,      
        cmd: "muestraOculta",
        sel: selector,
        bol: boleano
    })));
}

iniciar();