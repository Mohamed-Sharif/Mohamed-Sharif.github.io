/**
 * Email Collection Prompt
 * Shows a modal to collect visitor email addresses
 */

(function() {
	'use strict';

	// Configuration
	var config = {
		showAfterDelay: 3000, // Show after 3 seconds
		showOnFirstVisit: true, // Show on first visit only
		cookieName: 'email_prompt_shown', // Cookie to track if shown
		cookieExpiry: 30 // Days until cookie expires
	};

	/**
	 * Create and show email prompt modal
	 */
	function createEmailModal() {
		// Check if already shown (if first visit only)
		if (config.showOnFirstVisit && getCookie(config.cookieName)) {
			return null;
		}

		// Create modal HTML
		var modalHTML = `
			<div id="email-prompt-modal" class="email-modal-overlay">
				<div class="email-modal-content">
					<button class="email-modal-close" aria-label="Close">&times;</button>
					<div class="email-modal-header">
						<h2>Stay Connected!</h2>
						<p>Get updates about my latest projects and research</p>
					</div>
					<form id="email-prompt-form" class="email-modal-form">
						<div class="form-group">
							<input 
								type="email" 
								id="prompt-email" 
								name="email" 
								placeholder="Enter your email address" 
								required
								autocomplete="email"
							>
							<label for="prompt-email">Email Address</label>
						</div>
						<div class="form-group">
							<input 
								type="text" 
								id="prompt-name" 
								name="name" 
								placeholder="Your name (optional)" 
								autocomplete="name"
							>
							<label for="prompt-name">Name (Optional)</label>
						</div>
						<button type="submit" class="email-submit-btn">
							Subscribe
						</button>
						<button type="button" class="email-skip-btn">
							Maybe Later
						</button>
						<p class="email-privacy-note">
							We respect your privacy. Unsubscribe at any time.
						</p>
					</form>
				</div>
			</div>
		`;

		// Add to page
		document.body.insertAdjacentHTML('beforeend', modalHTML);

		// Setup event listeners
		setupModalEvents();
		
		// Return modal element
		return document.getElementById('email-prompt-modal');
	}

	/**
	 * Setup modal event listeners
	 */
	function setupModalEvents() {
		var modal = document.getElementById('email-prompt-modal');
		var closeBtn = modal.querySelector('.email-modal-close');
		var skipBtn = modal.querySelector('.email-skip-btn');
		var form = document.getElementById('email-prompt-form');

		// Close button
		closeBtn.addEventListener('click', function() {
			closeModal();
		});

		// Skip button
		skipBtn.addEventListener('click', function() {
			closeModal();
		});

		// Close on overlay click
		modal.addEventListener('click', function(e) {
			if (e.target === modal) {
				closeModal();
			}
		});

		// Close on ESC key
		document.addEventListener('keydown', function(e) {
			if (e.key === 'Escape' && modal.style.display !== 'none') {
				closeModal();
			}
		});

		// Form submission
		form.addEventListener('submit', function(e) {
			e.preventDefault();
			handleFormSubmit();
		});
	}

	/**
	 * Handle form submission
	 */
	function handleFormSubmit() {
		var emailInput = document.getElementById('prompt-email');
		var nameInput = document.getElementById('prompt-name');
		var email = emailInput.value.trim();
		var name = nameInput.value.trim();

		if (!email || !isValidEmail(email)) {
			showError('Please enter a valid email address');
			return;
		}

		// Send to Google Analytics
		if (typeof gtag !== 'undefined') {
			gtag('event', 'email_subscription', {
				'email': email,
				'name': name || 'Anonymous',
				'source': 'email_prompt_modal'
			});
		}

		// Send to visitor tracking
		if (window.visitorTracking) {
			var visitorData = window.visitorTracking.getData();
			visitorData.email = email;
			visitorData.name = name;
			visitorData.subscriptionSource = 'modal';
		}

		// Send to webhook (if configured)
		sendToWebhook(email, name);

		// Show success message
		showSuccess(email);

		// Set cookie to not show again
		setCookie(config.cookieName, 'true', config.cookieExpiry);
	}

	/**
	 * Send email to webhook
	 */
	function sendToWebhook(email, name) {
		// Replace with your webhook URL (Zapier, Make.com, etc.)
		var webhookUrl = 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/';
		
		// Uncomment to enable webhook
		/*
		fetch(webhookUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: email,
				name: name,
				timestamp: new Date().toISOString(),
				source: 'email_prompt_modal',
				pageUrl: window.location.href
			})
		})
		.catch(function(error) {
			console.warn('Webhook failed:', error);
		});
		*/
	}

	/**
	 * Show success message
	 */
	function showSuccess(email) {
		var modal = document.getElementById('email-prompt-modal');
		var form = document.getElementById('email-prompt-form');
		
		form.innerHTML = `
			<div class="email-success-message">
				<div class="success-icon">✓</div>
				<h3>Thank you!</h3>
				<p>We've added <strong>${email}</strong> to our list.</p>
				<button class="email-close-btn" onclick="document.getElementById('email-prompt-modal').style.display='none'">
					Close
				</button>
			</div>
		`;

		// Auto close after 3 seconds
		setTimeout(function() {
			closeModal();
		}, 3000);
	}

	/**
	 * Show error message
	 */
	function showError(message) {
		var form = document.getElementById('email-prompt-form');
		var errorDiv = document.createElement('div');
		errorDiv.className = 'email-error-message';
		errorDiv.textContent = message;
		
		// Remove existing error
		var existingError = form.querySelector('.email-error-message');
		if (existingError) {
			existingError.remove();
		}
		
		form.insertBefore(errorDiv, form.firstChild);
		
		// Remove after 5 seconds
		setTimeout(function() {
			errorDiv.remove();
		}, 5000);
	}

	/**
	 * Close modal
	 */
	function closeModal() {
		var modal = document.getElementById('email-prompt-modal');
		if (modal) {
			modal.style.display = 'none';
			setCookie(config.cookieName, 'true', config.cookieExpiry);
		}
	}

	/**
	 * Validate email
	 */
	function isValidEmail(email) {
		var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	}

	/**
	 * Set cookie
	 */
	function setCookie(name, value, days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + (value || "") + expires + "; path=/";
	}

	/**
	 * Get cookie
	 */
	function getCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}

	/**
	 * Initialize
	 */
	function init() {
		// Show after delay
		setTimeout(function() {
			createEmailModal();
		}, config.showAfterDelay);
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

})();
