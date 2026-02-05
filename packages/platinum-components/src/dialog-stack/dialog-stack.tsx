import "@awesome.me/webawesome/dist/components/dialog/dialog.js";
import { adaptState } from "promethium-js";
import {
  WaAfterHideEvent,
  WaAfterShowEvent,
  WaHideEvent,
  WaShowEvent,
} from "@awesome.me/webawesome";
import { CSSResult } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { live } from "lit/directives/live.js";
import { JSX } from "promethium-js/jsx-runtime";
import { TreeProps } from "../tree/tree.js";

type CreateDialogStackNavigationStackEntry<
  T extends string,
  B extends Record<string, unknown> = {},
> = {
  type: T;
  id: string;
  label?: string;
  headerActions?: JSX.Element;
  footer?: JSX.Element;
  withoutHeader?: boolean;
  lightDismiss?: boolean;
  onShow?: (e: WaShowEvent) => void;
  onHide?: (e: WaHideEvent) => void;
  onAfterShow?: (e: WaAfterShowEvent) => void;
  onAfterHide?: (e: WaAfterHideEvent) => void;
} & B;

export type DialogStackFormNavigationStackEntry =
  CreateDialogStackNavigationStackEntry<
    "form",
    { elements: Array<JSX.Element> }
  >;

export type DialogStackTreeNavigationStackEntry =
  CreateDialogStackNavigationStackEntry<"tree", TreeProps>;

export type DialogStackArbitraryContentNavigationStackEntry =
  CreateDialogStackNavigationStackEntry<
    "arbitraryContent",
    { children: JSX.Element }
  >;

export type DialogStackNavigationStackEntry =
  | DialogStackFormNavigationStackEntry
  | DialogStackTreeNavigationStackEntry
  | DialogStackArbitraryContentNavigationStackEntry;

type DistributiveOmit<T, K extends PropertyKey> = T extends any
  ? Omit<T, K>
  : never;

function generateId() {
  return Math.random().toString() + Date.now().toString();
}

export type DialogStackController = ReturnType<
  typeof createDialogStackController
>;

export function createDialogStackController() {
  const navigationStack = adaptState<Array<DialogStackNavigationStackEntry>>(
    [],
  );

  function navigateDialogStackTo(
    ...navigationStackEntriesWithoutIds: Array<
      DistributiveOmit<DialogStackNavigationStackEntry, "id">
    >
  ) {
    const navigationStackEntries = navigationStackEntriesWithoutIds.map(
      (navigationStackEntryWithoutId) => {
        return {
          ...navigationStackEntryWithoutId,
          id: generateId(),
        };
      },
    ) as Array<DialogStackNavigationStackEntry>;
    navigationStack.set([...navigationStack.get(), ...navigationStackEntries]);
  }

  function replaceDialogStackNavigationStackWith(
    ...navigationStackEntriesWithoutIds: Array<
      DistributiveOmit<DialogStackNavigationStackEntry, "id">
    >
  ) {
    const navigationStackEntries = navigationStackEntriesWithoutIds.map(
      (navigationStackEntryWithoutId) => {
        return {
          ...navigationStackEntryWithoutId,
          id: generateId(),
        };
      },
    ) as Array<DialogStackNavigationStackEntry>;
    navigationStack.set(navigationStackEntries);
  }

  function navigateBack() {
    navigationStack.mutate(() => {
      navigationStack.value.pop();
    });
  }

  function closeDialogStack() {
    navigationStack.set([]);
  }

  return {
    getNavigationStack: navigationStack.get.bind(navigationStack),
    navigateDialogStackTo,
    replaceDialogStackNavigationStackWith,
    navigateBack,
    closeDialogStack,
  };
}

export type DialogStackProps = {
  controller: DialogStackController;
  styles?: CSSResult;
};

export function DialogStack(props: DialogStackProps) {
  return () => {
    const navigationStack = props.controller.getNavigationStack();
    const navigationStackLength = navigationStack.length;

    return repeat(
      navigationStack,
      (item) => item.id,
      (item) => (
        <wa-dialog
          $prop:open={live(navigationStackLength > 0)}
          attr:label={item.label ?? "Dialog"}
          on:wa-after-hide={() => {
            props.controller.navigateBack();
          }}
        >
          {
            // TODO: report `choose` for not passing in item to template function
            // and implement `betterChoose`
            item.type === "form"
              ? "form"
              : item.type === "tree"
                ? "tree"
                : item.type === "arbitraryContent"
                  ? item.children
                  : "No content to show"
          }
        </wa-dialog>
      ),
    );
  };
}
