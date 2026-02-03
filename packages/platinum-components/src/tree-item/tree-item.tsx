import { styleMap } from "lit/directives/style-map.js";
import { adaptEffect, adaptState } from "promethium-js";
import { createRef, ref } from "lit/directives/ref.js";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  attachClosestEdge,
  extractClosestEdge,
  Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { JSX } from "promethium-js/jsx-runtime";
import "@awesome.me/webawesome/dist/components/tree-item/tree-item.js";
import "@awesome.me/webawesome/dist/components/button-group/button-group.js";
import WaTreeItem from "@awesome.me/webawesome/dist/components/tree-item/tree-item.js";
import WaButtonGroup from "@awesome.me/webawesome/dist/components/button-group/button-group.js";

export type DraggableOptions = Parameters<typeof draggable>[0];
export type DropTargetOptions = Parameters<typeof dropTargetForElements>[0];

export function TreeItem(props: {
  children: JSX.Element;
  tooltipContent: string;
  scrollIntoView?: boolean;
  actionButtons?: JSX.Element;
  expanded?: boolean;
  selected?: boolean;
  onExpand?: (e: Event) => void;
  onCollapse?: (e: Event) => void;
  onDoubleClick?: (e: MouseEvent) => void;
  onSelect?: (e: MouseEvent) => void;
  draggableOptions?: Partial<DraggableOptions>;
  dropTargetOptions?: Partial<DropTargetOptions>;
}) {
  const draggedOverEdge = adaptState<Edge | null>(null);
  const dragging = adaptState(false);
  const treeItemRef = createRef<WaTreeItem>();
  const buttonGroupRef = createRef<WaButtonGroup>();

  adaptEffect(
    () => {
      if (props.scrollIntoView) {
        treeItemRef.value?.scrollIntoView();
      }
    },
    { deps: () => void 0 },
  );

  adaptEffect(
    () => {
      if (
        props.draggableOptions &&
        props.dropTargetOptions &&
        treeItemRef.value
      ) {
        props.draggableOptions.element = treeItemRef.value;
        props.draggableOptions.onDragStart = () => dragging.set(true);
        props.draggableOptions.onDrop = () => dragging.set(false);
        props.dropTargetOptions.element = treeItemRef.value;
        const previousGetDataFn = props.dropTargetOptions.getData;
        props.dropTargetOptions.getData = ({ input, element, source }) => {
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
        props.dropTargetOptions.onDrag = ({ self, source }) => {
          // @maybe
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
        props.dropTargetOptions.onDragLeave = () => {
          draggedOverEdge.set(null);
        };
        const previousOnDropFunction = props.dropTargetOptions.onDrop;
        props.dropTargetOptions.onDrop = ({ self, location, source }) => {
          if (
            self.data.type === source.data.type &&
            self.element !== source.element
          ) {
            previousOnDropFunction?.({ self, location, source });
          }
          draggedOverEdge.set(null);
        };

        return combine(
          draggable(props.draggableOptions as DraggableOptions),
          dropTargetForElements(props.dropTargetOptions as DropTargetOptions),
        );
      }
    },
    { deps: () => void 0 },
  );

  adaptEffect(
    () => {
      (
        Array.from(buttonGroupRef.value?.children ?? []) as Array<HTMLElement>
      ).forEach((iconButton) => {
        iconButton.addEventListener("keydown", (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            iconButton.click();
          }
        });
      });
    },
    { deps: () => void 0 },
  );

  return () => {
    const draggedOverStyles = draggedOverEdge.value
      ? {
          [`border-${draggedOverEdge.value}`]:
            "0.15rem solid var(--sl-color-primary-500)",
        }
      : {};

    return (
      <wa-tree-item
        use:ref={ref(treeItemRef)}
        attr:title={props.tooltipContent}
        $attr:style={styleMap({
          overflow: "hidden",
          whiteSpace: "noWrap",
          position: "relative",
          opacity: dragging.value ? 0.5 : 1,
          ...draggedOverStyles,
        })}
        bool:expanded={props.expanded}
        bool:selected={props.selected}
        on:sl-expand={props.onExpand}
        on:sl-collapse={props.onCollapse}
        on:click={props.onSelect}
        on:dblclick={props.onDoubleClick}
      >
        <div
          attr:class="actions-container"
          $attr:style={styleMap({
            position: "absolute",
            top: 0,
            right: 0,
            width: "100%",
            minHeight: "2rem",
            textAlign: "right",
          })}
        >
          <wa-button-group
            use:ref={ref(buttonGroupRef)}
            attr:label="Actions"
            $attr:style={styleMap({
              padding: "0 0.4rem",
            })}
          >
            {props.actionButtons}
          </wa-button-group>
        </div>
        {props.children}
      </wa-tree-item>
    );
  };
}
