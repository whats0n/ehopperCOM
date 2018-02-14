var UP = 'up';
var DOWN = 'down';
var numberPattern = /\d+/g;

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

  total.text((price*quantity).toFixed(2));
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
