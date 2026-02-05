import { styleMap } from "lit/directives/style-map.js";
import { adaptEffect, styles } from "promethium-js";
import { createRef, ref } from "lit/directives/ref.js";
import { JSX } from "promethium-js/jsx-runtime";
import "@awesome.me/webawesome/dist/components/tree-item/tree-item.js";
import "@awesome.me/webawesome/dist/components/button-group/button-group.js";
import "@awesome.me/webawesome/dist/components/button/button.js";
import "@awesome.me/webawesome/dist/components/icon/icon.js";
import WaTreeItem from "@awesome.me/webawesome/dist/components/tree-item/tree-item.js";
import WaButtonGroup from "@awesome.me/webawesome/dist/components/button-group/button-group.js";
import { WaCollapseEvent, WaExpandEvent } from "@awesome.me/webawesome";
import {
  adaptDraggableFunctionality,
  DraggableOptions,
  DropTargetOptions,
} from "./adaptDraggableFunctionality";
import { css } from "lit";

const treeItemStyles = css`
  ${styles.scope} wa-button::part(base) {
    padding: 0.2rem;
    width: max-content;
    height: max-content;
  }
`;

export type TreeItemProps = {
  children: JSX.Element;
  title: string;
  items?: Array<TreeItemProps>;
  scrollIntoView?: boolean;
  actionButtons?: Array<{
    name?: string;
    src?: string;
    title: string;
    onClick: (e: MouseEvent) => void;
  }>;
  expanded?: boolean;
  selected?: boolean;
  onExpand?: (e: WaExpandEvent) => void;
  onCollapse?: (e: WaCollapseEvent) => void;
  onDoubleClick?: (e: MouseEvent) => void;
  onSelect?: (e: MouseEvent) => void;
  draggableOptions?: Partial<DraggableOptions>;
  dropTargetOptions?: Partial<DropTargetOptions>;
};

export function TreeItem(props: TreeItemProps) {
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

  const { draggedOverEdge, dragging } = adaptDraggableFunctionality({
    draggableOptions: props.draggableOptions,
    dropTargetOptions: props.dropTargetOptions,
    treeItemRef,
  });

  return () => {
    const draggedOverStyles = draggedOverEdge.value
      ? {
          [`border-${draggedOverEdge.value}`]:
            "0.15rem solid var(--wa-color-brand-50)",
        }
      : {};

    return (
      <wa-tree-item
        use:styles={styles.inject(treeItemStyles)}
        use:ref={ref(treeItemRef)}
        attr:title={props.title}
        $attr:style={styleMap({
          // whiteSpace: "noWrap",
          position: "relative",
          opacity: dragging.value ? 0.5 : 1,
          ...draggedOverStyles,
        })}
        bool:expanded={props.expanded}
        bool:selected={props.selected}
        on:wa-expand={props.onExpand}
        on:wa-collapse={props.onCollapse}
        on:click={props.onSelect}
        on:dblclick={props.onDoubleClick}
      >
        {props.children}
        {props.items?.map((item) => {
          return <TreeItem {...item} />;
        })}
        <div
          $attr:style={styleMap({
            position: "absolute",
            top: "0.1rem",
            right: "0.1rem",
          })}
        >
          {props.actionButtons?.map((actionButton) => {
            return (
              <wa-button
                attr:variant="neutral"
                attr:appearance="plain"
                attr:size="small"
                on:click={actionButton.onClick}
                $attr:style={styleMap({
                  paddingRight: "0.1rem",
                })}
              >
                <wa-icon
                  attr:title={actionButton.title}
                  attr:label={actionButton.title}
                  attr:name={actionButton.name}
                  attr:src={actionButton.src}
                ></wa-icon>
              </wa-button>
            );
          })}
        </div>
      </wa-tree-item>
    );
  };
}
