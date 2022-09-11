


var animenuTrak;
var btnHome;
var btnTemas;
var btnMenu;
var btnConfig;
var btnAyuda;

asignaEventosBotones();


function asignaEventosBotones(){
    btnHome=document.querySelector(".itmMenuBotones[m='1']");
    btnTemas=document.querySelector(".itmMenuBotones[m='2']");
    btnMenu=document.querySelector(".itmMenuBotones[m='3']");
    btnConfig=document.querySelector(".itmMenuBotones[m='4']");
    btnAyuda=document.querySelector(".itmMenuBotones[m='5']");

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
        modalFrameTitulo.innerHTML="Ayuda";
        modalFrameIframe.setAttribute("src","./plantilla/htmls/ayuda.html")
        modalFrame.style.display="flex";
    });

    // btnSiguiente.addEventListener("click",function(){
    //     siguiente();
    // });
    // btnAtras.addEventListener("click",function(){
    //     atras();
    // });
    //
    // btnSiUltimo.addEventListener("click",function(){
    //     ir(ultimo);
    // });
    // btnNoUltimo.addEventListener("click",function(){
    //     ir(0);
    // });

}