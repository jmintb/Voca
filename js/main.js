



$(document).ready(function() {
var wordCount = 40;
var bufferSize = 300;
var randomWords = [];
var wordsInUse = [];
var wordsForUse = [];
var isPlaying = false;
var requestCount = 0;
var savedCheckedWords = [];
var tenKWords = [];
var colors = ['red', 'blue', 'orange', 'yellow', 'cyan', 'brown', 'crimson', 'green', 'purple', 'black', 'crimson'];


  refillBuffer();
  $("#start-btn").on("click", startGame);
  $('#stats-btn').on('click', showStats);



  if(localStorage.savedCheckedWords != undefined && localStorage.savedCheckedWords.indexOf(',') != -1){
    for (var i = 0; i < localStorage.savedCheckedWords.split(',').length; i++) {
      savedCheckedWords.push(localStorage.savedCheckedWords.split(',')[i]);
    }
  console.log("savedWords: "+localStorage.savedCheckedWords+' '+savedCheckedWords);

}

unfilteredTenKWords = wordPool.split(' ');

for (var i = 0; i < unfilteredTenKWords.length; i++) {
  unfilteredTenKWords[i] = unfilteredTenKWords[i].replace(/\s/g, '');
}

tenKWords = unfilteredTenKWords.filter(function(word){
  if(savedCheckedWords.join(',').includes(word.replace(/\s/g, ''))){
  console.log("word: "+word);
}
  return !savedCheckedWords.join(',').includes(word.replace(/\s/g, ''));
});


  updateSavedWords();

  function refillBuffer(){
    randomWords = tenKWords.slice(0, bufferSize-1);
    tenKWords.splice(0, bufferSize-1);
    console.log("refillBuffer: "+randomWords.length+" "+tenKWords.length);

  }




  function startGame(){
    console.log("startGame");
    isPlaying = true;
    refreshWwords();
    $("#start-btn").blur();

  }

  function showStats(){
    $('#stats-btn').blur();
    $("#main-body").empty();
    var stats =  getStats();
    var circleSectors = [];
    var sector = document.createElement('div');
    var degSum = 0;
    var linePosition = 0;
    for(i = 0; i<stats.length; i++){
      if(stats[i] <= 0){
      var deg = 0;
    } else {
       var deg = (stats[i]/savedCheckedWords.length)*360;
       console.log("deg: "+deg+" "+degSum+" "+(stats[i]/savedCheckedWords.length)+" "+savedCheckedWords.length+" "+stats[i]);
       var divLine = document.createElement('div');
       var innerLine = document.createElement('div');
       $(innerLine).addClass('innerLine');
       $(divLine).addClass('line');
       $(divLine).css('transform', 'rotate('+(degSum+(deg/2))+'deg)');
       var descriptionRot =    -degSum-(deg/2);
       $(divLine).html('<p class="description" style="transform:rotate('+(descriptionRot)+'deg); white-space: nowrap;"> '+((i+1)+' letters '+ ((stats[i]/savedCheckedWords.length*100).toPrecision(3)))+'% </p>');
       $(innerLine).css('transform', 'rotate('+(degSum+(deg/2)-0.3)+'deg)');

       if(deg > 180){
         deg -= 180;
         var bigDiv = document.createElement('div');
         $(bigDiv).addClass('pie');
         var bigInnerDiv = document.createElement('div');
         $(bigInnerDiv).addClass(' pieBefore');
         $(bigInnerDiv).css("transform", "rotate("+180+"deg)");
         $(bigInnerDiv).css('background-color', colors[i]);
         $(bigDiv).append(bigInnerDiv);
         $(bigDiv).css('transform', 'rotate('+(degSum)+'deg)');
         circleSectors.push(bigDiv);
         degSum += 180;

       }
        var div = document.createElement('div');
        $(div).addClass("pie");
        var innerDiv = document.createElement('div');
        $(innerDiv).addClass("pieBefore");
        $(innerDiv).css("transform", "rotate("+deg+"deg)");
        $(innerDiv).css('background-color',colors[i]);
        $(div).append(innerDiv);
        if(degSum > 108){
        $(div).css('transform', 'rotate('+(degSum)+'deg)');
      } else{
        $(div).css('transform', 'rotate('+(degSum)+'deg)');
      }


      circleSectors.push(innerLine);
      circleSectors.push(divLine);

        degSum += deg;
        console.log("deg: "+JSON.stringify($(divLine).offset()));

        circleSectors.push(div);

      }
    }

    $('#main-body').append(circleSectors);

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
    getStats();
  }

  function updateSavedWords(){
    savedCheckedWords = savedCheckedWords.concat(getCheckedWords());
    localStorage.savedCheckedWords = savedCheckedWords.join(',');
    $("#word-count").html("Words: "+savedCheckedWords.length);
    console.log("savedCheckedWords: "+savedCheckedWords.length+" localStorage: "+localStorage.savedCheckedWords);
  }

  function addNextBtn(){
    var nextBtn = document.createElement("button");
    $(nextBtn).addClass('btn btn-primary');
    $(nextBtn).html('Next');
    $(nextBtn).attr('id', 'next-btn');
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
      ' <label id="word-grid-label" class="btn-default btn" > <input id="checkbox-input" type="checkbox"> '+word+' </label> </li> ';
      $(wordGridContainer).html($(wordGridContainer).html() + wordGridItem);

    }
      randomWords.splice(0, wordCount);
    return wordGridContainer;

  }

  function getStats(){
    var maxWordLength = 10;
    var wordCountsFromLength = [];
    for(var i = 0; i <= maxWordLength; i ++){
      var filtered = savedCheckedWords.filter(function(word){
        var wordCleaned = word.replace(/\s/g, '');
        return wordCleaned.length == i+1;
      });
      console.log("stat: "+i+" "+filtered);
      wordCountsFromLength.push(filtered.length);
    }
    console.log('stats: '+wordCountsFromLength);
    return wordCountsFromLength;
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
