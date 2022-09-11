window.addEventListener("DOMContentLoaded",iniciaEval(this['\x65\x6a\x73\x6f\x6e'].$()))
function iniciaEval(datos){
        
    if(window.muestraOculta){
        window.muestraOculta(".cargador",true);
        window.muestraOculta(".visor",false);
        window.muestraOculta(".menuBotones",false);
        window.muestraOculta(".atras",false);
        window.muestraOculta(".siguiente",false);
    }
    if(window.getExcelData){
        window.getExcelData(function(res){
            if(typeof(res)=="object" && res.eval){
                comienzaEvaluacion();
            }            
        })
    }

    var Prop={};
    var Txt={};
    var Textos=[];
    var Eval=[];    
    var idioma=datos[[!+[]+!+[]]+[]].nombre;

    var PREG=[];
    var PActual=0;
    var Total=0;    
    var PREVIO;
    var SELEC=[];
    var intentoActual=0;
    var maxintentos;
    var calmasalta="";
    var evalfinalizada=false;
    var evalaprobada=false;

    var Einstruciones=document.querySelector(".eval-instrucciones");
    var Epreguntas=document.querySelector(".eval-preguntas");
    var Eresultados=document.querySelector(".eval-resultados");
    var Eretros=document.querySelector(".eval-retros");
    var EretroSombra=document.querySelector(".eval-retros-sombra");
    var EretroPositiva=document.querySelector(".eval-retro-positiva");
    var EretroNegativa=document.querySelector(".eval-retro-negativa");
    var EretroInfo=document.querySelector(".eval-retro-info");
    var btnIniEval=document.querySelector(".btnIniciarEval");
    var btnInfo=document.querySelector(".btnAceptarInfo");
    var btnBien=document.querySelector(".btnAceptarBien");
    var btnMal=document.querySelector(".btnAceptarMal");
    var msgBien=document.querySelector(".msgBien");
    var msgMal=document.querySelector(".msgMal");
    var msgTitulo=document.querySelector(".msgTitulo");
    var msgInfo=document.querySelector(".msgInfo");
    var btnSigue=document.querySelector(".btnSigue");
    var txtPregunta=document.querySelector(".pregunta");
    var txtRespuestas=document.querySelector(".eval-respuestas");    
    var htmlRespuesta=document.querySelector(".eval-respuesta").outerHTML;
    var resTexto=document.querySelector(".mensajeResultados");  
    var resCal=document.querySelector(".calificacion");  
    var numeracion=document.querySelector(".numeracion");  
    var btnReintentar=document.querySelector(".btnReintentar");  
    var btnFinintentos=document.querySelector(".btnFinintentos");  
    var txtMasalta=document.querySelector(".txtMasalta");  
    var txtCalmasalta=document.querySelector(".calmasalta");  

    function comienzaEvaluacion(){

        Einstruciones.style.display="none";
        Epreguntas.style.display="none";
        Eresultados.style.display="none";
        Eretros.style.display="none";
        EretroPositiva.style.display="none";
        EretroNegativa.style.display="none";
        EretroInfo.style.display="none";
        btnReintentar.style.display="none";
        btnFinintentos.style.display="none";
        txtMasalta.style.display="none";
        txtCalmasalta.style.display="none";

        getPropiedades();
        getTextos();
        getEval();
        asignaTextos();
        asignaBotones();
        pideDatosGuardados();
        window.muestraOculta(".cargador",false);
        window.muestraOculta(".visor",true);
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
    function getEval(){
        Eval=getDataByName(idioma,datos);
    }

    function pideDatosGuardados(){
        if(window.getData){
            window.getData(function(res){
                console.log("  - Res getData ",res)
                if(!res){
                    console.log("  - Primera vez");
                    maxintentos=Number(Prop.intentos);
                    PREVIO={
                        "intento":intentoActual,
                        "totalintentos":maxintentos,
                        "calmasalta":calmasalta,
                        "evalfinalizada":evalfinalizada,
                        "evalaprobada":evalaprobada
                    }
                    generaPreguntas();                    
                    muestraInstruccion();
                }else{
                    console.log("  - Ya hay datos");    
                    maxintentos=Number(Prop.intentos);
                    PREVIO=res;    
                    intentoActual=PREVIO.intento;
                    calmasalta=PREVIO.calmasalta;
                    evalfinalizada=PREVIO.evalfinalizada;   
                    evalaprobada=PREVIO.evalaprobada;   

                    console.log("  - PREVIO " ,PREVIO)
                    console.log("  - intentoActual ",intentoActual)
                    console.log("  - calmasalta ",calmasalta)
                    console.log("  - evalfinalizada ",evalfinalizada)
                    console.log("  - evalaprobada ",evalaprobada)

                    validaIntentos();
                }
            });
        }
    }
    function asignaTextos(){
        var sel;
        for(var i in Textos){
            i=Number(i);
            sel="";
            sel=document.querySelector("[data-text='"+Textos[i]["Textos"]+"']")
            if(sel){
                sel.innerHTML=Txt[Textos[i]["Textos"]];
            }
            
        }
    }

    function asignaBotones(){
        btnIniEval.addEventListener("click",function(){
            if(Total>0){
                muestraPregunta(PActual);
            }
        });
        btnInfo.addEventListener("click",function(){
            Eretros.style.display="none";
            EretroInfo.style.display="none";
        });
        btnBien.addEventListener("click",function(){
            gsap.to(EretroPositiva,{scale:0,onComplete:function(){
                Eretros.style.display="none";
                EretroPositiva.style.display="none";
            }})
            gsap.to(".pregunta",{xPercent:-110,duration:.8})
            gsap.to(".eval-respuestas",{xPercent:-110,duration:.8,onComplete:function(){
                muestraPregunta(PActual+1)    
            }});           
        });
        btnMal.addEventListener("click",function(){
            gsap.to(EretroNegativa,{scale:0,onComplete:function(){
                Eretros.style.display="none";
                EretroNegativa.style.display="none";    
            }})
            
            gsap.to(".pregunta",{xPercent:-110,duration:.8})
            gsap.to(".eval-respuestas",{xPercent:-110,duration:.8,onComplete:function(){
                muestraPregunta(PActual+1)    
            }});            
        });  

        btnReintentar.addEventListener("click",function(){
            console.log("  -Reintentar");
            location.reload();
        });

        btnFinintentos.addEventListener("click",function(){
            console.log("  -FinIntentos")

            intentoActual=maxintentos;
            evalfinalizada=true;

            if(window.htmlcompleto && evalfinalizada)window.htmlcompleto();

            PREVIO={
                "intento":intentoActual,
                "totalintentos":maxintentos,
                "calmasalta":calmasalta,
                "evalfinalizada":evalfinalizada,
                "evalaprobada":evalaprobada
            }

            if(window.setData)window.setData(PREVIO);

            location.reload();
        });
    }

    function validaIntentos(){
        if( intentoActual<maxintentos ){
            if(evalfinalizada){
                muestraResultados();
                resCal.innerHTML=calmasalta;
                return 0;
            }
            if(intentoActual<maxintentos){
                if(intentoActual>0){
                    var msg=Txt["Txt_intentos_msg1"];
                    var restaIntentos=maxintentos-intentoActual;
                    msg=msg.split("${intentoActual}").join(intentoActual).split("${restaIntentos}").join(restaIntentos)
                    muestraInstruccion();
                    muestraMensaje("faltanIntenos",msg,"Intentos")
                }                
                generaPreguntas();
            }
        }else{                
            muestraResultados();
            if(evalaprobada){
                if(calmasalta==100){
                    muestraMensaje("sinIntentos",Txt["Txt_aprobado_100"],Txt["Txt_aprobado_titulo"]);  
                }else{
                    muestraMensaje("sinIntentos",Txt["Txt_aprobado_normal"],Txt["Txt_aprobado_titulo"]);        
                }
            }else{
                muestraMensaje("sinIntentos",Txt["Txt_msg_finintentos"],"Fin Intentos");    
            }                
            resCal.innerHTML=calmasalta;    
            window.muestraOculta(".menuBotones",true);
            window.muestraOculta(".atras",true);        
        }
    }
    function muestraMensaje(tipo,res,titulo){  
        //console.log("  - muestraMensaje ",tipo,res,titulo)      
        switch(tipo){
            case "faltanIntenos":
                msgTitulo.innerHTML=titulo;
                msgInfo.innerHTML=res;
                gsap.fromTo(EretroInfo,{scale:0},{scale:1,ease:"elastic",duration:1.5})
                Eretros.style.display="flex";
                EretroInfo.style.display="flex";
            break;
            case "sinIntentos":
                msgTitulo.innerHTML=titulo;
                msgInfo.innerHTML=res;
                gsap.fromTo(EretroInfo,{scale:0},{scale:1,ease:"elastic",duration:1.5})
                Eretros.style.display="flex";
                EretroInfo.style.display="flex";
                btnInfo.style.display="flex";
            break;
            case "retroPositiva":
                msgBien.innerHTML=res;
                gsap.fromTo(EretroPositiva,{scale:0},{scale:1,ease:"elastic",duration:1.5})
                Eretros.style.display="flex";
                EretroPositiva.style.display="flex";                
            break;
            case "retroNegativa":
                msgMal.innerHTML=res;
                gsap.fromTo(EretroNegativa,{scale:0},{scale:1,ease:"elastic",duration:1.5})
                Eretros.style.display="flex";                
                EretroNegativa.style.display="flex";                
            break;            
        }
    }

    function generaPreguntas(){
        console.log("  - generaPreguntas");
        //console.log(Eval)
        var tRes=[];        
        for(var i=Eval.length-1;i>-1;i--){
            if(Eval[i].pregunta!=""){
                if(Prop.revolverrespuestas=="si"){
                    tRes=arrayShuffle(tRes);
                }
                PREG.push({
                    "idn":Eval[i].id,
                    "pregunta":Eval[i].pregunta,
                    "respuestas":tRes,
                    "retrobien":Eval[i].retrobien,
                    "retromal":Eval[i].retromal,
                    "extra":Eval[i].extra,
                })
                tRes=null;
                tRes=[];
            }else if(Eval[i].respuestas!=""){
                tRes.push({
                    "idn":Eval[i].id,
                    "respuesta":Eval[i].respuestas,
                    "correcta":Eval[i].correcta=="correcta",
                    "retrobien":Eval[i].retrobien,
                    "retromal":Eval[i].retromal
                })
            }   
        }
        PREG=PREG.reverse();

        if(Prop.revolverpreguntas="si"){
            PREG=arrayShuffle(PREG);
        }        
        /*
        if(PREVIO && PREVIO.respondio){
            PREVIO.respondio[PREVIO.intento].map(function(e){
                console.log(e,PREG);
                for(var i in PREG){
                   i=Number(i);
                   if(e[0]==PREG[i].idn){
                     PREG.splice(i,1);
                   }  
                }
            })
        }
        */

        if(PREG.length>Number(Prop.numpreguntas)){
            PREG.length=Number(Prop.numpreguntas);            
        }
        Total=PREG.length;

        //console.log(PREG)
    }

    function muestraInstruccion(){
        console.log("  - muestraInstruccion")
         quitaTodo()
         Einstruciones.style.display="flex";
         //console.log(Einstruciones)
    }
    function muestraPregunta(n){        
        quitaTodo();
        if(n>=Total){
           muestraResultados()
           return 0;
        }
        console.log("  - muestraPregunta",(n+1),"/",Total)

        numeracion.innerHTML=(n+1)+" / "+Total;

        gsap.fromTo(".pregunta",{xPercent:110},{xPercent:0})
        gsap.fromTo(".eval-respuestas",{xPercent:110},{xPercent:0});

        btnSigue.style.display="none";
        Epreguntas.style.display="flex";
        PActual=n;
        txtPregunta.innerHTML=PREG[PActual].pregunta;
        var respuesta=``;
        var prefijos=["A)","B)","C)","D)","F)","E)","G)","H)"];
        for(var i in PREG[PActual].respuestas){
            i=Number(i);
            var prefijo=prefijos[i];
            var txtRespuesta=PREG[PActual].respuestas[i].respuesta;
            var nidn=PREG[PActual].respuestas[i].idn;
            var todo=htmlRespuesta;
            todo=todo.split("${nidn}").join(nidn)
            if(Prop.prefijos=="si"){
                todo=todo.split("${prefijo}").join(prefijo)    
            }else{
                todo=todo.split("${prefijo}").join("")    
            }            
            todo=todo.split("${txtRespuesta}").join(txtRespuesta)
            respuesta+=todo;
        }
        txtRespuestas.innerHTML=respuesta;
        var arrResp=Array.from(txtRespuestas.querySelectorAll(".eval-respuesta"));

        for(var i in arrResp){
            i=Number(i)
            //console.log( arrResp[i] )
            arrResp[i].addEventListener("click",function(){
                quitaSelRes();
                this.classList.add("selres")
                SELEC[PActual]=Number(this.getAttribute("n"))
                if( respEsCorrecta(SELEC[PActual]) ){
                    if(PREG[PActual].retrobien!=""){
                        muestraMensaje("retroPositiva",PREG[PActual].retrobien)    
                    }else{
                        btnSigue.style.display="flex";
                    }                    
                }else{
                    if(PREG[PActual].retromal!=""){
                        muestraMensaje("retroNegativa",PREG[PActual].retromal)
                    }else{
                        btnSigue.style.display="flex";
                    }
                }
            })
        }
    }
    function respEsCorrecta(idn){
        for(var i=Eval.length-1;i>-1;i--){
            if(Eval[i].id==idn){
                break;
            }
        }
        if(Eval[i].respuesta!="" && Eval[i].correcta!=""){
            return true;
        }
        return false;        
    }
    function quitaSelRes(){
        var arrResp=Array.from(txtRespuestas.querySelectorAll(".eval-respuesta"));
        for(var i in arrResp){
            i=Number(i)            
            arrResp[i].classList.remove("selres")
        }
    }
    function muestraResultados(){
        console.log("  - muestraResultados")
        intentoActual++;
        quitaTodo()
        Eresultados.style.display="flex";
        console.log("  - SELEC" , SELEC)
        var puntos=0;
        for(var i in SELEC){
            i=Number(i)
            if( respEsCorrecta(SELEC[i]) ){
                puntos++;
            }
        }
        var cal=(puntos/Total)*100;
        var calred=Number(cal.toFixed(0));

        if(calmasalta==""){
            calmasalta=calred;
        }else if(calred>calmasalta){
            calmasalta=calred;
        }
        
        
        resCal.innerHTML=calred;

        if(calred==100){
            resTexto.innerHTML=Txt["Txt_resultados_aprobado_100"]   
            intentoActual=maxintentos;
            evalfinalizada=true;
            evalaprobada=true;
            window.muestraOculta(".menuBotones",true);
        }else{
            if(intentoActual<maxintentos){
                if( calred >= Prop.calaprobatoria ){
                    resTexto.innerHTML=Txt["Txt_resultados_aprobado_conintentos"]                   
                    evalaprobada=true;
                    btnFinintentos.style.display="flex";
                    btnReintentar.style.display="flex"; 
                }else{
                    resTexto.innerHTML=Txt["Txt_resultados_noaprobado_conintentos"];
                    btnReintentar.style.display="flex"; 
                }
            }else{
                if( calred >= Prop.calaprobatoria ){
                    resTexto.innerHTML=Txt["Txt_resultados_aprobado_sinintentos"]   
                    evalfinalizada=true;
                    evalaprobada=true;
                }else{
                    resTexto.innerHTML=Txt["Txt_resultados_noaprobado_sinintentos"] 
                    evalfinalizada=true;
                    if(evalaprobada!=true){
                        evalaprobada=false;    
                    }                
                }
                window.muestraOculta(".menuBotones",true);
            }            
        }        

        if(intentoActual>1){
            txtMasalta.style.display="flex";
            txtCalmasalta.style.display="flex";
            txtCalmasalta.innerHTML=calmasalta;
        }

        console.log("  - intentoActual ",intentoActual)
        console.log("  - calmasalta ",calmasalta)
        console.log("  - evalfinalizada ",evalfinalizada)
        console.log("  - evalaprobada ",evalaprobada)

        if(window.htmlcompleto && evalfinalizada)window.htmlcompleto();

        PREVIO={
            "intento":intentoActual,
            "totalintentos":maxintentos,
            "calmasalta":calmasalta,
            "evalfinalizada":evalfinalizada,
            "evalaprobada":evalaprobada
        }

        if(window.setData)window.setData(PREVIO);
        

    }
    function quitaTodo(){
        Einstruciones.style.display="none";
        Epreguntas.style.display="none";
        Eresultados.style.display="none";
        Eretros.style.display="none";
    }
}