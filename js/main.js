



$(document).ready(function() {
var wordCount = 40;
var bufferSize = 300;
var randomWords = [];
var wordsInUse = [];
var wordsForUse = [];
var isPlaying = false;
var requestCount = 0;

  refillBuffer();
  $("#start-btn").on("click", startGame);

  function refillBuffer(){
    for (var i = (bufferSize - randomWords.length); i >= 0; i--) {
      getRandomWord();
      console.log("randomWord: "+randomWords.length);

      if(randomWords.length >= bufferSize || requestCount >= bufferSize){
        console.log("break");
      break;
    }
  }
  }
  //getCheckedWords();



  function getRandomWord(){
    var API_URL = "http://randomword.setgetgo.com/get.php";
      $.get(API_URL, randomWordReceived, "jsonp");
      requestCount ++;


  }

  function randomWordReceived(data){
    console.log("randomWord randomWordReceived: "+randomWords.length+" "+wordsForUse.length+ " "+wordsInUse.length);
    requestCount --;
    if(randomWords.indexOf(data.Word) == -1){
      randomWords.push(data.Word);
    }

    if (wordsForUse.length < wordCount) {
      wordsForUse.push(data.Word);
    } else if(wordsInUse.length < wordCount && wordsForUse.length >= wordCount && isPlaying){
      refreshWwords();
    }



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

    if(randomWords.length >= wordCount && wordsForUse.length < wordCount){
      wordsForUse = randomWords.slice(0, wordCount);
      randomWords = randomWords.splice(wordCount-1, randomWords.length-1);
    } else{
    refillBuffer();
  }
    $("#main-body").empty();
    var wordGrid = getWordGrid();
    $("#main-body").append(wordGrid);
    addNextBtn();
  }

  function addNextBtn(){
    var nextBtn = document.createElement("button");
    $(nextBtn).addClass('btn btn-default');
    $(nextBtn).html('Next');
    $(nextBtn).attr('id', 'next-primary');
    $(nextBtn).on('click', refreshWwords);
    $("#main-body").append(nextBtn);
    if(wordsInUse.length != 0) randomWords.splice(0, wordCount-1);
    refillBuffer();
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

      var word = wordsForUse[i];
      if(wordsForUseLength < wordCount){
        word = loadingIcon;
      } else{
        wordsInUse.push(word);
      }

      var wordGridItem = '  <li id="word-grid-item" class="checkbox "> '+
      ' <label class="btn-default btn" > <input type="checkbox"> '+word+' </label> </li> ';
      $(wordGridContainer).html($(wordGridContainer).html() + wordGridItem);
    //  randomWords.splice(i, 1);
    }

    console.log("in use: "+wordsInUse.length);
    if(wordsForUse.length >= wordCount){
      wordsForUse.length = 0 ;
    }

    return wordGridContainer;

  }

  function getCheckedWords(){
    var words = [];
      $("input:checked").each(function(){
        words.push($(this).parent().text());
          //console.log("checkedWord: "+$(this).parent().html()+$(this).prop('checked'));

       })
       console.log("checkedWords: "+words);
  }

});
