'use client';

import React, { useState, useCallback, useEffect } from 'react';
import ChatBox from '@/components/ChatBox';
import Browser from '@/components/Browser';
import Terminal from '@/components/Terminal';
import AppLayout from '@/components/AppLayout';
import { apiService } from '@/services/api';
import { Message } from '@/types';

interface Page {
  name: string;
  path: string;
  html: string;
  isActive: boolean;
}

interface GameChange {
  name: string;
  code: string;
  action: 'create' | 'update' | 'delete';
}

interface ChatResponse {
  response: string;
  changes?: GameChange[];
}

interface SystemMetrics {
  memory: number;
  cpu: number;
  network: number;
  fps: number;
}

interface TerminalMessage {
  role: 'system' | 'user' | 'assistant';
  agentName: string;
  content: string;
  timestamp: Date;
  metrics?: SystemMetrics;
  processId?: number;
  threadId?: number;
  type?: 'info' | 'warning' | 'error' | 'success';
}

/**
 * Represents the Game Developer Agent page within Evoka AI.
 * Provides a chat interface for generating and modifying game code.
 */
export default function GameDevPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentHtml, setCurrentHtml] = useState('');
  const [terminalMessages, setTerminalMessages] = useState<TerminalMessage[]>([]);
  const [pages, setPages] = useState<Page[]>([
    {
      name: 'Game',
      path: '/index.html',
      html: `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>3D Racing Game</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
    }
    #speedometer {
      position: fixed;
      bottom: 20px;
      right: 20px;
      color: white;
      font-family: Arial;
      font-size: 20px;
      background: rgba(0,0,0,0.5);
      padding: 10px;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div id="speedometer">Speed: 0 MPH</div>
  <script async src="https://unpkg.com/es-module-shims/dist/es-module-shims.js"></script>
  <script type="importmap">
    {
      "imports": {
        "three": "https://unpkg.com/three@0.156.1/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.156.1/examples/jsm/"
      }
    }
  </script>
  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    
    let scene, camera, renderer, car, controls, wheels = [], currentSpeed = 0;
    const maxSpeed = 0.5;
    const acceleration = 0.01;
    const deceleration = 0.005;
    const turnSpeed = 0.03;
    const keys = {};

    init();
    animate();

    function init() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87CEEB);

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      document.body.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.position.set(10, 10, 10);
      dirLight.castShadow = true;
      scene.add(dirLight);

      const road = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
      );
      road.rotation.x = -Math.PI / 2;
      road.receiveShadow = true;
      scene.add(road);

      car = new THREE.Group();
      const carBody = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1, 4),
        new THREE.MeshStandardMaterial({ color: 0xff0000 })
      );
      carBody.castShadow = true;
      car.add(carBody);

      const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
      const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x202020 });
      const wheelPositions = [[1, 0.4, 1], [-1, 0.4, 1], [1, 0.4, -1], [-1, 0.4, -1]];

      wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(...pos);
        wheels.push(wheel);
        car.add(wheel);
      });

      scene.add(car);

      camera.position.set(0, 5, 10);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.target = car.position;
      controls.enableDamping = true;

      window.addEventListener('resize', onWindowResize, false);

      document.addEventListener('keydown', (event) => keys[event.key.toLowerCase()] = true);
      document.addEventListener('keyup', (event) => keys[event.key.toLowerCase()] = false);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
  </script>
</body>
</html>`,
      isActive: true
    }
  ]);

  useEffect(() => {
    const indexPage = pages.find(p => p.path === '/index.html');
    if (indexPage) {
      setCurrentHtml(indexPage.html);
    }
  }, []);

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-[45%] h-full flex flex-col p-2 gap-2">
          <div className="h-[60%]">
            <ChatBox
              messages={messages}
              onSendMessage={() => {}}
              isLoading={isLoading}
              connectionStatus="GameDev Agent"
            />
          </div>

          <div className="h-[calc(40%-2rem)]">
            <Terminal
              messages={terminalMessages}
              isSimulating={false}
            />
          </div>
        </div>

        <div className="w-[60%] h-[calc(100%-2rem)] p-2 flex flex-col gap-2">
          <div className="flex-1">
            <Browser
              html={currentHtml}
              pages={pages}
              isPreviewMode={false}
              agentType="gamedev"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
