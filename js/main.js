/* ===================================================================
 * Howdy - Main JS
 *
 * ------------------------------------------------------------------- */ 

(function($) {

	"use strict";

	var cfg = {		
		defAnimation   : "fadeInUp",    // default css animation		
		scrollDuration : 800,           // smoothscroll duration
		statsDuration  : 4000           // stats animation duration
	},	
	$WIN = $(window);

	
	/* Preloader 
	 * -------------------------------------------------- */
	var ssPreloader = function() {

		$WIN.on('load', function() {	

			// force page scroll position to top at page refresh
			$('html, body').animate({ scrollTop: 0 }, 'normal');

	      // will first fade out the loading animation 
	    	$("#loader").fadeOut("slow", function(){

	        // will fade out the whole DIV that covers the website.
	        $("#preloader").delay(300).fadeOut("slow");

	      }); 
	  	});
	}; 


	/* FitVids
	------------------------------------------------------ */ 
	var ssFitVids = function() {
		$(".fluid-video-wrapper").fitVids();
	};  		

   
	/*	Masonry
	------------------------------------------------------ */
	var ssMasonryFolio = function() {

		var containerBricks = $('.bricks-wrapper');

		containerBricks.imagesLoaded( function() {
			containerBricks.masonry( {	
			  	itemSelector: '.brick',
			  	resize: true
			});
		});
	};


	/*	Light Gallery
	------------------------------------------------------- */
	var ssLightGallery = function() {

		$('#folio-wrap').lightGallery({  
			showThumbByDefault: false,
			hash: false,
			selector: ".item-wrap"		
		});
	};


  	/* Menu on Scrolldown
	 * ------------------------------------------------------ */
	var ssMenuOnScrolldown = function() {

		var menuTrigger = $('#header-menu-trigger');

		$WIN.on('scroll', function() {

			if ($WIN.scrollTop() > 150) {				
				menuTrigger.addClass('opaque');
			}
			else {				
				menuTrigger.removeClass('opaque');
			}

		}); 
	};

	
  	/* OffCanvas Menu
	 * ------------------------------------------------------ */
   var ssOffCanvas = function() {

	       var menuTrigger = $('#header-menu-trigger'),
	       nav             = $('#menu-nav-wrap'),
	       closeButton     = nav.find('.close-button'),
	       siteBody        = $('body'),
	       mainContents    = $('section, footer');

		// open-close menu by clicking on the menu icon
		menuTrigger.on('click', function(e){
			e.preventDefault();
			menuTrigger.toggleClass('is-clicked');
			siteBody.toggleClass('menu-is-open');
		});

		// close menu by clicking the close button
		closeButton.on('click', function(e){
			e.preventDefault();
			menuTrigger.trigger('click');	
		});

		// close menu clicking outside the menu itself
		siteBody.on('click', function(e){		
			if( !$(e.target).is('#menu-nav-wrap, #header-menu-trigger, #header-menu-trigger span') ) {
				menuTrigger.removeClass('is-clicked');
				siteBody.removeClass('menu-is-open');
			}
		});

   };


  /* Smooth Scrolling
	* ------------------------------------------------------ */
	var ssSmoothScroll = function() {

		$('.smoothscroll').on('click', function (e) {
			var target = this.hash,
			$target    = $(target);
	 	
		 	e.preventDefault();
		 	e.stopPropagation();	   	

	    	$('html, body').stop().animate({
	       	'scrollTop': $target.offset().top
	      }, cfg.scrollDuration, 'swing').promise().done(function () {

	      	// check if menu is open
	      	if ($('body').hasClass('menu-is-open')) {
					$('#header-menu-trigger').trigger('click');
				}

	      	window.location.hash = target;
	      });
	  	});

	};


  /* Placeholder Plugin Settings
	* ------------------------------------------------------ */
	var ssPlaceholder = function() {
		$('input, textarea, select').placeholder();  
	};


  /* Stat Counter
  	*------------------------------------------------------- */
  	var ssStatCounter = function() {

	   var statSection = $("#stats"),
	   stats           = $(".stat-count");

	   // Initialize: Get target values from data-target attribute and ensure starting at 0
	   stats.each(function() {
		   var $this = $(this);
		   var targetValue = parseInt($this.data('target')) || 0;
		   
		   // Store target value
		   $this.data('target-value', targetValue);
		   
		   // Ensure it starts at 0
		   $this.text('0');
	   });

	   statSection.waypoint({
	   	handler: function(direction) {

	      	if (direction === "down") { 
				   stats.each(function () {
					   var $this = $(this);
					   
					   // Skip if already animated
					   if ($this.data('animated')) {
						   return;
					   }
					   
					   $this.data('animated', true);
					   var targetValue = $this.data('target-value') || parseInt($this.data('target')) || 0;

					   // Animate from 0 to target value
					   $({ Counter: 0 }).animate({ Counter: targetValue }, {
					   	duration: cfg.statsDuration,
					   	easing: 'swing',
					   	step: function (curValue) {
					      	$this.text(Math.ceil(curValue));
					    	},
					   	complete: function() {
					   		$this.text(targetValue); // Ensure final value is exact
					   	}
					  	});
					});
	       	} 

	       	// trigger once only
	       	this.destroy(); 
			},	
			offset: "75%"	// Trigger when section is 75% visible
		});

  	};


  	/* Alert Boxes
  	------------------------------------------------------- */
  	var ssAlertBoxes = function() {

  		$('.alert-box').on('click', '.close', function() {
		  $(this).parent().fadeOut(500);
		}); 

  	};	  	
	

  /* Animations
	* ------------------------------------------------------- */
	var ssAnimations = function() {

		if (!$("html").hasClass('no-cssanimations')) {
			$('.animate-this').waypoint({
				handler: function(direction) {

					var defAnimationEfx = cfg.defAnimation;

					if ( direction === 'down' && !$(this.element).hasClass('animated')) {
						$(this.element).addClass('item-animate');

						setTimeout(function() {
							$('body .animate-this.item-animate').each(function(ctr) {
								var el       = $(this),
								animationEfx = el.data('animate') || null;	

	                  	if (!animationEfx) {
			                 	animationEfx = defAnimationEfx;	                 	
			               }

			              	setTimeout( function () {
									el.addClass(animationEfx + ' animated');
									el.removeClass('item-animate');
								}, ctr * 50);

							});								
						}, 100);
					}

					// trigger once only
	       		this.destroy(); 
				}, 
				offset: '95%'
			}); 
		}

	};
	

  /* Intro Animation
	* ------------------------------------------------------- */
	var ssIntroAnimation = function() {

		$WIN.on('load', function() {
		
	     	if (!$("html").hasClass('no-cssanimations')) {
	     		setTimeout(function(){
	    			$('.animate-intro').each(function(ctr) {
						var el = $(this),
	                   animationEfx = el.data('animate') || null;		                                      

	               if (!animationEfx) {
	                 	animationEfx = cfg.defAnimation;	                 	
	               }

	              	setTimeout( function () {
							el.addClass(animationEfx + ' animated');
						}, ctr * 300);
					});						
				}, 100);
	     	} 
		}); 

	};


  /* Contact Form
   * ------------------------------------------------------ */
   var ssContactForm = function() {   	

   	/* local validation */   	
		$('#contactForm').validate({

			/* submit via ajax */
			submitHandler: function(form) {				
				var sLoader = $('#submit-loader');			

				$.ajax({   	
			      type: "POST",
			      url: "inc/sendEmail.php",
			      data: $(form).serialize(),

			      beforeSend: function() { 
			      	sLoader.fadeIn(); 
			      },
			      success: function(msg) {
		            // Message was sent
		            if (msg == 'OK') {
		            	sLoader.fadeOut(); 
		               $('#message-warning').hide();
		               $('#contactForm').fadeOut();
		               $('#message-success').fadeIn();   
		            }
		            // There was an error
		            else {
		            	sLoader.fadeOut(); 
		               $('#message-warning').html(msg);
			            $('#message-warning').fadeIn();
		            }
			      },
			      error: function() {
			      	sLoader.fadeOut(); 
			      	$('#message-warning').html("Something went wrong. Please try again.");
			         $('#message-warning').fadeIn();
			      }
		      });    		
	  		}

		});
   };	

 
  /* Back to Top
	* ------------------------------------------------------ */
	var ssBackToTop = function() {

		var pxShow  = 500,         // height on which the button will show
		fadeInTime  = 400,         // how slow/fast you want the button to show
		fadeOutTime = 400,         // how slow/fast you want the button to hide
		scrollSpeed = 300,         // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'
		goTopButton = $("#go-top")

		// Show or hide the sticky footer button
		$(window).on('scroll', function() {
			if ($(window).scrollTop() >= pxShow) {
				goTopButton.fadeIn(fadeInTime);
			} else {
				goTopButton.fadeOut(fadeOutTime);
			}
		});
	};	



  /* Initialize
	* ------------------------------------------------------ */
	(function ssInit() {

		ssPreloader();
		ssFitVids();
		ssMasonryFolio();
		ssLightGallery();
		ssMenuOnScrolldown();
		ssOffCanvas();
		ssSmoothScroll();
		ssPlaceholder();
		ssStatCounter();
		ssAlertBoxes();
		ssAnimations();
		ssIntroAnimation();		
		ssContactForm();
		ssBackToTop();

	})();
 

})(jQuery);