import { adaptState, adaptEffect } from "promethium-js";
import { Ref } from "lit/directives/ref.js";
import WaTreeItem from "@awesome.me/webawesome/dist/components/tree-item/tree-item.js";
import {
  attachClosestEdge,
  extractClosestEdge,
  Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";

export type DraggableOptions = Parameters<typeof draggable>[0];

export type DropTargetOptions = Parameters<typeof dropTargetForElements>[0];

export function adaptDraggableFunctionality(options: {
  draggableOptions?: Partial<DraggableOptions>;
  dropTargetOptions?: Partial<DropTargetOptions>;
  treeItemRef: Ref<WaTreeItem>;
}) {
  const draggedOverEdge = adaptState<Edge | null>(null);
  const dragging = adaptState(false);

  adaptEffect(
    () => {
      if (
        options.draggableOptions &&
        options.dropTargetOptions &&
        options.treeItemRef.value
      ) {
        options.draggableOptions.element = options.treeItemRef.value;
        options.draggableOptions.onDragStart = () => dragging.set(true);
        options.draggableOptions.onDrop = () => dragging.set(false);
        options.dropTargetOptions.element = options.treeItemRef.value;
        const previousGetDataFn = options.dropTargetOptions.getData;
        options.dropTargetOptions.getData = ({ input, element, source }) => {
          const data =
            previousGetDataFn?.({
              input,
              element,
              source,
            }) ?? {};

          return attachClosestEdge(data, {
            input,
            element,
            // you can specify what edges you want to allow the user to be closest to
            allowedEdges: ["top", "bottom"],
          });
        };
        options.dropTargetOptions.onDrag = ({ self, source }) => {
          const closestEdgeOfTarget = extractClosestEdge(self.data);
          if (
            self.element === source.element ||
            self.data.type !== source.data.type
          ) {
            draggedOverEdge.set(null);
          } else {
            draggedOverEdge.set(closestEdgeOfTarget);
          }
        };
        options.dropTargetOptions.onDragLeave = () => {
          draggedOverEdge.set(null);
        };
        const previousOnDropFunction = options.dropTargetOptions.onDrop;
        options.dropTargetOptions.onDrop = ({ self, location, source }) => {
          if (
            self.data.type === source.data.type &&
            self.element !== source.element
          ) {
            previousOnDropFunction?.({ self, location, source });
          }
          draggedOverEdge.set(null);
        };

        return combine(
          draggable(options.draggableOptions as DraggableOptions),
          dropTargetForElements(options.dropTargetOptions as DropTargetOptions),
        );
      }
    },
    { deps: () => void 0 },
  );

  return {
    dragging,
    draggedOverEdge,
  };
}
