import "@awesome.me/webawesome/dist/styles/webawesome.css";
import {
  DialogStack,
  createDialogStackController,
} from "@diligentworkman/platinum-components";
import "../custom-elements.ts";
import { adaptState } from "promethium-js";
import { styleMap } from "lit/directives/style-map.js";

const dialogStackController = createDialogStackController();

export function DialogStackTestComponent() {
  const childrenTextArray = ["Hi", "Ho", "Howdy!", "Herh!", "Man!", "Mandem!"];
  const count = adaptState(0);

  function spawnDialogsInStack() {
    const navigationStackEntries = Array.from({ length: count.value }, () => {
      const selectedChildrenText =
        childrenTextArray[Math.floor(Math.random() * childrenTextArray.length)];

      return {
        type: "arbitraryContent",
        label: selectedChildrenText,
        children: (
          <wa-button on:click={spawnDialogsInStack}>
            {selectedChildrenText}
          </wa-button>
        ),
      } as const;
    });

    dialogStackController.navigateDialogStackTo(...navigationStackEntries);
  }

  return () => {
    return (
      <>
        <DialogStack controller={dialogStackController} />
        <wa-button on:click={spawnDialogsInStack}>Open Dialog Stack</wa-button>
        <div
          $attr:style={styleMap({
            marginTop: "1rem",
          })}
        >
          <wa-button
            on:click={() => {
              count.set(count.value - 1);
            }}
          >
            -
          </wa-button>
          <span
            $attr:style={styleMap({
              padding: "1rem",
            })}
          >
            {count.value}
          </span>
          <wa-button
            on:click={() => {
              count.set(count.value + 1);
            }}
          >
            +
          </wa-button>
        </div>
      </>
    );
  };
}
