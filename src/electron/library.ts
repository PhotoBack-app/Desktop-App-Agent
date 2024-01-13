import { dialog } from "electron";

export function selectLibraryLocationDialog() {
  return dialog.showOpenDialog({
    title: "Choose your library location",
    message: "Choose your library location",
    buttonLabel: "Choose",
    properties: ["openDirectory", "createDirectory"],
  });
}
