import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Geometric3DCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- SCENE & CAMERA ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.035);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 7.5;

    // --- RENDERER ---
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return undefined;
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 640 ? 1 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Luz neutra nas faces, turquesa e violeta nas bordas.
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe5f3f5, 3.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x35d6cf, 4.2);
    rimLight.position.set(-4, 2, 1);
    scene.add(rimLight);

    const violetLight = new THREE.DirectionalLight(0x9775ec, 2.6);
    violetLight.position.set(4, -2, 2);
    scene.add(violetLight);

    const glintLight = new THREE.PointLight(0x93eee8, 3.0, 20);
    glintLight.position.set(0, 2, 4);
    scene.add(glintLight);

    // --- MASTER CONTAINER ---
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // =========================================================================
    // 1. O MONOLITO PRINCIPAL (A FORMA FENOMENAL ORIGINAL QUE VOCÊ MAIS CURTIU)
    // =========================================================================
    const monolithGroup = new THREE.Group();
    masterGroup.add(monolithGroup);

    // Dodecaedro Usinado em Titânio Negro Escuro
    const titaniumMaterial = new THREE.MeshStandardMaterial({
      color: 0x202529,
      roughness: 0.28,
      metalness: 0.88,
      flatShading: true,
      transparent: true,
      opacity: 0.9,
    });

    const monolithGeo = new THREE.DodecahedronGeometry(1.9, 0);
    const monolithMesh = new THREE.Mesh(monolithGeo, titaniumMaterial);
    monolithGroup.add(monolithMesh);

    // Arestas reais com uma passagem suave entre turquesa e violeta.
    const wireframeGeo = new THREE.EdgesGeometry(monolithGeo);
    const edgePositions = wireframeGeo.getAttribute('position');
    const edgeColors = [];
    const turquoise = new THREE.Color(0x62e3d9);
    const violet = new THREE.Color(0x9d87d9);
    for (let i = 0; i < edgePositions.count; i += 1) {
      const blend = THREE.MathUtils.clamp((edgePositions.getX(i) + 1.9) / 3.8, 0, 1);
      const color = turquoise.clone().lerp(violet, blend);
      edgeColors.push(color.r, color.g, color.b);
    }
    wireframeGeo.setAttribute('color', new THREE.Float32BufferAttribute(edgeColors, 3));
    const wireframeMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
    });
    const wireframeMesh = new THREE.LineSegments(wireframeGeo, wireframeMat);
    monolithGroup.add(wireframeMesh);

    // Anéis Orbitais de Precisão (Giroscópio)
    const innerRingGeo = new THREE.TorusGeometry(2.5, 0.015, 16, 120);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0x327a7a,
      emissive: 0x124b48,
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 0.6,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = Math.PI / 4;
    monolithGroup.add(innerRing);

    const outerRingGeo = new THREE.TorusGeometry(3.2, 0.008, 16, 120);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x9d87d9,
      transparent: true,
      opacity: 0.08,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.y = Math.PI / 3;
    monolithGroup.add(outerRing);

    // Initial positioning
    masterGroup.position.set(2.4, 0.0, -0.5);

    // --- SCROLL & MOUSE INTERACTION ---
    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      targetScrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    };

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 640 ? 1 : 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    handleScroll();

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    let animId;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionPreference.matches;

    const animate = () => {
      if (document.hidden) return;
      if (!reducedMotion) animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.05;
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // O destaque diminui após a abertura para preservar a leitura dos cards.
      const heroFade = THREE.MathUtils.clamp(window.scrollY / Math.max(window.innerHeight * 0.8, 1), 0, 1);
      const lightingStrength = 1 - heroFade * 0.38;
      rimLight.intensity = 4.2 * lightingStrength;
      violetLight.intensity = 2.6 * lightingStrength;
      wireframeMat.opacity = 0.3 * lightingStrength;

      // Studio Glint light following cursor
      glintLight.position.x = Math.sin(elapsedTime * 0.4) * 4 + mouseX * 2;
      glintLight.position.y = 2.0 + Math.cos(elapsedTime * 0.3) * 2 - mouseY * 2;

      // Architectural rotation of the main Dodecahedron Monolith
      monolithMesh.rotation.x = elapsedTime * 0.06 + scrollProgress * Math.PI * 1.8;
      monolithMesh.rotation.y = elapsedTime * 0.1 + scrollProgress * Math.PI * 2.5;
      wireframeMesh.rotation.x = monolithMesh.rotation.x;
      wireframeMesh.rotation.y = monolithMesh.rotation.y;

      innerRing.rotation.z = elapsedTime * 0.12 + scrollProgress * Math.PI * 1.5;
      outerRing.rotation.z = -elapsedTime * 0.07 - scrollProgress * Math.PI;

      // A mesma geometria acompanha a rolagem de toda a página
      const xTrajectory =
        Math.cos(scrollProgress * Math.PI * 2.2) * 1.8 +
        Math.sin(scrollProgress * Math.PI) * 0.6;
      const yTrajectory = -Math.sin(scrollProgress * Math.PI * 1.5) * 0.6;

      masterGroup.position.x = xTrajectory;
      masterGroup.position.y = yTrajectory;
      masterGroup.position.z = -0.5 - Math.sin(scrollProgress * Math.PI) * 1.2;

      const scale = 1.05 - Math.sin(scrollProgress * Math.PI) * 0.2;
      masterGroup.scale.setScalar(scale);

      // Mouse Parallax across the entire screen
      masterGroup.rotation.x += (mouseY * 0.2 - masterGroup.rotation.x) * 0.08;
      masterGroup.rotation.y += (mouseX * 0.25 - masterGroup.rotation.y) * 0.08;

      renderer.render(scene, camera);
    };

    const handleVisibility = () => {
      cancelAnimationFrame(animId);
      if (!document.hidden) animate();
    };

    const handleMotionPreference = (event) => {
      reducedMotion = event.matches;
      cancelAnimationFrame(animId);
      animate();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    motionPreference.addEventListener('change', handleMotionPreference);
    animate();

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', handleVisibility);
      motionPreference.removeEventListener('change', handleMotionPreference);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      const geometries = new Set();
      const materials = new Set();
      scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) {
          const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
          objectMaterials.forEach((material) => materials.add(material));
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-50 sm:opacity-100"
      aria-hidden="true"
    />
  );
}
