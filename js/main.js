var scrollKeys = {
    38 : 1,
    40 : 1,
    37 : 1,
    39 : 1,
    32 : 1,
    33 : 1,
    34 : 1,
    35 : 1,
    36 : 1
};

window.onload = () => {
    screenTrans();
    setScrolling(false);
};


// ----------Screen Transition
function screenTrans ()
{
    let pageAnc = document.querySelectorAll("a:not([target='_blank'])");
    let fadeEl = document.querySelector(".fadeObject");
    let footer = document.querySelector("footer");
    let fadeTime = 1;
    
    setTimeout(() => {
        fadeEl.setAttribute("data-fadeState", "0");
        footer.setAttribute("data-fadeState", "0");
        
        ScrollBar.setBars(true);
        setScrolling(true);
    }, (fadeTime * 1000));
    
    for (let i = 0; i < pageAnc.length; i++)
    {
        let anchor = pageAnc[i];
        
        anchor.addEventListener("click", e => {
            e.preventDefault();
            let target = e.target.href;
            
            setScrolling(false);
            ScrollBar.setBars(false);
            
            footer.setAttribute("data-fadeState", "2");
            fadeEl.setAttribute("data-fadeState", "2");
            
            setTimeout(() => {
                window.location.href = target;
            }, (fadeTime * 500));
        });
    }
}


// ----------Scrolling
function preventDefault(e)
{
    e.preventDefault();
}

function preventDefaultForScrollKeys(e)
{
    if (keys[e.keyCode])
    {
        preventDefault(e);
        return false;
    }
}

var supportsPassive = false;
try
{
    window.addEventListener("scrollingToggle", null, Object.defineProperty({}, "passive", {
        get : function () { supportsPassive = true; } 
    }));
}
catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

// Toggle
function setScrolling (toggle)
{
    if (toggle)
    {
        window.removeEventListener("DOMMouseScroll", preventDefault, false);
        window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
        window.removeEventListener("touchmove", preventDefault, wheelOpt);
        window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
    }
    else
    {
        window.addEventListener("DOMMouseScroll", preventDefault, false);
        window.addEventListener(wheelEvent, preventDefault, wheelOpt);
        window.addEventListener("touchmove", preventDefault, wheelOpt);
        window.addEventListener("keydown", preventDefaultForScrollKeys, false);
    }
}


// ----------Scrollbar
function ScrollBar ()
{
    ThrowError(1);
}

ScrollBar.setBars = function (state)
{
    if (!state)
    {
        if (this.scrollInterval == null)
        {
            ThrowError(2);
        }
        else if (state == false)
        {
            clearInterval(this.scrollInterval);
            this.barArrowUp.style.visibility = "hidden";
            this.barArrowDown.style.visibility = "hidden";
        }
        else
        {
            ThrowError(0);
        }
        
        return null;
    }
    
    this.scrollBar = document.querySelector(".scrollBar");
    let _barArrowUp = document.createElement("div");
    let _barArrowDown = document.createElement("div");
    let barImg1 = document.createElement("img");
    let barImg2 = document.createElement("img");
    
    _barArrowUp.classList.add("scrollBarUp");
    _barArrowDown.classList.add("scrollBarDown");
    _barArrowUp.style.visibility = "hidden";
    _barArrowDown.style.visibility = "hidden";
    
    let imgSrc = "/img/spr_ui12-12.png"; 
    
    barImg1.src = imgSrc;
    barImg2.src = imgSrc;
    
    _barArrowUp.appendChild(barImg1);
    _barArrowDown.appendChild(barImg2);
    
    this.scrollBar.appendChild(_barArrowUp);
    this.scrollBar.appendChild(_barArrowDown);
    
    this.barArrowUp = document.querySelector(".scrollBarUp");
    this.barArrowDown = document.querySelector(".scrollBarDown");
    
    this.detectScreen();
};

ScrollBar.detectScreen = function ()
{
    let barArrowUp = this.barArrowUp;
    let barArrowDown = this.barArrowDown;
    
    let content = document.querySelector("#mainContent");
    
    this.scrollInterval = setInterval(() => {
        scrollPos = content.scrollTop / (content.scrollHeight - content.clientHeight);
        
        if (!isNaN(scrollPos))
        {
            if (scrollPos <= 0)
            {
                barArrowUp.style.visibility = "hidden";
                barArrowDown.style.visibility = "visible";
            }
            else if (scrollPos >= 1)
            {
                barArrowUp.style.visibility = "visible";
                barArrowDown.style.visibility = "hidden";
            }
            else
            {
                barArrowUp.style.visibility = "visible";
                barArrowDown.style.visibility = "visible";
            }
        }
        else
        {
            barArrowUp.style.visibility = "hidden";
            barArrowDown.style.visibility = "hidden";
        }
    }, 2);
};


// ----------Debugging
function ThrowError (errorCode)
{
    var errorText;
    
    switch (errorCode)
    {
        case 0:
            errorText = "Value was unassigned or invalid";
            break;
        case 1:
            errorText = "Using static class as a function";
            break;
        case 2:
            errorText = "There is no instance to work with";
            break;
    }
    
    errorText += `\nError Code: ${errorCode}`;
    
    alert(errorText);
    console.error(errorText);
    throw new Error(errorText);
}