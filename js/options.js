
const { config, electron_config } = window;

const min_reasonable_time = 0.1;
const max_reasonable_time = 1000;
 
exports.getAutoShuffle = () => {
  if (electron_config.has('auto_shuffle')) {
    return electron_config.get('auto_shuffle');
  }
  return config.default_auto_shuffle;
};

exports.setAutoShuffle = (value) => {
  electron_config.set('auto_shuffle', value);
};

exports.getIncludeVideos = () => {
  if (electron_config.has('include_video')) {
    return electron_config.get('include_video');
  }
  return config.default_include_video;
};

exports.setIncludeVideos = (value) => {
  electron_config.set('include_video', value);
};

exports.getUseTransitions = () => {
  if (electron_config.has('use_transitions')) {
    return electron_config.get('use_transitions');
  }
  return config.default_use_tranistions;
};

exports.setUseTransitions = (value) => {
  electron_config.set('use_transitions', value);
};

exports.getBlackBackground = () => {
  if (electron_config.has('black_background')) {
    return electron_config.get('black_background');
  }
  return config.default_black_background;
};

exports.setBlackBackground = (value) => {
  electron_config.set('black_background', value);
};

exports.getSlideShowTimer = () => {
  if (electron_config.has('slide_show_timer')) {
    return electron_config.get('slide_show_timer');
  }
  
  return config.default_slide_show_timer;
};

exports.setSlideShowTimer = (timer) => {
  if (isNaN(timer)) {
    return 'please enter a number';
  } else if (timer === '') {
    return 'please enter a value';
  } else if (timer < min_reasonable_time || timer > max_reasonable_time) {
    return 'please enter a more realistic value';
  }

  electron_config.set('slide_show_timer', timer);
  return 'success';
};

