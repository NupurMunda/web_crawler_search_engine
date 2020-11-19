var scrap_obj = function(){
    var page_limit = document.getElementById("page_limit");
    var range_slider =  document.getElementById("customRange");
    var scrapping_button = document.getElementById("scrapping_button");
    var show_result_btn = document.getElementById("show_result");
    var seed_url = document.getElementById("seed_url");
    var scrapping_progress_bar = document.getElementById("scrapping_progress");
    var scrapping_complete_div = document.getElementById("scrapping_complete");
    var scrapping_failed_div = document.getElementById("scrapping_failed");
    var seed_box_span = document.getElementById("error");
    var data = {};

    var set_data = function(resp_data, seed_URL){
      data = {"data": resp_data,
        "seed_url": seed_URL
      };
      return;
    };

    var get_data = function(){
      return data;
    };
    
    var make_get_api_call = async function(url, method="GET", data={}){
      if(method=="GET"){
        const response = await fetch('/start-scrapping');
        const final_result = await response.json();
        return final_result;
      }
      const response = await fetch('/start-scrapping', {method: 'POST', body: JSON.stringify(data), cache: "no-cache",
      headers: new Headers({
        "content-type": "application/json"
      })});
      const final_result = await response.json();
      
      return final_result;
    };
    var display_error= function(){
      seed_box_span.textContent = "fill the box";
      seed_url.style.border = "1px solid #f44336";
      return;
    };
    var change_page_limit = function(){
      page_limit.textContent = range_slider.value;
      return;
    };
    var toggle_display = function(element_to_display, element_to_hide){
      element_to_display.style.display = "block";
      element_to_hide.style.display = "none";
      console.log(element_to_display, element_to_hide);
      return;
    };
    var start_scrapping = async function(){
      const url = seed_url.value.trim();
      if(url.length == 0){
        display_error();
        return;
      }
      seed_box_span.textContent = "";
      seed_url.style.border = "1px solid #ced4d";
      scrapping_button.disabled = true;
      show_result_btn.disabled = true;
      let show_result_text = show_result_btn.querySelector("p").textContent;
      if(show_result_text == "Hide the Result"){
        show_result_btn.click();
      }
      //show_result_btn.textContent = "Show the Result";
      toggle_display(scrapping_progress_bar, scrapping_complete_div);
      toggle_display(scrapping_progress_bar, scrapping_failed_div);
      const api_end_point = '/start-scrapping';
      let data_to_send = {
        "seed_url": url,
        "max_iteration" : page_limit.textContent
      };
      const final_result = await make_get_api_call(api_end_point, "POST" , data_to_send );
      if(final_result.links.length ==0){
        toggle_display(scrapping_failed_div, scrapping_progress_bar);
        scrapping_button.disabled = false;
        return;
      }
      set_data(final_result, url);
      toggle_display(scrapping_complete_div , scrapping_progress_bar);
      scrapping_button.disabled = false;
      show_result_btn.disabled = false;
      return;

    };

    var on_load = function(){
      page_limit.textContent = range_slider.value;
      range_slider.addEventListener("change", change_page_limit);
      scrapping_button.addEventListener("click", start_scrapping);
    };
    return {
      on_load : on_load,
      get_data: get_data,
    };
  }();

  window.onload = scrap_obj.on_load();