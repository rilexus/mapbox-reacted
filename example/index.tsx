import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
declare const module: any;

const MOUNT_NODE = document.getElementById("root");

const render = () => {
  ReactDOM.render(<App />, MOUNT_NODE);
};

render();

if (module.hot) {
  module.hot.accept(["./components/App.tsx"], () =>
    setImmediate(() => {
      ReactDOM.unmountComponentAtNode(MOUNT_NODE);
      render();
    })
  );
}
