var QuestionView = Backbone.View.extend({
	
	render: function(){
		var template = $("#questionsTemplate").html();
		var html = Mustache.render(template, this.model.toJSON());
		this.$el.html(html);
		
		return this;
	}
	
});

var QuestionsView = Backbone.View.extend({
	
	el: "#container1",
	
	events: {
		"click #next": "nextQuestion",
		"click #prev": "prevQuestion"
	},
	
	initialize: function(options) {
		this.bus = options.bus;
	},
	
	render: function(){
		this.$el.html("");
		
		var questionView = new QuestionView({model: questions.at(currentModel)});
		this.$el.append(questionView.render().$el);
		
		if (currentModel == 9)
			$("#next").html("Finish...");
		
		return this;
	},
	
	checkChecked: function(counter){
		$("input").each(function() {
			var checkString = "checked" + this.value;
			if (this.checked) {
				questions.at(currentModel).set(checkString, true);
				counter++;
			} else {
				questions.at(currentModel).set(checkString, false);
			}
		});
		return counter;
	},
	
	updateScore: function(){
		var triggerBus = this.bus;
		$("input").each(function() {
			if (this.checked && this.value == questions.at(currentModel).get("correctAnswer") + 1) 
				triggerBus.trigger("scorePlusOne");
		});
	},
	
	nextQuestion: function(e){
		var validateAnsweredCounter = 0;
		validateAnsweredCounter = this.checkChecked(validateAnsweredCounter);
		
		if (validateAnsweredCounter == 0) {
			alert("Please give an answer!");
			e.target.blur();
			return 
		} else {
			this.updateScore();
			e.stopPropagation();
			if (currentModel != 9) {
				currentModel++;
				this.render();
			} else {
				this.bus.trigger("finalScoreRender");
			}
		};
	},
	
	prevQuestion: function(e){
		e.target.blur();
		if (currentModel == 0)
			return;
		
		this.checkChecked();
		
		if (score.get("score") != 0)
			this.bus.trigger("scoreMinusOne");
		
		e.stopPropagation();
		currentModel--;
		this.render();
	}
})

var ScoreView = Backbone.View.extend({
	
	el: "#container1",
	
	initialize: function(options) {
		this.bus = options.bus;
		
		this.bus.on("finalScoreRender", this.render, this);
	},
	
	render: function(){
		var template = $("#endTemplate").html();
		var html = Mustache.render(template, this.model.toJSON());
		this.$el.html(html);
		
		return this;
	}
});