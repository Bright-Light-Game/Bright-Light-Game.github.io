window.onload = () => {
    screenTrans();
};

function screenTrans ()
{
    let pageAnc = document.querySelectorAll("a:not([target='_blank'])");
    let fadeEl = document.querySelector(".fadeObject");
    let footer = document.querySelector("footer");
    let fadeTime = 1
    
    setTimeout(() => {
        fadeEl.setAttribute("data-fadeState", "0");
        footer.setAttribute("data-fadeState", "0");
    }, (fadeTime * 1000));
    
    for (let i = 0; i < pageAnc.length; i++)
    {
        let anchor = pageAnc[i];
        
        anchor.addEventListener("click", e => {
            e.preventDefault();
            let target = e.target.href;
            
            footer.setAttribute("data-fadeState", "2");
            fadeEl.setAttribute("data-fadeState", "2");
            
            setInterval(() => {
                window.location.href = target;
            }, (fadeTime * 500));
        });
    }
}