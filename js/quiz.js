/**
 * Quiz controls and functions
 */
$(document).ready(function(){
	var content = $("#content");
	var quiz_name = $("#new-quiz-name");	
	var quiz_question = $("#new-quiz-question");	
/**----------------------
 *    UI FUNCTIONS
------------------------*/
	loadHome();
	function loadQuiz(id){ 
		//set up views
		$("#quiz-view").show();
		$("#home-view").hide();
		$('#live-thankyou').hide(); 
		//get quiz from db
		var current = fetchQuiz(id);
		//set the quiz name
		$("#live-name").text(current.name);
		$("#live-name").attr('data-quiz-id',id);
		$("#live-question").text("Q: "+current.question);
		bindListeners();
	}
	function showResults(id){ 

		//get quiz from db
		var current = fetchQuiz(id);
		console.log(current); 
	}
	function loadHome(){
		//set up views
		$("#quiz-view").hide();
		$("#home-view").show();
		
		//set up DB
		var quizs = store.get('quizlist');	
		if(quizs==null)
		{
			alert("creating new quiz list");
			store.set('quizlist', [{name:'Example Quiz'}]);
		}
		//refresh the quiz list
		refreshList();
		bindListeners(); 
	}
/**----------------------
 *    BUTTON LISTENERS
------------------------*/
	function bindListeners(){
	/**
	 * listener for new quiz button
	 */
	$("#quiz-controls .new").click(function(){
		var name = quiz_name.val()
		var question = quiz_question.val()
		if(name =='' || question == '')
		{
			alert('Please enter valid quiz parameters');
		}
		else
		{
			createQuiz(name,question);
			refreshList();
		}
	});
	/** 
	 * listener clear list button
	 */
	$("#list-wrapper .clear").click(function(){
		var answer = confirm("Delete all quiz's?")
		if (answer){
			store.set('quizlist',[]);
			refreshList();
			bindListeners();
		}
		else{
		}
	});
	
	/**-------------------------------
	 * listener sform quiz list items 
	 ------------------------------*/
	$(".quiz-link").click(function(){
		var link = $(this).attr('data-quiz');
		loadQuiz(link);
	});
	$(".quiz-results").click(function(){
		var link = $(this).attr('data-quiz');
		showResults(link);
	});
	/**
	 * listener for answering
	 */
	$("#live-answer-button").click(function(){
		$('#live-inputs').show();
		$('#live-thankyou').hide(); 
	});
	/**
	 * listener for live submition
	 */
	$("#live-submit").click(function(){
		var _name = $("#live-name-input").val();
		var _answer = $("#live-answer").val();
		//log
		console.log(_name);
		console.log(_answer);
		if(_answer == '' || _name == '')
		{
			alert("Please answer all fields");	
		}
		else
		{
			//insert answer
			var id = $("#live-name").attr('data-quiz-id');
			insertAnswer(id,{name:_name,answer:_answer})
			//clear the inputs
			$('#live-inputs input').val('');
			$('#live-inputs').hide();
			$('#live-thankyou').show();
		} 
	});
	/**
	 * Listen for finish quiz click
	 */
	$("#live-finish-button").click(function(){
		loadHome();
	});
	}
});  
/**----------------------
 *    DB FUNCTIONS
 ------------------------*/
function insertAnswer(id, answer){
	console.log(answer);
	var quizs = store.get('quizlist');
	console.log(quizs);
	var i = 0; 
	var marker = -1;
	for(i = 0; i < quizs.length ; i++)
	{
		if(quizs[i].id = id)
			marker = i;
	}
	if(marker>-1)
	{
		$.merge(quizs[marker].answers, [answer]);
		store.set('quizlist',quizs);
		console.log("updating quizlist");
	}
	
}
/**
 * create a unique id
 */
function uniqueId(){
var newDate = new Date;
return newDate.getTime();
}
/**
 * insert quiz into db
 */
function createQuiz(_name,_question){
	var current_list = store.get('quizlist');
	var time = uniqueId();
	console.log(time);
	var new_quiz =  [{id: time, name:_name, question:_question, answers:[]}];
	var new_list = $.merge( current_list, new_quiz );
	console.log("inside createQuiz");
	console.log(new_list);
	store.set('quizlist', new_list);
}
/**
 * fetch quiz from db
 */
function fetchQuiz(id){
	var quizs = store.get('quizlist');
	var i = 0; 
	for(i = 0; i < quizs.length ; i++)
	{
		if(quizs[i].id = id)
			return quizs[i];
	}
	return null;
}
/**
 * Load quizs from DB into listview
 */
function refreshList(){
	var list = $("#quiz-list");
	list.empty();

	var str = '';
	var quizs = store.get('quizlist');
	var i = 0; 
	for(i = 0; i < quizs.length ; i++)
	{
		var current = quizs[i];
		var answer_count = current.answers == null ? 0 : current.answers.length; 
		str += '<li data-corners="true">';
		str += '<a class="quiz-link" data-quiz="'+current.id+'">';
		str += '<h3 class="ui-li-heading">'+current.name+'</h3>';
		str += '<p class="ui-li-desc">'+current.question+'</p>';
		str += '<span class="ui-li-count ui-btn-up-c ui-btn-corner-all">'+answer_count+'</span>';
		str += '</a>';
		str += '<a data-split-icon="info" data-icon="info" data-quiz="'+current.id+'" class="quiz-results"></a>' 
		str += '</li>';
	}
	list.append(str);
	list.listview( "refresh" );
}
