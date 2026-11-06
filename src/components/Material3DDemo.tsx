"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, RotateCcw, Eye, ShieldCheck, Sun, Layers } from "lucide-react";

export type MaterialPreset = "cristal" | "satinado" | "ambar" | "pead";

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

export function Material3DDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMaterial, setActiveMaterial] = useState<MaterialPreset>("cristal");
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const bottleGroupRef = useRef<THREE.Group | null>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);

  const currentConfig = MATERIAL_CONFIGS[activeMaterial];

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
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // --- ILUMINACIÓN INDUSTRIAL DE ESTUDIO ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Luz principal cenital suave
    const topLight = new THREE.DirectionalLight(0xfff8ee, 2.4);
    topLight.position.set(2, 4, 3);
    scene.add(topLight);

    // Rim light para destacar el contorno del vidrio
    const rimLight = new THREE.DirectionalLight(0xbad7ff, 3.0);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    // Luz de relleno cálida frontal
    const fillLight = new THREE.DirectionalLight(0xffeedd, 1.2);
    fillLight.position.set(0, -2, 2);
    scene.add(fillLight);

    // --- GRUPO PRINCIPAL DE LA BOTELLA ---
    const bottleGroup = new THREE.Group();
    bottleGroupRef.current = bottleGroup;
    scene.add(bottleGroup);

    // --- CREAR GEOMETRÍA DE BOTELLA APOTHECARY (Estilo Boston Round OSSIL) ---
    // Usamos LatheGeometry para un contorno perfecto de envase de perfumería
    const points: THREE.Vector2[] = [];
    // Base plana con chaflán suave
    points.push(new THREE.Vector2(0, -1.2));
    points.push(new THREE.Vector2(0.72, -1.2));
    points.push(new THREE.Vector2(0.78, -1.16));
    // Cuerpo cilíndrico
    points.push(new THREE.Vector2(0.8, -1.0));
    points.push(new THREE.Vector2(0.8, 0.4));
    // Hombro redondeado tipo Boston Round
    points.push(new THREE.Vector2(0.76, 0.65));
    points.push(new THREE.Vector2(0.65, 0.85));
    points.push(new THREE.Vector2(0.45, 1.0));
    // Cuello
    points.push(new THREE.Vector2(0.3, 1.08));
    points.push(new THREE.Vector2(0.3, 1.45));
    // Rosca / Corona exterior
    points.push(new THREE.Vector2(0.34, 1.46));
    points.push(new THREE.Vector2(0.34, 1.54));
    points.push(new THREE.Vector2(0.24, 1.55));
    // Boca interior
    points.push(new THREE.Vector2(0.24, 1.3));

    const bottleGeometry = new THREE.LatheGeometry(points, 64);
    bottleGeometry.computeVertexNormals();

    // Material PBR inicial
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
    meshRef.current = bottleMesh;
    bottleGroup.add(bottleMesh);

    // Gotero / Pipeta interior para mayor realismo visual de perfumería
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

    // Tapa roscada negra mate con bulbo de goma (Accesorio Gotero Europeo)
    const capGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.45, 32);
    const capMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.35,
      metalness: 0.1,
    });
    const capMesh = new THREE.Mesh(capGeometry, capMaterial);
    capMesh.position.y = 1.48;
    bottleGroup.add(capMesh);

    // Bulbo de silicona superior
    const bulbGeometry = new THREE.SphereGeometry(0.24, 32, 16);
    bulbGeometry.scale(1, 1.3, 1);
    const bulbMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.8,
    });
    const bulbMesh = new THREE.Mesh(bulbGeometry, bulbMaterial);
    bulbMesh.position.y = 1.82;
    bottleGroup.add(bulbMesh);

    // Base reflectiva sutil (Suelo de estudio fotográfico)
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
        Math.min(0.4, bottleGroupRef.current.rotation.x + deltaY * 0.004)
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

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 420;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (bottleGroupRef.current && isRotating && !isDragging) {
        bottleGroupRef.current.rotation.y += 0.007;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
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
      pbrMaterial.dispose();
    };
  }, []);

  // Efecto para actualizar material dinámicamente cuando el usuario cambia de preset
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
  }, [activeMaterial]);

  const resetRotation = () => {
    if (bottleGroupRef.current) {
      bottleGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <section className="my-12 rounded-3xl bg-[#141413] border border-[#2B2B28] overflow-hidden text-white shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* Panel 3D Canvas */}
        <div className="lg:col-span-7 relative flex flex-col justify-between p-6 bg-radial from-[#222220] to-[#141413]">
          {/* Header del Visor */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#A8A29E] font-bold">
                Inspector Óptico PBR 3D
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
                  isRotating
                    ? "bg-[#2A2A27] text-white border-[#3F3F3A]"
                    : "bg-transparent text-[#8C827A] border-[#2A2A27] hover:text-white"
                }`}
                title="Pausar / Reanudar giro automático"
              >
                {isRotating ? "Auto-giro Activo" : "Giro Pausado"}
              </button>

              <button
                onClick={resetRotation}
                className="p-1.5 rounded-lg bg-[#2A2A27] text-[#A8A29E] hover:text-white border border-[#3F3F3A] transition-colors"
                title="Restablecer posición inicial"
              >
                <RotateCcw className="w-3.5 h-3.5" />
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
              Arrastrá el envase para inspeccionar refracción y reflejos
            </span>
            <span className="font-mono text-[10px] text-[#A8A29E]">
              Boca B/E 15 + Gotero Bulbo
            </span>
          </div>
        </div>

        {/* Panel de Controles & Ficha Técnica */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#2B2B28] bg-[#191918]">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#9E734E] px-2.5 py-0.5 rounded-full bg-[#9E734E]/15 border border-[#9E734E]/30">
                  {currentConfig.badge}
                </span>
                <span className="text-xs text-[#8C827A] font-medium">
                  Guía Materiales OSSIL
                </span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white mt-2">
                {currentConfig.name}
              </h3>
              <p className="text-xs font-semibold text-[#D4CEBF] mt-1">
                {currentConfig.subtitle}
              </p>
              <p className="text-xs text-[#A8A29E] mt-3 leading-relaxed">
                {currentConfig.description}
              </p>
            </div>

            {/* Selector de Materiales (Botones de prueba) */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4CEBF] block">
                Seleccioná el acabado de envase:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  Object.keys(MATERIAL_CONFIGS) as MaterialPreset[]
                ).map((key) => {
                  const cfg = MATERIAL_CONFIGS[key];
                  const isSelected = activeMaterial === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveMaterial(key)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        isSelected
                          ? "bg-[#9E734E] text-white border-[#9E734E] shadow-lg shadow-[#9E734E]/20"
                          : "bg-[#222220] text-[#D4CEBF] border-[#2E2E2B] hover:border-[#444440] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold block">{cfg.name.split(" ")[1] || cfg.name}</span>
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

            {/* Tabla de Especificaciones Ópticas y Físicas */}
            <div className="p-4 rounded-2xl bg-[#141413] border border-[#2B2B28] space-y-2.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9E734E] block">
                Ficha Técnica Óptica (Grado Laboratorio):
              </span>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#8C827A] block">Transmisión Lumínica:</span>
                  <span className="font-semibold text-white">{currentConfig.specs.transmision}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C827A] block">Rugosidad Superficial:</span>
                  <span className="font-semibold text-white">{currentConfig.specs.rugosidad}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C827A] block">Protección UV:</span>
                  <span className="font-semibold text-amber-400">{currentConfig.specs.proteccionUV}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C827A] block">Uso Recomendado:</span>
                  <span className="font-semibold text-white line-clamp-1">{currentConfig.specs.usoIdeal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Directo a Cotización de Muestra */}
          <div className="pt-6 mt-6 border-t border-[#2B2B28]">
            <a
              href={`https://wa.me/5493512440156?text=Hola%20OSSIL,%20estoy%20viendo%20el%20acabado%20${encodeURIComponent(
                currentConfig.name
              )}%20en%20el%20sitio%20y%20quisiera%20solicitar%20muestras%20f%C3%ADsicas%20o%20cotizaci%C3%B3n.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#141413] text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-sm"
            >
              <span>Solicitar Muestra Física de {currentConfig.name.split(" ")[1] || "Material"}</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
