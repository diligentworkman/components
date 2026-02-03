import { render } from "lit";
import "@awesome.me/webawesome/dist/styles/webawesome.css";
import {
  DialogStack,
  createDialogStackController,
} from "@diligentworkman/platinum-components";

const dialogStackController = createDialogStackController();

render(
  <>
    <DialogStack controller={dialogStackController} />
    <wa-button
      on:click={() => {
        dialogStackController.navigateDialogStackTo({
          type: "arbitraryContent",
          children: <>Nope</>,
        });
      }}
    >
      Hi, button here!
    </wa-button>
  </>,
  document.body,
);
