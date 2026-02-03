import { styleMap } from "lit/directives/style-map.js";
import "@awesome.me/webawesome/dist/components/button-group/button-group.js";
import "@awesome.me/webawesome/dist/components/button/button.js";
import "@awesome.me/webawesome/dist/components/icon/icon.js";

export function Toolbar() {
  return () => {
    return (
      <div
        $attr:style={styleMap({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        })}
      >
        <wa-button-group
          attr:label="Tools"
          $attr:style={styleMap({
            fontSize: "1rem",
            paddingTop: "0.5rem",
            paddingBottom: "0.75rem",
          })}
        >
          <wa-button attr:variant="neutral" attr:appearance="accent">
            <wa-icon attr:name="house" attr:label="Home"></wa-icon>
          </wa-button>
        </wa-button-group>
      </div>
    );
  };
}
