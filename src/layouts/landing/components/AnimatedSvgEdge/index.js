import { BaseEdge, getBezierPath, getStraightPath, getSmoothStepPath } from "@xyflow/react";

export function AnimatedSvgEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data = {
    duration: 2,
    direction: "forward",
    path: "bezier",
    repeat: "indefinite",
    shape: "circle",
  },
  ...delegated
}) {
  const Shape = shapes[data.shape];

  const [path] = getPath({
    type: data.path ?? "bezier",
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const animateMotionProps = getAnimateMotionProps({
    duration: data.duration,
    direction: data.direction ?? "forward",
    repeat: data.repeat ?? "indefinite",
    path,
  });

  return (
    <>
      <BaseEdge id={id} path={path} {...delegated} />
      <Shape animateMotionProps={animateMotionProps} />
    </>
  );
}
