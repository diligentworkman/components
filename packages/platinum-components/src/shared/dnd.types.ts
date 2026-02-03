import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

export type DraggableOptions = Parameters<typeof draggable>[0];
export type DropTargetOptions = Parameters<typeof dropTargetForElements>[0];
