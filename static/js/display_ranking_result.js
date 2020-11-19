var show_result_btn = document.getElementById("display_rank");
var display_result = function(){
    var seed_url = "";
    var table = document.getElementById("display_table").querySelector("tbody");
    var create_col = function(name,width){
        let col = document.createElement("td");
        col.textContent = name;
        let bootstrap_class = `col-${width}`;
        col.classList.add(bootstrap_class);
        col.style.wordBreak = "break-all";
        return col;
    };
    var create_row = function(rank, page_name, to, from){
        
        let row = document.createElement("tr");
        let rank_col = create_col(rank,1);
        let page_name_col = create_col(page_name,9);
        let to_col = create_col(to,1);
        let from_col = create_col(from,1);
        row.appendChild(rank_col);
        row.appendChild(page_name_col);
        row.appendChild(to_col);
        row.appendChild(from_col);
        if(page_name == seed_url){
            row.classList.add("table-warning");
        }
        row.classList.add("d-flex");
        return row;

    };
    var create_table_body = function(){
        
        let data = ranker_obj.get_data();
        console.log(data);
        seed_url = data.seed_url;
        let ranks = data.ranks;
        if(ranks.length ==0){
            return;
        }
        
        for(var i =0;i< ranks.length; i++){
            console.log(ranks[i]);
            let rank = i+1;
            let page_name = ranks[i].page_name;
            let to = ranks[i].to;
            let from = ranks[i].from;
            let row = create_row(rank, page_name, to, from);
            table.appendChild(row);
        }
    };
    var on_load = function(){
        create_table_body();
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
