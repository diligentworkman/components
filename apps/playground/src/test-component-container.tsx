import { styleMap } from "lit/directives/style-map.js";
import { JSX } from "promethium-js/jsx-runtime";
import "@awesome.me/webawesome/dist/components/divider/divider.js";

export function TestComponentContainer(props: {
  name: string;
  children: JSX.Element;
}) {
  return () => (
    <>
      <div
        $attr:style={styleMap({
          margin: "1rem",
          border: "0.2rem solid var(--wa-color-brand-60)",
          borderRadius: 0,
          padding: "0.5rem",
        })}
      >
        <h4
          $attr:style={styleMap({
            margin: 0,
            padding: "0 0.5rem",
          })}
        >
          {props.name}
        </h4>
        <wa-divider
          $attr:style={styleMap({
            margin: "0.5rem",
          })}
        ></wa-divider>
        <div
          $attr:style={styleMap({
            margin: "1rem",
            border: "0.1rem solid var(--wa-color-surface-border)",
            borderRadius: "0.25rem",
            padding: "1rem",
          })}
        >
          {props.children}
        </div>
      </div>
    </>
  );
}
