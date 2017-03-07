



$(document).ready(function() {
var wordCount = 20;
var bufferSize = 300;
var randomWords = [];
var wordsInUse = [];
var wordsForUse = [];
var isPlaying = false;
var requestCount = 0;
var savedCheckedWords = [];
var tenKWords = [];

tenKWords = wordPool.split(" ");

  refillBuffer();
  $("#start-btn").on("click", startGame);

  function refillBuffer(){
    randomWords = tenKWords.slice(0, bufferSize-1);
    tenKWords.splice(0, bufferSize-1);
    console.log("refillBuffer: "+randomWords.length+" "+tenKWords.length);

  }




  function startGame(){
    console.log("startGame");
    isPlaying = true;
    refreshWwords();

  }



  function showResult(){

    var checkedWords = getCheckedWords();
    $("#main-body").empty();


  }

  function refreshWwords(){
    updateSavedWords();

    if(randomWords.length < wordCount ){
    refillBuffer();
  }
    $("#main-body").empty();
    var wordGrid = getWordGrid();
    $("#main-body").append(wordGrid);
    addNextBtn();
  }

  function updateSavedWords(){
    savedCheckedWords = savedCheckedWords.concat(getCheckedWords());
    $("#word-count").html("Words: "+savedCheckedWords.length);
    console.log("savedCheckedWords: "+savedCheckedWords);
  }

  function addNextBtn(){
    var nextBtn = document.createElement("button");
    $(nextBtn).addClass('btn btn-default');
    $(nextBtn).html('Next');
    $(nextBtn).attr('id', 'next-primary');
    $(nextBtn).on('click', refreshWwords);
    $("#main-body").append(nextBtn);
  }

  function getWordGrid(){
    wordsInUse.length = 0;
    var loadingIcon = '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> ';
    var wordGridContainer = document.createElement("ul");
    $(wordGridContainer).addClass("word-grid flex-container jumbotron");
    $(wordGridContainer).attr("id", "word-grid-container");
    var wordsForUseLength = wordsForUse.length;


    //console.log(wordArr);
    for(var i = 0; i < wordCount; i ++){

      var word = randomWords[i];
      if(randomWords.length < wordCount){
        word = loadingIcon;
      } else{
        wordsInUse.push(word);
      }

      var wordGridItem = '  <li id="word-grid-item" class="checkbox "> '+
      ' <label class="btn-default btn" > <input type="checkbox"> '+word+' </label> </li> ';
      $(wordGridContainer).html($(wordGridContainer).html() + wordGridItem);

    }
      randomWords.splice(0, wordCount);
    return wordGridContainer;

  }

  function getCheckedWords(){
    var words = [];
      $("input:checked").each(function(){
        words.push($(this).parent().text());
          console.log("checkedWord: "+$(this).parent().text()+$(this).prop('checked'));

       });
       return words;
       console.log("checkedWords: "+words);
  }

});
