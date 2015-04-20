var Question = Backbone.Model.extend({
	
	urlRoot: "questions.json"

});

var Score = Backbone.Model.extend({
	
	initialize: function(options) {
		this.bus = options.bus;
		
		this.bus.on("scorePlusOne", this.plusOne);
		this.bus.on("scoreMinusOne", this.minusOne);
	},
	
	plusOne: function() {
		score.attributes.score++;
	},
	
	minusOne: function() {
		score.attributes.score--;
	}
	
});

var Questions = Backbone.Collection.extend({
	
	model: Question,
	
	url: "questions.json",
	
	parse: function(response){
		return response.questions;
    },
	
	setOrder: function() {
		this.forEach(function(model, i) {
			model.set({"order": questionOrder[i]})
			
			var questionNumber = model.get("order") + 1;
			model.set({"number": questionNumber});
		});
		
		this.comparator = "order";
		
		this.sort();
	}
	
});

var currentModel = 0;