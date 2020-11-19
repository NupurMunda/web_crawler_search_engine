var ranker_obj = function(){

    var ranking_button = document.getElementById("ranking_button");
    var ranking_progress_bar = document.getElementById("ranking_progress");
    var ranking_complete_div = document.getElementById("ranking_complete");
    var ranking_failed_div = document.getElementById("ranking_failed");
    var show_result_btn = document.getElementById("display_rank");
    var ranks = {};
    var seed_url = "";
    var data = {};

    var set_data = function(resp_data){
      // ranks = resp_data.ranks;
      // seed_url = resp_data.seed_url;
      data = resp_data;
      return;
    };

    var get_data = function(){
      return data;
    };
    
    var make_get_api_call = async function(url){
      const response = await fetch(url);
      const final_result = await response.json();
      return final_result;      
    };

    var toggle_display = function(element_to_display, element_to_hide){
      element_to_display.style.display = "block";
      element_to_hide.style.display = "none";
      return;
    };
    var check_empty_response = function (response){
      return Object.keys(response).length === 0 && response.constructor === Object;
    };

    var start_ranking = async function(){
      ranking_button.disabled = true;
      if(show_result_btn.textContent.trim()  == "Hide Result"){
        show_result_btn.click();
      }
      show_result_btn.disabled = true;
      
      toggle_display(ranking_progress_bar, ranking_complete_div);
      const api_end_point = '/start-ranking';
      const final_result = await make_get_api_call(api_end_point);
      console.log(final_result);
      if(final_result.ranks.length == 0){
        toggle_display(ranking_failed_div , ranking_progress_bar);
        ranking_button.disabled = false;
        return;
      }
      set_data(final_result);
      toggle_display(ranking_complete_div , ranking_progress_bar);
      ranking_button.disabled = false;
      show_result_btn.disabled = false;
      return;

    };
    var on_load = function(){
      ranking_button.addEventListener("click", start_ranking);
    };
    return {
      on_load : on_load,
      get_data: get_data,
    };
  }();

  window.onload = ranker_obj.on_load();