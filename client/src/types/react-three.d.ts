declare module '@react-three/fiber' {
  import * as THREE from 'three';
  import * as React from 'react';

  // Basic Canvas props
  export interface CanvasProps extends React.HTMLAttributes<HTMLCanvasElement> {
    children?: React.ReactNode;
    camera?: any;
    gl?: any;
    shadows?: boolean | any;
    raycaster?: any;
    frameloop?: 'always' | 'demand' | 'never';
    resize?: any;
    orthographic?: boolean;
    dpr?: number | [min: number, max: number];
    linear?: boolean;
    flat?: boolean;
    legacy?: boolean;
    events?: any;
  }

  // Basic ThreeElements type
  export interface ThreeElements {
    primitive: any;
    mesh: any;
    points: any;
    line: any;
    lineSegments: any;
    lineLoop: any;
    group: any;
    [k: string]: any;
  }

  export const Canvas: React.FC<CanvasProps>;
  
  // Extend JSX with Three.js elements
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      mesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      group: any;
      // Add other Three.js elements as needed
      [elemName: string]: any;
    }
  }
}

declare module '@react-three/drei' {
  import * as THREE from 'three';
  import * as React from 'react';

  // Basic Text component props
  export interface TextProps {
    children?: React.ReactNode;
    fontSize?: number;
    font?: string;
    letterSpacing?: number;
    lineHeight?: number;
    position?: [number, number, number] | THREE.Vector3;
    rotation?: [number, number, number] | THREE.Euler;
    material?: any;
    color?: string;
    anchorX?: 'left' | 'center' | 'right' | number;
    anchorY?: 'top' | 'center' | 'bottom' | number;
    [key: string]: any;
  }

  // Basic OrbitControls props
  export interface OrbitControlsProps {
    enableZoom?: boolean;
    enablePan?: boolean;
    enableRotate?: boolean;
    minDistance?: number;
    maxDistance?: number;
    [key: string]: any;
  }

  // Basic Cloud props
  export interface CloudProps {
    ref?: React.RefObject<THREE.Group | null>; // Changed to allow null
    opacity?: number;
    speed?: number;
    width?: number;
    depth?: number;
    segments?: number;
    position?: [number, number, number] | THREE.Vector3;
    color?: string;
    [key: string]: any;
  }

  export const Text: React.FC<TextProps>;
  export const OrbitControls: React.FC<OrbitControlsProps>;
  export const Cloud: React.FC<CloudProps>;
}