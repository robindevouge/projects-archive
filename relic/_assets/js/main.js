$(document).ready(function () {

	var story = [
		{
			"chapter": "0",
			"steps": [
				{"behaviour":"input","content": "Hello, what's your name?"},
				{"behaviour":"composed","content": "Hello ", "content2":"!"},
				{"behaviour":"simple","content": "If you see this message, the Internet has somehow disappeared."},
				{"behaviour":"choice","content": "Did you know the Internet?","choices": [
					{"content":"Yes","leadsToChapter":"1"},
					{"content":"No","leadsToChapter":"2"}
				]}
			]
		},
		{
			"chapter":"1",
			"steps": [
				{"behaviour":"video","content": "It was great, wasn't it?"},
				{"behaviour":"missing","content": "What do you miss the most?","options": [
					{"content":"The social networks","answer":"0"},
					{"content":"The entertainment","answer":"1"},
					{"content":"The wealth of informations","answer":"2"},
					{"content":"The overall craziness","answer":"3"},
				]},
				{"behaviour":"multiple","content": [
					{"answer":"Ah, Facebook, Twitter, Snapchat... The good old days of sharing everything. Don't forget that you still can! Spend time with the ones you love, share those great moments with them. It'll be as good, if not better. Plus, this time, the government won't be spying on you."},
					{"answer":"I could watch videos all day long too. And don't tell me about those games we used to spend hours on. There was something for everyone. But don't worry, there still is! There are millions of books to read, movies to watch, games to play or places to visit! You'll never run out of possibilities."},
					{"answer":"Ah yes. All the informations at the tip of your fingers. Millions of results in less than a second. This will be hard to top, but libraries are full of knowledge, and so are you and your surroundings. Share all that you can and you'll learn a lot in return!"},
					{"answer":"It was a big mess, for sure. A big charming and funny one though. But there are so many great things to do \"in real life\". Don't hesitate, go on an adventure, get crazy and you'll have the time of your life! "},
				]},
			]
		},
		{
			"chapter": "2",
			"steps": [
				{"behaviour":"simple","content": "Wow, I feel old now."},
				{"behaviour":"video","content": "That's what the Internet used to be, in a nutshell :"},
				{"behaviour":"simple","content": "All the computers could be connected to one another."},
				{"behaviour":"simple","content": "Sounds crazy, right?"},
				{"behaviour":"input","content": "What's \"the big thing\", nowadays?"},
				{"behaviour":"inputuse","content": "? That sounds nice. Maybe it’ll be the next internet!"}
			]
		},
		{
			"chapter": "3",
			"steps": [
				{"behaviour":"simple","content": "Actually, you might wonder who I am."},
				{"behaviour":"simple","content": "I am some kind of relic. I’m here to tell people about the internet. Some kind of “deluxe” 404 page."},
				{"behaviour":"simple","content": "You can call me Luke."},
				{"behaviour":"choice","content": "Do you know a bit about Internet’s history?","choices": [
					{"content":"Yes","leadsToChapter":"4"},
					{"content":"No","leadsToChapter":"5"}
				]}
			]
		},
		{
			"chapter": "4",
			"steps": [
				{"behaviour":"inputtest","content": "Nice! Little test for you then, what was the name of one of the creators of the web?"},
				{"behaviour":"passchapter","content": "Well played!","chapter":6},
				{"behaviour":"passchapter","content": "Nice try ! But actually","chapter":5},
			]
		},
		{
			"chapter": "5",
			"steps": [
				{"behaviour":"history","content": "It was a network of networks, accessible to the public. It was made popular with the apparition of the web, invented by Tim Berners-Lee and Robert Cailliau."},
				{"behaviour":"history","content": "It was originally conceived and developed to meet the demand for automatic information-sharing between scientists in universities and institutes around the world."},
				{"behaviour":"history","content": "In the end, it evolved in a more entertaining way and the majority of computers were connected to each other."},
				{"behaviour":"history","content": "But don’t mistake the web for the Internet ! The web was just an application of the internet, like mail, chat and peer to peer."},
				{"behaviour":"history","content": "It became so popular that almost 3 bilion people (40% of the worldwide population) accessed the internet every day all over the world."},
				{"behaviour":"passchapter","content": "The little history lesson is over! Thanks for reading!","chapter":"6"},
				{"behaviour":"passchapter","content": "Oh sorry! I got carried away.","chapter":"6"}
			]
		},
		{
			"chapter": "6",
			"steps": [
				{"behaviour":"simple","content": "Anyway, it was a pleasure talking to you."},
				{"behaviour":"simple","content": "The Internet might be over but there are still so many things to do !"},
				{"behaviour":"simple","content": "Discover the world, discover yourself, discover people, don't stop learning!"},
				{"behaviour":"composed","content": "Enjoy your life, ","content2":"!"},
				{"behaviour":"stop"}
			]
		},
	]


	//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||


	var currentChapter = 0,
		currentStep = 0,
		currentDisplayed,
		userInput,
		userName,
		userNameSet = 0,
		missingAnswer;


	//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||


	function getBehaviour() {
		switch (story[currentChapter].steps[currentStep].behaviour) {
		case "simple":
			bSimple();
			break;
		case "composed":
			bComposed();
			break;
		case "input":
			bInput();
			break;
		case "choice":
			bChoice();
			break;
		case "video":
			bVideo();
			break;
		case "missing":
			bMissing();
			break;
		case "multiple":
			bMultiple();
			break;
		case "inputuse":
			bInputUse();
			break;
		case "inputtest":
			bInputTest();
			break;
		case "passchapter":
			bPassChapter();
			break;
		case "history":
			bHistory();
			break;
		case "stop":
			bStop();
			break;
		default:
			console.log('error : unknown behaviour');
		}
	}

	//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

	function bSimple() {
		currentDisplayed = story[currentChapter].steps[currentStep].content

		relicSay(function () {
			currentStep++;
			setTimeout(relicReset, 1500);
		});
	}

	function bComposed() {
		if (userNameSet == 0) {
			userName = userInput;
			userNameSet = 1;
		}
		currentDisplayed = story[currentChapter].steps[currentStep].content + userName + story[currentChapter].steps[currentStep].content2;

		relicSay(function () {
			currentStep++;
			setTimeout(relicReset, 1500);
		});
	}

	function bInput() {
		currentDisplayed = story[currentChapter].steps[currentStep].content;
		relicSay(function () {
			$('.container').append('<input type="text" class="input" placeholder="Type it here"><button class="button ok">OK</button>');
			$('.input').focus();
			$('.input').off("keyup, click");
			$('.input').on("keyup", function (e) {
				if (e.which == 13) {
					userInput = $('.input').val();
					$('.input').val("");
					$('.input, .ok').remove();
					currentStep++;
					relicReset();
				}
			});
			$('.ok').on("click", function () {
				userInput = $('.input').val();
				$('.input').val("");
				$('.input, .ok').addClass('hidden');
				currentStep++;
				relicReset();
			});
		});

	}

	function bChoice() {
		currentDisplayed = story[currentChapter].steps[currentStep].content;
		relicSay(function () {
			for (var i = 0; i < story[currentChapter].steps[currentStep].choices.length; i++) {
				$('.button_container').append("<button class='button choice' data-leadsToChapter='" + story[currentChapter].steps[currentStep].choices[i].leadsToChapter + "'>" + story[currentChapter].steps[currentStep].choices[i].content + "</button>");
			}
			$('.choice').click(function () {
				currentChapter = $(this).data('leadstochapter');
				currentStep = 0;
				$('.choice').remove();
				relicReset();
			});
		});

	}

	function bVideo() {

		currentDisplayed = story[currentChapter].steps[currentStep].content;
		relicSay(function () {
			setTimeout(function () {
				$('.container').append("<video class='video' poster='_assets/img/relic-poster.jpg'><source src='_assets/img/relic-video.webm'><source src='_assets/img/relic-video.mp4'></video>");
				$('.video').get(0).play()
				$('.video').on('ended click', function () {
					currentStep++;
					$('.video').fadeOut(1500, function () {
						$('.video').remove();
						relicReset();
					})
				});
			}, 500);
		});


	}

	function bMissing() {
		currentDisplayed = story[currentChapter].steps[currentStep].content;
		relicSay(function () {
			for (var i = 0; i < story[currentChapter].steps[currentStep].options.length; i++) {
				$('.more_button_container').append("<button class='button missing' data-answer='" + story[currentChapter].steps[currentStep].options[i].answer + "'>" + story[currentChapter].steps[currentStep].options[i].content + "</button>");
			}
			$('.missing').click(function () {
				missingAnswer = $(this).data('answer')
				$('.missing').remove();
				currentStep++;
				relicReset();
			});
		});


	}

	function bMultiple() {
		currentDisplayed = story[currentChapter].steps[currentStep].content[missingAnswer].answer;
		relicSay(function () {
			currentChapter = 3;
			currentStep = 0;
			setTimeout(relicReset, 1000);
		});
	}

	function bInputUse() {
		currentDisplayed = userInput + story[currentChapter].steps[currentStep].content;
		relicSay(function () {
			currentChapter = 3;
			currentStep = 0;
			setTimeout(relicReset, 1000);
		});
	}

	function bInputTest() {
		currentDisplayed = story[currentChapter].steps[currentStep].content
		relicSay(function () {
			$('.container').append('<input type="text" class="input" placeholder="Type it here"><button class="button ok hidden">OK</button>');
//			$('.input, .ok').removeClass('hidden');
			$('.input').focus();
			$('.input').off("keyup, click");
			$('.input').on("keyup", function (e) {
				if (e.which == 13) {
					userInput = $('.input').val().toLowerCase();
					$('.input').val("");
					$('.input, .ok').remove();
					if (userInput == "tim berners lee" || userInput == "tim berners-lee" || userInput == "robert cailliau") {
						currentStep = 1;
					} else {
						currentStep = 2;
					}
					relicReset();
				}
			});
			$('.ok').on("click", function () {
				userInput = $('.input').val().toLowerCase();
				//					$('.input').val("");
				$('.input, .ok').addClass('hidden');
				if (userInput == "tim berners lee" || userInput == "tim berners-lee" || userInput == "robert cailliau") {
					currentStep = 1;
				} else {
					currentStep = 2;
				}
				relicReset();
			});
		});
	}


	function bPassChapter() {
		currentDisplayed = story[currentChapter].steps[currentStep].content
		relicSay(function () {
			currentChapter = story[currentChapter].steps[currentStep].chapter;
			currentStep = 0;
			setTimeout(relicReset, 1500);
		})
	}

	function bHistory() {
		currentDisplayed = story[currentChapter].steps[currentStep].content;
		$('.button_container').append("<button class='button continue'>Continue</button><button class='button stop'>Stop</button>");

		$('.stop').click(function () {
			$('.stop, .continue').remove();
			currentStep = 6;
			relicReset();
		})
		relicSay(function () {
			$('.continue').click(function () {
				$('.stop, .continue').remove();
				currentStep++;
				relicReset();
			})
		})

	}

	function bStop() {
		$('.splash').removeClass('fadeOut');
	}


	//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||


	function relicReset() {
		$("#text").typed('reset');
	};

	function relicSay(callbackFunction) {
		$("#text").typed({
			strings: [currentDisplayed],
			typeSpeed: 0,
			backDelay: 500,
			loop: false,
			contentType: 'html', // or text
			// defaults to false for infinite loop
			loopCount: false,
			callback: callbackFunction,
			resetCallback: getBehaviour
		});

	};

	//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

	setTimeout(function () {
		$('.splash').addClass('fadeOut');
	}, 1000)
	setTimeout(function () {
		getBehaviour();
	}, 2500)




});