var show_result_btn = document.getElementById("show_result");
var display_result = function(){
    var result_div = document.getElementById("display_searching_result");
    var create_element = function(type, name, classes){
        let element = document.createElement(type);
        element.textContent = name;
        element.className = classes;
        return element;
    };
    var create_card_row = function(name, words, url){
        
        let div = document.createElement("div");
        div.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <p class="card-text">Words Present : </p>
            <div class="border bg-light p-4 m-2 word_list">
              
            </div>

            <a href="${url}" class="btn btn-info d-flex justify-content-center" target="_blank">Visit Url</a>
        `;

        words.forEach(function(word){
            let word_ele = create_element("span",word,"border border-secondary mr-4 p-2" );
            div.querySelector(".word_list").appendChild(word_ele);
        });
        
        div.classList.add("card");
        div.classList.add("my-2");
        div.classList.add("px-py-3");
        return div;

    };
    var create_searched_result_list = function(){
        
        let data = search_obj.get_data();
        console.log(data);
        //document.getElementById("user_query").textContent = data.query;
        let page_list = data.page_list.res;
        //remove res later
        let title = "Query : " + data.query;
        let heading = create_element("h4", title, "sticky-top bg-info py-3 px-3 text-light");

        result_div.appendChild(heading);
        page_list.forEach(function(page_info){
            let name = page_info.page_name;
            let words = page_info.words;
            let url = page_info.page;
            var card = create_card_row(name, words, url);
            result_div.appendChild(card);

        });
        return;

    };
    var on_load = function(){

        create_searched_result_list();

        if(show_result_btn.textContent.trim() == "Show Result"){
            show_result_btn.textContent = "Hide Result";
        }
        else{
            show_result_btn.textContent = "Show Result";
        }
    };
    return {
        on_load: on_load
    };
}();

show_result_btn.onclick = display_result.on_load;
