// Animated gradient behind the page, using ShaderGradient (shadergradient.co).
// Loaded straight from esm.sh, so there's still no build step. Every package
// shares one copy of React and three.js through the ?deps= pins.
import React from 'https://esm.sh/react@18.3.1';
import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client?deps=react@18.3.1';
import { ShaderGradientCanvas, ShaderGradient } from 'https://esm.sh/@shadergradient/react@2.4.20?deps=react@18.3.1,react-dom@18.3.1,three@0.169.0,@react-three/fiber@8.17.10';

var el = document.getElementById('background');

// Hold the gradient still for visitors who ask for less motion.
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

var gradient = React.createElement(ShaderGradient, {
  animate: reduceMotion ? 'off' : 'on',
  axesHelper: 'off',
  brightness: 1.2,
  cAzimuthAngle: 180,
  cDistance: 3.6,
  cPolarAngle: 90,
  cameraZoom: 1,
  color1: '#2697ab',
  color2: '#6d8c65',
  color3: '#004600',
  destination: 'onCanvas',
  embedMode: 'off',
  envPreset: 'city',
  format: 'gif',
  fov: 45,
  frameRate: 10,
  gizmoHelper: 'hide',
  grain: 'on',
  lightType: '3d',
  pixelDensity: 1,
  positionX: -1.4,
  positionY: 0,
  positionZ: 0,
  range: 'disabled',
  rangeEnd: 40,
  rangeStart: 0,
  reflection: 0.1,
  rotationX: 0,
  rotationY: 10,
  rotationZ: 50,
  shader: 'defaults',
  type: 'plane',
  uAmplitude: 1,
  uDensity: 0.8,
  uFrequency: 5.5,
  uSpeed: 0.4,
  uStrength: 5.8,
  uTime: 0,
  wireframe: false
});

createRoot(el).render(
  React.createElement(ShaderGradientCanvas, {
    style: { width: '100%', height: '100%' },
    pixelDensity: 1,
    fov: 45,
    pointerEvents: 'none'
  }, gradient)
);
