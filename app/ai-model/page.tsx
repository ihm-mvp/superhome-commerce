
"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

type ModelViewerProps = {
  url: string;
  format: "GLB" | "OBJ";
};

function ModelViewer({ url, format }: ModelViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("正在初始化...");
  const [error, setError] = useState("");

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let disposed = false;
    let frameId = 0;
    let model: THREE.Object3D | null = null;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f1f3f5");

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.01,
      10000
    );
    camera.position.set(2, 1.5, 2.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x8b8b8b, 2));

    const keyLight = new THREE.DirectionalLight(0xffffff, 3);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);

    const ground = new THREE.GridHelper(4, 20, 0xb0b8c1, 0xd8dde3);
    scene.add(ground);

    const resizeObserver = new ResizeObserver(() => {
      if (!container || disposed) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    resizeObserver.observe(container);

    function frameModel(object: THREE.Object3D) {
      const box = new THREE.Box3().setFromObject(object);

      if (box.isEmpty()) {
        throw new Error("模型没有可显示的几何数据。");
      }

      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);

      if (!Number.isFinite(maxDimension) || maxDimension <= 0) {
        throw new Error("模型尺寸无效。");
      }

      // 将模型移动至视窗中心
      object.position.sub(center);

      // 按模型尺寸调整相机，避免模型过大或过小
      const fitSize = maxDimension * 1.8;
      const distance =
        fitSize / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));

      camera.position.set(
        distance * 0.9,
        distance * 0.65,
        distance * 1.1
      );

      camera.near = Math.max(distance / 1000, 0.001);
      camera.far = distance * 100;
      camera.updateProjectionMatrix();

      controls.target.set(0, 0, 0);
      controls.minDistance = maxDimension * 0.5;
      controls.maxDistance = maxDimension * 10;
      controls.update();

      ground.scale.setScalar(Math.max(maxDimension / 2, 0.1));
    }

    function prepareOBJMaterials(object: THREE.Object3D) {
      object.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;

        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        // OBJ 不带材质文件时，为模型提供默认材质
        const needsDefaultMaterial =
          !child.material ||
          materials.length === 0 ||
          materials.some((material) => !material);

        if (needsDefaultMaterial) {
          child.material = new THREE.MeshStandardMaterial({
            color: "#b8a38d",
            roughness: 0.78,
            metalness: 0,
          });
        }

        if (child.geometry) {
          child.geometry.computeVertexNormals();
        }
      });
    }

    async function loadModel() {
      setStatus("正在加载模型...");
      setError("");

      try {
        let loadedObject: THREE.Object3D;

        if (format === "GLB") {
          const gltf = await new GLTFLoader().loadAsync(url);
          loadedObject = gltf.scene;
        } else {
          loadedObject = await new OBJLoader().loadAsync(url);
          prepareOBJMaterials(loadedObject);
        }

if (disposed) {
          loadedObject.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.geometry.dispose();
              const materials = Array.isArray(child.material)
                ? child.material
                : [child.material];
              materials.forEach((material) => material.dispose());
            }
          });
          return;
        }

        model = loadedObject;
        scene.add(loadedObject);
        frameModel(loadedObject);
        setStatus("模型加载成功");
      } catch (err) {
        console.error(`${format} model loading failed:`, err);

        if (!disposed) {
          setStatus("模型加载失败");
          setError(
            err instanceof Error
              ? err.message
              : "无法加载模型，请检查文件路径和格式。"
          );
        }
      }
    }

    function animate() {
      if (disposed) return;

      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    void loadModel();
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();

      if (model) {
        scene.remove(model);
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();

            const materials = Array.isArray(child.material)
              ? child.material
              : [child.material];

            materials.forEach((material) => material.dispose());
          }
        });
      }

      ground.geometry.dispose();
      if (Array.isArray(ground.material)) {
        ground.material.forEach((material) => material.dispose());
      } else {
        ground.material.dispose();
      }

      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [url, format]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <div>
          <div className="font-semibold text-gray-900">{format} 模型</div>
          <div className="text-xs text-gray-500">
            RR-PC5313_AI_model.{format.toLowerCase()}
          </div>
        </div>

        <span
          className={`text-xs ${
            error ? "text-red-600" : "text-gray-500"
          }`}
        >
          {status}
        </span>
      </div>

      <div
        ref={mountRef}
        className="h-[380px] w-full touch-pan-y"
      />

      {error && (
        <div className="border-t border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="border-t px-4 py-3 text-xs text-gray-500">
        鼠标拖动旋转 · 滚轮缩放 · 触屏拖动旋转
      </div>
    </div>
  );
}

export default function AIModelTestPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <div className="text-sm font-medium text-gray-500">
            MIR · Development Test
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            AI Furniture Model Test
          </h1>

        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ModelViewer
            format="GLB"
            url="/test/RR-PC5313_AI_model.glb"
          />

          <ModelViewer
            format="OBJ"
            url="/test/RR-PC5313_AI_model.obj"
          />
        </div>

      </div>
    </main>
  );
}