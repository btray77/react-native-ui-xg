/**
 * Copy from NavigatorNavigationBarStylesIOS.js
 */

'use strict';

var Dimensions = require('Dimensions');

var buildStyleInterpolator = require('buildStyleInterpolator');
var merge = require('merge');

var SCREEN_WIDTH = Dimensions.get('window').width;
var NAV_BAR_HEIGHT = 44;
var STATUS_BAR_HEIGHT = 0;
var NAV_HEIGHT = NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT;

var BASE_STYLES = {
  Title: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT,
    left: 0,
    right: 0,
    alignItems: 'center',
    height: NAV_BAR_HEIGHT,
    backgroundColor: 'transparent'
  },
  LeftButton: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT,
    left: 0,
    overflow: 'hidden',
    opacity: 1,
    height: NAV_BAR_HEIGHT,
    backgroundColor: 'transparent'
  },
  RightButton: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT,
    right: 0,
    overflow: 'hidden',
    opacity: 1,
    alignItems: 'flex-end',
    height: NAV_BAR_HEIGHT,
    backgroundColor: 'transparent'
  }
};

// There are 3 stages: left, center, right. All previous navigation
// items are in the left stage. The current navigation item is in the
// center stage. All upcoming navigation items are in the right stage.
// Another way to think of the stages is in terms of transitions. When
// we move forward in the navigation stack, we perform a
// right-to-center transition on the new navigation item and a
// center-to-left transition on the current navigation item.
var Stages = {
  Left: {
    Title: merge(BASE_STYLES.Title, {left: -SCREEN_WIDTH / 2, opacity: 0}),
    LeftButton: merge(BASE_STYLES.LeftButton, {left: 0, opacity: 0}),
    RightButton: merge(BASE_STYLES.RightButton, {opacity: 0})
  },
  Center: {
    Title: merge(BASE_STYLES.Title, {left: 0, opacity: 1}),
    LeftButton: merge(BASE_STYLES.LeftButton, {left: 0, opacity: 1}),
    RightButton: merge(BASE_STYLES.RightButton, {opacity: 1})
  },
  Right: {
    Title: merge(BASE_STYLES.Title, {left: SCREEN_WIDTH / 2, opacity: 0}),
    LeftButton: merge(BASE_STYLES.LeftButton, {left: 0, opacity: 0}),
    RightButton: merge(BASE_STYLES.RightButton, {opacity: 0})
  }
};


var opacityRatio = 100;

var Interpolators = {
  // Animating *into* the center stage from the right
  RightToCenter: buildSceneInterpolators(Stages.Right, Stages.Center),
  // Animating out of the center stage, to the left
  CenterToLeft: buildSceneInterpolators(Stages.Center, Stages.Left),
  // Both stages (animating *past* the center stage)
  RightToLeft: buildSceneInterpolators(Stages.Right, Stages.Left)
};

function buildSceneInterpolators(startStyles, endStyles) {
  return {
    Title: buildStyleInterpolator({
      opacity: {
        type: 'linear',
        from: startStyles.Title.opacity,
        to: endStyles.Title.opacity,
        min: 0,
        max: 1
      },
      left: {
        type: 'linear',
        from: startStyles.Title.left,
        to: endStyles.Title.left,
        min: 0,
        max: 1,
        extrapolate: true
      }
    }),
    LeftButton: buildStyleInterpolator({
      opacity: {
        type: 'linear',
        from: startStyles.LeftButton.opacity,
        to: endStyles.LeftButton.opacity,
        min: 0,
        max: 1,
        round: opacityRatio
      },
      left: {
        type: 'linear',
        from: startStyles.LeftButton.left,
        to: endStyles.LeftButton.left,
        min: 0,
        max: 1
      }
    }),
    RightButton: buildStyleInterpolator({
      opacity: {
        type: 'linear',
        from: startStyles.RightButton.opacity,
        to: endStyles.RightButton.opacity,
        min: 0,
        max: 1,
        round: opacityRatio
      },
      left: {
        type: 'linear',
        from: startStyles.RightButton.left,
        to: endStyles.RightButton.left,
        min: 0,
        max: 1,
        extrapolate: true
      }
    })
  };
}

module.exports = {
  General: {
    NavBarHeight: NAV_BAR_HEIGHT,
    StatusBarHeight: STATUS_BAR_HEIGHT,
    TotalNavHeight: NAV_HEIGHT
  },
  Interpolators,
  Stages
};
