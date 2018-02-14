class Validation {

  constructor(options) {
    this.options = options;
    this.cache = {};
    this.validation = this.validation.bind(this);
    this.init();
  }
  
  //inits
  init() {
    this.initializeCache();
    this.initializeEvents();
  }

  initializeCache() {
    const {form} = this.options;
    const steps = form.find('.js-validation-password-step');
    
    //elements
    this.cache.form = form;
    this.cache.password = {
      container: form.find('.js-validation-password'),
      hint: form.find('.js-validation-password-hint'),
      steps: {
        all: steps,
        length: steps.filter('[data-step-type="length"]'),
        lowerCase: steps.filter('[data-step-type="lowercase"]'),
        upperCase: steps.filter('[data-step-type="uppercase"]'),
        symbols: steps.filter('[data-step-type="symbols"]'),
        number: steps.filter('[data-step-type="number"]')
      },
      input: form.find('.js-validation-password-input'),
      confirm: form.find('.js-validation-confirm-input')
    };
    this.cache.submit = form.find('.js-validation-submit');
    
    //conditions
    this.cache.conditions = {
      symbols: /[^A-Za-z0-9\-_]/,
      number: /\d/,
      lowerCase: /[a-z]/,
      upperCase: /[A-Z]/
    };
    
    //states
    this.cache.states = {
      success: 'is-success',
      error: 'is-error',
      open: 'is-open'
    };
    
    //validationStates
    this.cache.validationStates = {
      length: null,
      lowerCase: null,
      upperCase: null,
      symbols: null,
      number: null
    };
  }

  initializeEvents() {
    this.validatePassword();
    this.validationConfirm();
    this.validationOnSubmit();
  }

  validatePassword() {
    const {hint, steps, input} = this.cache.password;
    const {validationStates} = this.cache;
    const {conditions} = this.cache;
    const {open, success, error} = this.cache.states;
    const {validation} = this;

    input
      .on('input', () => {

        const value = input.val();

        validationStates.length = validation(
          value.length >= 9 && value.length <= 15,
          steps.length
        );

        validationStates.lowerCase = validation(
          conditions.lowerCase.test(value),
          steps.lowerCase
        );

        validationStates.upperCase = validation(
          conditions.upperCase.test(value),
          steps.upperCase
        );

        validationStates.symbols = validation(
          conditions.symbols.test(value),
          steps.symbols
        );

        validationStates.number = validation(
          conditions.number.test(value),
          steps.number
        );

      })
      .blur(() => {

        if (validationStates.length && validationStates.lowerCase && validationStates.upperCase && validationStates.symbols && validationStates.number) {
          hint.removeClass(open);
          input.addClass(success);
        } else {
          input
            .addClass(error)
            .removeClass(success);
        }

      })
      .focus(() => {
        hint.addClass(open);
        input
          .removeClass(error)
          .removeClass(success);
      });
  }

  validationConfirm() {
    const {input, confirm} = this.cache.password;
    const {success, error} = this.cache.states;

    confirm
      .blur(() => {
        if (confirm.val() !== input.val()) {
          confirm
            .removeClass(success)
            .addClass(error);
        } else {
          confirm
            .removeClass(error)
            .addClass(success);
        }
      })
      .focus(() => {
        confirm
          .removeClass(error)
          .removeClass(success);
      });
  }

  validationOnSubmit() {
    const {input, confirm} = this.cache.password;
    const {error} = this.cache.states;
    
    this.cache.form.on('submit', (e) => {
      const inputValue = input.val();
      const confirmValue = confirm.val();
      
      if (inputValue === confirmValue) confirm.removeClass(error);
      if (!inputValue) input.addClass(error);
      if (!confirmValue || inputValue !== confirmValue) confirm.addClass(error);

      if (input.hasClass(error) || confirm.hasClass(error)) {
        return false;
      }
    });
  }

  //utils
  validation(condition, step) {
    const {success} = this.cache.states;
    if (condition) {
      step.addClass(success);
      return true;
    } else {
      step.removeClass(success);
      return false;
    }
  }

}

$('.js-validation-form').each((i, form) => {
  new Validation({ form: $(form) });
});
