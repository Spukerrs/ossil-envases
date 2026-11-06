"use client";

import { Droplets, Eye, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STORE_CONFIG } from "@/lib/constants";

export type MaterialPreset = "cristal" | "satinado" | "ambar" | "pead";
export type CapPreset = "gotero" | "spray_oro" | "spray_plata" | "tapa_negra";
export type LiquidPreset = "ambar" | "botanico" | "rosas" | "incoloro" | "lavanda";

interface MaterialConfig {
  id: MaterialPreset;
  name: string;
  subtitle: string;
  description: string;
  badge: string;
  specs: {
    transmision: string;
    rugosidad: string;
    proteccionUV: string;
    usoIdeal: string;
  };
  threeProps: {
    color: number;
    roughness: number;
    metalness: number;
    transmission: number;
    ior: number;
    thickness: number;
    transparent: boolean;
    opacity: number;
  };
}

const MATERIAL_CONFIGS: Record<MaterialPreset, MaterialConfig> = {
  cristal: {
    id: "cristal",
    name: "Vidrio Cristal Transparente",
    subtitle: "Claridad óptica de alta pureza",
    description:
      "Vidrio neutro con máxima transparencia y refracción. Permite apreciar la tonalidad real de la fragancia o formulación líquida.",
    badge: "Estándar Perfumería",
    specs: {
      transmision: "98% (Óptica Total)",
      rugosidad: "0.05 (Espejado)",
      proteccionUV: "Baja (Uso interior)",
      usoIdeal: "Perfumes finos, difusores, esencias puras",
    },
    threeProps: {
      color: 0xffffff,
      roughness: 0.04,
      metalness: 0.05,
      transmission: 0.96,
      ior: 1.52,
      thickness: 1.2,
      transparent: true,
      opacity: 1.0,
    },
  },
  satinado: {
    id: "satinado",
    name: "Vidrio Satinado / Esmerilado",
    subtitle: "Acabado mate sedoso al tacto",
    description:
      "Tratado químicamente al ácido para generar una difusión de luz uniforme. Textura 'soft-touch' de alta gama sin marcas de huellas dactilares.",
    badge: "Acabado Premium B2B",
    specs: {
      transmision: "82% (Luz Difusa)",
      rugosidad: "0.48 (Mate Suave)",
      proteccionUV: "Media (Difractaria)",
      usoIdeal: "Cosmética botánica, serums, líneas exclusivas",
    },
    threeProps: {
      color: 0xf4f3ef,
      roughness: 0.52,
      metalness: 0.0,
      transmission: 0.88,
      ior: 1.48,
      thickness: 1.5,
      transparent: true,
      opacity: 0.95,
    },
  },
  ambar: {
    id: "ambar",
    name: "Vidrio Ámbar Anti-UV",
    subtitle: "Protección fotoprotectora medicinal",
    description:
      "Tonalidad ámbar rica en óxidos de hierro que filtra longitudes de onda ultravioleta (UV), impidiendo la degradación y foto-oxidación del producto.",
    badge: "Grado Farmacopea",
    specs: {
      transmision: "70% (Filtrado Óptico)",
      rugosidad: "0.08 (Brillo Cálido)",
      proteccionUV: "Alta (Bloqueo UV >90%)",
      usoIdeal: "Aceites esenciales, tinturas madre, fármacos",
    },
    threeProps: {
      color: 0x9e4e12,
      roughness: 0.08,
      metalness: 0.05,
      transmission: 0.78,
      ior: 1.54,
      thickness: 1.4,
      transparent: true,
      opacity: 1.0,
    },
  },
  pead: {
    id: "pead",
    name: "Polietileno de Alta Densidad (PEAD)",
    subtitle: "Polímero técnico resistente y opaco",
    description:
      "Plástico de alta resistencia a solventes, ácidos, grasas y caídas. Material no deformable, 100% reciclable y apto para productos de limpieza o uso diario.",
    badge: "Máxima Durabilidad",
    specs: {
      transmision: "0% (Opaco Total)",
      rugosidad: "0.38 (Satinado Plástico)",
      proteccionUV: "Excelente (Barrera Total)",
      usoIdeal: "Lociones, jabón líquido, alcohol en gel, químicos",
    },
    threeProps: {
      color: 0xf8f9fa,
      roughness: 0.38,
      metalness: 0.0,
      transmission: 0.0,
      ior: 1.42,
      thickness: 0.0,
      transparent: false,
      opacity: 1.0,
    },
  },
};

