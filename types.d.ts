import { MotionValue } from "framer-motion";

declare global {
  type Nodes = {
    [nodeName: string]: THREE.Object3D | THREE.Mesh | THREE.Points | THREE.Line
  }
}
export { };
