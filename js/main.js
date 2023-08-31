window.onload = () => {
    Loop.Init();
    Data.Init();
};


class Data
{
    static #loaded = false;
    static #fromSSOS = false;
    static #events = [];
    static #sSOS = [];
    
    static #event = null;
    
    static html = {
        body : null,
        main : null,
        content : null,
        footer : null
    };
    
    static get isLoaded ()
    {
        return this.#loaded;
    }
    
    static get currentEvent ()
    {
        return this.#event;
    }
    
    static get openedFromSSOS ()
    {
        return this.#fromSSOS;
    }
    
    static #CompareMethod (lhs, rhs)
    {
        const lS = `${lhs}`;
        const rS = `${rhs}`;
        
        let a = "";
        let b = "";
        
        for (let i = 0; i < lS.length; i++)
        {
            if (lS[i] === "\n") continue;
            if (lS[i - 1] === " " && lS[i] === " ") continue;
            if (lS[i + 1] === " " && lS[i] === " ") continue;
            if (lS[i - 1] === "{" && lS[i] === " ") continue;
            if (lS[i + 1] === "}" && lS[i] === " ") continue;
            if (lS[i - 1] === "(" && lS[i] === " ") continue;
            if (lS[i + 1] === ")" && lS[i] === " ") continue;
            if (lS[i - 1] === "," && lS[i] === " ") continue;
            if (lS[i + 1] === "," && lS[i] === " ") continue;
            
            a += lS[i];
        }
        
        for (let i = 0; i < rS.length; i++)
        {
            if (rS[i] === "\n") continue;
            if (rS[i - 1] === " " && rS[i] === " ") continue;
            if (rS[i + 1] === " " && rS[i] === " ") continue;
            if (rS[i - 1] === "{" && rS[i] === " ") continue;
            if (rS[i + 1] === "}" && rS[i] === " ") continue;
            if (rS[i - 1] === "(" && rS[i] === " ") continue;
            if (rS[i + 1] === ")" && rS[i] === " ") continue;
            if (rS[i - 1] === "," && rS[i] === " ") continue;
            if (rS[i + 1] === "," && rS[i] === " ") continue;
            
            b += rS[i];
        }
        
        return a === b;
    }
    
