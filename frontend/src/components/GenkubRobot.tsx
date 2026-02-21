'use client';
import React, { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useGraph } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'

export default function GenkubRobot(props: React.JSX.IntrinsicElements['group']) {
    const { scene } = useGLTF('/models/genkub_greeting_robot.gltf')
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
    const { nodes } = useGraph(clone) as any

    const floatRef = useRef<THREE.Group>(null)
    const bodyRef = useRef<THREE.Group>(null)
    const headRef = useRef<THREE.Group>(null)
    const rightArmRef = useRef<THREE.Group>(null)

    // Intro animation tracking
    const introProgress = useRef(0)

    // Smooth Glowing Color Target (Ears, Chest)
    const targetGlowColor = useRef(new THREE.Color('#ffffff'))

    // Dedicated material for the changing rims
    const rimsGlowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#ffffff',
    }), [])

    useEffect(() => {
        // Randomly turn glow to orange and then back
        const colorInterval = setInterval(() => {
            // Chance to turn orange
            if (Math.random() > 0.5) {
                targetGlowColor.current.set('#f97316'); // Bright premium orange

                // Turn back to white after 3.5 seconds to give it time to glow
                setTimeout(() => {
                    targetGlowColor.current.set('#ffffff');
                }, 3500);
            }
        }, 6000);

        return () => clearInterval(colorInterval);
    }, []);

    useFrame((state, delta) => {
        if (floatRef.current && bodyRef.current && headRef.current && rightArmRef.current) {
            const time = state.clock.elapsedTime;

            // Smoothly interpolate the rim color — 0.008 for ultra-smooth transition
            rimsGlowMaterial.color.lerp(targetGlowColor.current, 0.008);

            // Intro Greeting: Head nod + body bounce
            if (introProgress.current < 1) {
                introProgress.current += delta * 0.5;
                const t = Math.min(introProgress.current, 1);

                // Friendly head nod (look down then back up)
                const nodCurve = Math.sin(t * Math.PI * 2) * 0.25;
                headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, nodCurve - 0.122, 0.15);

                // Excited body bounce
                floatRef.current.position.y = Math.sin(t * Math.PI * 3) * 0.12;
            }

            // Smooth bobbing
            floatRef.current.position.y = Math.sin(time * 1.5) * 0.05;

            // Organic breathing (slight scale pulse on the body)
            const breathe = 1 + Math.sin(time * 2.5) * 0.012;
            bodyRef.current.scale.set(breathe, breathe, breathe);

            // Smooth mouse tracking (Coordinates -1 to 1)
            const targetX = THREE.MathUtils.clamp((state.pointer.x * Math.PI) / 4, -0.6, 0.6);
            const targetY = THREE.MathUtils.clamp((state.pointer.y * Math.PI) / 6, -0.4, 0.4);

            // X axis is roll (side tilt) -> Keep 0 !
            // Y axis is yaw (left/right) -> targetX
            // Z axis is pitch (up/down) -> targetY
            headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetX, 0.06);
            headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, targetY - 0.122, 0.06);
            headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, 0.1);

            // Body slightly tracks
            bodyRef.current.rotation.y = THREE.MathUtils.lerp(bodyRef.current.rotation.y, targetX * 0.3, 0.04);
            bodyRef.current.rotation.z = THREE.MathUtils.lerp(bodyRef.current.rotation.z, targetY * 0.1, 0.04);
            bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, 0, 0.04);
        }
    })

    // Dynamic Material for body
    const bodyMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: '#08080a',
        metalness: 0.6,
        roughness: 0.15,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
    }), [])

    // Deep pitch black for the face glass
    const faceMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: '#000000',
        metalness: 0.8,
        roughness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
    }), [])

    // Pure emissive white for Face (Eyes, Mouth) - NEVER CHANGES
    const faceGlowMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#ffffff',
    }), [])

    return (
        <group {...props} dispose={null}>
            <group ref={floatRef}>
                {/* Rotate -90 degrees around Y to make him face exactly front */}
                <group rotation={[0, -Math.PI / 2, 0]}>
                    <group ref={bodyRef}>
                        <group scale={0.01}>
                            <group position={[0, 0.214, 0]} scale={98.043}>
                                <group position={[0, -0.002, 0]} scale={0.01}>
                                    <group ref={headRef} position={[-0.084, 25.17, 0]} rotation={[0, 0, -0.122]} scale={98.043}>
                                        <group position={[0.001, -0.257, 0]}>
                                            <mesh geometry={nodes.Cylinder.geometry} material={bodyMaterial} />
                                            <mesh geometry={nodes.Ears.geometry} material={rimsGlowMaterial} />
                                            <mesh geometry={nodes.Cylinder002.geometry} material={bodyMaterial} />
                                        </group>
                                        <group position={[0.202, -0.084, 0]} scale={[0.01, 0.008, 0.01]}>
                                            <mesh geometry={nodes.Mouth.geometry} material={faceGlowMaterial} position={[-19.679, -16.701, 0]} scale={98.043} />
                                        </group>
                                        <group position={[0.202, -0.019, 0]} scale={0.01}>
                                            <mesh geometry={nodes.Eyes.geometry} material={faceGlowMaterial} position={[-19.679, -23.054, 0]} scale={98.043} />
                                        </group>
                                        <mesh geometry={nodes.Head_1.geometry} material={bodyMaterial} position={[0.001, -0.255, 0]} />
                                        <mesh geometry={nodes.Head_2.geometry} material={faceMaterial} position={[0.001, -0.255, 0]} />
                                    </group>
                                </group>
                                <group position={[0.012, -0.223, 0]}>
                                    <mesh geometry={nodes.Neck.geometry} material={bodyMaterial} position={[-0.012, 0.223, 0]} />
                                    <mesh geometry={nodes.Body.geometry} material={bodyMaterial} position={[-0.012, 0.223, 0]} />
                                    <mesh geometry={nodes.Body_Circle_1.geometry} material={rimsGlowMaterial} position={[-0.012, 0.223, 0]} />
                                    <mesh geometry={nodes.Body_Circle_2.geometry} material={bodyMaterial} position={[-0.012, 0.223, 0]} />
                                </group>
                                <group ref={rightArmRef} position={[0.032, -0.26, 0.254]}>
                                    <group position={[-0.016, 0.202, -0.042]}>
                                        <group position={[0.001, -0.153, 0.054]} scale={0.01}>
                                            <group position={[1.388, -13.646, 1.559]} scale={98.043}>
                                                <mesh geometry={nodes.Arm_R.geometry} material={bodyMaterial} position={[-0.01, 0.273, -0.071]} />
                                                <mesh geometry={nodes.HAND_R.geometry} material={bodyMaterial} position={[-0.01, 0.074, 0.014]} rotation={[Math.PI, -1.571, 0]} />
                                            </group>
                                        </group>
                                        <mesh geometry={nodes.Forearm_R.geometry} material={bodyMaterial} position={[-0.016, 0.058, -0.212]} rotation={[0.035, 0, 0]} scale={[1, 0.8, 1]} />
                                    </group>
                                    <mesh geometry={nodes.Shoulder_R.geometry} material={bodyMaterial} position={[-0.032, 0.26, -0.254]} />
                                </group>
                                <group position={[0.038, -0.254, -0.254]}>
                                    <mesh geometry={nodes.Hand_L.geometry} material={bodyMaterial} position={[-0.032, 0.223, 0.286]} rotation={[0, 0, -0.004]} scale={[0.773, 0.865, 0.892]} />
                                    <mesh geometry={nodes.Arm_L.geometry} material={bodyMaterial} position={[-0.038, 0.254, 0.254]} />
                                    <mesh geometry={nodes.Forearm_L.geometry} material={bodyMaterial} position={[-0.038, 0.254, 0.254]} />
                                    <mesh geometry={nodes.Shoulder_L.geometry} material={bodyMaterial} position={[-0.038, 0.254, 0.254]} />
                                </group>
                            </group>
                        </group>
                    </group>
                </group>
            </group>
        </group>
    )
}
