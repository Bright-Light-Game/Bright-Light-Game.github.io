Data.Once("WhileDataLoading", async () => {
    await FAQ.Init();
});


class FAQ
{
    static #loaded = false;
    
    static async Init ()
    {
        if (this.#loaded) return;
        
        await Data.LoadScript("https://cdn.jsdelivr.net/npm/marked/marked.min.js");
        
        const content = document.querySelector("#faq");
        
        const response = await fetch("/data/faq.json");
        const data = await response.json();
        
        for (let i = 0; i < data.length; i++)
        {
            if (data[i].question.length == null || data[i].answer.length == null) continue;
            
            const question = document.createElement("strong");
            const answer = document.createElement("blockquote");
            
            question.classList.add("faq-question");
            answer.classList.add("faq-answer");
            
            question.append(data[i].question);
            
            const parsedAnswer = marked.parse(data[i].answer, {
                headerIds : false,
                mangle : false
            });
            
            answer.insertAdjacentHTML("beforeend", parsedAnswer.trim());
            
            content.append(question, answer);
        }
        
        this.#loaded = true;
    }
}