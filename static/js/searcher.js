var search_obj = function(){
    var search_button = document.getElementById("search_button");
    var show_result_btn = document.getElementById("show_result");
    var search_query = document.getElementById("search_query");
    var searching_progress_bar = document.getElementById("searching_progress");
    var searching_complete_div = document.getElementById("searching_complete");
    var searching_failed_div = document.getElementById("searching_failed");
    var search_query_box_span = document.getElementById("error");
    var data = {};

    var set_data = function(resp_data, query){
      data = {"page_list": resp_data,
        "query": query
      };
      return;
    };

    var get_data = function(){
      return data;
    };
    
    var make_api_call = async function( data={}){

      const response = await fetch('/start_searching', {method: 'POST', body: JSON.stringify(data), cache: "no-cache",
      headers: new Headers({
        "content-type": "application/json"
      })});
      const final_result = await response.json();
      
      return final_result;
    };
    var display_error= function(){
        search_query_box_span.textContent = "fill the box";
      search_query.style.border = "1px solid #f44336";
      return;
    };

    var toggle_display = function(element_to_display, element_to_hide){
      element_to_display.style.display = "block";
      element_to_hide.style.display = "none";
      console.log(element_to_display, element_to_hide);
      return;
    };
    var empty_result = function(){
      
      const result_div_children = document.getElementById("display_searching_result");
      while (result_div_children.firstChild) {
        result_div_children.removeChild(result_div_children.lastChild);
      }
      return;
    };
    var start_searching = async function(){
      const query = search_query.value.trim();
      console.log(query);
      if(query.length == 0){
        display_error();
        return;
      }
      search_query_box_span.textContent = "";
      search_query.style.border = "1px solid #ced4d";
      search_button.disabled = true;
      show_result_btn.disabled = true;
      empty_result();
      toggle_display(searching_progress_bar, searching_complete_div); 
    //   let show_result_text = show_result_btn.querySelector("p").textContent;
    //   if(show_result_text == "Hide the Result"){
    //     show_result_btn.click();
    //   }
      //show_result_btn.textContent = "Show the Result";
    
    //   toggle_display(searching_progress_bar, searching_failed_div);
      let data_to_send = {
        "query": query
      };
      const final_result = await make_api_call( data_to_send );
      console.log(final_result.res.length);
      if(final_result.res.length ==0){
        toggle_display(searching_failed_div, searching_progress_bar);
        search_button.disabled = false;
        return;
      }
    set_data(final_result, query);
    
    
    toggle_display(searching_complete_div , searching_progress_bar);
      search_button.disabled = false;
      console.log(final_result);
      show_result_btn.disabled = false;
      return;

    };

    var on_load = function(){
      search_query.addEventListener("keyup", function(event){
          if(event.keyCode === 13){
            event.preventDefault();
            search_button.click();
          }
      });

      search_button.addEventListener("click", start_searching);
    };
    return {
      on_load : on_load,
      get_data: get_data,
    };
  }();

  window.onload = search_obj.on_load();