$(document).ready(function(){

	var vw = window.innerWidth-$(".toolbox").width()-50, 		//viewport width - toolbox & inner margin
		vh = window.innerHeight-$("header").height()-50,			//viewport height - header & inner margin
		gridSize,
		cellSize,
		canvasSize;
	
// live display of range input value
	$('#grid-size').next().html($('#grid-size').val());
	$('#grid-size').on("change mousemove", function() {
		$(this).next().html($(this).val());
	});
	
// GRID GENERATION
	function generateGrid(){
		$(".container").html("");
		for (var i = 0; i < gridSize; i++){
			$(".container").append("<tr class = 'row'></tr>")
		};

		$(".row").each(function(){
			for (var i = 0; i < gridSize; i++){
			$(this).append("<td class = 'cell'></td>")
			};
		});
		//determining littlest value for defining default zoom
		if (vw < vh){
			cellSize = Math.floor((vw/gridSize)/5.0) * 5;
		}
		if (vw > vh){
			cellSize = Math.floor((vh/gridSize)/5.0) * 5;
		}
		
	}
	function setCellSize (){
		$(".cell").css({
			"width" : cellSize-1,
			"height" : cellSize-1
		});
	}
	function setContainerSize(){
		$(".container").css("width", gridSize*cellSize+"px");
	}
	
	function generateNewGrid(){
		$(".presets").removeClass("pop");
		generateGrid();
		setCellSize();
		setContainerSize();
	}
	$(".generate").click(function(){
		gridSize = $("#grid-size").val();
		generateNewGrid();
	});

	
// NEW
	
	$(".new").click(function(){
		$(".prompt-new").addClass("pop");
		$(".prompt-new-yes").click(function(){
			$(".container").html("");
			$(".prompt-new").removeClass("pop");
			$(".presets").addClass("pop");
		});
		$(".prompt-new-no").click(function(){
			$(".prompt-new").removeClass("pop");
		});
	});
	
	
	// LOAD
	
	$(".load").click(function(){
		var drawingJSON = localStorage.getItem("drawing");
		var gridJSON = localStorage.getItem("gridSize");
		var drawing = JSON.parse(drawingJSON);
		gridSize = JSON.parse(gridJSON);
		if(drawing == null || gridSize == null){
			alert("Aucun dessin enregistré !");
			return;
		};
		generateNewGrid();
		var i = 0;
		$(".cell").each(function(){
			$(this).css("background-color",drawing[i]);
			i++;
		});
	});
	
// open tool drawer
	
	$(".open-toolbox").click(function(){
		$(".toolbox").toggleClass("shown");
		$(".wrapper").toggleClass("stretched");
		$(".open-toolbox__img").toggleClass("roto");
	});
	

	
		// TOOLBOX FUNCTIONS
	
//choosing color
//with colpick.js
	$('.colorPicker').colpick({							// it takes a HTML element and opens the color picker on click on it
		color:'#000000',
		submitText:'Deal with it!',
		onSubmit:function(hsb,hex,rgb,el) {
			$(el).css('background-color', '#'+hex);
			$(el).colpickHide();
		}
	})
	.css('background-color', '#000'); // not by library - sets div same color as chosen : reminder of what color is chosen
	
//zoom
	
	$(".zoomin").click(function(){
		if(cellSize >= 5 && cellSize < 50){
			cellSize+=5;
			setCellSize();
			setContainerSize();
		}
		if(cellSize == 2){
			cellSize = 5;
			setCellSize();
			setContainerSize();
			$(".cell").css("border", "1px solid #999");
		}
	});
	$(".zoomout").click(function(){
		if (cellSize < 10){
			cellSize = 2
			setCellSize();
			setContainerSize();
			$(".cell").css("border", "none");
		}
		if (cellSize >= 10){
			cellSize-=5;
			setCellSize();
			setContainerSize();
		}
	});
	
	
	// SAVE
	
	$(".save").click(function(){
		var drawing = [],
			currentCellColor;
		$(".cell").each(function(){
			currentCellColor = $(this).css("background-color");
			drawing.push(currentCellColor);
		});
		var drawingJSON = JSON.stringify(drawing);
		var gridJSON = JSON.stringify(gridSize);
		localStorage.setItem("drawing",drawingJSON);
		localStorage.setItem("gridSize",gridJSON);
		$(".save-confirm").addClass("save-anim");
		setTimeout(function(){
			$(".save-confirm").removeClass("save-anim");
		},2000);
	});
	
	

// HELP TOOLTIPS
// based on http://www.kriesi.at/archives/create-simple-tooltips-with-css-and-jquery
	
function tooltip(target_items, name){	
	$(target_items).each(function(i){
		$("body").append("<div class='"+name+"' id='"+name+i+"'><p>"+$(this).attr('help')+"</p></div>");
		var my_tooltip = $("#"+name+i);
		$(this).removeAttr("title").mouseover(function(){
			my_tooltip.fadeIn(0);
		}).mousemove(function(kmouse){
			my_tooltip.css({left:kmouse.pageX+15, top:kmouse.pageY-my_tooltip.height()-15});
		}).mouseout(function(){
			my_tooltip.fadeOut(0);
		});
	});
};
	
function deleteTooltip(){
	$(".tooltip").each(function(){
		$(this).remove();
	});
};

var help = 1;
$(".help").click(function(){
	if (help == 0){
		$(this).removeClass("help-active");
		deleteTooltip();
		help = 1;
	}else{
		$(this).addClass("help-active");
		tooltip(".tool, .new-toolbox, .save, .load-toolbox, .colorPicker, .help","tooltip");
		help = 0;
	};
});
	
//rendering image 
//with html2canvas.js which creates a canvas element from a HTML element and its content
	
	$("#btn-download").click(function(event){
		event.preventDefault();
		
		html2canvas($(".wrapper"), {
			onrendered: function(canvas) {
				
				document.body.appendChild(canvas); //makes canvas
				$("canvas").attr("id","dlcanvas"); //adds class to canvas
				
				//applies canvas to image
				var dataURL = canvas.toDataURL();
				$("#dlimg").src = dataURL;
				
				//makes dl button actually dl the image
				/*
Note for the future :
I would have preferred not to be forced to open a popup window but the other only method would have been quite "dirty" :
Since the rendering of image takes a few time, I would need a setTimeout to delay the "natural" function of the link which is to download the image, but the render time depends on the user's computer speed and it isn't possible to evaluate that time nor check when the render has finished.
I should then choose a precise amount of time for delaying, but not enough and the user will download an empty image, too much and (s)he will think it hasn't worked and click again, and I don't want this to happen, not user friendly.
The main problem with the popup method is that they are by default blocked by the browser and users don't really trust popups and sometimes don't even know how to show them anyway.
				*/
				$("#btn-download").attr("href",dataURL);
				window.open(dataURL);
			},
			background : undefined
		});
	});
	
//fill button - filling all the cells - BAD IDEA ?
	
	$(".fill").click(function(){
		var color = $(".colorPicker").css("background-color");
		$(".prompt-validation").addClass("visible");
		
		$(".prompt-yes").click(function(){
			$(".cell").css("background-color", color);
			$(".prompt-validation").removeClass("visible");
		})
		$(".prompt-no").click(function(){
			$(".prompt-validation").removeClass("visible");
		})
	})
	

//clear button - clear all the cells
	$(".clear").click(function(){
		$(".prompt-validation").addClass("visible");
		
		$(".prompt-yes").click(function(){
			$(".cell").css("background-color", "");
			$(".prompt-validation").removeClass("visible");
		})
		$(".prompt-no").click(function(){
			$(".prompt-validation").removeClass("visible");
		})
	})
	
	
	
	
	
	
	
		// DRAWING
	// presets
	
// brush/eraser
	$(".brush").click(function(){
		$(".brush").addClass("active");
		$(".eraser").removeClass("active");
	});
	$(".eraser").click(function(){
		$(".eraser").addClass("active");
		$(".brush").removeClass("active");
	});
	
// size
	$(".size-small").click(function(){
		$(".size-big").removeClass("active");
		$(".size-small").addClass("active");
	});
	$(".size-big").click(function(){
		$(".size-small").removeClass("active");
		$(".size-big").addClass("active");
	});
	
//checking if click is triggered
	var clicked = false;
	$(document).mousedown(function() {
		clicked = true;
	}).mouseup(function() {
		clicked = false; 
	});
	
// coloring function
	function draw(cell, color){
		$(cell).css("background-color", color);
		//brush size - if big then also colors adjacent cells
		if($(".size-big").hasClass("active")){
			var cellY = event.clientY,		// Y pos of pointer
				cellX = event.clientX		// X pos of pointer
			$(document.elementFromPoint(cellX, cellY-cellSize)).css("background-color", color);
			$(document.elementFromPoint(cellX+cellSize, cellY)).css("background-color", color);
			$(document.elementFromPoint(cellX, cellY+cellSize)).css("background-color", color);
			$(document.elementFromPoint(cellX-cellSize, cellY)).css("background-color", color);
		}
	}


//	function testDraw (event, test){
//		$(".container").on(event, ".cell", function(){		
//			if($(".brush").test){	
//				draw(this, $(".colorPicker").css("background-color"));
//			};
//			if($(".eraser").test){
//				draw(this, "");
//			};
//		});
//	}
//	testDraw("mouseover", 'hasClass("active") && clicked === true');
//	testDraw("mousedown", 'hasClass("active")');
	
	$(".container").on("mouseover", ".cell", function(){		
		if($(".brush").hasClass("active") && clicked === true){	
			draw(this, $(".colorPicker").css("background-color"));
		};
		if($(".eraser").hasClass("active") && clicked === true){
			draw(this, "");
		};
	});
	$(".container").on("mousedown", ".cell", function(){
		if($(".brush").hasClass("active")){	
			draw(this, $(".colorPicker").css("background-color"));
		};
		if($(".eraser").hasClass("active")){
			draw(this, "");
		};
	});

	
// END
});