
import { SceneManager } from './src/core/SceneManager.js';
import { UIManager } from './src/core/UIManager.js';
import { AudioManager } from './src/core/AudioManager.js';
import { PortalScene } from './src/components/PortalScene.js';
import { UniverseScene } from './src/components/UniverseScene.js';
import { HeartScene } from './src/components/HeartScene.js';
import { MemoryScene } from './src/components/MemoryScene.js';
import { PromiseScene } from './src/components/PromiseScene.js';
import { FinaleScene } from './src/components/FinaleScene.js';

const canvas = document.createElement('canvas');
document.getElementById('canvas-container').appendChild(canvas);

const sceneManager = new SceneManager(canvas);
const uiManager = new UIManager();
const audioManager = new AudioManager();

// Expose managers to window for debugging or easy access from scenes
window.sceneManager = sceneManager;
window.uiManager = uiManager;
window.audioManager = audioManager;

// Register Scenes
const portalScene = new PortalScene(sceneManager);
sceneManager.addScene('portal', portalScene);

const universeScene = new UniverseScene(sceneManager);
sceneManager.addScene('universe', universeScene);

const heartScene = new HeartScene(sceneManager);
sceneManager.addScene('heart', heartScene);

const memoryScene = new MemoryScene(sceneManager);
sceneManager.addScene('memory', memoryScene);

const promiseScene = new PromiseScene(sceneManager);
sceneManager.addScene('promise', promiseScene);

const finaleScene = new FinaleScene(sceneManager);
sceneManager.addScene('finale', finaleScene);

// Start with first scene
sceneManager.switchScene('portal');

console.log("Core Engine Initialized & Portal Scene Loaded");
