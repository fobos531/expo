import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'ThemeProvider';
import * as React from 'react';

import getStackNavWithConfig from './StackConfig';
import { optionalRequire } from './routeBuilder';
import { TabBackground } from '../components/TabBackground';
import TabIcon from '../components/TabIcon';
import { Layout } from '../constants';
import { CameraScreens } from '../screens/Camera/CameraScreen';
import ExpoComponents from '../screens/ExpoComponentsScreen';
import { MapsScreens } from '../screens/ExpoMaps/MapsScreen';
import { ImageScreens } from '../screens/Image/ImageScreen';
import { UIScreens } from '../screens/UI/UIScreen';
import { VideoScreens } from '../screens/Video/VideoScreen';
import { type ScreenApiItem, type ScreenConfig } from '../types/ScreenConfig';

const Stack = createStackNavigator();

export const Screens: ScreenConfig[] = [
  {
    getComponent() {
      return optionalRequire(() => require('../screens/DrawerLayoutAndroidScreen'));
    },
    name: 'DrawerLayoutAndroid',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/ModalScreen'));
    },
    name: 'Modal',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/ScrollViewScreen'));
    },
    name: 'ScrollView',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/MaskedViewScreen'));
    },
    name: 'MaskedView',
    options: { title: 'Basic Mask Example' },
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/BlurView/BlurViewScreen'));
    },
    name: 'BlurView',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/Camera/CameraScreen'));
    },
    name: 'Camera',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/TextScreen'));
    },
    name: 'Text',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/TextInputScreen'));
    },
    name: 'TextInput',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/TouchablesScreen'));
    },
    name: 'Touchables',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/TouchableBounceScreen'));
    },
    name: 'TouchableBounce',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/SwitchScreen'));
    },
    name: 'Switch',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/SliderScreen'));
    },
    name: 'Slider',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/PressableScreen'));
    },
    name: 'Pressable',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/PickerScreen'));
    },
    name: 'Picker',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/CheckboxScreen'));
    },
    name: 'Checkbox',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/ButtonScreen'));
    },
    name: 'Button',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/ActivityIndicatorScreen'));
    },
    name: 'ActivityIndicator',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/DateTimePickerScreen'));
    },
    name: 'DateTimePicker',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/GLScreen'));
    },
    name: 'GL',
    options: { title: 'Examples of GL use' },
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/ClearToBlueScreen'));
    },
    name: 'ClearToBlue',
    options: { title: 'Clear to blue' },
    route: 'gl/cleartoblue',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/BasicTextureScreen'));
    },
    name: 'BasicTexture',
    options: { title: 'Basic texture use' },
    route: 'gl/basictexture',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/GLViewScreen'));
    },
    name: 'GLViewScreen',
    options: { title: 'GLView example' },
    route: 'gl/glviewscreen',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/GLMaskScreen'));
    },
    name: 'Mask',
    options: { title: 'MaskedView integration' },
    route: 'gl/mask',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/GLSnapshotsScreen'));
    },
    name: 'Snapshots',
    options: { title: 'Taking snapshots' },
    route: 'gl/snapshots',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/GLThreeComposerScreen'));
    },
    name: 'THREEComposer',
    options: { title: 'three.js glitch and film effects' },
    route: 'gl/threecomposer',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/GLThreeDepthStencilBufferScreen'));
    },
    name: 'THREEDepthStencilBuffer',
    options: { title: 'three.js depth and stencil buffer' },
    route: 'gl/threedepthstencilbuffer',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/GLThreeSpriteScreen'));
    },
    name: 'THREESprite',
    options: { title: 'three.js sprite rendering' },
    route: 'gl/threesprite',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/ProcessingInAndOutScreen'));
    },
    name: 'ProcessingInAndOut',
    options: { title: "'In and out' from openprocessing.org" },
    route: 'gl/processinginandout',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/ProcessingNoClearScreen'));
    },
    name: 'ProcessingNoClear',
    options: { title: 'Draw without clearing screen with processing.js' },
    route: 'gl/processingnoclear',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/PIXIBasicScreen'));
    },
    name: 'PIXIBasic',
    options: { title: 'Basic pixi.js use' },
    route: 'gl/pixibasic',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/PIXISpriteScreen'));
    },
    name: 'PIXISprite',
    options: { title: 'pixi.js sprite rendering' },
    route: 'gl/pixisprite',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/GLCameraScreen'));
    },
    name: 'GLCamera',
    options: { title: 'Expo.Camera integration' },
    route: 'gl/glcamera',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/WebGL2TransformFeedbackScreen'));
    },
    name: 'WebGL2TransformFeedback',
    options: { title: 'WebGL2 - Transform feedback' },
    route: 'gl/webgl2transformfeedback',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/CanvasScreen'));
    },
    name: 'Canvas',
    options: { title: 'Canvas example - expo-2d-context' },
    route: 'gl/canvas',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/GLHeadlessRenderingScreen'));
    },
    name: 'HeadlessRendering',
    options: { title: 'Headless rendering' },
    route: 'gl/headlessrendering',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/GLReanimatedExample'));
    },
    name: 'ReanimatedWorklets',
    options: { title: 'Reanimated worklets + gesture handler' },
    route: 'gl/reanimated',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GL/GLViewOnBusyThread'));
    },
    name: 'GLViewOnBusyThread',
    options: { title: 'Creating GLView when a thread is busy' },
    route: 'gl/busythread',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GestureHandlerPinchScreen'));
    },
    name: 'GestureHandlerPinch',
    options: { title: 'Pinch and Rotate' },
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GestureHandlerListScreen'));
    },
    name: 'GestureHandlerList',
    options: { title: 'Gesture Handler List' },
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/GestureHandlerSwipeableScreen'));
    },
    name: 'GestureHandlerSwipeable',
    options: { title: 'Swipeable Rows' },
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/HTMLElementsScreen'));
    },
    name: 'HTML',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/Image/ImageScreen'));
    },
    name: 'Image',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/Reanimated/ReanimatedScreen'));
    },
    name: 'Reanimated',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/SegmentedControlScreen'));
    },
    name: 'SegmentedControl',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/Skia/SkiaScreen'));
    },
    name: 'Skia',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/SVG/SVGScreen'));
    },
    name: 'SVG',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/SVG/SVGExampleScreen'));
    },
    name: 'SVGExample',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/LinearGradientScreen'));
    },
    name: 'LinearGradient',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/LottieScreen'));
    },
    name: 'Lottie',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/MapsScreen'));
    },
    name: 'Maps',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/ExpoMaps/MapsScreen'));
    },
    name: 'ExpoMaps',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/Audio/AV/VideoScreen'));
    },
    name: 'Video (expo-av)',
    route: 'video-expo-av',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/Video/VideoScreen'));
    },
    name: 'Video (expo-video)',
    route: 'video-expo-video',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/UI/UIScreen'));
    },
    name: 'Expo UI',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/Screens'));
    },
    name: 'Screens',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/SymbolImageScreen'));
    },
    name: 'Symbols',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/WebViewScreen'));
    },
    name: 'WebView',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/PagerViewScreen'));
    },
    name: 'PagerView',
    options: { gesturesEnabled: false, title: 'PagerView Example' },
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/FlashListScreen'));
    },
    name: 'FlashList',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/ClipboardPasteButtonScreen'));
    },
    name: 'ClipboardPasteButton',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/LivePhotoScreen'));
    },
    name: 'LivePhoto',
  },
  {
    getComponent() {
      return optionalRequire(() => require('../screens/MeshGradientScreen'));
    },
    name: 'MeshGradient',
  },
  ...CameraScreens,
  ...ImageScreens,
  ...VideoScreens,
  ...UIScreens,
  ...MapsScreens,
];

export const screenApiItems: ScreenApiItem[] = Screens.map(({ name, route }) => ({
  name,
  route: '/components/' + (route ?? name.toLowerCase()),
  isAvailable: true,
}));

function ExpoComponentsStackNavigator(props: { navigation: BottomTabNavigationProp<any> }) {
  const { theme } = useTheme();
  return (
    <Stack.Navigator {...props} {...getStackNavWithConfig(props.navigation, theme)}>
      <Stack.Screen
        name="ExpoComponents"
        options={{
          title: Layout.isSmallDevice ? 'Expo SDK Components' : 'Components in Expo SDK',
        }}>
        {() => <ExpoComponents apis={screenApiItems} />}
      </Stack.Screen>
      {Screens.map(({ name, getComponent, options }) => (
        <Stack.Screen name={name} key={name} getComponent={getComponent} options={options ?? {}} />
      ))}
    </Stack.Navigator>
  );
}

ExpoComponentsStackNavigator.navigationOptions = {
  title: 'Components',
  tabBarLabel: 'Components',
  tabBarIcon: ({ focused }: { focused: boolean }) => {
    return <TabIcon name="react" focused={focused} />;
  },
  tabBarBackground: () => <TabBackground />,
};

export default ExpoComponentsStackNavigator;
