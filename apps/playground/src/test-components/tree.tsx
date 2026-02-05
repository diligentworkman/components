import { Tree } from "@diligentworkman/platinum-components";

export function TreeTestComponent() {
  return () => {
    return (
      <Tree
        items={[
          {
            title: "Bad!",
            children: <>Hey!</>,
            actionButtons: [
              { name: "house", title: "House", onClick() {} },
              { name: "eyedropper", title: "House", onClick() {} },
            ],
            items: [
              { title: "Billy Jean!", children: <>Hi!</> },
              { title: "Billy Jean!", children: <>Hi!</> },
              { title: "Billy Jean!", children: <>Hi!</> },
            ],
          },
          { title: "Billy Jean!", children: <>Hi!</> },
          { title: "Bad!", children: <>Hey!</> },
          { title: "Billy Jean!", children: <>Hi!</> },
          { title: "Bad!", children: <>Hey!</> },
          { title: "Billy Jean!", children: <>Hi!</> },
          { title: "Bad!", children: <>Hey!</> },
          { title: "Billy Jean!", children: <>Hi!</> },
        ]}
      />
    );
  };
}
