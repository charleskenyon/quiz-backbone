// generate random question order
var questionOrder = [];

while (questionOrder.length != 10){
	var randomNum = Math.floor(Math.random() * 10);
	if (questionOrder.indexOf(randomNum) == -1) {
		questionOrder.push(randomNum);
	}
};

var bus = _.extend({}, Backbone.Events);

var questions = new Questions();
var score = new Score({score: 0, bus: bus});
var scoreView = new ScoreView({model: score, bus: bus});

questions.fetch({
    success: function(){
		successCallback();
	}
});

var successCallback = function() {
	questions.setOrder();
	
	var questionsView = new QuestionsView({model: questions, bus: bus});
	questionsView.render();
};