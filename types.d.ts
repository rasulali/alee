import { MotionValue } from "motion/react";

declare global {
  type Nodes = {
    [nodeName: string]: THREE.Object3D | THREE.Mesh | THREE.Points | THREE.Line
  }
  interface DivierProps {
    text?: string
  }
}
export { };
