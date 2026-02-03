import { styleMap } from "lit/directives/style-map.js";
import "@awesome.me/webawesome/dist/components/tree/tree.js";
import WaTree from "@awesome.me/webawesome/dist/components/tree/tree.js";

export function Tree(props: {
  contentFn: () => unknown;
  height?: string;
  selection?: WaTree["selection"];
}) {
  return () => {
    return (
      <wa-tree
        $attr:style={styleMap({
          height: props.height ?? undefined,
          overflowY: "auto",
        })}
        attr:selection={props.selection ?? "leaf"}
        attr:tabindex="-1"
        on:wa-selection-change={(e) => {
          e.detail.selection.forEach((treeItem) => treeItem.click());
        }}
      >
        {props.contentFn()}
      </wa-tree>
    );
  };
}