const LIQUID_CONFIGS: Record<LiquidPreset, { name: string; colorHex: number; dotClass: string }> = {
  ambar: {
    name: "Perfume Ámbar Cálido",
    colorHex: 0xd9822b,
    dotClass: "bg-amber-500",
  },
  botanico: {
    name: "Sérum Botánico Romero",
    colorHex: 0x4d7c0f,
    dotClass: "bg-lime-600",
  },
  rosas: {
    name: "Tónico Floral Rosas",
    colorHex: 0xbe185d,
    dotClass: "bg-pink-600",
  },
  lavanda: {
    name: "Difusor Esencia Lavanda",
    colorHex: 0x6d28d9,
    dotClass: "bg-purple-600",
  },
  incoloro: {
    name: "Solución Cristalina Pura",
    colorHex: 0xe2e8f0,
    dotClass: "bg-slate-300",
  },
};

export function Material3DDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMaterial, setActiveMaterial] = useState<MaterialPreset>("cristal");
  const [activeCap, setActiveCap] = useState<CapPreset>("gotero");
  const [activeLiquid, setActiveLiquid] = useState<LiquidPreset>("ambar");
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const isRotatingRef = useRef<boolean>(isRotating);
  isRotatingRef.current = isRotating;

  const bottleGroupRef = useRef<THREE.Group | null>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const liquidMeshRef = useRef<THREE.Mesh | null>(null);
  const liquidMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const capMeshRef = useRef<THREE.Mesh | null>(null);
  const bulbMeshRef = useRef<THREE.Mesh | null>(null);
  const actuatorMeshRef = useRef<THREE.Mesh | null>(null);

  const currentConfig = MATERIAL_CONFIGS[activeMaterial];

  // biome-ignore lint/correctness/useExhaustiveDependencies: WebGL scene lifecycle runs on mount; dynamic reactive property updates are handled in dedicated effects below.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- SETUP THREE.JS SCENE ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x181817); // Dark apothecary slate

    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // --- ILUMINACIÓN INDUSTRIAL DE ESTUDIO ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight(0xfff8ee, 2.5);
    topLight.position.set(2, 4, 3);
    scene.add(topLight);

    const rimLight = new THREE.DirectionalLight(0xbad7ff, 3.2);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffeedd, 1.3);
    fillLight.position.set(0, -2, 2);
    scene.add(fillLight);

    // --- GRUPO PRINCIPAL DE LA BOTELLA ---
    const bottleGroup = new THREE.Group();
    bottleGroupRef.current = bottleGroup;
    scene.add(bottleGroup);

    // --- CREAR GEOMETRÍA DE BOTELLA APOTHECARY (Boston Round OSSIL) ---
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0, -1.2));
    points.push(new THREE.Vector2(0.72, -1.2));
    points.push(new THREE.Vector2(0.78, -1.16));
    points.push(new THREE.Vector2(0.8, -1.0));
    points.push(new THREE.Vector2(0.8, 0.4));
    points.push(new THREE.Vector2(0.76, 0.65));
    points.push(new THREE.Vector2(0.65, 0.85));
    points.push(new THREE.Vector2(0.45, 1.0));
    points.push(new THREE.Vector2(0.3, 1.08));
    points.push(new THREE.Vector2(0.3, 1.45));
    points.push(new THREE.Vector2(0.34, 1.46));
    points.push(new THREE.Vector2(0.34, 1.54));
    points.push(new THREE.Vector2(0.24, 1.55));
    points.push(new THREE.Vector2(0.24, 1.3));

    const bottleGeometry = new THREE.LatheGeometry(points, 64);
    bottleGeometry.computeVertexNormals();

    const initialProps = MATERIAL_CONFIGS[activeMaterial].threeProps;
    const pbrMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(initialProps.color),
      roughness: initialProps.roughness,
      metalness: initialProps.metalness,
      transmission: initialProps.transmission,
      ior: initialProps.ior,
      thickness: initialProps.thickness,
      transparent: initialProps.transparent,
      opacity: initialProps.opacity,
      clearcoat: activeMaterial !== "pead" ? 1.0 : 0.0,
      clearcoatRoughness: 0.1,
    });
    materialRef.current = pbrMaterial;

    const bottleMesh = new THREE.Mesh(bottleGeometry, pbrMaterial);
    bottleGroup.add(bottleMesh);

    // --- GEOMETRÍA DE LÍQUIDO INTERIOR CON REFRACCIÓN ---
    const liquidPoints: THREE.Vector2[] = [];
    liquidPoints.push(new THREE.Vector2(0, -1.16));
    liquidPoints.push(new THREE.Vector2(0.68, -1.16));
    liquidPoints.push(new THREE.Vector2(0.74, -1.0));
    liquidPoints.push(new THREE.Vector2(0.74, 0.35));
    liquidPoints.push(new THREE.Vector2(0.68, 0.55));
    liquidPoints.push(new THREE.Vector2(0.55, 0.72));
    liquidPoints.push(new THREE.Vector2(0, 0.72)); // Menisco superficial

    const liquidGeometry = new THREE.LatheGeometry(liquidPoints, 48);
    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(LIQUID_CONFIGS[activeLiquid].colorHex),
      transmission: 0.82,
      roughness: 0.08,
      ior: 1.333, // Refracción acuosa/perfumera
      transparent: true,
      opacity: 0.95,
    });
    liquidMatRef.current = liquidMaterial;

    const liquidMesh = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquidMesh.visible = activeMaterial !== "pead";
    liquidMeshRef.current = liquidMesh;
    bottleGroup.add(liquidMesh);

    // Pipeta interior de vidrio para gotero
    const pipetteGeometry = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 16);
    const pipetteMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      roughness: 0.1,
      transparent: true,
      opacity: 0.7,
      ior: 1.45,
    });
    const pipetteMesh = new THREE.Mesh(pipetteGeometry, pipetteMaterial);
    pipetteMesh.position.y = 0.2;
    bottleGroup.add(pipetteMesh);

    // Collarín / Tapa roscada
    const capGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.45, 32);
    const capMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.35,
      metalness: 0.1,
    });
    const capMesh = new THREE.Mesh(capGeometry, capMaterial);
    capMesh.position.y = 1.48;
    capMeshRef.current = capMesh;
    bottleGroup.add(capMesh);

    // Bulbo de goma para gotero
    const bulbGeometry = new THREE.SphereGeometry(0.24, 32, 16);
    bulbGeometry.scale(1, 1.3, 1);
    const bulbMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.8,
    });
    const bulbMesh = new THREE.Mesh(bulbGeometry, bulbMaterial);
    bulbMesh.position.y = 1.82;
    bulbMeshRef.current = bulbMesh;
    bottleGroup.add(bulbMesh);

    // Pulsador / Actuador spray
    const actuatorGeometry = new THREE.CylinderGeometry(0.22, 0.24, 0.48, 32);
    const actuatorMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.2,
      metalness: 0.85,
    });
    const actuatorMesh = new THREE.Mesh(actuatorGeometry, actuatorMaterial);
    actuatorMesh.position.y = 1.8;
    actuatorMesh.visible = false;
    actuatorMeshRef.current = actuatorMesh;
    bottleGroup.add(actuatorMesh);

    // Suelo reflectivo
    const floorGeometry = new THREE.CircleGeometry(2.5, 64);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x121211,
      roughness: 0.6,
      metalness: 0.2,
    });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.21;
    scene.add(floorMesh);

    // --- INTERACTIVIDAD DE MOUSE / TOUCH ---
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !bottleGroupRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      bottleGroupRef.current.rotation.y += deltaX * 0.008;
      bottleGroupRef.current.rotation.x = Math.max(
        -0.3,
        Math.min(0.4, bottleGroupRef.current.rotation.x + deltaY * 0.004),
      );

      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onPointerDown);
    dom.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    dom.addEventListener("touchstart", onPointerDown, { passive: true });
    dom.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 420;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (bottleGroupRef.current && isRotatingRef.current && !isDragging) {
        bottleGroupRef.current.rotation.y += 0.007;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      dom.removeEventListener("mousedown", onPointerDown);
      dom.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      dom.removeEventListener("touchstart", onPointerDown);
      dom.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      renderer.dispose();
      bottleGeometry.dispose();
      liquidGeometry.dispose();
      pbrMaterial.dispose();
      liquidMaterial.dispose();
    };
  }, []);

  // Actualizar material de botella al cambiar de preset
  useEffect(() => {
    if (!materialRef.current) return;
    const props = MATERIAL_CONFIGS[activeMaterial].threeProps;
    const mat = materialRef.current;

    mat.color.setHex(props.color);
    mat.roughness = props.roughness;
    mat.metalness = props.metalness;
    mat.transmission = props.transmission;
    mat.ior = props.ior;
    mat.thickness = props.thickness;
    mat.transparent = props.transparent;
    mat.opacity = props.opacity;
    mat.clearcoat = activeMaterial !== "pead" ? 1.0 : 0.0;
    mat.needsUpdate = true;

    // Si es PEAD (opaco), ocultar el líquido interior
    if (liquidMeshRef.current) {
      liquidMeshRef.current.visible = activeMaterial !== "pead";
    }
  }, [activeMaterial]);

  // Actualizar líquido interior según selección
  useEffect(() => {
    if (!liquidMatRef.current) return;
    liquidMatRef.current.color.setHex(LIQUID_CONFIGS[activeLiquid].colorHex);
    liquidMatRef.current.needsUpdate = true;
  }, [activeLiquid]);

  // Actualizar tapa/válvula según selección
  useEffect(() => {
    if (!capMeshRef.current || !bulbMeshRef.current || !actuatorMeshRef.current) return;

    const cap = capMeshRef.current;
    const bulb = bulbMeshRef.current;
    const actuator = actuatorMeshRef.current;

    const capMat = cap.material as THREE.MeshStandardMaterial;
    const actMat = actuator.material as THREE.MeshStandardMaterial;

    if (activeCap === "gotero") {
      cap.visible = true;
      capMat.color.setHex(0x111111);
      capMat.metalness = 0.1;
      capMat.roughness = 0.4;
      bulb.visible = true;
      actuator.visible = false;
    } else if (activeCap === "spray_oro") {
      cap.visible = true;
      capMat.color.setHex(0xd4af37);
      capMat.metalness = 0.9;
      capMat.roughness = 0.15;
      bulb.visible = false;
      actuator.visible = true;
      actMat.color.setHex(0xe0bf47);
      actMat.metalness = 0.9;
      actMat.roughness = 0.15;
    } else if (activeCap === "spray_plata") {
      cap.visible = true;
      capMat.color.setHex(0xd1d5db);
      capMat.metalness = 0.95;
      capMat.roughness = 0.1;
      bulb.visible = false;
      actuator.visible = true;
      actMat.color.setHex(0xe5e7eb);
      actMat.metalness = 0.95;
      actMat.roughness = 0.1;
    } else if (activeCap === "tapa_negra") {
      cap.visible = true;
      capMat.color.setHex(0x111111);
      capMat.metalness = 0.1;
      capMat.roughness = 0.3;
      bulb.visible = false;
      actuator.visible = false;
    }
  }, [activeCap]);

  const resetRotation = () => {
    if (bottleGroupRef.current) {
      bottleGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <section className="my-12 rounded-3xl bg-[#141413] border border-[#2B2B28] overflow-hidden text-white shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        {/* Visor 3D WebGL (Canvas interactivo) */}
        <div className="lg:col-span-7 relative p-6 flex flex-col justify-between bg-radial from-[#242422] to-[#121211]">
          {/* Cabecera del Visor */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest text-[#D4CEBF] uppercase">
                Render PBR en Tiempo Real • Three.js
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRotating(!isRotating)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  isRotating
                    ? "bg-[#9E734E] text-white border-[#9E734E]"
                    : "bg-[#222220] text-[#A8A29E] border-[#2E2E2B]"
                }`}
              >
                {isRotating ? "Auto-Giro ON" : "Pausar Giro"}
              </button>

              <button
                type="button"
                onClick={resetRotation}
                className="p-1.5 rounded-lg bg-[#222220] border border-[#2E2E2B] text-[#D4CEBF] hover:text-white transition-colors cursor-pointer"
                title="Reiniciar rotación a vista frontal"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Canvas WebGL Contenedor */}
          <div
            ref={containerRef}
            className="w-full h-[360px] sm:h-[400px] cursor-grab active:cursor-grabbing my-2 touch-none select-none"
          />

          {/* Tips de interacción */}
          <div className="flex items-center justify-between text-[11px] text-[#8C827A] z-10 pt-2 border-t border-[#262624]">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#9E734E]" />
              Arrastrá el envase para inspeccionar refracción y líquido interior
            </span>
            <span className="font-mono text-[10px] text-[#A8A29E]">
              Boca 18/415 • Demostrador PBR
            </span>
          </div>
        </div>

        {/* Panel de Controles & Ficha Técnica */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#2B2B28] bg-[#191918]">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#9E734E] px-2.5 py-0.5 rounded-full bg-[#9E734E]/15 border border-[#9E734E]/30">
                  {currentConfig.badge}
                </span>
                <span className="text-xs text-[#8C827A] font-medium">Guía Materiales OSSIL</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white mt-1.5">
                {currentConfig.name}
              </h3>
              <p className="text-xs font-semibold text-[#D4CEBF] mt-0.5">
                {currentConfig.subtitle}
              </p>
              <p className="text-xs text-[#A8A29E] mt-2 leading-relaxed">
                {currentConfig.description}
              </p>
            </div>

            {/* Selector de Materiales (Botones de prueba) */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4CEBF] block">
                1. Acabado del Envase:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(MATERIAL_CONFIGS) as MaterialPreset[]).map((key) => {
                  const cfg = MATERIAL_CONFIGS[key];
                  const isSelected = activeMaterial === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveMaterial(key)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#9E734E] text-white border-[#9E734E] shadow-lg shadow-[#9E734E]/20"
                          : "bg-[#222220] text-[#D4CEBF] border-[#2E2E2B] hover:border-[#444440] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold block">
                          {cfg.name.split(" ")[1] || cfg.name}
                        </span>
                        {isSelected && <Sparkles className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="text-[10px] opacity-80 line-clamp-1 mt-0.5">
                        {cfg.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selector de Válvula / Accesorio */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4CEBF] block">
                2. Accesorio / Cierre en 3D:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: "gotero",
                    label: "Gotero Negro",
                    desc: "Bulbo silicona",
                  },
                  {
                    id: "spray_oro",
                    label: "Spray Oro",
                    desc: "Atomizador lujo",
                  },
                  {
                    id: "spray_plata",
                    label: "Spray Plata",
                    desc: "Cromado fino",
                  },
                  {
                    id: "tapa_negra",
                    label: "Tapa Ciega",
                    desc: "Cierre hermético",
                  },
                ].map((cap) => {
                  const isSelected = activeCap === cap.id;
                  return (
                    <button
                      key={cap.id}
                      type="button"
                      onClick={() => setActiveCap(cap.id as CapPreset)}
                      className={`p-2 rounded-xl text-left border transition-all text-xs font-bold cursor-pointer ${
                        isSelected
                          ? "bg-[#FFFFFF] text-[#141413] border-white shadow-xs"
                          : "bg-[#222220] text-[#A8A29E] border-[#2E2E2B] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{cap.label}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#9E734E]" />}
                      </div>
                      <span className="text-[10px] font-normal opacity-70 block mt-0.5">
                        {cap.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selector de Tinte de Líquido Interior (Solo cuando no es PEAD) */}
            {activeMaterial !== "pead" && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4CEBF] flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-[#9E734E]" />
                  <span>3. Tinte de Líquido Interior:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(LIQUID_CONFIGS) as LiquidPreset[]).map((key) => {
                    const lq = LIQUID_CONFIGS[key];
                    const isSelected = activeLiquid === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setActiveLiquid(key)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#FFFFFF] text-[#141413] border-white font-bold shadow-xs"
                            : "bg-[#222220] text-[#D4CEBF] border-[#2E2E2B] hover:text-white"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${lq.dotClass}`} />
                        <span>{lq.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tabla de Especificaciones Ópticas y Físicas */}
            <div className="p-3.5 rounded-2xl bg-[#141413] border border-[#2B2B28] space-y-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] text-[#8C827A] block">Transmisión:</span>
                  <span className="font-semibold text-white">
                    {currentConfig.specs.transmision}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C827A] block">Rugosidad:</span>
                  <span className="font-semibold text-white">{currentConfig.specs.rugosidad}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C827A] block">Protección UV:</span>
                  <span className="font-semibold text-amber-400">
                    {currentConfig.specs.proteccionUV}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C827A] block">Uso Ideal:</span>
                  <span className="font-semibold text-white truncate block">
                    {currentConfig.specs.usoIdeal}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Directo a Cotización de Muestra */}
          <div className="pt-4 mt-4 border-t border-[#2B2B28]">
            <a
              href={STORE_CONFIG.contact.whatsappUrl(
                `Hola OSSIL, estoy viendo el acabado ${currentConfig.name} con accesorio ${activeCap} y líquido ${LIQUID_CONFIGS[activeLiquid].name} en el visor 3D y quisiera solicitar muestras físicas o cotización.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#141413] text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-sm cursor-pointer"
            >
              <span>Solicitar Muestra de {currentConfig.name.split(" ")[1] || "Material"}</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
