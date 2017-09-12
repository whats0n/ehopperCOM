(function() {
	//START: COMMON
	const $ = jQuery;
	const SUCCESS = 'is-success';
	const OPEN = 'is-open';
	const ERROR = 'error';

	const regexSpecialSymbols = /[^A-Za-z0-9\-_]/;
	const regexNumber = /\d/;
	const regexLowerCase = /[a-z]/;
	const regexUpperCase = /[A-Z]/;

	const validation = (condition, $step) => {
		if (condition) {
			$step.addClass(SUCCESS);
			return true;
		} else {
			$step.removeClass(SUCCESS);
			return false;
		}
	};
	//END: COMMON

	const password = $('.js-password');

	password.each(function() {

		//START: JQUERY ELEMENTS
		const $this = $(this);
		const $input = $this.find('.js-password-input');
		const $hint = $this.find('.js-password-hint');
		const $steps = $this.find('.js-password-step');
		const $field = $this.find('.js-password-field');
		//END: JQUERY ELEMENTS

		//START: VALIDATION RULES
		let $stepLength = null;
		let $stepLowerCase = null;
		let $stepUpperCase = null;
		let $stepSymbols = null;

		$steps.each(function(i, step) {

			const $step = $(step);
			const type = $step.data('step-type').toLowerCase();

			switch (type) {
				case 'length':
					$stepLength = $step;
				break;
				case 'lowercase':
					$stepLowerCase = $step;
				break;
				case 'uppercase':
					$stepUpperCase = $step;
				break;
				case 'symbols':
					$stepSymbols = $step;
				break;
			};

		});
		//END: VALIDATION RULES

		//START: VALIDATION STEPS
		let validateLength = null;
		let validateLowercase = null;
		let validateUppercase = null;
		let validateSymbols = null;
		//END: VALIDATION STEPS

		//START: INPUT HENDLERS
		$input
			.on('input', function(e) {

				const value = $input.val();

				validateLength = validation(
					value.length >= 9 && value.length <= 15,
					$stepLength
				);

				validateLowercase = validation(
					regexLowerCase.test(value),
					$stepLowerCase
				);

				validateUppercase = validation(
					regexUpperCase.test(value),
					$stepUpperCase
				);

				validateSymbols = validation(
					regexSpecialSymbols.test(value) && regexNumber.test(value),
					$stepSymbols
				);

				$field.removeClass(ERROR);

			})
			.blur(function(e) {

				if (validateLength && validateLowercase && validateUppercase && validateSymbols) {
					$hint.removeClass(OPEN);
				} else {
					$field.addClass(ERROR);
				}

			})
			.focus(function(e) {
				$hint.addClass(OPEN);
			});
		//END: INPUT HENDLERS

	});

})();