((datos)=>{
    
    console.log("- Inari v1.0 -");    


    var Prop={};
    var Txt={};
    var Textos=[];
    var Htmls=[];    
    var idioma=datos[[!+[]+!+[]]+[]].nombre;
    var actualIntetosConexion=0;
    var maxIntetosConexion=10;

    var scormDatos={};    
    var scormUltimo=0;
    
    var trak=[];
    var actual=0;
    var total=0;
    var ultimo=0;
    var volumen=1;    
    var htmlData=[];

    var tiempoPrecargas=false;
    var modoactual=0;

    var preIframes=[];
    window.finPrecargaIframe=finPrecargaIframe;

    window.recive=recive;
    window.msg=new msgPost(recive);

    var evRemoto;
    var file="\x61\x70\x69\x31\x32\x2e\x6a\x73";

    var visor;        
    var cargador;        
    var visorIfr;        
    var cargadorIfr;  
    
    var btnHome;    
    var btnTemas;
    var btnMenu;
    var btnConfig;
    var btnAyuda;
    var menuTrak;
    var menuTrakItems;
    var menuTrakItem;
    var menuTrakSombra;
    var menuBotones;
    var btnSiguiente;
    var btnAtras;
    var btnSiUltimo;
    var btnNoUltimo;

    var modalFrame;
    var modalFrameTitulo;
    var modalFrameIframe;

    var animenuTrak;
    var cursoCompleto=false;    

    var conEvaluacion;

    iniciar();


    function iniciar(){

        //
        // var path = window.location.pathname;
        // var page = path.split("/").pop();
        // console.log(page);
        getPropiedades();        
        getTextos();        
        getHtmls();
        precargas();
        getEval();
        if(!online){
            Prop.scormversion="web";
        }

        switch(Prop.scormversion){
            case "scorm1.2":
                cargarjs(["./plantilla/js/"+file],
                function(){ console.log(" - cargado ",Prop.scormversion); iniciaSCORM(); });
            break;
            case "web":
            default: 
                Prop.scormversion="web";
                getDatosDeWeb();
            break;
        }

    }

    function getPropiedades(){
        var p=getDataByName("Propiedades",datos);
        for(var i in p){
            Prop[p[i].variable]=p[i].valor;
        }
    }
    function getTextos(){
        Textos=getDataByName("Textos",datos);
        for(var i in Textos){
            Txt[Textos[i]["Textos"]]=Textos[i][idioma];
        }
    }
    function getHtmls(){
        Htmls=getDataByName(idioma,datos);
    }
    function getEval(){
        conEvaluacion=false;        
        for(var i in Htmls){
            i=Number(i)
            if(Htmls[i].eval!=""){
                conEvaluacion=true;
            }
        }
    }
        

    function iniciaSCORM(){        
        intentoConectarAPISCORM();
        window.onunload = function() {
            console.log(" - finalizar scorm");
            scorm("finalizar");
        }
        function intentoConectarAPISCORM(){
            scorm("iniciar");
            if (scorm("apiOK")) {
                getDatosDeScorm();
            } else {
                actualIntetosConexion++;                
                if(actualIntetosConexion>=maxIntetosConexion){
                    console.log(" - superados intentos conexion API Scorm ",actualIntetosConexion);
                    msgAlerta("error",Txt.Txt_errapi_titulo,Txt.Txt_errapi_contenido)
                }else{
                    console.log(" - intento conexion API Scorm ",actualIntetosConexion);
                    setTimeout(intentoConectarAPISCORM, 1000);
                }                
            }
        }
    }
    function getDatosDeScorm(){
        var suspendata=scorm("getData");        
        if(suspendata.length>0){
            scormDatos=JSON.parse(suspendata);
            scormUltimo=scorm("getUltimo");

            console.log("  - scormDatos ",scormDatos)
            console.log("  - scormUltimo ",scormUltimo)

            trak=scormDatos.trak;            
            ultimo=Number(scormUltimo);
            volumen=scormDatos.volumen;
            htmlData=scormDatos.htmlData;
            idioma=scormDatos.idioma;
            total=Htmls.length;
            console.log(" - Leer datos de scorm")
            iniciaNavegacion();
        }else{            
            getDatosDeWeb();
        }        
    }
    function getDatosDeWeb(){        
        console.log(" - Primera vez, inicializar valores");
        trak=Htmls.map(function(n){return 0});
        total=Htmls.length;
        iniciaNavegacion();
    }
    function precargas(){        
        switch(Prop.precarga){
            case "si":                
                tiempoPrecargas=true;
                var preIFR=document.querySelector(".precargas");
                var ifrSTR="";
                for(var i in Htmls){                    
                    i=Number(i);
                    preIframes[i]=0;
                    var url = Htmls[i].carpeta+"/"+Htmls[i].archivo;
                    var res = document.createElement("link");
                    res.rel = "subresource";
                    res.as = "document";
                    res.onload = finPrecargaIframe;
                    res.href = url;
                    document.head.appendChild(res);                    
                    ifrSTR+=`<iframe src="${url}" n="${i}" onload="finPrecargaIframe(${i})"></iframe>`;
                }
                //console.log(" - Precargas ",preIframes);
                preIFR.innerHTML=ifrSTR;                
            break;
            case "no":            
            default:
                tiempoPrecargas=false;
            break;
        }
    }
    function finPrecargaIframe(n){        
        preIframes[n]=1;
        if(preIframes.indexOf(0)==-1){
            console.log(" - Precargas completadas", preIframes);
            var preIFR=document.querySelector(".precargas");
            preIFR.innerHTML="";
            tiempoPrecargas=false;            
            iniciaNavegacion();
        }
    }
    
    function iniciaNavegacion(){        
        if(!tiempoPrecargas){
            asignaEventosBotones();  
            generaMenu();
            if(ultimo>0){
                msgAlerta("ultimo",Txt.Txt_irultimo_titulo,Txt.Txt_irultimo_contenido,{"si":Txt.Txt_irultimo_btnsi,"no":Txt.Txt_irultimo_btnno})
            }else{                                          
                ir(0);
            }   
        }   
    }

    function generaMenu(){
        var htmlMenu=[];
        var arrHijos=[];
        for(var i=Htmls.length-1;i>-1;i--){
            if(Htmls[i].menu!=""){
                if(arrHijos.length>0){
                    htmlMenu.push(`<div class="menuTrakItem" tipo="p" n="${i}" hijos="${arrHijos.reverse().join(",")}"><div class="estado" n="${i}"></div><div class="textoItem" n="${i}">${Htmls[i].menu}</div><div class="icono mas" n="${i}"></div></div>`);
                }else{
                    htmlMenu.push(`<div class="menuTrakItem" tipo="p" n="${i}"><div class="estado" n="${i}"></div><div class="textoItem" n="${i}">${Htmls[i].menu}</div></div>`);
                }                
                arrHijos=null;
                arrHijos=[];
            }else if(Htmls[i].submenu!="" || Htmls[i].menu==""){    
                arrHijos.push(i);            
                htmlMenu.push(`<div class="menuTrakItem" tipo="h" n="${i}"><div class="estado" n="${i}"></div><div class="textoItem" n="${i}">${Htmls[i].submenu}</div></div>`);
            }            
        }
        htmlMenu=htmlMenu.reverse();
        menuTrakItems.innerHTML=htmlMenu.join("");
        
        menuTrakItem=[].slice.call(document.querySelectorAll(".menuTrakItem"));

        for(var i in menuTrakItem){
            var icon=menuTrakItem[i].querySelector(".icono");
            var texto=menuTrakItem[i].querySelector(".textoItem");
            
            if(icon && texto){
                icon.addEventListener("click",function(){
                    var n=Number(this.getAttribute("n"));
                    var h=menuTrakItem[n].getAttribute("hijos").split(",");
                    for(var k in menuTrakItem){
                        if( menuTrakItem[k].getAttribute("tipo")=="h" ){
                            menuTrakItem[k].style.display="none";
                        }                        
                    }
                    var menos=[].slice.call(document.querySelectorAll(".menos"));                    
                    for(var l in menos){                        
                        menos[l].classList.remove("menos");
                        menos[l].classList.add("mas");
                    }
                    this.classList.remove("mas");
                    this.classList.add("menos");                                        
                    for(var j in h){
                        j=Number(j);
                        menuTrakItem[h[j]].style.display="block";
                    }
                });           
                texto.addEventListener("click",function(){
                    var n=Number(this.getAttribute("n"));                    
                    ir(n);
                });
            }else{
                menuTrakItem[i].addEventListener("click",function(){
                    var n=Number(this.getAttribute("n"));                    
                    ir(n);
                });
            }            
        }

        actualizarMenu();
    }

    function asignaEventosBotones(){
        visor=document.querySelector(".visor");        
        cargador=document.querySelector(".cargador");        
        visorIfr=document.querySelector(".visor iframe");        
        cargadorIfr=document.querySelector(".cargador iframe");  
        btnHome=document.querySelector(".itmMenuBotones[m='1']");            
        btnTemas=document.querySelector(".itmMenuBotones[m='2']");  
        btnMenu=document.querySelector(".itmMenuBotones[m='3']");  
        btnConfig=document.querySelector(".itmMenuBotones[m='4']");  
        btnAyuda=document.querySelector(".itmMenuBotones[m='5']");  
        menuTrak=document.querySelector(".menuTrak");
        menuTrakItems=document.querySelector(".menuTrakItems");
        menuTrakSombra=document.querySelector(".menuTrakSombra");
        menuBotones=document.querySelector(".menuBotones");
        btnSiguiente=document.querySelector(".siguiente");
        btnAtras=document.querySelector(".atras");

        modalFrame=document.querySelector("#modalFrame");
        modalFrameTitulo=document.querySelector("#modalFrame .modaltitulo");
        modalFrameIframe=document.querySelector("#modalFrame iframe");

        btnSiUltimo=document.querySelector("#modalUltimo .btnsi");
        btnNoUltimo=document.querySelector("#modalUltimo .btnno");

        menuTrak.style.display="none";
        btnSiguiente.style.display="none";
        btnAtras.style.display="none";
        

        //gsap.set(".itmMenuBotones .entrada",{x:0})
        //gsap.set(".itmMenuBotones .mascara",{width:0,transformOrigin:"0 0"})
        gsap.fromTo(".menuBotones",{xPercent:50},{xPercent:0,onStart:function(){menuBotones.style.display="block"}})

        animenuTrak=gsap.timeline({paused:true});        
        animenuTrak.fromTo(".menuTrakItems",{xPercent:-100},{xPercent:0,duration:.5,
            onStart:function(){
                menuTrak.style.display="block";
            },onReverseComplete:function(){
                menuTrak.style.display="none";
            }
        });
        animenuTrak.to(".menuTrak",{css:{backgroundColor:"rgba(0,0,0,.5)"},duration:.5},"-=.5");
        
        menuTrakSombra.addEventListener("click",function(){
            animenuTrak.reverse();
        });
      

        btnHome.addEventListener("click",function(){                        
            if(animenuTrak.progress()>0){
                animenuTrak.reverse()
            }
            var m=Number(this.getAttribute("m"));
            ir(0);                      
        });

        btnTemas.addEventListener("click",function(){                        
            if(animenuTrak.progress()>0){
                animenuTrak.reverse()
            }
            var m=Number(this.getAttribute("m"));
            ir(1); 
        });

        btnMenu.addEventListener("click",function(){                        
            var m=Number(this.getAttribute("m"));
            if(animenuTrak.progress()>0){
                animenuTrak.reverse()
            }else{
                animenuTrak.play();               
            }
        });  
        btnConfig.addEventListener("click",function(){            
            if(animenuTrak.progress()>0){
                animenuTrak.reverse()
            }
            var m=Number(this.getAttribute("m"));
            // modalFrameTitulo.innerHTML="Configuracion";
            modalFrameIframe.setAttribute("src","./plantilla/htmls/configuracion.html")
            modalFrame.style.display="flex";
        });

        btnAyuda.addEventListener("click",function(){            
            if(animenuTrak.progress()>0){
                animenuTrak.reverse()
            }
            var m=Number(this.getAttribute("m"));
            // modalFrameTitulo.innerHTML="Ayuda";
            modalFrameIframe.setAttribute("src","./plantilla/htmls/ayuda.html")
            modalFrame.style.display="flex";     
        }); 

        btnSiguiente.addEventListener("click",function(){
            siguiente();
        });
        btnAtras.addEventListener("click",function(){            
            atras();
        });

        btnSiUltimo.addEventListener("click",function(){
            ir(ultimo);
        });
        btnNoUltimo.addEventListener("click",function(){
            ir(0);
        });

    }

    function ir(n){
        reiniciaElemPlantilla();
        
        actual=n;
        console.log(actual);

        visorIfr.setAttribute("src",Htmls[actual].carpeta+"/"+Htmls[actual].archivo);

        if(ultimo<actual){
            ultimo=actual;
        }

        if(trak[actual]==0){
            trak[actual]=1;
            actualizarMenu();
            registrar();
        }        
        validaNavegacion();
        modo(actual==0?0:1);
        if(actual == 0){
            document.getElementById("menuImage").src = "assets/img/menu/menu_principal.png";
        }else{
            document.getElementById("menuImage").src = "assets/img/menu/menu_principal.png";
        }
    }

    function validaNavegacion(){
        if(actual==0){
            btnAtras.style.display="none";
        }else{
            btnAtras.style.display="block";
        }        
        if(trak[actual]==2 && actual<(total-1)){
            btnSiguiente.style.display="block";            
        }else{
            btnSiguiente.style.display="none";            
        }
    }
    function reiniciaElemPlantilla(){
        visorIfr.setAttribute("src","about:blank");        
        btnAtras.style.display="none";
        btnSiguiente.style.display="none";
        cargador.style.display="none";
        visor.style.display="block";  
        menuBotones.style.display="block";  
        if(animenuTrak.progress()>0){
            animenuTrak.reverse()
        }

        //gsap.to(".itmMenuBotones .entrada",{x:0})
        //gsap.to(".itmMenuBotones .mascara",{width:0,transformOrigin:"0 0"})
    }

    function siguiente(){
        if(actual+1<total){
            ir(actual+1)
        }


    }
    function atras(){
        if(actual-1>-1){
            ir(actual-1)
        }
    }
    function colorEstado(estatus){        
        switch(estatus){
            case 0:
                return "#c4c4c4";
            break;
            case 1:
                return "#f8e6a5";
            break;
            case 2:
                return "green";
            break;
        }
    }
    function actualizarMenu(){
        validaNavegacion();        
        var arr=[];
        for(var i=menuTrakItem.length-1;i>-1;i--){            
            var t=menuTrakItem[i].getAttribute("tipo");
            var n=Number(menuTrakItem[i].getAttribute("n"));            
            var est=document.querySelector(".menuTrakItem .estado[n='"+n+"']");                
            if(t=="h"){                
                est.style.color=colorEstado(trak[i]);
                arr.push(trak[i]);
            }else if(t=="p"){
                arr.push(trak[i]);              
                var QE=QEstado(arr);
                var ColorFinal = colorEstado(QE)                
                est.style.color=ColorFinal;
                arr=null;
                arr=[];
            }
        }
    }
    function registrar(){
        //console.log("  - ",trak.join(""));
        scormDatos=JSON.stringify({
            "trak":trak,
            "idioma":idioma,
            "ultimo":ultimo,
            "htmlData":htmlData,
        });
        if(Prop.scormversion=="scorm1.2"){
            scorm("setData",scormDatos);
            scorm("setUltimo",ultimo);            
            if( QEstado(trak) == 2 && !cursoCompleto){
                cursoCompleto=true;
                if(!conEvaluacion){
                    scorm("completo");    
                }                
            } 
        }
    }

    function recive(event){        
        //console.log("Recive ",event)
        if(tiempoPrecargas || (typeof(event.data)!="string" || event.data.indexOf("soy")==-1 )){
            return 0;
        }
        var remodata=JSON.parse(event.data);                
        evRemoto=event;
        switch(remodata.cmd){
            case "loadgetExcelData":
                var resultado=Htmls[actual];
                msg.reenvia(event, (JSON.stringify({
                    soy: "indice",
                    cmd: "loadgetExcelData",
                    res: resultado
                })));
            break;
            case "getExcelData":
                var resultado=Htmls[actual];
                msg.reenvia(event, (JSON.stringify({
                    soy: "indice",
                    cmd: "getExcelData",
                    res: resultado
                })));
            break;
            case "getAllExcelData":
                var resultado=Htmls;
                msg.reenvia(event, (JSON.stringify({
                    soy: "indice",
                    cmd: "getExcelData",
                    res: resultado
                })));
            break;
            case "getData":
                var resultado=htmlData[actual];
                msg.reenvia(event, (JSON.stringify({
                    soy: "indice",
                    cmd: "getData",
                    res: resultado
                })));
            break;        
            case "getAllData":
                var resultado=htmlData;
                msg.reenvia(event, (JSON.stringify({
                    soy: "indice",
                    cmd: "getAllData",
                    res: resultado
                })));
            break;
            case "setData":                
                htmlData[actual]=remodata.data;
                registrar();                
                if(remodata.file=="evaluacion.html"){
                    if(remodata.data.evalfinalizada){
                        //console.log(" - CAL ",remodata.data.calmasalta)
                        scorm("setCalificacion",remodata.data.calmasalta);
                        if(remodata.data.evalaprobada){
                            //console.log(" - ESTADO ","passed")
                            scorm("setEstado","passed");
                        }else{
                            //console.log(" - ESTADO ","failed")
                            scorm("setEstado","failed");
                        }
                    }                    
                }
            break;
            case "setAllData":
                htmlData=remodata.data;
            break;
            case "atras":
                atras();
            break;
            case "siguiente":
                siguiente();
            break;
            case "ir":
                ir(Number(remodata.n));
            break;
            case "htmlcompleto":
                if(trak[actual]==1){
                    trak[actual]=2;
                    actualizarMenu();
                    registrar();
                }                
            break;
            case "muestraOculta":
                //console.log( remodata )
                document.querySelector(remodata.sel).style.display=(remodata.bol)?"block":"none";          
            break;
        }
    }
    
    function msgAlerta(tipo,titulo,msg,otros){
        var modal;
        switch(tipo){
            case "error":
                modal=document.querySelector("#modalError");
                var modaltitulo=document.querySelector("#modalError .modaltitulo");
                var modalcontenido=document.querySelector("#modalError .modalcontenido");

                modaltitulo.innerHTML=titulo;
                modalcontenido.innerHTML=msg;
                
            break;
            case "ultimo":
                modal=document.querySelector("#modalUltimo");
                var modaltitulo=document.querySelector("#modalUltimo .modaltitulo");
                var modalcontenido=document.querySelector("#modalUltimo .modalcontenido");
                var modalbtnsi=document.querySelector("#modalUltimo .btnsi");
                var modalbtnno=document.querySelector("#modalUltimo .btnno");

                modaltitulo.innerHTML=titulo;
                modalcontenido.innerHTML=msg;      
                modalbtnsi.innerHTML=otros.si;
                modalbtnno.innerHTML=otros.no;     
                
                //modalbtnsi.removeEventListener("click");
                modalbtnsi.addEventListener("click",function(){                    
                    modal.style.display="none";
                    ir(ultimo)
                });

                modalbtnno.addEventListener("click",function(){                    
                    modal.style.display="none";
                });

            break;
        }
        modal.style.display="block";
        return modal;
    }

    function scorm(c, v) {
        if (Prop.scormversion == "web" || !online) {
            console.log(" - "+c + " ->  is web");
            return "";
        }
        var res = false;
        var err = "";
        if (online) {
            if (Prop.scormversion == "scorm1.2") {
                switch (c) {
                    case "apiOK":
                        res = APIOK();
                        break;
                    case "iniciar":
                        res = SCOInitialize();
                        break;
                    case "finalizar":
                        res = SCOFinish();
                        break;
                    case "getApi":
                        res = g_objAPI;
                        break;
                    case "getNombre":
                        res = SCOGetValue("cmi.core.student_name");
                        break;
                    case "completo":
                        res = SCOSetStatusCompleted();
                        break;
                    case "getEstado":
                        res = SCOGetValue("cmi.core.lesson_status");
                        break;
                    case "getUltimo":
                        res = SCOGetValue("cmi.core.lesson_location");
                        break;
                    case "getData":
                        res = SCOGetValue("cmi.suspend_data");
                        break;
                    case "getCalificacion":
                        res = SCOGetValue("cmi.core.score.raw");
                        break;
                    case "setEstado":
                        res = SCOSetValue("cmi.core.lesson_status", v);
                        SCOCommit();
                        break;
                    case "setUltimo":
                        res = SCOSetValue("cmi.core.lesson_location", v);
                        SCOCommit();
                        break;
                    case "setData":
                        res = SCOSetValue("cmi.suspend_data", v);
                        SCOCommit();
                        break;
                    case "setCalificacion":
                        res = SCOSetValue("cmi.core.score.raw", v);
                        SCOCommit();
                        break;
                    case "GuardarInteracciones":
                        var nint = SCOGetValue("cmi.interactions._count");
                        var sint = "cmi.interactions." + nint + ".";
                        if (v.id != null) {
                            SCOSetValue(sint + "id", v.id + "");
                        }
                        if (v.timestamp != null) {
                            SCOSetValue(sint + "time", v.timestamp + "");
                        }
                        if (v.objectives != null) {
                            SCOSetValue(sint + "objectives.0.id", v.objectives + "");
                        }
                        if (v.tipo != null) {
                            SCOSetValue(sint + "type", v.tipo + "");
                        }
                        if (v.correcta != null) {
                            SCOSetValue(sint + "correct_responses.0.pattern", v.correcta + "");
                        }
                        if (v.respondio != null) {
                            SCOSetValue(sint + "student_response", v.respondio + "");
                        }
                        if (v.resultado != null) {
                            SCOSetValue(sint + "result", v.resultado + "");
                        }
                        if (v.peso != null) {
                            SCOSetValue(sint + "weighting", v.peso + "");
                        }
                        if (v.tiempo != null) {
                            SCOSetValue(sint + "latency", v.tiempo + "");
                        }
                        if (v.descripcion != null) {
                            //SCOSetValue(sint + "description", v.descripcion+"");
                        }
                        SCOCommit();
                        break;
                }
                err = SCOGetLastError();
                if (err) {
                    if (err > 0) {
                        console.log("Error " + err + " = " + SCOGetErrorString(err));
                    } else {
                        console.log("LMS ok  = " + SCOGetErrorString(err));
                    }
                }
            }
        }
        return res;
    }

    function quitaClase(selector){
        var elementos=[].slice.call(document.querySelectorAll(selector));                    
        for(var i in elementos){                        
            i=Number(i)
            elementos[i].classList.remove(selector);
        }  
    }    

    function modo(n){
        if(n!=undefined){
            modoactual=n;
            var arr=Array.from(document.querySelectorAll("[modo]"))
            for(var i in arr ){
                i=Number(i);
                arr[i].setAttribute("modo",modoactual)
            }
        }else{
            return modoactual;
        }
    }

})(this['\x61\x6a\x73\x6f\x6e'].$());