    static #AddEvent (event, callback, recallable)
    {
        const listener = {
            event : event,
            callback : callback,
            recallable : recallable,
            called : false
        };
        
        for (let iA = 0; iA < this.#events.length; iA++)
        {
            const equalEvent = listener.event === this.#events[iA].event;
            const equalMethod = this.#CompareMethod(listener.callback, this.#events[iA].callback);
            const equalRecall = listener.recallable === this.#events[iA].recallable;
            
            if (equalEvent && equalMethod && equalRecall)
            {
                let newEvents = [];
                
                for (let iB = 0; iB < this.#events.length; iB++)
                {
                    if (iB === iA) continue;
                    
                    if (newEvents.length === 0) newEvents[0] = this.#events[iB];
                    else newEvents.push(this.#events[iB]);
                }
                
                this.#events = newEvents;
                
                return;
            }
        }
        
        if (this.#events.length === 0) this.#events[0] = listener;
        else this.#events.push(listener);
    }
    
    static IsSSOS (src)
    {
        for (let i = 0; i < this.#sSOS.length; i++) if (src === `${window.location.origin}/${this.#sSOS[i]}`) return true;
        
        return false;
    }
    
    static On (event, callback)
    {
        this.#AddEvent(event, callback, true);
    }
    
    static Once (event, callback)
    {
        this.#AddEvent(event, callback, false);
    }
    
    static async #CallEvent (eventName)
    {
        this.#event = eventName;
        
        const event = this.#event;
        
        let mustRemove = null;
        
        for (let iA = 0; iA < this.#events.length; iA++)
        {
            const listener = this.#events[iA];
            const callable = listener.recallable || !listener.called;
            
            if (listener.event !== event) continue;
            
            if (!callable)
            {
                let newEvents = [];
                
                for (let iB = 0; iB < this.#events.length; iB++)
                {
                    if (iB === iA) continue;
                    
                    if (newEvents.length === 0) newEvents[0] = this.#events[iB];
                    else newEvents.push(this.#events[iB]);
                }
                
                this.#events = newEvents;
                
                continue;
            }
            
            await listener.callback();
            
            listener.called = true;
        }
        
        this.#event = null;
    }
    
    static async Image (src)
    {
        const img = await fetch(src);
        const blob = await img.blob();
        
        return await URL.createObjectURL(blob);
    }
    
    static async LoadScript (src)
    {
        const script = document.createElement("script");
        
        script.src = src;
        script.type = "text/javascript";
        script.async = true;
        
        this.html.body.appendChild(script);
        
        await new Promise(resolve => script.addEventListener("load", resolve));
    }
    
    static async Init ()
    {
        this.html.body = document.body;
        this.html.main = document.querySelector("main");
        this.html.content = document.querySelector("#mainContent");
        this.html.footer = document.querySelector("footer");
        
        this.#fromSSOS = CookieJar.GetCookie("fromSSOS") === "true";
        
        CookieJar.RemoveCookie("fromSSOS");
        
        await this.#CallEvent("WhileDataLoading");
        
        const dataRequest = await fetch("/data/data.json");
        
        const newData = await dataRequest.json();
        
        this.#sSOS = newData.samestyleoriginsites;
        
        await new Promise(resolve => setTimeout(resolve, 5));
        
        await this.#CallEvent("OnDataLoad");
    }
}

class Loop
{
    static #loaded = false;
    static #uTime = 0;
    static #uDeltaTime = 0;
    static #frameIndex = 0;
    static #time = 0;
    static #deltaTime = 0;
    static #calls = [];
    
    static targetFrameRate = 60;
    static timeScale = 1;
    static maximumDeltaTime = 0.06666667;
    
    static get unscaledTime ()
    {
        return this.#uTime;
    }
    
    static get unscaledDeltaTime ()
    {
        return this.#uDeltaTime;
    }
    
    static get frameCount ()
    {
        return this.#frameIndex;
    }
    
    static get time ()
    {
        return this.#time;
    }
    
    static get deltaTime ()
    {
        return this.#deltaTime;
    }
    
    static #RequestUpdate ()
    {
        requestAnimationFrame(this.#Update.bind(this));
    }
    
    static #Update ()
    {
        const slice = (1 / this.targetFrameRate) - 5e-3;
        
        let accumulator = (1e-3 * performance.now()) - this.#uTime;
        
        while (accumulator >= slice)
        {
            this.#uDeltaTime = (1e-3 * performance.now()) - this.#uTime;
            this.#uTime += this.#uDeltaTime;
            
            let deltaT = this.#uDeltaTime;
            
            if (deltaT > this.maximumDeltaTime) deltaT = this.maximumDeltaTime;
            
            this.#deltaTime = deltaT * this.timeScale;
            this.#time += this.#deltaTime;
            
            this.#Invoke();
            
            if (this.timeScale != 0) this.#frameIndex++;
            
            accumulator -= slice;
        }
        
        this.#RequestUpdate();
    }
    
    static #Invoke ()
    {
        const currentCalls = this.#calls;
        
        let newCalls = [];
        
        for (let i = 0; i < currentCalls.length; i++)
        {
            const currentCall = currentCalls[i];
            
            currentCall.time += this.#deltaTime;
            
            if (currentCall.time > (typeof currentCall.timeout === "function" ? currentCall.timeout() : currentCall.timeout))
            {
                currentCall.callback();
                
                if (currentCall.temp) continue;
                else currentCall.time = 0;
            }
            
            if (newCalls.length === 0) newCalls[0] = currentCall;
            else newCalls.push(currentCall);
        }
        
        this.#calls = newCalls;
    }
    
    static Init ()
    {
        if (this.#loaded) return;
        
        this.#loaded = true;
        
        this.#RequestUpdate();
    }
    
    static Append (callback, data)
    {
        const dat = data ?? { };
        
        const newCall = {
            callback : callback,
            temp : dat.temporary ?? false,
            timeout : dat.delay ?? 0,
            time : 0
        };
        
        if (this.#calls.length === 0) this.#calls[0] = newCall;
        else this.#calls.push(newCall);
    }
    
    static async Delay (time)
    {
        if (time === 0) return;
        
        return new Promise(resolve => this.Append(resolve, {
            temporary : true,
            delay : time
        }));
    }
}

class ScreenTrans
{
    static #loaded = false;
    
    static fadeTime = 1;
    
    static Set ()
    {
        if (this.#loaded) return;
        
        Data.html.body.style.opacity = "1";
        Data.html.footer.style.transform = "none";
        
        if (!Data.openedFromSSOS)
        {
            Data.html.body.style.transition = `opacity ${this.fadeTime / Loop.timeScale}s`;
            Data.html.footer.style.transition = `transform ${this.fadeTime / Loop.timeScale}s`;
        }
        
        Data.Once("OnDataLoad", async () => {
            Data.html.content.style.opacity = "1";
            Data.html.content.style.transition = `opacity ${this.fadeTime / Loop.timeScale}s`;
            
            await Loop.Delay(this.fadeTime);
            
            Data.html.content.setAttribute("data-scrollable", "true");
            
            Data.html.body.style.pointerEvents = "all";
            Data.html.body.style.transition = "none";
            Data.html.footer.style.transition = "none";
            
            ScrollBar.Toggle(true);
        });
        
        this.#loaded = true;
        
        Loop.Append(() => { this.ScanAnchors(); });
    }
    
    static ScanAnchors ()
    {
        const pageAnc = document.querySelectorAll("a:not([target='_blank'])");
        
        for (let i = 0; i < pageAnc.length; i++)
        {
            let valid = true;
            
            if (pageAnc[i].href[0] === "#") return;
            
            pageAnc[i].onclick = async event => {
                event.preventDefault();
                
                const target = pageAnc[i].href;
                
                let invalidTarget = false;
                
                try
                {
                    const request = await fetch(target, {
                        mode : "no-cors"
                    });
                    
                    if (request.status > 200 && request.status !== 404) invalidTarget = true;
                }
                catch
                {
                    invalidTarget = true;
                }
                
                if (invalidTarget)
                {
                    Data.html.body.style.animation = "none";
                    
                    Data.html.body.style.animation = `shake ${0.125 / Loop.timeScale}s`;
                    
                    await Loop.Delay(0.125);
                    
                    Data.html.body.style.animation = "none";
                    
                    return;
                }
                
                Data.html.content.setAttribute("data-scrollable", "false");
                
                Data.html.body.style.pointerEvents = "none";
                
                if (Data.IsSSOS(target))
                {
                    CookieJar.SetCookie("fromSSOS", true);
                    
                    Data.html.content.style.opacity = "0";
                    Data.html.content.style.transition = `opacity ${0.5 * this.fadeTime / Loop.timeScale}s`;
                }
                else
                {
                    Data.html.body.style.opacity = "0";
                    Data.html.body.style.transition = `opacity ${0.5 * this.fadeTime / Loop.timeScale}s`;
                    
                    Data.html.footer.style.transform = "translateY(100%)";
                    Data.html.footer.style.transition = `transform ${0.5 * this.fadeTime / Loop.timeScale}s`;
                }
                
                await Loop.Delay(0.5 * this.fadeTime);
                
                window.location.href = target;
            };
        }
    }
}

class ScrollBar
{
    static #loaded = false;
    static #enabled = false;
    
    static #scrollBar = null;
    static #barUp = null;
    static #barDown = null;
    
    static Update ()
    {
        if (!this.#enabled) return;
        
        const scrollPos = Data.html.content.scrollTop / (Data.html.content.scrollHeight - Data.html.content.clientHeight);
        
        if (isNaN(scrollPos))
        {
            this.#barUp.setAttribute("data-enabled", "false");
            this.#barDown.setAttribute("data-enabled", "false");
            
            return;
        }
        
        if (scrollPos <= 0)
        {
            this.#barUp.setAttribute("data-enabled", "false");
            this.#barDown.setAttribute("data-enabled", "true");
        }
        else if (scrollPos >= 1)
        {
            this.#barUp.setAttribute("data-enabled", "true");
            this.#barDown.setAttribute("data-enabled", "false");
        }
        else
        {
            this.#barUp.setAttribute("data-enabled", "true");
            this.#barDown.setAttribute("data-enabled", "true");
        }
    }
    
    static Toggle (state)
    {
        if (this.#enabled === state) return;
        
        this.#enabled = state;
        
        if (!state)
        {
            this.#barUp.setAttribute("data-enabled", "false");
            this.#barDown.setAttribute("data-enabled", "false");
        }
    }
    
    static async Set ()
    {
        if (this.#loaded) return;
        
        this.#scrollBar = Data.html.main.querySelector(".scrollBar");
        
        this.#barUp = document.createElement("div");
        this.#barDown = document.createElement("div");
        
        const uImgWrap = document.createElement("div");
        const uImg = document.createElement("img");
        
        const dImgWrap = document.createElement("div");
        const dImg = document.createElement("img");
        
        this.#barUp.classList.add("barUp");
        this.#barDown.classList.add("barDown");
        
        uImg.classList.add("unselectable");
        dImg.classList.add("unselectable");
        
        this.#barUp.setAttribute("data-enabled", "false");
        this.#barDown.setAttribute("data-enabled", "false");
        
        const img = await Data.Image("/img/spr_ui12-12.png");
        
        uImg.src = img;
        dImg.src = img;
        
        uImgWrap.append(uImg);
        dImgWrap.append(dImg);
        
        this.#barUp.append(uImgWrap);
        this.#barDown.append(dImgWrap);
        
        this.#scrollBar.append(this.#barUp, this.#barDown);
        
        this.#loaded = true;
        
        Loop.Append(() => { this.Update(); });
    }
}


Data.Once("WhileDataLoading", () => {
    ScreenTrans.Set();
});

Data.Once("OnDataLoad", async () => {
    await ScrollBar.Set();
});