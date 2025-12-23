/**
 * Visitor Tracking System
 * Captures: Email, IP Address, Device Information
 * Sends to: Google Analytics & Webhook
 */

(function() {
	'use strict';

	// Visitor data object
	var visitorData = {
		timestamp: new Date().toISOString(),
		pageUrl: window.location.href,
		pageTitle: document.title,
		referrer: document.referrer || 'Direct',
		device: {},
		ip: null,
		email: null,
		sessionId: generateSessionId()
	};

	/**
	 * Generate unique session ID
	 */
	function generateSessionId() {
		return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
	}

	/**
	 * Detect device information
	 */
	function detectDevice() {
		var ua = navigator.userAgent;
		var device = {
			// Device Type
			deviceType: getDeviceType(),
			
			// Operating System
			os: getOS(),
			osVersion: getOSVersion(),
			
			// Browser
			browser: getBrowser(),
			browserVersion: getBrowserVersion(),
			
			// Screen
			screenWidth: window.screen.width,
			screenHeight: window.screen.height,
			screenResolution: window.screen.width + 'x' + window.screen.height,
			colorDepth: window.screen.colorDepth,
			
			// Viewport
			viewportWidth: window.innerWidth,
			viewportHeight: window.innerHeight,
			
			// Language
			language: navigator.language || navigator.userLanguage,
			languages: navigator.languages ? navigator.languages.join(',') : navigator.language,
			
			// Timezone
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			timezoneOffset: new Date().getTimezoneOffset(),
			
			// Platform
			platform: navigator.platform,
			
			// User Agent
			userAgent: ua,
			
			// Mobile detection
			isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
			isTablet: /iPad|Android/i.test(ua) && !/Mobile/i.test(ua),
			isDesktop: !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)),
			
			// Touch support
			touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
			
			// Connection (if available)
			connection: navigator.connection ? {
				effectiveType: navigator.connection.effectiveType,
				downlink: navigator.connection.downlink,
				rtt: navigator.connection.rtt
			} : null
		};
		
		return device;
	}

	/**
	 * Get device type
	 */
	function getDeviceType() {
		var ua = navigator.userAgent;
		if (/tablet|ipad|playbook|silk/i.test(ua)) {
			return 'Tablet';
		}
		if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) {
			return 'Mobile';
		}
		return 'Desktop';
	}

	/**
	 * Get operating system
	 */
	function getOS() {
		var ua = navigator.userAgent;
		if (ua.match(/Windows NT 10.0/)) return 'Windows 10/11';
		if (ua.match(/Windows NT 6.3/)) return 'Windows 8.1';
		if (ua.match(/Windows NT 6.2/)) return 'Windows 8';
		if (ua.match(/Windows NT 6.1/)) return 'Windows 7';
		if (ua.match(/Mac OS X/)) return 'macOS';
		if (ua.match(/Linux/)) return 'Linux';
		if (ua.match(/Android/)) return 'Android';
		if (ua.match(/iPhone|iPad|iPod/)) return 'iOS';
		return 'Unknown';
	}

	/**
	 * Get OS version
	 */
	function getOSVersion() {
		var ua = navigator.userAgent;
		var match = ua.match(/(?:Windows|Mac OS X|Android|iPhone OS|iPad OS)[\s\/]?([\d\._]+)/i);
		return match ? match[1] : 'Unknown';
	}

	/**
	 * Get browser
	 */
	function getBrowser() {
		var ua = navigator.userAgent;
		if (ua.indexOf('Edg/') > -1) return 'Edge';
		if (ua.indexOf('Chrome/') > -1 && ua.indexOf('Edg/') === -1) return 'Chrome';
		if (ua.indexOf('Firefox/') > -1) return 'Firefox';
		if (ua.indexOf('Safari/') > -1 && ua.indexOf('Chrome/') === -1) return 'Safari';
		if (ua.indexOf('Opera/') > -1 || ua.indexOf('OPR/') > -1) return 'Opera';
		return 'Unknown';
	}

	/**
	 * Get browser version
	 */
	function getBrowserVersion() {
		var ua = navigator.userAgent;
		var match = ua.match(/(?:Chrome|Firefox|Safari|Edge|Opera|OPR)\/([\d\.]+)/i);
		return match ? match[1] : 'Unknown';
	}

	/**
	 * Get IP address using a free API
	 */
	function getIPAddress() {
		// Try multiple IP services for reliability
		var ipServices = [
			'https://api.ipify.org?format=json',
			'https://api64.ipify.org?format=json',
			'https://ipapi.co/json/'
		];

		function tryService(index) {
			if (index >= ipServices.length) {
				console.warn('Could not fetch IP address');
				return;
			}

			fetch(ipServices[index])
				.then(function(response) {
					if (!response.ok) throw new Error('Network response was not ok');
					return response.json();
				})
				.then(function(data) {
					visitorData.ip = data.ip || data.query || 'Unknown';
					visitorData.ipLocation = data.country ? {
						country: data.country,
						countryCode: data.country_code || data.countryCode,
						region: data.region || data.regionName,
						city: data.city,
						postal: data.postal || data.zip,
						lat: data.latitude || data.lat,
						lon: data.longitude || data.lon,
						isp: data.org || data.isp,
						timezone: data.timezone
					} : null;
					
					// Send to Google Analytics
					sendToGoogleAnalytics();
					
					// Send to webhook if configured
					sendToWebhook();
				})
				.catch(function(error) {
					console.warn('IP service failed, trying next:', error);
					tryService(index + 1);
				});
		}

		tryService(0);
	}

	/**
	 * Send data to Google Analytics
	 */
	function sendToGoogleAnalytics() {
		if (typeof gtag === 'undefined') {
			console.warn('Google Analytics not loaded');
			return;
		}

		// Send device info as custom dimensions/events
		gtag('event', 'visitor_info', {
			'device_type': visitorData.device.deviceType,
			'device_os': visitorData.device.os,
			'browser': visitorData.device.browser,
			'screen_resolution': visitorData.device.screenResolution,
			'is_mobile': visitorData.device.isMobile,
			'language': visitorData.device.language,
			'timezone': visitorData.device.timezone,
			'ip_address': visitorData.ip,
			'session_id': visitorData.sessionId
		});

		// Set user properties
		gtag('set', 'user_properties', {
			'device_type': visitorData.device.deviceType,
			'operating_system': visitorData.device.os,
			'browser': visitorData.device.browser
		});
	}

	/**
	 * Send data to webhook (for storing data)
	 */
	function sendToWebhook() {
		// Replace with your webhook URL (e.g., Zapier, Make.com, or custom API)
		var webhookUrl = 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/';
		
		// Uncomment and add your webhook URL to enable
		/*
		fetch(webhookUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(visitorData)
		})
		.catch(function(error) {
			console.warn('Webhook failed:', error);
		});
		*/
	}

	/**
	 * Capture email from contact form
	 */
	function captureEmailFromForm() {
		var contactForm = document.querySelector('form[name="contactForm"]');
		if (!contactForm) return;

		var emailInput = contactForm.querySelector('input[type="email"]');
		if (!emailInput) return;

		// Capture email on form submit
		contactForm.addEventListener('submit', function(e) {
			var email = emailInput.value.trim();
			if (email) {
				visitorData.email = email;
				visitorData.formSubmitted = true;
				visitorData.formData = {
					name: contactForm.querySelector('[name="contactName"]')?.value || '',
					subject: contactForm.querySelector('[name="contactSubject"]')?.value || '',
					message: contactForm.querySelector('[name="contactMessage"]')?.value || ''
				};

				// Send to Google Analytics
				if (typeof gtag !== 'undefined') {
					gtag('event', 'form_submission', {
						'email': email,
						'form_name': 'contact_form',
						'device_type': visitorData.device.deviceType
					});
				}

				// Send to webhook
				sendToWebhook();
			}
		});
	}

	/**
	 * Initialize tracking
	 */
	function init() {
		// Detect device info immediately
		visitorData.device = detectDevice();
		
		// Send device info to GA immediately
		sendToGoogleAnalytics();
		
		// Get IP address (async)
		getIPAddress();
		
		// Setup email capture
		captureEmailFromForm();
		
		// Store in sessionStorage for later use
		try {
			sessionStorage.setItem('visitorData', JSON.stringify(visitorData));
		} catch(e) {
			console.warn('Could not store visitor data:', e);
		}
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	// Export for external use
	window.visitorTracking = {
		getData: function() {
			return visitorData;
		},
		refresh: function() {
			visitorData.device = detectDevice();
			getIPAddress();
		}
	};

})();
