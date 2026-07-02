import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const makeMat = (color, roughness = 0.52, metalness = 0.05) => (
    new THREE.MeshStandardMaterial({ color, roughness, metalness })
);

const FinanceScene = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return undefined;
        if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent || '')) {
            mount.setAttribute('data-webgl', 'test-fallback');
            return undefined;
        }

        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
        camera.position.set(0, 3.25, 7.35);
        camera.lookAt(0, 0.7, 0);

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        } catch (error) {
            mount.setAttribute('data-webgl', 'unavailable');
            return undefined;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = true;
        mount.appendChild(renderer.domElement);

        const ambient = new THREE.HemisphereLight(0xffffff, 0xdbe7ef, 2.45);
        scene.add(ambient);

        const key = new THREE.DirectionalLight(0xffffff, 2.9);
        key.position.set(4, 7, 5);
        key.castShadow = true;
        scene.add(key);

        const group = new THREE.Group();
        group.scale.setScalar(1.08);
        scene.add(group);

        const ink = makeMat(0x17202a, 0.46, 0.02);
        const surface = makeMat(0xffffff, 0.58, 0.02);
        const baseMat = makeMat(0xe6f0ee, 0.62, 0.02);
        const green = makeMat(0x15803d, 0.5, 0.05);
        const red = makeMat(0xbe123c, 0.52, 0.05);
        const blue = makeMat(0x1d4ed8, 0.48, 0.06);
        const teal = makeMat(0x0f766e, 0.45, 0.08);
        const gold = makeMat(0xf59e0b, 0.38, 0.2);

        const base = new THREE.Mesh(new THREE.BoxGeometry(5.9, 0.25, 3.7), baseMat);
        base.position.y = -0.24;
        base.receiveShadow = true;
        group.add(base);

        const screen = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.25, 0.16), surface);
        screen.position.set(-0.7, 1.05, -0.55);
        screen.rotation.x = -0.06;
        screen.castShadow = true;
        screen.receiveShadow = true;
        group.add(screen);

        const screenTop = new THREE.Mesh(new THREE.BoxGeometry(3.25, 0.12, 0.08), teal);
        screenTop.position.set(-0.7, 2.0, -0.44);
        group.add(screenTop);

        const bars = [
            { x: -1.75, h: 0.78, mat: green },
            { x: -0.88, h: 1.22, mat: blue },
            { x: -0.02, h: 0.56, mat: red },
            { x: 0.85, h: 1.55, mat: green },
        ];

        bars.forEach((bar) => {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.42, bar.h, 0.28), bar.mat);
            mesh.position.set(bar.x, 0.07 + bar.h / 2, -0.28);
            mesh.castShadow = true;
            group.add(mesh);
        });

        const graphPoints = [
            new THREE.Vector3(-2.08, 0.52, -0.08),
            new THREE.Vector3(-1.44, 0.86, -0.08),
            new THREE.Vector3(-0.76, 0.66, -0.08),
            new THREE.Vector3(-0.06, 1.18, -0.08),
            new THREE.Vector3(0.74, 1.02, -0.08),
            new THREE.Vector3(1.38, 1.52, -0.08),
        ];
        const graph = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(graphPoints),
            new THREE.LineBasicMaterial({ color: 0x0f766e, linewidth: 2 })
        );
        graph.position.z = 0.04;
        group.add(graph);

        const wallet = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.7, 0.75), ink);
        wallet.position.set(2, 0.32, 0.65);
        wallet.rotation.y = -0.35;
        wallet.castShadow = true;
        group.add(wallet);

        const clasp = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.8), gold);
        clasp.position.set(1.38, 0.42, 0.55);
        clasp.rotation.y = -0.35;
        clasp.castShadow = true;
        group.add(clasp);

        for (let i = 0; i < 5; i += 1) {
            const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.06, 40), gold);
            coin.position.set(1.55 + i * 0.18, 0.77 + i * 0.055, -0.05 + i * 0.08);
            coin.rotation.set(Math.PI / 2, 0.2, 0.15);
            coin.castShadow = true;
            group.add(coin);
        }

        const reportA = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.72, 0.08), surface);
        reportA.position.set(1.95, 1.63, -0.9);
        reportA.rotation.set(0.08, -0.45, 0.08);
        reportA.castShadow = true;
        group.add(reportA);

        const reportB = new THREE.Mesh(new THREE.BoxGeometry(1, 0.62, 0.08), surface);
        reportB.position.set(-2.38, 1.38, 0.28);
        reportB.rotation.set(-0.03, 0.55, -0.1);
        reportB.castShadow = true;
        group.add(reportB);

        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.07, 16, 64), blue);
        ring.position.set(2.05, 1.66, -0.84);
        ring.rotation.set(1.35, 0.1, 0.25);
        group.add(ring);

        const pointer = { x: 0, y: 0 };
        const onPointerMove = (event) => {
            const rect = mount.getBoundingClientRect();
            pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.28;
            pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.16;
        };
        mount.addEventListener('pointermove', onPointerMove);

        const resize = () => {
            const { width, height } = mount.getBoundingClientRect();
            renderer.setSize(width, height, false);
            camera.aspect = width / Math.max(height, 1);
            camera.updateProjectionMatrix();
        };

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(mount);
        resize();

        let frameId;
        const clock = new THREE.Clock();
        const render = () => {
            const elapsed = clock.getElapsedTime();
            if (!prefersReducedMotion) {
                group.rotation.y += ((pointer.x + Math.sin(elapsed * 0.35) * 0.04) - group.rotation.y) * 0.04;
                group.rotation.x += ((-pointer.y - 0.08) - group.rotation.x) * 0.04;
                reportA.position.y = 1.63 + Math.sin(elapsed * 1.3) * 0.06;
                reportB.position.y = 1.38 + Math.cos(elapsed * 1.1) * 0.05;
                ring.rotation.z += 0.01;
            }
            renderer.render(scene, camera);
            frameId = window.requestAnimationFrame(render);
        };
        render();

        return () => {
            window.cancelAnimationFrame(frameId);
            resizeObserver.disconnect();
            mount.removeEventListener('pointermove', onPointerMove);
            mount.removeChild(renderer.domElement);
            renderer.dispose();
            scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach((material) => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        };
    }, []);

    return <div ref={mountRef} className="finance-scene" aria-hidden="true" />;
};

export default FinanceScene;
