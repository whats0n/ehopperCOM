var UP = 'up';
var DOWN = 'down';
var numberPattern = /\d+/g;
var couponValue = null;
const coupon = {
  percentage: 'Percentage',
  fixed: 'Fixed amount',
  fixedUnit: 'Fixed amount per unit'
};

function getValues(input) {
  return {
    val: input.val(),
    min: +input.data('min'),
    max: +input.data('max')
  };
};

function enableControls(buttons) {
  buttons.attr('disabled', false);
}

function disableControls(buttons, direction) {
  switch (direction) {
    case UP:
      buttons.filter('[data-spinner-control="' + UP + '"]').attr('disabled', true);
      return;
    case DOWN:
      buttons.filter('[data-spinner-control="' + DOWN + '"]').attr('disabled', true);
      return;
  }
}

function setTotal(quantity) {
  var price = $('[data-price]').data('price');
  var total = $('[data-total]');
  var totalVal = (price*quantity).toFixed(2);
  var totalValUpdated = couponValue === coupon.fixed ? (totalVal - 10).toFixed(2) : totalVal;

  total.text(totalValUpdated);
}

$('[data-spinner]').each((i, spinner) => {
  spinner = $(spinner);
  const input = spinner.find('[data-spinner-input]');
  const controls = spinner.find('[data-spinner-control]');

  //START HANDLE CONTROLS
  controls.on('click', e => {
    e.preventDefault();
    let target = $(e.currentTarget);
    if (target.attr('disabled')) return;
    let direction = target.data('spinner-control');
    let values = getValues(input);

    let min = values.min;
    let max = values.max;
    let newVal = +values.val;

    enableControls(controls);
    switch (direction) {
      case UP: 
        newVal++;
        if (newVal >= max) {
          newVal = max;
          disableControls(controls, UP);
        }
        break;
      case DOWN:
        newVal--;
        if (newVal <= min) {
          newVal = min;
          disableControls(controls, DOWN);
        }
        break;
    }

    setTotal(newVal);
    input.val(newVal);
  });
  //END HANDLE CONTROLS

  //START HANDLE INPUT
  input.on('input', e => {
    let values = getValues(input);
    let min = values.min;
    let max = values.max;
    let val = values.val;

    if (!val) val = ''+min;

    let filtered = val.match( numberPattern );
    
    let newVal = (filtered && filtered.length) ? +(filtered.join('')) : min;
    enableControls(controls);

    if (newVal >= max) {
      newVal = max;
      disableControls(controls, UP);
    }
    if (newVal <= min) {
      newVal = min;
      disableControls(controls, DOWN);
    }

    setTotal(newVal);
    input.val(newVal);
  });
  //END HANDLE INPUT
});

const price = $('[data-price]');
const priceValue = +(price.data('price')).toFixed(2);
const ERROR = 'is-error';

$('[data-coupon*="button"]').on('click', e => {
  e.preventDefault();
  const value = $('[data-coupon*="input"]').val();
  let priceNewValue = priceValue;
  
  switch (value) {
    case coupon.percentage:
      priceNewValue = priceValue * 0.9;
      break;
    case coupon.fixedUnit:
      priceNewValue = priceValue - 10;
      break;
  }

  if (value && value.length) $('[data-coupon*="input"]').addClass(ERROR);

  switch (value) {
    case coupon.percentage:
    case coupon.fixed:
    case coupon.fixedUnit:
      $('[data-coupon*="input"]').removeClass(ERROR);
      break;
  }

  couponValue = value;

  priceNewValue = priceNewValue.toFixed(2);

  price.data('price', priceNewValue);
  price.text(priceNewValue);
  
  if (value && value.length && !$('[data-coupon*="input"]').hasClass(ERROR)) {
    $('[data-coupon*="cancel"]').attr('hidden', false);
    $('[data-coupon*="button"').attr('hidden', true);
    $('[data-coupon*="input"]').attr('disabled', true);
  }

  $('[data-spinner-input]').trigger('input');

});

$('[data-coupon*="cancel"]').on('click', e => {
  $('[data-coupon*="input"]').val('').attr('disabled', false);
  $('[data-coupon*="button"]').trigger('click');
  $('[data-coupon*="cancel"]').attr('hidden', true);
  $('[data-coupon*="button"').attr('hidden', false);
});
