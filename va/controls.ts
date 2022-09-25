function configureControls(map){

    const buttons: [string, string, number, google.maps.ControlPosition][] = [
        ["Rotate Left", "rotate", 20, google.maps.ControlPosition.LEFT_CENTER],
        ["Rotate Right", "rotate", -20, google.maps.ControlPosition.RIGHT_CENTER],
        ["Tilt Down", "tilt", 20, google.maps.ControlPosition.TOP_CENTER],
        ["Tilt Up", "tilt", -20, google.maps.ControlPosition.BOTTOM_CENTER],
      ];
    
      buttons.forEach(([text, mode, amount, position]) => {
        const controlDiv = document.createElement("div");
        const controlUI = document.createElement("button");
    
        controlUI.classList.add("ui-button");
        controlUI.innerText = `${text}`;
        controlUI.addEventListener("click", () => {
          adjustMap(mode, amount);
        });
        controlDiv.appendChild(controlUI);
        map.controls[position].push(controlDiv);
      });
    
      const adjustMap = function (mode: string, amount: number) {
        switch (mode) {
          case "tilt":
            map.setTilt(map.getTilt()! + amount);
            break;
          case "rotate":
            map.setHeading(map.getHeading()! + amount);
            break;
          default:
            break;
        }
      };
}

    


export {configureControls}