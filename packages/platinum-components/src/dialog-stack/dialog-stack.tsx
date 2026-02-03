import "@awesome.me/webawesome/dist/components/dialog/dialog.js";
import { adaptState } from "promethium-js";
import { DraggableOptions, DropTargetOptions } from "../shared/dnd.types";
import {
  WaAfterHideEvent,
  WaAfterShowEvent,
  WaCollapseEvent,
  WaExpandEvent,
  WaHideEvent,
  WaSelectEvent,
  WaShowEvent,
} from "@awesome.me/webawesome";
import { CSSResult } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { live } from "lit/directives/live.js";
import { JSX } from "promethium-js/jsx-runtime";

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

export type DialogStackTreeNavigationStackEntryElement = {
  tooltipText: string;
  prefixElement?: JSX.Element;
  label: string;
  actionButtons: Array<{
    tooltipText: string;
    // TODO: have default icon
    iconName?: string;
    iconUrl?: string;
    onClick?: (e: MouseEvent) => void;
  }>;
  scrollIntoView?: boolean;
  expanded?: boolean;
  selected?: boolean;
  onExpand?: (e: WaExpandEvent) => void;
  onCollapse?: (e: WaCollapseEvent) => void;
  onDoubleClick?: (e: MouseEvent) => void;
  onSelect?: (e: WaSelectEvent) => void;
  draggableOptions?: Partial<DraggableOptions>;
  dropTargetOptions?: Partial<DropTargetOptions>;
};

export type DialogStackTreeNavigationStackEntry =
  CreateDialogStackNavigationStackEntry<
    "tree",
    {
      elements: Array<DialogStackTreeNavigationStackEntryElement>;
    }
  >;

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

  function closeDialogStack() {
    navigationStack.set([]);
  }

  return {
    getNavigationStack: navigationStack.get.bind(navigationStack),
    navigateDialogStackTo,
    replaceDialogStackNavigationStackWith,
    closeDialogStack,
  };
}

export function DialogStack(props: {
  controller: DialogStackController;
  styles?: CSSResult;
}) {
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
        >
          {
            // TODO: report `choose` for not passing in item to template function
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
