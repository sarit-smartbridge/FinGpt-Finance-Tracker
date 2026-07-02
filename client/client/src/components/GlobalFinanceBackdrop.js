import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const material = (color, opacity = 1, roughness = 0.56, metalness = 0.03) => (
    new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness,
        transparent: opacity < 1,
        opacity,
    })
);

const GlobalFinanceBackdrop = () => {
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
        const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0.6, 11);
        camera.lookAt(0, 0, 0);

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        } catch (error) {
            mount.setAttribute('data-webgl', 'unavailable');
            return undefined;
        }

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = false;
        mount.appendChild(renderer.domElement);

        scene.add(new THREE.HemisphereLight(0xffffff, 0xb9d9d3, 2.8));
        const key = new THREE.DirectionalLight(0xffffff, 2.7);
        key.position.set(5, 7, 6);
        scene.add(key);
        const rim = new THREE.PointLight(0x0ea5e9, 1.6, 16);
        rim.position.set(-5, 2, 2);
        scene.add(rim);

        const group = new THREE.Group();
        scene.add(group);

        const teal = material(0x0f766e, 0.58);
        const blue = material(0x2563eb, 0.48);
        const green = material(0x15803d, 0.5);
        const red = material(0xbe123c, 0.42);
        const white = material(0xffffff, 0.72);
        const slate = material(0x17202a, 0.36);
        const gold = material(0xf59e0b, 0.58, 0.38, 0.18);

        const grid = new THREE.GridHelper(11, 18, 0x0f766e, 0x93c5fd);
        grid.position.set(0, -3.2, -1.8);
        const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
        gridMaterials.forEach((item) => {
            item.transparent = true;
            item.opacity = 0.16;
        });
        group.add(grid);

        const leftBars = new THREE.Group();
        [-2.1, -1.45, -0.8, -0.15].forEach((x, i) => {
            const height = [0.9, 1.35, 0.72, 1.65][i];
            const mesh = new THREE.Mesh(
                new THREE.BoxGeometry(0.34, height, 0.34),
                [green, blue, red, teal][i]
            );
            mesh.position.set(x, -2.4 + height / 2, -0.4);
            leftBars.add(mesh);
        });
        leftBars.position.set(-3.65, -0.2, -1.4);
        leftBars.rotation.set(-0.15, 0.42, 0.02);
        group.add(leftBars);

        const ledger = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.1, 0.1), white);
        ledger.position.set(4.1, 1.72, -1.7);
        ledger.rotation.set(0.06, -0.38, -0.02);
        group.add(ledger);

        for (let i = 0; i < 4; i += 1) {
            const line = new THREE.Mesh(new THREE.BoxGeometry(2.55 - i * 0.24, 0.07, 0.08), i === 0 ? teal : slate);
            line.position.set(3.95, 2.22 - i * 0.34, -1.55);
            line.rotation.copy(ledger.rotation);
            group.add(line);
        }

        const wallet = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.78, 0.55), slate);
        wallet.position.set(4.4, -2.38, -0.9);
        wallet.rotation.set(0.14, -0.5, 0.06);
        group.add(wallet);

        for (let i = 0; i < 7; i += 1) {
            const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.045, 32), gold);
            coin.position.set(3.85 + i * 0.17, -1.86 + Math.sin(i) * 0.08, -1.15 + i * 0.035);
            coin.rotation.set(Math.PI / 2, 0.1, 0.12);
            group.add(coin);
        }

        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.06, 16, 72), blue);
        ring.position.set(-4.55, 1.9, -2.2);
        ring.rotation.set(1.1, 0.25, -0.2);
        group.add(ring);

        const halo = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.045, 16, 96), teal);
        halo.position.set(4.95, 0.25, -3);
        halo.rotation.set(1.18, -0.32, 0.16);
        group.add(halo);

        const cardA = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.92, 0.08), white);
        cardA.position.set(-4.95, 0.85, -1.5);
        cardA.rotation.set(0.08, 0.48, -0.08);
        group.add(cardA);

        const cardB = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.78, 0.08), white);
        cardB.position.set(0.35, -2.9, -2);
        cardB.rotation.set(-0.08, -0.2, 0.06);
        group.add(cardB);

        const floatingCoin = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.055, 42), gold);
        floatingCoin.position.set(-2.05, 2.55, -2.4);
        floatingCoin.rotation.set(Math.PI / 2, 0.15, -0.2);
        group.add(floatingCoin);

        const smallBars = new THREE.Group();
        [0.45, 0.82, 1.08].forEach((height, i) => {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, height, 0.24), [teal, green, blue][i]);
            mesh.position.set(i * 0.42, height / 2, 0);
            smallBars.add(mesh);
        });
        smallBars.position.set(2.15, -3.05, -1.65);
        smallBars.rotation.set(-0.08, -0.52, 0.02);
        group.add(smallBars);

        const addDataRibbon = (points, color, opacity) => {
            const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
            const mesh = new THREE.Mesh(
                new THREE.TubeGeometry(curve, 80, 0.018, 8, false),
                new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
            );
            group.add(mesh);
            return mesh;
        };

        const ribbonA = addDataRibbon([
            [-5.7, -1.6, -2.4],
            [-3.4, 0.1, -2.8],
            [-0.5, 1.05, -3.2],
            [2.2, 0.1, -2.7],
            [5.5, 1.25, -2.9],
        ], 0x0f766e, 0.36);
        const ribbonB = addDataRibbon([
            [-5.4, 2.8, -3.4],
            [-2.2, 2.15, -2.5],
            [0.9, 2.7, -3.1],
            [4.7, 1.9, -2.6],
        ], 0x2563eb, 0.28);
        const ribbonC = addDataRibbon([
            [-4.6, -2.85, -2.2],
            [-1.5, -2.3, -3],
            [1.5, -2.7, -2.5],
            [4.7, -1.8, -2.8],
        ], 0xf59e0b, 0.24);

        const pointer = { x: 0, y: 0 };
        const onPointerMove = (event) => {
            pointer.x = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 0.13;
            pointer.y = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 0.08;
        };
        window.addEventListener('pointermove', onPointerMove);

        const resize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height, false);
            camera.aspect = width / Math.max(height, 1);
            camera.position.z = width < 700 ? 12.5 : 11;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', resize);
        resize();

        let frameId;
        const clock = new THREE.Clock();
        const render = () => {
            const elapsed = clock.getElapsedTime();
            if (!prefersReducedMotion) {
                group.rotation.y += ((pointer.x + Math.sin(elapsed * 0.18) * 0.035) - group.rotation.y) * 0.035;
                group.rotation.x += ((-pointer.y * 0.55) - group.rotation.x) * 0.035;
                leftBars.position.y = -0.2 + Math.sin(elapsed * 0.85) * 0.08;
                ledger.position.y = 1.72 + Math.cos(elapsed * 0.7) * 0.08;
                wallet.position.y = -2.38 + Math.sin(elapsed * 0.75) * 0.05;
                ring.rotation.z += 0.004;
                halo.rotation.z -= 0.003;
                cardA.position.y = 0.85 + Math.sin(elapsed * 0.9) * 0.06;
                cardB.position.y = -2.9 + Math.cos(elapsed * 0.8) * 0.05;
                floatingCoin.position.y = 2.55 + Math.sin(elapsed * 0.95) * 0.08;
                floatingCoin.rotation.z += 0.012;
                ribbonA.position.y = Math.sin(elapsed * 0.42) * 0.045;
                ribbonB.position.y = Math.cos(elapsed * 0.38) * 0.04;
                ribbonC.position.y = Math.sin(elapsed * 0.36) * 0.035;
            }
            renderer.render(scene, camera);
            frameId = window.requestAnimationFrame(render);
        };
        render();

        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onPointerMove);
            mount.removeChild(renderer.domElement);
            renderer.dispose();
            scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach((item) => item.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        };
    }, []);

    return <div ref={mountRef} className="app-3d-backdrop" aria-hidden="true" />;
};

export default GlobalFinanceBackdrop;
