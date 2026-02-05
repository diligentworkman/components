import { render } from "lit";
import "@awesome.me/webawesome/dist/styles/webawesome.css";
import "./custom-elements.ts";
import { DialogStackTestComponent } from "./test-components/dialog-stack.tsx";
import { TestComponentContainer } from "./test-component-container.tsx";
import { TreeTestComponent } from "./test-components/tree.tsx";

render(
  <>
    <TestComponentContainer name="Dialog Stack">
      <DialogStackTestComponent />
    </TestComponentContainer>
    <TestComponentContainer name="Tree">
      <TreeTestComponent />
    </TestComponentContainer>
  </>,
  document.body,
);
