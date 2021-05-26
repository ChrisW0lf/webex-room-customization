import xapi from 'xapi';

// by Christian Wolf - chriswol@cisco.com

// Standard position for immersive share, bottom right in half size and full opacity
let immersiveVideoParams = {X: 8000, Y: 7500, Scale: 50, Opacity: 100};
let source = 'UsbC';
let backgroundImage;
let backgroundMode;
let isImmersiveVideo = false;
let positionMovement = 1000;
const maxSizeOpacity = 100;
const maxMovement = 2500;


// Updates Source UI
function updateSourceUI(source) {
  xapi.command('UserInterface Extensions Widget SetValue', {
    WidgetId: 'source_immersiveVideo',
    Value: source
  });
};

// Updates Slider UI
function updateSliderUI(widget, lable) {
  // Update text lable
  xapi.command('UserInterface Extensions Widget SetValue', {
    WidgetId: widget+'Lable_immersiveVideo',
    Value: lable
  });

  // Update Slider level
  let maxLevel;
  if (widget === 'posAdjustment') {maxLevel = maxMovement}
  else {maxLevel = maxSizeOpacity};

  const level = Math.round(parseInt(lable) * 255 / maxLevel);
  xapi.command('UserInterface Extensions Widget SetValue', {
    WidgetId: widget+'Slider_immersiveVideo',
    Value: level
  });
};

async function getBackgroundSettings() {
  backgroundImage = await xapi.Status.Cameras.Background.Image.get();
  backgroundMode = await xapi.Status.Cameras.Background.Mode.get();
};

function unsetGUIValue(guiId) {
    xapi.command('UserInterface Extensions Widget UnsetValue', {
        WidgetId: guiId
    });
}

// Set immersive Video
function immersiveVideo(x = immersiveVideoParams.X, y = immersiveVideoParams.Y, scale = immersiveVideoParams.Scale, opacity = immersiveVideoParams.Opacity) {
  isImmersiveVideo = true;
  immersiveVideoParams = { X: x, Y: y, Scale: scale, Opacity: opacity };
  xapi.command('Cameras Background Set', { Mode: source });
  xapi.command('Cameras Background ForegroundParameters Set', immersiveVideoParams);
};

// Unset immersive Video
function disableImmersiveVideo() {
  isImmersiveVideo = false;
  if (backgroundMode === 'Image') { xapi.command('Cameras Background Set', { Image: backgroundImage, Mode: backgroundMode }); }
  else {xapi.command('Cameras Background Set', { Mode: backgroundMode }); };
};

xapi.on('ready', () => {
  updateSourceUI(source);
  updateSliderUI('size', immersiveVideoParams.Scale);
  updateSliderUI('opacity', immersiveVideoParams.Opacity);
  updateSliderUI('posAdjustment', positionMovement);
  getBackgroundSettings();
});

// Event if Background Image or Mode has been changed
xapi.status.on('Cameras Background', (event) => {
  if (!isImmersiveVideo) {
    if (event['Image']) {backgroundImage = event['Image']; }
    else {backgroundMode = event['Mode']; };
  };
});

xapi.event.on('UserInterface Extensions Widget Action', (event) => { 

  // Event to change source for immersive Video
  if (event.WidgetId === 'source_immersiveVideo') {
    source = event.Value
    if (isImmersiveVideo) {immersiveVideo()};
  }
  // Event on Sliders to update UI and ImmersiveVideo
  else if (event.WidgetId.includes('Slider_immersiveVideo') && event.Type === 'changed') {
    let widget = event.WidgetId.replace('Slider_immersiveVideo', '');
    let lable;

    switch (event.WidgetId) {
      case 'sizeSlider_immersiveVideo':
        lable = Math.round(event.Value * maxSizeOpacity / 255);
        if (lable == 0) {lable = 1};
        immersiveVideoParams.Scale = lable;
        if (isImmersiveVideo) {immersiveVideo()};
        break;
      case 'opacitySlider_immersiveVideo':
        lable = Math.round(event.Value * maxSizeOpacity / 255);
        immersiveVideoParams.Opacity = lable;
        if (isImmersiveVideo) {immersiveVideo()};
        break;
      case 'posAdjustmentSlider_immersiveVideo':
        lable = Math.round(event.Value * maxMovement / 255 / 100) * 100;
        positionMovement = lable;
      default:
        // do nothing
    };
    updateSliderUI(widget, lable);
  }
  // Preset position of immersive video
  else if (event.WidgetId === 'position_immersiveVideo' && event.Type === 'released') {
    switch (event.Value) {
      case 'upperLeft':
        immersiveVideo(1000, 2500);
        break;
      case 'upperRight':
        immersiveVideo(8000, 2500);
        break;
      case 'upperCenter':
        immersiveVideo(5000, 2500);
        break;
      case 'lowerCenter':
        immersiveVideo(5000, 7500);
        break;
      case 'lowerLeft':
        immersiveVideo(1000, 7500);
        break;
      case 'lowerRight':
        immersiveVideo(8000, 7500);
        break;
      case 'activate':
        immersiveVideo();
        break;
      case 'reset':
        if (isImmersiveVideo) {immersiveVideo(8000, 7500, 50, 100);}
        else {immersiveVideoParams = {X: 8000, Y: 7500, Scale: 50, Opacity: 100}};
        updateSliderUI('size', immersiveVideoParams.Scale);
        updateSliderUI('opacity', immersiveVideoParams.Opacity);
        updateSliderUI('posAdjustment', 1000);
        break;
      case 'deactivate':
        disableImmersiveVideo();
        break;
      default:
        // do nothing
    }
    setTimeout(() => { unsetGUIValue(event.WidgetId); }, 200);
  }
  // Update position of immersive video
  else if (event.WidgetId == 'posAdjustmentPad_immersiveVideo' && event.Type == 'released') {
    switch (event.Value) {
      case 'left':
        if(immersiveVideoParams.X - positionMovement >= 0) {immersiveVideoParams.X -= positionMovement};
        break;
      case 'right':
        if(immersiveVideoParams.X + positionMovement <= 10000) {immersiveVideoParams.X += positionMovement};
        break;
      case 'up':
        if(immersiveVideoParams.Y - positionMovement >= 0) {immersiveVideoParams.Y -= positionMovement};
        break;
      case 'down':
        if(immersiveVideoParams.Y + positionMovement <= 10000) {immersiveVideoParams.Y += positionMovement};
        break;
      default:
        //do nothing
    };
    if(isImmersiveVideo) {immersiveVideo()};
  };
});

