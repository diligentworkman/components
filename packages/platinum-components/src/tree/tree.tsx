import { styleMap } from "lit/directives/style-map.js";
import "@awesome.me/webawesome/dist/components/tree/tree.js";
import WaTree from "@awesome.me/webawesome/dist/components/tree/tree.js";
import { TreeItem, TreeItemProps } from "../tree-item/tree-item.js";

export type TreeProps = {
  items: Array<TreeItemProps>;
  height?: string;
  selection?: WaTree["selection"];
};

export function Tree(props: TreeProps) {
  return () => {
    return (
      <wa-tree
        $attr:style={styleMap({
          height: props.height ?? undefined,
        })}
        attr:selection={props.selection ?? "leaf"}
        on:wa-selection-change={(e) => {
          e.detail.selection.forEach((treeItem) => treeItem.click());
        }}
      >
        {props.items.map((item) => {
          return <TreeItem {...item} />;
        })}
      </wa-tree>
    );
  };
}
